const Like = require('../models/like');
const Tweet = require('../models/tweet');

module.exports.createLike = async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  const like = new Like(req.body.like.liked === true);
  like.author = req.user._id;
  tweet.likes.push(like);
  await like.save();
  await tweet.save();
  req.flash('success', 'Liked!')
  res.redirect(`/tweets/${tweet._id}`)
}

module.exports.destroyLike = async (req, res) => {
  const { id, likeId } = req.params;
  await Tweet.findByIdAndUpdate(id, { $pull: { likes: likeId } });
  await Like.findByIdAndDelete(req.params.likeId);
  req.flash('success', 'You unliked!')
  res.redirect(`/tweets/${id}`);
}