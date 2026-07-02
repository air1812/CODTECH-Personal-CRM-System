const express = require('express');
const { loginPage, registerPage, registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
});

router.get('/login', redirectIfAuthenticated, loginPage);
router.get('/register', redirectIfAuthenticated, registerPage);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

module.exports = router;
