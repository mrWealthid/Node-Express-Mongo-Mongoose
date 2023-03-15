const express = require('express');
const { getMonthlyPlan } = require('../controllers/tourController');
const { getTourStats } = require('../controllers/tourController');
const {
  getAllTours,
  getTour,
  createTour,
  patchTour,
  deleteTour,
  updateTour,
  aliasTopTours,
} = require('../controllers/tourController');

const authController = require('../controllers/authController');
// const { checkID, checkRequestBody } = require('../controllers/tourController');

const router = express.Router();

// router.param('id', (req, res, next, val)=> {
//   console.log(`Tour id is ${val}`)
//   next();
// })

// router.param('id',checkID)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

//Aggregation operations for stats
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(authController.protect, getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .put(updateTour)
  .patch(patchTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );
module.exports = router;
