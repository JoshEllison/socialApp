const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Tweet = require('../models/tweet');
const { tweetSchema } = require('../schemas');
const {isLoggedIn} = require('../middleware');

const validateTweet = (req, res, next) => {
  const { error } = tweetSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',') //makes a single string message
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

router.get('/', catchAsync(async (req, res) => {
  const tweets = await Tweet.find({});
  res.render('tweets/index', { tweets })
}))

router.get('/new', isLoggedIn, (req, res) => {
  res.render('tweets/new')
})

router.post('/', isLoggedIn, validateTweet, catchAsync(async (req, res, next) => {
  // if(!req.body.tweet) throw new ExpressError('Invalid Tweet Data', 400)
  const tweet = new Tweet(req.body.tweet)
  await tweet.save();
  req.flash('success', 'Your tweet was sent!')
  res.redirect(`/tweets/${tweet._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id).populate('replies');
  if(!tweet){
    req.flash('error', 'Cannot find that tweet!');
    return res.redirect('/tweets');
  }
  res.render('tweets/show', { tweet })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id)
  if (!tweet) {
    req.flash('error', 'Cannot find that tweet!');
    return res.redirect('/tweets');
  }
  res.render('tweets/edit', { tweet })
}))

router.put('/:id', isLoggedIn, validateTweet, catchAsync(async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findByIdAndUpdate(id, { ...req.body.tweet })
  req.flash('success', 'Your tweet was edited!')
  res.redirect(`/tweets/${tweet._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Tweet.findByIdAndDelete(id);
  req.flash('success', 'Your tweet was deleted!')
  res.redirect('/tweets');
}))

module.exports = router;