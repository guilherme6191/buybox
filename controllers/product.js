var Product = require('../models/APIProduct');

exports.get = function(req, res) {
  Product.find({}, function(err, products) {
    if (!products) {
      res.status(404).send("not found");
    }
    else if (err && err.code) {
      res.status(500).send("Falha ao resgatar Produtos. Por favor, tente mais tarde.");
    } else {
      res.status(200).send({ products });
    }
  })
};
