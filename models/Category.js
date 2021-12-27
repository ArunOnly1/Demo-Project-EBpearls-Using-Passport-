const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: [2, 'Too short category name'],
    max: [50, 'Too long category name'],
    trim: true,
    unique: true,
  },
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category
