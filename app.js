const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { tweetSchema } = require('./schemas')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Tweet = require('./models/tweet');
const Reply = require('./models/reply');

mongoose.connect('mongodb://localhost:27017/social-app', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

const validateTweet = (req, res, next) => {
  const { error } = tweetSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',') //makes a single string message
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/maketweet', catchAsync(async (req, res) => {
  const tweet = new Tweet({ tweetText: '2020 set a low bar for 2021' })
  await tweet.save()
  res.send(tweet)
}))

app.get('/tweets', catchAsync(async (req, res) => {
  const tweets = await Tweet.find({});
  res.render('tweets/index', { tweets })
}))

app.get('/tweets/new', (req, res) => {
  res.render('tweets/new')
})

app.post('/tweets', validateTweet, catchAsync(async (req, res, next) => {
  // if(!req.body.tweet) throw new ExpressError('Invalid Tweet Data', 400)
    const tweet = new Tweet(req.body.tweet)
    await tweet.save();
    res.redirect(`/tweets/${tweet._id}`)
}))

app.get('/tweets/:id', catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id)
  res.render('tweets/show', { tweet })
}))

app.get('/tweets/:id/edit', catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id)
  res.render('tweets/edit', { tweet })
}))

app.put('/tweets/:id', validateTweet, catchAsync(async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findByIdAndUpdate(id, {...req.body.tweet } )
  res.redirect(`/tweets/${tweet._id}`)
}))

app.delete('/tweets/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Tweet.findByIdAndDelete(id);
  res.redirect('/tweets');
}))

app.post('/tweets/:id/replies', catchAsync(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  const reply = new Reply(req.body.reply);
  tweet.replies.push(reply);
  await reply.save();
  await tweet.save();
  res.redirect(`/tweets/${tweet._id}`)
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('serving on port 3000')
})