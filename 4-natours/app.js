const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

//middlewear
app.use(express.json());
// data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
);

// handler functions
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // include number of results for arrays
    results: tours.length,
    data: { tours },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
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

const getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === parseInt(id));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  // can also times a string by 1 to turn into integer eg req.params.id * 1
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  console.log('pretend I updated JSON');
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Tour Hypothetically Updated',
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === parseInt(id));
  //fail
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  // success
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
/* < ------------------------------ *** -------------------------------- > */
// ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

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

app.listen(port, () => {
  console.log('app running on port 3000');
});
