const { getDatabase } = require('../database/db');
const dayjs = require('dayjs');

function createContact(contact) {
  const db = getDatabase();
  const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO contacts (user_id, full_name, email, phone, company, job_title, address, notes, category, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(
      sql,
      [
        contact.user_id,
        contact.full_name,
        contact.email,
        contact.phone,
        contact.company,
        contact.job_title,
        contact.address,
        contact.notes || '',
        contact.category,
        contact.status,
        createdAt,
      ],
      function (err) {
        db.close();
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, created_at: createdAt, ...contact });
      }
    );
  });
}

function updateContact(contactId, userId, contact) {
  const db = getDatabase();

  return new Promise((resolve, reject) => {
    const sql = `UPDATE contacts SET full_name = ?, email = ?, phone = ?, company = ?, job_title = ?, address = ?, notes = ?, category = ?, status = ?
      WHERE id = ? AND user_id = ?`;

    db.run(
      sql,
      [
        contact.full_name,
        contact.email,
        contact.phone,
        contact.company,
        contact.job_title,
        contact.address,
        contact.notes || '',
        contact.category,
        contact.status,
        contactId,
        userId,
      ],
      function (err) {
        db.close();
        if (err) {
          return reject(err);
        }
        resolve(this.changes > 0);
      }
    );
  });
}

function getContactById(contactId, userId) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM contacts WHERE id = ? AND user_id = ?', [contactId, userId], (err, row) => {
      db.close();
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

function deleteContact(contactId, userId) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM contacts WHERE id = ? AND user_id = ?', [contactId, userId], function (err) {
      db.close();
      if (err) {
        return reject(err);
      }
      resolve(this.changes > 0);
    });
  });
}

function countContacts(userId) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as total FROM contacts WHERE user_id = ?', [userId], (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row.total || 0);
    });
  });
}

function countStatus(userId, status) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as total FROM contacts WHERE user_id = ? AND status = ?', [userId, status], (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row.total || 0);
    });
  });
}

function countCategory(userId, category) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as total FROM contacts WHERE user_id = ? AND category = ?', [userId, category], (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row.total || 0);
    });
  });
}

function getRecentContacts(userId, limit = 5) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM contacts WHERE user_id = ? ORDER BY created_at DESC LIMIT ?', [userId, limit], (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function searchContacts(userId, query = {}, options = {}) {
  const db = getDatabase();
  const values = [userId];
  let where = 'WHERE user_id = ?';

  if (query.search) {
    where += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)';
    const term = `%${query.search}%`;
    values.push(term, term, term, term);
  }
  if (query.category && query.category !== 'all') {
    where += ' AND category = ?';
    values.push(query.category);
  }
  if (query.status && query.status !== 'all') {
    where += ' AND status = ?';
    values.push(query.status);
  }

  const orderBy = options.sort === 'oldest' ? 'created_at ASC' : options.sort === 'alpha' ? 'full_name ASC' : 'created_at DESC';
  const limit = options.limit || 10;
  const offset = options.offset || 0;

  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM contacts ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    db.all(sql, [...values, limit, offset], (err, rows) => {
      if (err) {
        db.close();
        return reject(err);
      }
      const countSql = `SELECT COUNT(*) AS total FROM contacts ${where}`;
      db.get(countSql, values, (countErr, countRow) => {
        db.close();
        if (countErr) {
          return reject(countErr);
        }
        resolve({ rows, total: countRow.total || 0 });
      });
    });
  });
}

function checkDuplicateContactEmail(userId, email, excludeContactId = null) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    let sql = 'SELECT id FROM contacts WHERE user_id = ? AND email = ?';
    const params = [userId, email];
    if (excludeContactId) {
      sql += ' AND id != ?';
      params.push(excludeContactId);
    }
    db.get(sql, params, (err, row) => {
      db.close();
      if (err) {
        return reject(err);
      }
      resolve(!!row);
    });
  });
}

module.exports = {
  createContact,
  getContactById,
  updateContact,
  deleteContact,
  countContacts,
  countStatus,
  countCategory,
  getRecentContacts,
  searchContacts,
  checkDuplicateContactEmail,
};