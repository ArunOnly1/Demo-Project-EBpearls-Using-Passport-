const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const debug = require('debug')('User')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Too short name'],
    maxlength: [55, 'Too long name'],
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,

    min: [6, 'Must be minimun six characters long'],
    max: [20, 'Must not be more than twenty characters'],
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ['student', 'teacher'],
  },
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  return userObject
}
const User = mongoose.model('User', userSchema)

module.exports = User

// TODO:Login garda aru access dida deletedAt check garnu parxa
