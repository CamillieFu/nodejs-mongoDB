const express = require('express');
const tourController = require('../controllers/tourController');
// initialize router
const router = express.Router();
// validation middleware
// router.param('id', tourController.checkId);
// routes
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
