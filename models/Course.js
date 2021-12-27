const mongoose = require('mongoose')
const { convertSecondsToTime, convertTimeToSeconds } = require('../lib/utils')

const availabilitySchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      maxlength: 8,
      trim: true,
      set: convertTimeToSeconds,
      get: convertSecondsToTime,
    },
    to: {
      type: String,
      required: true,
      maxlength: 8,
      trim: true,
      set: convertTimeToSeconds,
      get: convertSecondsToTime,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true, setters: true }, //always true setters by default
    toJSON: { getters: true, setters: true },
  }
)

// availabilitySchema.set('toObject', { getters: true })
// availabilitySchema.set('toJSON', { getters: true })

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [2, 'Too small title'],
      maxlength: [50, 'Too long title'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [10, 'Too small description'],
      maxlength: [455, 'Too long description'],
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative or zero'],
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    students: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        enrolled_status: {
          type: String,
          enum: ['approved', 'pending', 'rejected'],
        },
      },
    ],

    capacity: {
      type: Number,
      min: [1, 'Cannot be less than 1'],
    },
    availability: {
      type: availabilitySchema,
    },
    length: {
      type: Number,
      min: 1,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toObject: { getters: true },
    toJSON: { getters: true },
  }
)

const Course = mongoose.model('Course', courseSchema)

module.exports = Course

// TODO:Create index for sorting
// TODO:Change time to seconds as a day has 86400 seconds
