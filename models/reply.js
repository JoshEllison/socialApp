const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
  replyText: String,
  rating: Number,
  date: { type: Date, default: Date.now },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
})

module.exports = mongoose.model('Reply', replySchema);