const fs = require('fs');
const path= require( 'path');

const Tour = require('../model/tourModel')

const filepath = path.join(process.cwd(), 'dev-data/data', 'tours-simple.json');
const tours = JSON.parse(fs.readFileSync(filepath, 'utf-8'));


exports.checkID=(req,res,next, val) => {
  console.log(`Tour id is ${val}`)
  if(req.params.id > tours.length ) {
    return res.status(404).json({
      status:'failed',
      message: 'Invalid Id'
    })
  }
  next()
}

exports.checkRequestBody = (req, res, next) => {
    const body = req.body
  // console.log(body.hasOwnProperty('name'))
  // console.log(body.hasOwnProperty('price'))
    if(!body.name || !body.price)  {
    return res.status(404).json({
      status:'failed',
      message: 'Invalid data'
    })
  }
  next()
}

/////2) ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  console.log(req.requestTime)
  res.status(200).json({
    status: 'success',
    requestedAt:req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};
exports.getTour = (req, res) => {
  const pathParam = req.params.id;
  const tour = tours.find((tour) => tour.id === +pathParam);
  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};
exports.createTour = (req, res) => {
  const newId = Date.now();
  const newTour = { ...req.body, id: newId };
  tours.push(newTour);
  fs.writeFile(filepath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
};
exports.updateTour = (req,res) => {
  const pathParam = req.params.id;
  const modifiedTour = req.body;
  const findTourIndex = tours.findIndex((tour) => tour.id === +pathParam);
  tours[findTourIndex] = modifiedTour;
  if(findTourIndex === -1) {
    res.status(404).json({
      status: 'failed',
      data: "Invalid ID"
    })
  }
  fs.writeFile(filepath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: modifiedTour
      }
    });
  });
};
exports.patchTour = (req, res) => {
  const pathParam = req.params.id;
  const modifiedTour = req.body;
  const findTourIndex = tours.findIndex((tour) => tour.id === +pathParam);
  tours[findTourIndex] = { ...tours[findTourIndex], ...modifiedTour };
  fs.writeFile(filepath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: modifiedTour
      }
    });
  });
};

exports.deleteTour=(req, res)=> {
  const pathParam = req.params.id;
  const filteredTours = tours.filter((tour) => tour.id !== +pathParam);
  if (filteredTours.length === tours.length) {
    res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }
  fs.writeFile(filepath, JSON.stringify(filteredTours), (err) => {
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
  
}


// exports. {deleteTour} from