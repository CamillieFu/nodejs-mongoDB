/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');

/* HANDLERS */
exports.checkTourData = (req, res, next, val) => {
  if (!val) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid form data',
    });
  }
  next();
};

// handlers
exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    /*make a copy of the query object that won't mutate original*/
    const queryObj = { ...req.query };
    // remove certain query terms from the query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // ADVANCED FILTERING
    /* stringify for editing */ let queryStr = JSON.stringify(queryObj);
    /* add $ to match mongoDB querying */
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const finalQuery = Tour.find(JSON.parse(queryStr));
    //fetching
    const tours = await finalQuery;
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
    res.status(202).json({
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
