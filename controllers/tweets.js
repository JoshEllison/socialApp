const Tweet = require('../models/tweet');

module.exports.index = async (req, res) => {
  const tweets = await Tweet.find({}).populate({
    path: 'replies',
    populate: {
      path: 'author'
    }
  }).populate('author');
  res.render('tweets/index', { tweets })
}

module.exports.renderNewForm = (req, res) => {
  res.render('tweets/new')
}

module.exports.createTweet = async (req, res, next) => {
  const tweet = new Tweet(req.body.tweet)
  tweet.author = req.user._id;
  await tweet.save();
  req.flash('success', 'Your tweet was sent!')
  res.redirect(`/tweets/${tweet._id}`)
}

// nested paths so both reply authors and tweet authors are available to display in show
// Improvement: pageinate or set up infinite scrolling with a 25 or 50 limit per 
module.exports.showTweet = async (req, res) => {
  const tweet = await Tweet.findById(req.params.id).populate({
    path: 'replies',
    populate: {
      path: 'author'
    }
  }).populate('author');
  console.log(tweet);
  if (!tweet) {
    req.flash('error', 'Cannot find that tweet!');
    return res.redirect('/tweets');
  }
  res.render('tweets/show', { tweet })
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findById(id)
  if (!tweet) {
    req.flash('error', 'Cannot find that tweet!');
    return res.redirect('/tweets');
  }
  res.render('tweets/edit', { tweet })
}

module.exports.updateTweet = async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findByIdAndUpdate(id, { ...req.body.tweet })
  req.flash('success', 'Your tweet was edited!')
  res.redirect(`/tweets/${tweet._id}`)
}

module.exports.destroyTweet = async (req, res) => {
  const { id } = req.params;
  await Tweet.findByIdAndDelete(id);
  req.flash('success', 'Your tweet was deleted!')
  res.redirect('/tweets');
}

module.exports.updateLikes = async (req, res) => {
  const { id } = req.params;
  const counter = 1;
  const liker = req.user.username;
  await Tweet.findByIdAndUpdate(id, {$inc: {likeCount: counter}})
  const likedTweet = await Tweet.findById(req.params.id)
  likedTweet.likedBy.push(liker)
  console.log(likedTweet);
  req.flash('success', 'liked!')
  res.redirect('/tweets')
}

