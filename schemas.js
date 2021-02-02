const Joi = require('joi');

// Joi schema's for data validation

module.exports.tweetSchema = Joi.object({
  tweet: Joi.object({
    tweetText: Joi.string().required().max(150),
    image: Joi.string()
  }).required()
});

