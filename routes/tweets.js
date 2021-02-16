const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateTweet} = require('../middleware');
const tweets = require('../controllers/tweets')

///////////////////////////////////////////////////////////////
/// Routes with middleware and passed in controller methods ///
///////////////////////////////////////////////////////////////
router.get('/', catchAsync(tweets.index));

router.get('/new', isLoggedIn, tweets.renderNewForm);

router.post('/', isLoggedIn, validateTweet, catchAsync(tweets.createTweet));

router.get('/:id', catchAsync(tweets.showTweet));

router.post('/:id/act', catchAsync(tweets.updateLikes))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(tweets.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateTweet, catchAsync(tweets.updateTweet))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(tweets.destroyTweet))

module.exports = router;