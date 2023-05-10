const express = require('express');
const reviewRouter = require('./reviewRoutes');
const { getMonthlyPlan } = require('../controllers/tourController');
const { getTourStats } = require('../controllers/tourController');
const {
  getAllTours,
  getTour,
  createTour,
  patchTour,
  deleteTour,
  aliasTopTours,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController');

const authController = require('../controllers/authController');
// const { checkID, checkRequestBody } = require('../controllers/tourController');

const router = express.Router();

// router.param('id',checkID)

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

//Aggregation operations for stats
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    createTour
  );

router
  .route('/:id')
  .get(getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    patchTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

//NESTED ROUTES
// POST /tour/2233444/reviews

//GET/tour/22333444/reviews

//GET/tour/2344555/reviews/3344455

module.exports = router;
