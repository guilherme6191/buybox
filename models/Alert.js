var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  url: String, //buscape
  productName: String,
  price: String, //buscape
  ram: Number, //fono
  frontCam: Number, //fono (secondary)
  rearCam: Number, //fono (primary)
  storage: Number, //fono
  dualChip: Boolean, //buscape
  isMatch: Boolean
});

var alertPriceSchema = new mongoose.Schema({
  userId: String,
  alertName: String,
  price: String,
  ram: Number,
  frontCam: Number,
  rearCam: Number,
  storage: Number,
  dualChip: Boolean,
  product: String,
  products: [productSchema]
});

var Alert = mongoose.model('Alert', alertPriceSchema);

module.exports = Alert;
