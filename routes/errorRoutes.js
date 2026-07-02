const express = require('express');
const router = express.Router();

router.get('/404', (req, res) => {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
});

router.get('/500', (req, res) => {
  res.status(500).render('errors/500', { title: 'Server Error', message: 'An unexpected error occurred.' });
});

module.exports = router;
