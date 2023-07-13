const fs = require('fs');

// data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// middleware
exports.checkId = (req, res, next, val) => {
  const tour = tours.find((el) => el.id === parseInt(val, 10));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  next();
};

exports.validateFormData = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing Name or Price',
    });
  }
  next();
};

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
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // include number of results for arrays
    results: tours.length,
    data: { tours },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(req.body, { id: newId });
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.getTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id, 10));
  // can also times a string by 1 to turn into integer eg req.params.id * 1
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(202).json({
    status: 'success',
    data: {
      tour: 'Tour Hypothetically Updated',
    },
  });
};

exports.deleteTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id, 10));
  const index = tours.indexOf(tour);
  tours.splice(index, 1);
  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};
