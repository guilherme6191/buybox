var Suggestion = require('../models/Suggestion');

exports.create = function(req, res, next) {
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var suggestion = new Suggestion({
      userIds: req.body.userIds,
      companyName: req.body.companyName,
      price: parseFloat(req.body.price),
      ram: parseInt(req.body.ram),
      frontCam: parseInt(req.body.frontCam),
      rearCam: parseInt(req.body.rearCam),
      storage: parseInt(req.body.storage),
      dualChip: req.body.dualChip === "true",
      productName: req.body.productName,
      url: req.body.url,
      created_at: new Date()
    }
  );

  suggestion.save(function(err) {
    if (err && err.code) {
      res.status(500).send({
        msg: 'Falha na criação da Sugestão. ' +
        'Por favor, tente mais tarde!'
      });
    } else {
      res.status(206).send(suggestion);
    }
  })

};

exports.get = function(req, res, next) {

  var userId = req.params.userId;
  if (userId) {
    Suggestion.find({ userIds: userId })
      .sort({ 'created_at': -1 })
      .limit(5)
      .exec(function(err, suggestions) {
        if (!suggestions) {
          return res.status(404).send("not found");
        }
        else if (err && err.code) {
          return res.status(500).send("Falha ao resgatar Sugestões. Por favor, tente mais tarde.");
        } else {
          return res.status(200).send({ suggestions });
        }
      })
  } else {
    Suggestion.find({})
      .exec(function(err, suggestions) {
        if (!suggestions) {
          return res.status(404).send("not found");
        }
        else if (err && err.code) {
          return res.status(500).send("Falha ao resgatar Sugestões. Por favor, tente mais tarde.");
        } else {
          return res.status(200).send({ suggestions });
        }
      });
  }
};
