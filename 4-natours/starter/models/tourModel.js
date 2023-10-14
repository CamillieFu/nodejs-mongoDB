// const { Timestamp } = require('mongodb');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require("mongoose");
const slugify = require("slugify");
const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
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
  // call next first so that it's not forgotten
  next();
});

TourSchema.post(/^find/, function (docs, next) {
  console.log("🧨🧨🧨", docs);
  next();
});
// ---------------------------- QUERY MIDDLEWARE END ----------------------------

// ----------------------------AGGREGATE MIDDLEWARE START ----------------------------
TourSchema.pre("aggregate", function (next) {
  console.log("👽", this.pipeline());
  // add stage to aggregate pipeline to hide secret tours (could probably be done at the controller?)
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
// -------------------------------------- END --------------------------------------

// create model using schema
const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
