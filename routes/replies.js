const express = require('express');
const router = express.Router( {mergeParams: true} ); // fixes null params error
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Tweet = require('../models/tweet');
const Reply = require('../models/reply');
const { replySchema } = require('../schemas')

const validateReply = (req, res, next) => {
  const { error } = replySchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',') //makes a single string message
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

router.post('/', validateReply, catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  const reply = new Reply(req.body.reply);
  tweet.replies.push(reply);
  await reply.save();
  await tweet.save();
  req.flash('success', 'Your tweet was sent!')
  res.redirect(`/tweets/${tweet._id}`)
}))

router.delete('/:replyId', catchAsync(async (req, res) => {
  const { id, replyId } = req.params;
  await Tweet.findByIdAndUpdate(id, { $pull: { replies: replyId } });
  await Reply.findByIdAndDelete(req.params.replyId);
  req.flash('success', 'Your tweet was deleted!')
  res.redirect(`/tweets/${id}`);
}))

module.exports = router;