const express = require('express');
const router = express.Router({ mergeParams: true }); // fixes null params error
const catchAsync = require('../utils/catchAsync');
const { validateReply, isLoggedIn, isReplyAuthor, isLikeAuthor } = require('../middleware')
const Tweet = require('../models/tweet');
const Like = require('../models/like');
const likes = require('../controllers/likes');

///////////////////////////////////////////////////////////////
/// Routes with middleware and passed in controller methods ///
///////////////////////////////////////////////////////////////

router.post('/', isLoggedIn, catchAsync(likes.createLike))

router.delete('/:replyId', isLoggedIn, isLikeAuthor, catchAsync(likes.destroyLike))

module.exports = router;