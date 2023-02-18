const Tour = require('../model/tourModel');

// const filepath = path.join(process.cwd(), 'dev-data/data', 'tours-simple.json');
// const tours = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

// exports.checkID=(req,res,next, val) => {
//   console.log(`Tour id is ${val}`)
//   if(req.params.id > tours.length ) {
//     return res.status(404).json({
//       status:'failed',
//       message: 'Invalid Id'
//     })
//   }
//   next()
// }

// exports.checkRequestBody = (req, res, next) => {
//     const body = req.body
//   // console.log(body.hasOwnProperty('name'))
//   // console.log(body.hasOwnProperty('price'))
//     if(!body.name || !body.price)  {
//     return res.status(404).json({
//       status:'failed',
//       message: 'Invalid data'
//     })
//   }
//   next()
// }

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

    //1 filtering
    const queryObj = { ...req.query };
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

    const query = Tour.find(JSON.parse(queryStr));

    /* second method
    const tours = await Tour.find()
      .where('duration')
      .equals(5)
      .where('difficulty')
      .equals('easy');
      
    */

    //Execute Query
    const tours = await query;

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
