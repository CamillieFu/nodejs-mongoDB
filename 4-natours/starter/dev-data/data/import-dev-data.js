const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded 🥂');
    process.exit();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted  🧨');
    process.exit();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  console.log('importing data ...');
  importData();
} else if (process.argv[2] === '--delete') {
  console.log('deleting data ...');
  deleteData();
}
