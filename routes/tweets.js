const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Tweet = require('../models/tweet');
const { tweetSchema } = require('../schemas')

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

router.get('/new', (req, res) => {
  res.render('tweets/new')
})

router.post('/', validateTweet, catchAsync(async (req, res, next) => {
  // if(!req.body.tweet) throw new ExpressError('Invalid Tweet Data', 400)
  const tweet = new Tweet(req.body.tweet)
  await tweet.save();
  req.flash('success', 'Successfully posted a new tweet!')
  res.redirect(`/tweets/${tweet._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id).populate('replies');
  res.render('tweets/show', { tweet })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id)
  res.render('tweets/edit', { tweet })
}))

router.put('/:id', validateTweet, catchAsync(async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findByIdAndUpdate(id, { ...req.body.tweet })
  res.redirect(`/tweets/${tweet._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Tweet.findByIdAndDelete(id);
  res.redirect('/tweets');
}))

module.exports = router;