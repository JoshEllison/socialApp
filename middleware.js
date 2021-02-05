module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // store url user is requesting
    
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  next();
}