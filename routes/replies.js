const express = require('express');
const router = express.Router( {mergeParams: true} ); // fixes null params error
const catchAsync = require('../utils/catchAsync');
const { validateReply, isLoggedIn, isReplyAuthor } = require('../middleware')
const Tweet = require('../models/tweet');
const Reply = require('../models/reply');
const ExpressError = require('../utils/ExpressError');
const replies = require('../controllers/replies');

///////////////////////////////////////////////////////////////
/// Routes with middleware and passed in controller methods ///
///////////////////////////////////////////////////////////////

router.post('/', isLoggedIn, validateReply, catchAsync(replies.createReply))

router.delete('/:replyId', isLoggedIn, isReplyAuthor, catchAsync(replies.destroyReply))

module.exports = router;