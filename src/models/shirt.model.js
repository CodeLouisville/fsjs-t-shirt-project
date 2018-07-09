// Load mongoose package
const mongoose = require('mongoose')

const ShirtSchema = new mongoose.Schema({
  name: { type: String },
  description: String,
  price: Number,
  created_at: { type: Date, default: Date.now },
  deleted: { type: Boolean }
})

const Shirt = mongoose.model('Shirt', ShirtSchema)

Shirt.count({}, function (err, count) {
  if (err) {
    throw err
  }
  if (count > 0) return

  const seedShirts = require('./shirt.seed.json')
  Shirt.create(seedShirts, function (err, newShirts) {
    if (err) {
      throw err
    }
    console.log('DB seeded')
  })
})

module.exports = Shirt
