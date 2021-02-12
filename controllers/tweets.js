module.exports.index = async (req, res) => {
  const tweets = await Tweet.find({}).populate({
    path: 'replies',
    populate: {
      path: 'author'
    }
  }).populate('author');
  res.render('tweets/index', { tweets })
}