var request = require('request');
var User = require('../models/User');

exports.getPartners = function(req, res, next) {
  User.find({ partner: true }, function(err, partners) {
    if (!partners) {
      res.status(404).send("not found");
    }
    res.status(200).send(partners)
  })
};

exports.deletePartner = function(req, res, next) {
  console.log("deletePartner mano")
  console.log("id: " + req.body.id)
  User.remove({ _id: req.body.id }, function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send({ msg: 'Parceiro excluído com sucesso.' });
    }
  });
};

