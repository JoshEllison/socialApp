const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
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

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/maketweet', async (req, res) => {
  const tweet = new Tweet({ tweetText: 'this is a test' })
  await tweet.save()
  res.send(tweet)
})

app.listen(3000, () => {
  console.log('serving on port 3000')
})