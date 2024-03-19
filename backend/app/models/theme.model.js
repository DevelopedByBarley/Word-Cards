const mongoose = require('mongoose');
const { Schema } = mongoose;

const themeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    required: true
  },
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  cards: [{
    type: Schema.Types.ObjectId,
    ref: "Card"
  }]
});


const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
