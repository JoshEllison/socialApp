const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Tweet = require('../models/tweet');
const {isLoggedIn, isAuthor, validateTweet} = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
  const tweets = await Tweet.find({});
  res.render('tweets/index', { tweets })
}))

router.get('/new', isLoggedIn, (req, res) => {
  res.render('tweets/new')
})

router.post('/', isLoggedIn, validateTweet, catchAsync(async (req, res, next) => {
  const tweet = new Tweet(req.body.tweet)
  tweet.author = req.user._id;
  await tweet.save();
  req.flash('success', 'Your tweet was sent!')
  res.redirect(`/tweets/${tweet._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id).populate('author').populate('replies');
  console.log(tweet);
  if(!tweet){
    req.flash('error', 'Cannot find that tweet!');
    return res.redirect('/tweets');
  }
  res.render('tweets/show', { tweet })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findById(id)
  if (!tweet) {
    req.flash('error', 'Cannot find that tweet!');
    return res.redirect('/tweets');
  }
  res.render('tweets/edit', { tweet })
}))

router.put('/:id', isLoggedIn, isAuthor, validateTweet, catchAsync(async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findByIdAndUpdate(id, { ...req.body.tweet })
  req.flash('success', 'Your tweet was edited!')
  res.redirect(`/tweets/${tweet._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Tweet.findByIdAndDelete(id);
  req.flash('success', 'Your tweet was deleted!')
  res.redirect('/tweets');
}))

module.exports = router;