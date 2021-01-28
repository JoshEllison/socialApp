const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  date: String,
  owner: String,
  tweetText: String
})

module.exports = mongoose.model('Tweet', TweetSchema);