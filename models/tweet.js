const mongoose = require('mongoose');
const Reply = require('./reply');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  tweetText: String,
  likes: {type: Number, default: 0},
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reply'
    }
  ],
}, {timestamps: true})

// deletes replies when a tweet is deleted using a query middleware
TweetSchema.post('findOneAndDelete', async function (doc) {
  if(doc){
    await Reply.deleteMany({
      _id: {
        $in: doc.replies
      }
    })
  }
  console.log(doc);
})

module.exports = mongoose.model('Tweet', TweetSchema);