// const { Timestamp } = require('mongodb');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxLength: [120, "name cannot exceed 120 characters"],
      minLength: [5, "name cannot be less than 10 characters"],
      // example validate: [validator.isAlpha, 'error message'],
    },
    slug: {
      type: String,
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
      required: [true, "A tour must have a price"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be above 1.0"],
      max: [5, "rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "discount price: ({VALUE}) must be less than price",
      },
    },
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
      required: [true, "Image required"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // when false, data not sent to client
      select: false,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "difficult", "crazily hard"],
        message:
          'Difficulty can only be one of the following: "easy", "medium", "difficult", "crazily hard"',
      },
      required: [true, "A tour must have a difficulty"],
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual property
TourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// model middleware usually runs before or after a model event: save, validate, remove, updateOne, deleteOne, init
// "save" middleware runs before .save and .create but not .insertMany
// ---------------------------- DOCUMENT MIDDLEWARE ----------------------------
TourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// can have multiple functions for same action (i.e. save)
TourSchema.pre("save", function (next) {
  //
  next();
});

// executed after save
TourSchema.post("save", function (doc, next) {
  console.log("🧨", doc);
  next();
});
// ---------------------------- DOCUMENT MIDDLEWARE END ---------------------------

// ---------------------------- QUERY MIDDLEWARE START ----------------------------
// not processing document, rather, the query itself
// removes secret tours from the selection before returning to client

// TourSchema.pre("find", function (next) {
TourSchema.pre(/^find/, function (next) {
  // you can use regular expressions to get around the fact that find command doesn't work for findOne, findanddelete etc
  // this is def better!
  this.find({ secretTour: { $ne: true } });
  next();
});

TourSchema.post(/^find/, function (docs, next) {
  next();
});
// ---------------------------- QUERY MIDDLEWARE END ----------------------------

// ----------------------------AGGREGATE MIDDLEWARE START ----------------------------
TourSchema.pre("aggregate", function (next) {
  // add stage to aggregate pipeline to hide secret tours (could be done at the controller?)
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
// -------------------------------------- END --------------------------------------

// create model using schema
const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
