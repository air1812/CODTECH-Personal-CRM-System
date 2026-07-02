const bcrypt = require('bcryptjs');
const { createUser, findByEmail } = require('../models/userModel');

function loginPage(req, res) {
  res.render('auth/login', { title: 'Login' });
}

function registerPage(req, res) {
  res.render('auth/register', { title: 'Register' });
}

async function registerUser(req, res) {
  const { name, email, password, confirm_password } = req.body;

  if (!name || !email || !password || !confirm_password) {
    req.session.error = 'All fields are required.';
    return res.redirect('/register');
  }

  if (password !== confirm_password) {
    req.session.error = 'Passwords do not match.';
    return res.redirect('/register');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    req.session.error = 'Please enter a valid email address.';
    return res.redirect('/register');
  }

  try {
    const existingUser = await findByEmail(email.toLowerCase());
    if (existingUser) {
      req.session.error = 'A user with this email already exists.';
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await createUser(name.trim(), email.toLowerCase().trim(), hashedPassword);
    req.session.user = { id: user.id, name: user.name, email: user.email };
    req.session.success = 'Registration completed. Welcome to your Personal CRM.';
    return res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.session.error = 'Unable to complete registration. Please try again later.';
    return res.redirect('/register');
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    req.session.error = 'Email and password are required.';
    return res.redirect('/login');
  }

  try {
    const user = await findByEmail(email.toLowerCase().trim());
    if (!user) {
      req.session.error = 'Invalid email or password.';
      return res.redirect('/login');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      req.session.error = 'Invalid email or password.';
      return res.redirect('/login');
    }

    req.session.user = { id: user.id, name: user.name, email: user.email };
    req.session.success = 'Welcome back to your CRM dashboard.';
    return res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.session.error = 'Unable to login. Please try again later.';
    return res.redirect('/login');
  }
}

function logoutUser(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
}

module.exports = {
  loginPage,
  registerPage,
  registerUser,
  loginUser,
  logoutUser,
};