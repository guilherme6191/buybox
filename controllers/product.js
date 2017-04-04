var request = require('request');
var fonoapi = require('../node_modules/fonoapi-nodejs/index');
fonoapi.token = '80b626281202215436ec1c802324e6ac647560bd13a88dbd';
var Alert = require('../models/Alert');
var async = require('async');
var nodemailer = require('nodemailer');
var User = require('../models/User');
var APIProduct = require('../models/APIProduct');

exports.getApiProducts = function() {
  console.log("getApiProducts Process starting...");
  async.waterfall([
      function(waterfallCallback) {
        console.log("Starting to get buscape products.");
        getBuscapeProducts(waterfallCallback);
        console.log("Done getting buscape products.");
      },
      function(buscapeList, waterfallCallback) {
        console.log("Starting to get fonoApi products and merge.");
        getFonoApiAndMerge(buscapeList, waterfallCallback);
        console.log("Done getting fonoApi products and merge.");
      }],
    function(err) {
      if (err) console.log(err);
      console.log('Processing done.');
    }
  );
};

exports.match = function(alert) {
  console.log("Match Process starting...");
  async.waterfall([
      function(waterfallCallback) {
        if (alert) {
          Alert.findById(alert._id, function(err, alert) {
            waterfallCallback(null, [alert]);
          })
        } else {
          Alert.find({}, function(err, alerts) {
            waterfallCallback(null, alerts)
          })
        }
      },
      function(alerts, waterfallCallback) {
        async.eachSeries(alerts,
          function(alert, eachCallback) {
            async.waterfall([
                function(waterCall) {
                  APIProduct
                    .find({
                      'storage': { $gte: alert.storage },
                      'ram': { $gte: alert.ram },
                      'frontCam': { $gte: alert.frontCam },
                      'rearCam': { $gte: alert.rearCam }
                    }, function(err, data) {
                      waterCall(null, data.sort(function(a, b) {
                        return parseFloat(a.price) - parseFloat(b.price);
                      }).slice(0, 3));
                    });
                },
                function(specMatches, watercall) {
                  alert.products = specMatches.map(function(specMatch) {
                    return {
                      url: specMatch.url, //buscape
                      productName: specMatch.productName,
                      price: specMatch.price, //buscape
                      ram: specMatch.ram,
                      frontCam: specMatch.frontCam,
                      rearCam: specMatch.rearCam,
                      storage: specMatch.storage,
                      dualChip: specMatch.dualChip,
                      isMatch: (parseFloat(specMatch.price) <= parseFloat(alert.price))
                    }
                  });

                  Alert.update({ _id: alert._id }, alert, function(err) {
                    if (err && err.code) {
                      alert.products = [];
                      watercall(alert);
                    } else {
                      User.findOne({ _id: alert.userId }, function(err, user) {
                        if (!err) {
                          alert.products.map(function(p) {
                            if (p.isMatch) {
                              sendMatchEmail(p, user, alert);
                            }
                          });
                        }
                      });

                      watercall(null, alert);
                    }
                  });
                }],
              function(err) {
                if (err) console.log(err);
                eachCallback(null, alert);
              }
            );
          }, function done(err) {
            if (err) {
              console.log(err)
            } else {
              waterfallCallback(alerts);
            }
          });

      }],
    function(err) {
      if (err) console.log(err);
      console.log('Processing done.');
    })
};

function getFonoApiAndMerge(buscapeList, callback) {

  var resultSpecList = [];
  //preFilter our list
  buscapeList = buscapeList
    .filter(function(elem) {
      return preFilter(elem, null);
    });

  async.eachSeries(buscapeList,
    function(buscape, eachSeriesCallback) {

      var name = buscape.product.productshortname.split(' ')[1];
      var brand = buscape.product.productshortname.split(' ')[0];

      try {
        fonoapi.getDevices(handleFonoAndCompare, name, brand);
      } catch (e) {
        console.log(e);
        eachSeriesCallback(null, alert, undefined)
      }

      function handleFonoAndCompare(queryString, data) {
        if (!data || !Array.isArray(data) || (data.status && !(data.status === 'error'))) {
          eachSeriesCallback(null, undefined);
        } else {
          eachSeriesCallback(null, data.map(function(fonoProduct) {
            if (isNameMatch(fonoProduct, buscape.product)) {
              return resultSpecList.push(buildAPIProductObj(fonoProduct, buscape.product));
            } else {
              //ignore
              //console.log('not a name match')
              return undefined;
            }
          }));
        }
      }

    },
    function done(err) {
      if (err) console.log(err);
      saveApiProducts(callback, resultSpecList);
    });
}

function saveApiProducts(callback, productList) {
  console.log("Starting to save Api products.");
  var rawProducts = productList.map(function(prod) {
    return {
      url: prod.url, //buscape
      productName: prod.productName,
      price: prod.price, //buscape
      ram: prod.ram, //fono
      frontCam: prod.frontCam, //fono (secondary)
      rearCam: prod.rearCam, //fono (primary)
      storage: prod.storage, //fono
      dualChip: prod.dualChip //buscape
    }
  });

  APIProduct.remove({}, function(err) {
    if (err) {
      console.log("APIProduct collection couldn't be deleted: " + err);
    } else {
      APIProduct.create(rawProducts, function(err) {
        if (err) {
          console.log(err)
        } else {
          if (callback) callback(null, rawProducts);
          console.log("APIProduct collection updated");
        }
      })
    }
  });
}

function getBuscapeProducts(callback) {

  var url =
    process.env.FIND_PRODUCTS_URL + '&results=100';
  request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var result = JSON.parse(body);
      callback(null, result.product);
    } else {
      console.log(err)
    }
  });
}

/**
 * makes a pre filter, returning true for the objs that passes the first conditions
 * @param elem
 * @param alert
 * @returns {*}
 */
function preFilter(elem, alert) {
  if (!elem.product || !elem.product.specification || !elem.product.specification.item) {
    return false
  } // if there is no complete specs info, discard for now

  var specs = elem.product.specification.item;
  if (alert) {
    return specs.every(function(elem) {
      if (alert.dualChip && elem.item.label === 'Chips' && elem.item.value[0] !== 'Dual Chip') {
        return false;
      }
      else {
        return true;
      }
    });
  } else {
    return true;
  }
}

function sendMatchEmail(product, user, alert) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_MAIL, // Your email id
      pass: process.env.GMAIL_PASS // Your password
    }
  });
  transporter.sendMail({
    from: process.env.GMAIL_MAIL,
    to: user.email,
    subject: '✔ Encontramos Match(es) para seu alerta de preço ' + alert.alertName + '!',
    text: 'Entre no buybox e veja os produtos e o(s) match(es):\n\n' +
    'Link: http://localhost:3000/userHome ' +
    '\n'
  }, function(err, info) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('Match email sent to: ' + user.email + ' for alert: ' + alert.alertName);
    }
  });
}

function isNameMatch(fonoProd, buscapeProd) {

  var fonoName = fonoProd.DeviceName;
  var apiName = buscapeProd.productname;

  if (apiName.includes(fonoName)) {
    //extract the name match and compare so we make sure the BuscapeName is equal
    //fonoApi could have a variant such as Pro, Prime, etc
    var cleanApiName = apiName.substr(apiName.indexOf(fonoName), fonoName.length);
    return cleanApiName === fonoName;
  } else {
    return false;
  }
}

function buildAPIProductObj(fonoProduct, buscape) {

  var dualChip = buscape.specification.item
    .find(function(obj) { //parse to boolean chips
      return obj.item.label === 'Chips'
    });

  var url = buscape.links.find(function(link) {
    return link.link.type === "product"
  }).link.url;


  var storage = checkNaN(fonoProduct.internal.split(',')[0].trim().split(' ')[0].trim().split('/')[0]);
  var ram = checkNaN(fonoProduct.internal.split(',')[1].trim().split(' ')[0]);
  var rearCam = checkNaN(fonoProduct.primary_.split(' ')[0].trim().split(' ')[0]);
  var frontCam = checkNaN(fonoProduct.secondary.split(' ')[0].trim().split(' ')[0]);


  return {
    productName: fonoProduct.DeviceName,
    price: buscape.pricemin, //buscape
    storage: storage,
    rearCam: rearCam,
    frontCam: frontCam,
    ram: ram,
    dualChip: dualChip,
    url: url
  };

}

function checkNaN(n) {
  return isNaN(n) ? 0 : n;
}

