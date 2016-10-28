var mongoose = require('mongoose');

var alertPriceSchema = new mongoose.Schema({
    userId: String,
    alertName: String,
    price: String,
    ram: String,
    frontCam: String,
    rearCam: String,
    storage: String,
    dualChip: Boolean,
    product: String
});

var Alert = mongoose.model('Alert', alertPriceSchema);

module.exports = Alert;
