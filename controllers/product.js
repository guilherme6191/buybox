var request = require('request');
var fonoapi = require('../node_modules/fonoapi-nodejs/index');
fonoapi.token = '80b626281202215436ec1c802324e6ac647560bd13a88dbd';
var Alert = require('../models/Alert');
var async = require('async');
var nodemailer = require('nodemailer');
var User = require('../models/User');

exports.getProducts = function (alert) {
    console.log("Process starting...")
    async.waterfall([
        function (waterfallCallback) {
            if (alert) {
                Alert.findById(alert._id, function (err, alert) {
                    waterfallCallback(null, [alert]);
                })
            } else {
                Alert.find({}, function (err, alert) {
                    waterfallCallback(null, alert)
                })
            }
        },
        function (alerts, waterfallCallback) {
            console.log("Starting to get buscape products.");
            getBuscapeProducts(alerts, waterfallCallback);
            console.log("Done getting buscape products.");
        },
        function (alerts, buscapeList, waterfallCallback) {
            async.eachSeries(alerts,
                function (alert, eachCallback) {
                    async.waterfall([
                            function (waterfallCallback) {
                                getFonoApiAndCompare(buscapeList, alert, waterfallCallback);
                                console.log("Comparing with specs from fonoApi for alert: " + alert.alertName);
                            },
                            function (specReadyList, alert, waterfallCallback) {
                                saveProductList(specReadyList, alert, waterfallCallback);
                                console.log("Saving matches, if any was found for alert: " + alert.alertName);
                            }],
                        function (err) {
                            if (err) {
                                console.log(err)
                            } else {
                                eachCallback()
                            }
                        });
                },

                function done(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        waterfallCallback();
                    }
                });

        }
    ], function (err) {
        console.log('Processing done.');
    });
};

function getFonoApiAndCompare(buscapeList, alert, callback) {

    var resultSpecList = [];
    //preFilter our list
    buscapeList = buscapeList
        .filter(function (elem) {
            return preFilter(elem, alert);
        });

    async.eachSeries(buscapeList,
        function (buscape, eachSeriesCallback) {

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
                    eachSeriesCallback(null, data.map(function (fonoProduct) {
                        if (isNameMatch(fonoProduct, buscape.product)) {
                            var specRateObj = matchAllSpecs(fonoProduct, alert);
                            return resultSpecList.push(buildSpecObj(specRateObj, fonoProduct, buscape.product));
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
            var matchSpecList = resultSpecList
                .filter(function (elem) {
                    return elem && elem.rate === 4;
                });

            callback(null, matchSpecList.sort(function (a, b) {
                return parseFloat(a.price) - parseFloat(b.price);
            }).slice(0, 3), alert);
        });
}

function getBuscapeProducts(alerts, callback) {

    var url =
        process.env.FIND_PRODUCTS_URL + '&results=100';
    request(url, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var result = JSON.parse(body);
            callback(null, alerts, result.product);
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
    return specs.every(function (elem) {
        if (elem.item.label === 'Chips' && alert.dualChip && elem.item.value[0] !== 'Dual Chip') {
            return false;
        }
        else if (elem.item.label === 'Câmera Traseira'
            && elem.item.value[0].substring(0, 2) < alert.rearCam) {
            return false;
        }
        return true;
    });
}


/**
 * Updates alert with the best products found
 *
 * @param list
 * @param alert
 * @param callback
 */
function saveProductList(list, alert, callback) {

    if (list && list.length <= 3) { //make sure max 3 to show up in FE

        alert.products = [];
        alert.products = list.map(function (readyProd) {
            return {
                rate: readyProd.rate,
                url: readyProd.url, //buscape
                productName: readyProd.productName,
                price: readyProd.price, //buscape
                ram: readyProd.ram, //fono
                frontCam: readyProd.frontCam, //fono (secondary)
                rearCam: readyProd.rearCam, //fono (primary)
                storage: readyProd.storage, //fono
                dualChip: readyProd.dualChip, //buscape
                isMatch: (parseFloat(readyProd.price) <= parseFloat(alert.price)) && readyProd.rate === 4
            }
        });

        Alert.update({ _id: alert._id }, alert, function (err) {
            if (err && err.code) {
                alert.products = [];
                callback(alert);
            } else {
                User.findOne({ _id: alert.userId }, function (err, user) {
                    if (!err) {
                        alert.products.map(function (p) {
                            if (p.isMatch) {
                                sendMatchEmail(p, user, alert);
                            }
                        });
                    }
                });

                callback(null, alert);
            }
        });
    } else {
        callback(null, alert)
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
        text: 'Vá direto para a página do buscapé do produto e faça sua compra:\n\n' +
        'Link: http://localhost:3000/userHome ' +
        '\n'
    }, function (err, info) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Match email sent to: ' + user.email + ' for alert: ' + alert.alertName);
        }
    });
}


/**
 * builds a Product object
 * @param specRateObj
 * @param fonoProd
 * @param apiProd
 * @returns {{rate: (*|number), productName: *, price: *, ram: (*|string), frontCam: (*|string), rearCam: (*|string), storage: (*|string), dualChip: boolean}}
 */
function buildSpecObj(specRateObj, fonoProd, apiProd) {

    //handle chips to bool
    var dualChip = apiProd.specification.item
        .find(function (obj) { //parse to boolean chips
            return obj.item.label === 'Chips'
        });

    var url = apiProd.links.find(function (link) {
        return link.link.type === "product"
    }).link.url;

    return {
        url: url,
        rate: specRateObj.rate,
        productName: fonoProd.DeviceName,
        price: apiProd.pricemin, //buscape
        ram: specRateObj.ram, //fono
        frontCam: specRateObj.frontCam, //fono (secondary)
        rearCam: specRateObj.rearCam, //fono (primary)
        storage: specRateObj.storage, //fono
        dualChip: dualChip && dualChip.item && dualChip.item.value && (dualChip.item.value[0].trim() === 'Dual Chip')
    }
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
/**
 * checks all smartphone specs
 * @param fonoProduct
 * @param alert
 * @returns {{rate: number, storage: *, rearCam: *, frontCam: *}}
 */
function matchAllSpecs(fonoProduct, alert) {

    var matchRate = 0;

    var storage = fonoProduct.internal.split(',')[0].trim().split(' ')[0];
    var ram = fonoProduct.internal.split(',')[1].trim().split(' ')[0];

    var rearCam = fonoProduct.primary_.split(' ')[0].trim().split(' ')[0];
    var frontCam = fonoProduct.secondary.split(' ')[0].trim().split(' ')[0];

    if (!isNaN(storage) && storage >= alert.storage) {
        matchRate += 1;
    }
    if (!isNaN(ram) && ram >= alert.ram) {
        matchRate += 1;
    }
    if (!isNaN(rearCam) && rearCam >= alert.rearCam) {
        matchRate += 1;
    }
    if (!isNaN(frontCam) && frontCam >= alert.frontCam) {
        matchRate += 1;
    }
    return {
        rate: matchRate,
        storage: storage,
        rearCam: rearCam,
        frontCam: frontCam,
        ram: ram
    };

}

