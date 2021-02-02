const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  date: String,
  owner: String,
  tweetText: String,
  image: String,
  price: Number,
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reply'
    }
  ]
})

module.exports = mongoose.model('Tweet', TweetSchema);