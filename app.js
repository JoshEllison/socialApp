const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

// auth
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const tweetRoutes = require('./routes/tweets');
const replyRoutes = require('./routes/replies');

mongoose.connect('mongodb://localhost:27017/social-app', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 1 week expiration
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, 
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // middleware for persistant login sessions
passport.use(new LocalStrategy(User.authenticate())); // add aditional strategies later
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to give access to whatever is in flash under success
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/fakeUser', async (req, res) => {
  const user = new User({email: 'fakeEmail@gmail.com', username: 'fakeUser'})
  const newUser = await User.register(user, 'password');
  res.send(newUser);
})

/// prefixing routes ///
app.use('/', userRoutes);
app.use('/tweets', tweetRoutes);
app.use('/tweets/:id/replies', replyRoutes);

app.get('/', (req, res) => {
  res.render('home')
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong!'
  res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
  console.log('serving on port 3000')
});