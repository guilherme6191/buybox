var mongoose = require('mongoose');

var suggestionSchema = new mongoose.Schema({
  url: String,
  productName: String,
  price: String,
  ram: Number,
  frontCam: Number,
  rearCam: Number,
  storage: Number,
  dualChip: Boolean,
  userId: String,
  companyName: String,
  userIds: [String],
  created_at: Date,
});


var Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;
