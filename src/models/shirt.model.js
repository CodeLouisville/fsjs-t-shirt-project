// Load mongoose package
const mongoose = require('mongoose');

const ShirtSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  created_at: { type: Date, default: Date.now },
});

const Shirt = mongoose.model('Shirt', ShirtSchema);
module.exports = Shirt;