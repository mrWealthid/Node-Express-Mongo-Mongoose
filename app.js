const express = require('express');
const morgan =require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const path= require( 'path');


const filepath = path.join(process.cwd(), 'public');

const app = express();


console.log(process.env.NODE_ENV)

////1) MIDDLEWARES4

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json());


app.use(express.static(filepath))

app.use((req,res, next) => {
  console.log('Hello from the middleware🚄');
  next();
})

app.use((req,res, next) => {
 req.requestTime = new Date().toISOString()
  next();
})

//Routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.put('/api/v1/tours/:id', updateTour);
// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour);




app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
module.exports = app