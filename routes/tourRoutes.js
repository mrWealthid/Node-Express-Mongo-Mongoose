const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  patchTour,
  deleteTour,
  updateTour,
  aliasTopTours,
} = require('../controllers/tourController');
// const { checkID, checkRequestBody } = require('../controllers/tourController');

const router = express.Router();

// router.param('id', (req, res, next, val)=> {
//   console.log(`Tour id is ${val}`)
//   next();
// })

// router.param('id',checkID)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .put(updateTour)
  .patch(patchTour)
  .delete(deleteTour);
module.exports = router;
