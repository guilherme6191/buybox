var request = require('request');
var Alert = require('../models/Alert');


exports.alertGetOne = function (req, res, next) {

    if (!req.params.id) {
        res.status(400).send("Id necessário");
    }

    Alert.findOne({ _id: req.params.id }, function (err, alert) {
        if (!alert) {
            res.status(404).send("not found");
        }
        res.status(200).send({ alert })
    })
};

exports.alertGetAll = function (req, res, next) {

    if (!req.body.userId) {
        res.status(400).send("userId necessário");
    }

    Alert.find({ userId: req.body.userId }, function (err, alerts) {
        if (!alerts) {
            res.status(404).send("not found");
        }
        if (err && err.code) {
            res.status(500).send("Falha ao resgatar alertas. Por favor, tente mais tarde.");
        }
        res.status(200).send({ alerts })
    })
};

/**
 * DELETE /account
 */
exports.alertDelete = function (req, res, next) {
    Alert.remove({ _id: req.params.id }, function (err) {
        if (err) {
            res.status(500).send();
        }
        res.sendStatus(204);
    });
};

/**
 * POST
 */
exports.alertPost = function (req, res, next) {

    //req.assert('fields.price', 'Preço não pode estar em branco.').notEmpty();
    //req.assert('fields.nameAlert', 'Nome do Alerta não pode estar em branco.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    if (req.body.fields && req.body.fields._id) {

        Alert.findById(req.body.fields._id, function (err, alert) {
            alert.alertName = req.body.fields.alertName;
            alert.price = req.body.fields.price;
            alert.ram = req.body.fields.ram;
            alert.frontCam = req.body.fields.frontCam;
            alert.rearCam = req.body.fields.rearCam;
            alert.storage = req.body.fields.storage;
            alert.dualChip = req.body.fields.dualChip === "true";

            alert.save(function (err) {
                if (err && err.code) {
                    res.status(500).send({
                        msg: 'Falha na atualização do Alerta de Preços. ' +
                        'Por favor, tente mais tarde!'
                    });
                } else {
                    res.status(200).send({ alert });
                }
            })
        });

    } else {

        var alert = new Alert({
                userId: req.body.userId,
                alertName: req.body.fields.alertName,
                price: parseInt(req.body.fields.price),
                ram: parseInt(req.body.fields.ram),
                frontCam: parseInt(req.body.fields.frontCam),
                rearCam: parseInt(req.body.fields.rearCam),
                storage: parseInt(req.body.fields.storage),
                dualChip: req.body.fields.dualChip === "true",
                product: req.body.fields.product
            }
        );

        alert.save(function (err) {
            if (err && err.code) {
                res.status(500).send({ msg: 'Falha na inserção do Alerta de Preços. Por favor, tente mais tarde!' });
            } else {
                res.status(200).send({ alert });
            }
        })
    }


};
