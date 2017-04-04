var mongoose = require('mongoose');

var apiProductSchema = new mongoose.Schema({
  url: String, //buscape
  productName: String,
  price: String, //buscape
  ram: Number, //fono
  frontCam: Number, //fono (secondary)
  rearCam: Number, //fono (primary)
  storage: Number, //fono
  dualChip: Boolean //buscape
});


var APIProduct = mongoose.model('APIProduct', apiProductSchema);

module.exports = APIProduct;
