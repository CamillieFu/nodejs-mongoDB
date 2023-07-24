// const { Timestamp } = require('mongodb');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  discount: Number,
  summary: {
    type: String,
    // removes all white space
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Image required'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    // when false, data not sent to client
    select: false,
  },
  startDates: [Date],
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
});
// create model using schema
const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
