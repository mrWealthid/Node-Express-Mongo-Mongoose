const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not be empty'] },

    rating: {
      type: Number,
      default: 0,
      max: [5, 'Rating must be below 5.0'],
      min: [1, 'Rating must be above 1.0'],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },

  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

//NESTED ROUTES
// POST /tour/2233444/reviews

//GET/tour/22333444/reviews

//GET/tour/2344555/reviews/3344455
