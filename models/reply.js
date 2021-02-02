const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
  replyText: String,
  image: String,
})

module.exports = mongoose.model('Reply', replySchema);