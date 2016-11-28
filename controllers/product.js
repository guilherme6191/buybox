var request = require('request');
var fonoapi = require('../node_modules/fonoapi-nodejs/index');
fonoapi.token = '80b626281202215436ec1c802324e6ac647560bd13a88dbd';
var Alert = require('../models/Alert');
var async = require('async');

exports.getProducts = function () {
    console.log('teste');

    async.waterfall([
        function (callback) {
            Alert.findById('583a1c23067e3a6e0b185504', function (err, alert) {
                callback(null, alert);
            })
        },
        function (alert, callback) {
            getBuscapeProducts(alert, callback);
        },
        function (filteredList, alert, callback) {
            getFonoApiAndCompare(filteredList, alert, callback);
        },
        function (specReadyList, alert, callback) {
            saveProductList(specReadyList, alert, callback)

        }
    ], function (err) {
        console.log('Processing done.');
    });
};

function getFonoApiAndCompare(filteredList, alert, callback) {

    console.log(filteredList.length);
    var x = 0;
    var resultSpecList = [];
    async.eachSeries(filteredList,
        function (buscape, eachSeriesCallback) {
            console.log(x++);
            var name = buscape.product.productshortname.split(' ')[1];
            var brand = buscape.product.productshortname.split(' ')[0];

            fonoapi.getDevices(handleFonoAndCompare, name, brand);

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
            var matchSpecList = resultSpecList.filter(function (elem) {
                return elem.rate === 4;
            });

            callback(null, matchSpecList.sort(function (a, b) {
                return parseFloat(a.price) - parseFloat(b.price);
            }).slice(0, 2), alert);
        });
}

function getBuscapeProducts(alert, callback) {

    var url =
        process.env.FIND_PRODUCTS_URL + '&results=100';
    request(url, function (err, response, body) {

        if (!err && response.statusCode == 200) {
            var list = JSON.parse(body);
            callback(null, list.product
                .filter(function (elem) {
                    return preFilter(elem, alert);
                }), alert);
        }
    });

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
}

/**
 * Updates alert with the best products found
 *
 * @param list
 * @param alert
 * @param callback
 */
function saveProductList(list, alert, callback) {

    if (list.length <= 3) { //make sure max 3 to show up in FE

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
                callback(alert);
            }
        });
    }
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

