const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Tweet = require('./models/tweet');
const { captureRejectionSymbol } = require('events');

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


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/maketweet', async (req, res) => {
  const tweet = new Tweet({ tweetText: '2020 set a low bar for 2021' })
  await tweet.save()
  res.send(tweet)
})

app.get('/tweets', async (req, res) => {
  const tweets = await Tweet.find({});
  res.render('tweets/index', { tweets })
})

app.get('/tweets/new', (req, res) => {
  res.render('tweets/new')
})

app.post('/tweets', async (req, res) => {
  const tweet = new Tweet(req.body.tweet)
  await tweet.save();
  res.redirect(`/tweets/${tweet._id}`)
})

app.get('/tweets/:id', async (req, res) => {
  const tweet = await Tweet.findById(req.params.id)
  res.render('tweets/show', { tweet })
})

app.get('/tweets/:id/edit', async (req, res) => {
  const tweet = await Tweet.findById(req.params.id)
  res.render('tweets/edit', { tweet })
})

app.put('/tweets/:id', async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findByIdAndUpdate(id, {...req.body.tweet } )
  res.redirect(`/tweets/${tweet._id}`)
})

app.delete('/tweets/:id', async (req, res) => {
  const { id } = req.params;
  await Tweet.findByIdAndDelete(id);
  res.redirect('/tweets');
})

app.listen(3000, () => {
  console.log('serving on port 3000')
})