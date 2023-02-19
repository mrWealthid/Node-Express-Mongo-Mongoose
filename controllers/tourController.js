const Tour = require('../model/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingAverage,price';
  req.query.limit = '5';

  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2) Advanced filtering
    //{difficulty:'easy', duration: {$gte:5.3}}
    //{difficulty:'easy', duration: {gte:5.3}}

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b{gte|gt|lte|lt}\b/g,
      (match) => `$ ${match}`
    );

    //Fix Me === it didn't work for lt

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      //basic sorting
      // query.sort(req.query.sort);

      //advanced sorting
      const sortBy = this.queryString.sort.split(',').join(' ');
      // query.sort(req.query.sort.replace(/,/g, ' '));
      this.query = this.query.sort(sortBy);
    } else {
      //adding default sort --- I feel this should always occur during pagination
      this.query = this.query.sort('-_id');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const field = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //page=2&limit=10, 1-10====>page 1; 11-20 ===> page 2; 21-30 ====> page3

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

/////2) ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime)

  /*Note
    In some cases you don't want to
    filter with certain query parameters
     something like ?difficulty=easy&page=2
      you have to handle such exception
       on your api filters
     */
  try {
    console.log(req.query);
    //Build Query

    //1A filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    //
    // //2) Advanced filtering
    // //{difficulty:'easy', duration: {$gte:5.3}}
    // //{difficulty:'easy', duration: {gte:5.3}}
    //
    // let queryStr = JSON.stringify(queryObj);
    //
    // queryStr = queryStr.replace(
    //   /\b{gte|gt|lte|lt}\b/g,
    //   (match) => `$ ${match}`
    // );
    //
    // //Fix Me === it didn't work for lt
    //
    // let query = Tour.find(JSON.parse(queryStr));

    /* second method
    const tours = await Tour.find()
      .where('duration')
      .equals(5)
      .where('difficulty')
      .equals('easy');
      
    */

    //1b. SORTING

    // if (req.query.sort) {
    //   //basic sorting
    //   // query.sort(req.query.sort);
    //
    //   //advanced sorting
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   // query.sort(req.query.sort.replace(/,/g, ' '));
    //   query.sort(sortBy);
    // } else {
    //   //adding default sort --- I feel this should always occur during pagination
    //   query = query.sort('-_id');
    // }

    //3 Field Limiting

    // if (req.query.fields) {
    //   const field = req.query.fields.split(',').join(' ');
    //   query = query.select(field);
    // } else {
    //   query = query.select('-__v');
    // }

    // //4 Pagination
    // const page = req.query.page * 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    //
    // //page=2&limit=10, 1-10====>page 1; 11-20 ===> page 2; 21-30 ====> page3
    //
    // query = query.skip(skip).limit(limit);
    //
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error("This page doesn't  exist");
    // }

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
