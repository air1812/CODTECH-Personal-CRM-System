const { createContact, getContactById, updateContact, deleteContact, countContacts, countStatus, getRecentContacts, searchContacts, checkDuplicateContactEmail } = require('../models/contactModel');

const categories = ['Family', 'Friends', 'Clients', 'Business', 'Leads', 'Others'];
const statuses = ['Active', 'Follow Up', 'Closed'];

async function dashboardPage(req, res) {
  const userId = req.session.user.id;
  const total = await countContacts(userId);
  const activeCount = await countStatus(userId, 'Active');
  const followUpCount = await countStatus(userId, 'Follow Up');
  const closedCount = await countStatus(userId, 'Closed');
  const recentContacts = await getRecentContacts(userId, 6);

  res.render('contacts/dashboard', {
    title: 'Dashboard',
    total,
    activeCount,
    followUpCount,
    closedCount,
    recentContacts,
  });
}

async function contactsPage(req, res) {
  const userId = req.session.user.id;
  const { search = '', category = 'all', status = 'all', sort = 'newest', page = 1 } = req.query;
  const limit = 10;
  const offset = (Number(page) - 1) * limit;

  const result = await searchContacts(userId, { search: search.trim(), category, status }, { sort, limit, offset });
  const totalPages = Math.ceil(result.total / limit) || 1;

  res.render('contacts/list', {
    title: 'Contacts',
    contacts: result.rows,
    filters: { search, category, status, sort, page: Number(page) },
    categories,
    statuses,
    pagination: { page: Number(page), totalPages },
  });
}

function newContactPage(req, res) {
  res.render('contacts/new', {
    title: 'Add Contact',
    categories,
    statuses,
    contact: {},
  });
}

async function createContactHandler(req, res) {
  const userId = req.session.user.id;
  const contact = {
    user_id: userId,
    full_name: req.body.full_name.trim(),
    email: req.body.email.toLowerCase().trim(),
    phone: req.body.phone.trim(),
    company: req.body.company.trim(),
    job_title: req.body.job_title.trim(),
    address: req.body.address.trim(),
    notes: req.body.notes.trim(),
    category: req.body.category,
    status: req.body.status,
  };

  if (!contact.full_name || !contact.email || !contact.phone || !contact.company || !contact.job_title || !contact.address || !contact.category || !contact.status) {
    req.session.error = 'Please complete all required fields.';
    return res.redirect('/contacts/new');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    req.session.error = 'Enter a valid email address.';
    return res.redirect('/contacts/new');
  }

  if (!/^\+?[0-9\-\s]{7,20}$/.test(contact.phone)) {
    req.session.error = 'Enter a valid phone number.';
    return res.redirect('/contacts/new');
  }

  const duplicate = await checkDuplicateContactEmail(userId, contact.email);
  if (duplicate) {
    req.session.error = 'A contact with this email already exists.';
    return res.redirect('/contacts/new');
  }

  try {
    await createContact(contact);
    req.session.success = 'Contact added successfully.';
    return res.redirect('/contacts');
  } catch (error) {
    console.error(error);
    req.session.error = 'Unable to add contact right now.';
    return res.redirect('/contacts/new');
  }
}

async function editContactPage(req, res) {
  const userId = req.session.user.id;
  const contact = await getContactById(req.params.id, userId);
  if (!contact) {
    req.session.error = 'Contact not found.';
    return res.redirect('/contacts');
  }

  res.render('contacts/edit', {
    title: 'Edit Contact',
    categories,
    statuses,
    contact,
  });
}

async function updateContactHandler(req, res) {
  const userId = req.session.user.id;
  const contactId = req.params.id;
  const contact = {
    full_name: req.body.full_name.trim(),
    email: req.body.email.toLowerCase().trim(),
    phone: req.body.phone.trim(),
    company: req.body.company.trim(),
    job_title: req.body.job_title.trim(),
    address: req.body.address.trim(),
    notes: req.body.notes.trim(),
    category: req.body.category,
    status: req.body.status,
  };

  if (!contact.full_name || !contact.email || !contact.phone || !contact.company || !contact.job_title || !contact.address || !contact.category || !contact.status) {
    req.session.error = 'Please complete all required fields.';
    return res.redirect(`/contacts/${contactId}/edit`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    req.session.error = 'Enter a valid email address.';
    return res.redirect(`/contacts/${contactId}/edit`);
  }

  if (!/^\+?[0-9\-\s]{7,20}$/.test(contact.phone)) {
    req.session.error = 'Enter a valid phone number.';
    return res.redirect(`/contacts/${contactId}/edit`);
  }

  const duplicate = await checkDuplicateContactEmail(userId, contact.email, contactId);
  if (duplicate) {
    req.session.error = 'A contact with this email already exists.';
    return res.redirect(`/contacts/${contactId}/edit`);
  }

  const updated = await updateContact(contactId, userId, contact);
  if (!updated) {
    req.session.error = 'Contact was not updated.';
    return res.redirect(`/contacts/${contactId}/edit`);
  }

  req.session.success = 'Contact updated successfully.';
  return res.redirect('/contacts');
}

async function deleteContactHandler(req, res) {
  const userId = req.session.user.id;
  const deleted = await deleteContact(req.params.id, userId);
  if (!deleted) {
    req.session.error = 'Unable to delete the contact.';
    return res.redirect('/contacts');
  }
  req.session.success = 'Contact deleted successfully.';
  return res.redirect('/contacts');
}

async function viewContactPage(req, res) {
  const userId = req.session.user.id;
  const contact = await getContactById(req.params.id, userId);
  if (!contact) {
    req.session.error = 'Contact not found.';
    return res.redirect('/contacts');
  }

  res.render('contacts/view', {
    title: 'View Contact',
    contact,
  });
}

module.exports = {
  dashboardPage,
  contactsPage,
  newContactPage,
  createContactHandler,
  editContactPage,
  updateContactHandler,
  deleteContactHandler,
  viewContactPage,
};