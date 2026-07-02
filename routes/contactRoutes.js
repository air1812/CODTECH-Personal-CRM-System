const express = require('express');
const {
  dashboardPage,
  contactsPage,
  newContactPage,
  createContactHandler,
  editContactPage,
  updateContactHandler,
  deleteContactHandler,
  viewContactPage,
} = require('../controllers/contactController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, dashboardPage);
router.get('/contacts', ensureAuthenticated, contactsPage);
router.get('/contacts/new', ensureAuthenticated, newContactPage);
router.post('/contacts', ensureAuthenticated, createContactHandler);
router.get('/contacts/:id/edit', ensureAuthenticated, editContactPage);
router.post('/contacts/:id', ensureAuthenticated, updateContactHandler);
router.post('/contacts/:id/delete', ensureAuthenticated, deleteContactHandler);
router.get('/contacts/:id', ensureAuthenticated, viewContactPage);

module.exports = router;
