const { tweetSchema, replySchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Tweet = require('./models/tweet');


// tweet middleware //
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // store url user is requesting
    
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  next();
}

module.exports.validateTweet = (req, res, next) => {
  const { error } = tweetSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',') //makes a single string message
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const tweet = await Tweet.findById(id);
  if (!tweet.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!')
    return res.redirect(`/tweets/${id}`);
  }
  next();
}

// replies middleware //
module.exports.validateReply = (req, res, next) => {
  const { error } = replySchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',') //makes a single string message
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}