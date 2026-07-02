function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  req.session.error = 'Please login to access this area.';
  return res.redirect('/login');
}

function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
}

module.exports = {
  ensureAuthenticated,
  redirectIfAuthenticated,
};