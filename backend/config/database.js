const colors = require('colors/safe');
const mongoose = require('mongoose');


function connection() {
  mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
      colors.green(console.log('Database is connected successfully'));
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });
}

module.exports = connection;
