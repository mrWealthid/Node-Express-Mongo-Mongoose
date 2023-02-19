const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingAverage,price';
  req.query.limit = '5';

  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

/////2) ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //Execute Query
    const tours = await features.query;

    //Send Response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  // const pathParam = req.params.id;
  // const tour = tours.find((tour) => tour.id === +pathParam);

  // res.status(404).json({
  //   status: 'failed',
  //   message: 'Invalid ID'
  // });

  const tour = await Tour.findById(req.params.id);
  //or Tour.findOne({_id: req.params.id})
  try {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  // const pathParam = req.params.id;
  // const modifiedTour = req.body;
  // const findTourIndex = tours.findIndex((tour) => tour.id === +pathParam);
  // tours[findTourIndex] = modifiedTour;
  // if(findTourIndex === -1) {
  //   res.status(404).json({
  //     status: 'failed',
  //     data: "Invalid ID"
  //   })
  //
  // fs.writeFile(filepath, JSON.stringify(tours), (err) => {

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.patchTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
  // const pathParam = req.params.id;
  // const modifiedTour = req.body;
  // const findTourIndex = tours.findIndex((tour) => tour.id === +pathParam);
  // tours[findTourIndex] = { ...tours[findTourIndex], ...modifiedTour };
  // fs.writeFile(filepath, JSON.stringify(tours), (err) => {
};

exports.deleteTour = async (req, res) => {
  // const pathParam = req.params.id;
  // const filteredTours = tours.filter((tour) => tour.id !== +pathParam);
  // if (filteredTours.length === tours.length) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: 'Invalid ID'
  //   });
  // }
  // fs.writeFile(filepath, JSON.stringify(filteredTours), (err) => {

  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// exports. {deleteTour} from
