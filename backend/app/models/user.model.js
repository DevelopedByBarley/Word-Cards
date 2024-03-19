const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
  },
  currentCapacity: {
    type: Number,
    default: 0,
  },
  password: String,
  themes: [{
    type: Schema.Types.ObjectId,
    ref: "Theme"
  }],
  cardsForRepeat: [],
  date: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);

module.exports = User;
