const Reply = require('../models/reply')

module.exports.createReply = async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  const reply = new Reply(req.body.reply);
  reply.author = req.user._id;
  tweet.replies.push(reply);
  await reply.save();
  await tweet.save();
  req.flash('success', 'Your tweet was sent!')
  res.redirect(`/tweets/${tweet._id}`)
}

module.exports.destroyReply = async (req, res) => {
  const { id, replyId } = req.params;
  await Tweet.findByIdAndUpdate(id, { $pull: { replies: replyId } });
  await Reply.findByIdAndDelete(req.params.replyId);
  req.flash('success', 'Your tweet was deleted!')
  res.redirect(`/tweets/${id}`);
}