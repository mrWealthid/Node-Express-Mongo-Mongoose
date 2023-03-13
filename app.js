const express = require('express');
const morgan = require('morgan');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const filepath = path.join(process.cwd(), 'public');

const app = express();

console.log(process.env.NODE_ENV);

////1) MIDDLEWARES4

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(filepath));

app.use((req, res, next) => {
  console.log('Hello from the middleware🚄');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  console.log(req.headers);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
