var request = require('request');
var Alert = require('../models/Alert');
var ProductCtrl = require('../helpers/product');

exports.alertGetOne = function(req, res, next) {

  if (!req.params.id) {
    return res.status(400).send("Id necessário");
  }

  Alert.findOne({ _id: req.params.id }, function(err, alert) {
    if (!alert) {
      res.status(404).send("not found");
    }
    res.status(200).send({ alert })
  })
};

exports.alertGetAll = function(req, res, next) {

  if (req.body.userId) {
    Alert.find({ userId: req.body.userId }, function(err, alerts) {
      if (!alerts) {
        res.status(404).send("not found");
      }
      else if (err && err.code) {
        res.status(500).send("Falha ao resgatar alertas. Por favor, tente mais tarde.");
      } else {
        res.status(200).send({ alerts });
      }
    })
  } else {

    Alert.find({}, function(err, alerts) {
      if (!alerts) {
        res.status(404).send("not found");
      }
      else if (err && err.code) {
        res.status(500).send("Falha ao resgatar alertas. Por favor, tente mais tarde.");
      } else {
        res.status(200).send({ alerts });
      }
    })
  }
};

/**
 * DELETE /account
 */
exports.alertDelete = function(req, res, next) {
  var id = req.body.id ? req.body.id : req.params.id;

  Alert.remove({ _id: id }, function(err) {
    if (err) {
      return res.status(500).send();
    } else {
      res.sendStatus(204);
    }
  });
};

/**
 * POST
 */
exports.alertPost = function(req, res, next) {

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  if (req.body.fields && req.body.fields._id) {

    Alert.findById(req.body.fields._id, function(err, alert) {
      alert.alertName = req.body.fields.alertName;
      alert.price = req.body.fields.price;
      alert.ram = req.body.fields.ram;
      alert.frontCam = req.body.fields.frontCam;
      alert.rearCam = req.body.fields.rearCam;
      alert.storage = req.body.fields.storage;
      alert.dualChip = req.body.fields.dualChip === "true";
      alert.products = [];

      alert.save(function(err) {
        if (err && err.code) {
          res.status(500).send({
            msg: 'Falha na atualização do Alerta de Preços. ' +
            'Por favor, tente mais tarde!'
          });
        } else {
          ProductCtrl.match(alert);
          res.status(206).send({ alert });
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
        product: req.body.fields.product,
        products: []
      }
    );

    alert.save(function(err) {
      if (err && err.code) {
        res.status(500).send({ msg: 'Falha na inserção do Alerta de Preços. Por favor, tente mais tarde!' });
      } else {
        ProductCtrl.match(alert);
        res.status(206).send({ alert });
      }
    })
  }
};
