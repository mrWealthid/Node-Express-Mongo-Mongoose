const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successfully'));
// const testTour = new Tour({
//   name: "The Fresh American",
//   rating: 4.7,
//   price: 497
// })
//
//
// testTour.save().then((doc)=> console.log(doc)).catch(err=> console.log(err))
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});