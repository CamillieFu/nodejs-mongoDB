/* eslint-disable node/no-unsupported-features/es-syntax */
const stateInConstructor = require('eslint-plugin-react/lib/rules/state-in-constructor');
const Tour = require('../models/tourModel');

/* HANDLERS */
exports.aliasTopTen = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,duration,difficulty';
  next();
};

exports.checkTourData = (req, res, next, val) => {
  if (!val) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid form data',
    });
  }
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}

// FUNCTIONS
exports.getAllTours = async (req, res) => {
  try {
    // 1) BUILD QUERY
    /* make a copy of the query object that won't mutate original */
    const queryObj = { ...req.query };
    // remove certain query terms from the query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) ADVANCED FILTERING
    /* stringify for editing */ let queryStr = JSON.stringify(queryObj);
    /* add $ to match mongoDB querying */
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // PAGINATION
    const page = req.query.page * 1 || 1; /* default is 1 */
    const limit = req.query.limit * 1 || 100; /* default is 100 */
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    // Throw error if page doesn't exist;
    if (req.query.page) {
      const numOfResults = await Tour.countDocuments();
      if (skip >= numOfResults) throw new Error('Page Does Not Exist');
    }

    //fetching
    const features = new APIFeatures(Tour.find(), req.query).filter();
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (tour) {
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    }
    res.status(204).json({
      status: 'fail',
      message: 'No Tour Found',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    // don't send any data back to client for delete requests
    res.status(204).json({
      status: 'success',
      message: 'Deleted Tour',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
