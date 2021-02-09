const express = require('express');
const router = express.Router( {mergeParams: true} ); // fixes null params error
const catchAsync = require('../utils/catchAsync');
const { validateReply, isLoggedIn, isReplyAuthor } = require('../middleware')
const Tweet = require('../models/tweet');
const Reply = require('../models/reply');

router.post('/', isLoggedIn, validateReply, catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  const reply = new Reply(req.body.reply);
  reply.author = req.user._id;
  tweet.replies.push(reply);
  await reply.save();
  await tweet.save();
  req.flash('success', 'Your tweet was sent!')
  res.redirect(`/tweets/${tweet._id}`)
}))

router.delete('/:replyId', isLoggedIn, isReplyAuthor, catchAsync(async (req, res) => {
  const { id, replyId } = req.params;
  await Tweet.findByIdAndUpdate(id, { $pull: { replies: replyId } });
  await Reply.findByIdAndDelete(req.params.replyId);
  req.flash('success', 'Your tweet was deleted!')
  res.redirect(`/tweets/${id}`);
}))

module.exports = router;