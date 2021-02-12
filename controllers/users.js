const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register')
}

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // doesn't support await so we use callback
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Social App!');
      res.redirect('/tweets');
    })
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('register')
  }
}

module.exports.renderLogin = (req, res) => {
  res.render('users/login')
}

module.exports.login = (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/tweets';
  delete req.session.returnTo; //clean up
  res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
  req.logOut();
  req.flash('success', 'Goodbye!');
  res.redirect('/tweets');
}