const express = require('express');
const tourController = require('../controllers/tourController');
// initialize router
const router = express.Router();
// validation middleware
// router.param('id', tourController.checkId);

// routes
// top 5 tours shortcut route
router
  .route('/top-5-tours')
  .get(tourController.aliasTopTen, tourController.getAllTours);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
