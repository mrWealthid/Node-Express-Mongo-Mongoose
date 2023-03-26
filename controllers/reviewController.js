const catchAsync = require('../utils/catchAsync');
const Review = require('../model/reviewsModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.tourId) filter = { tour: req.params.tourId };

  //Execute Query
  const reviews = await Review.find(filter);

  //Send Response
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  //Execute Query
  const review = await Review.create(req.body);

  //Send Response
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
