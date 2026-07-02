const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databasePath = path.join(__dirname, 'crm.sqlite');

function getDatabase() {
  const db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error('Unable to open database:', err.message);
    }
  });
  return db;
}

function initializeDatabase() {
  const db = getDatabase();

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        company TEXT NOT NULL,
        job_title TEXT NOT NULL,
        address TEXT NOT NULL,
        notes TEXT,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    );
  });

  db.close();
}

module.exports = {
  getDatabase,
  initializeDatabase,
};