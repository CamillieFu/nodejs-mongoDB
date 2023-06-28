const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const app = express();
const userRouter = require('./starter/routes/userRoutes');
const tourRouter = require('./starter/routes/tourRoutes');

// MIDDLEWARE
app.use(express.json());
app.use(morgan('dev'));
// custom middleware
app.use((req, res, next) => {
  console.log('middleware 🛠');
  next();
});
// adding custom property to req object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

// previous version / notes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// optional parameters take a question mark
// app.get('/api/v1/tours/:id/:y?', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//   });
// });
