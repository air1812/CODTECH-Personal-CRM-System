const { getDatabase } = require('../database/db');
const dayjs = require('dayjs');

function createUser(name, email, password) {
  const db = getDatabase();
  const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, email, password, createdAt], function (err) {
      db.close();
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, name, email, created_at: createdAt });
    });
  });
}

function findByEmail(email) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      db.close();
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

function findById(id) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      db.close();
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};