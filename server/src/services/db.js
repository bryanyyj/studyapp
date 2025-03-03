// server/src/services/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Adjust path if your .db file is in a different location
const dbPath = path.join(__dirname, '../../study_app.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});
const pool = {
  query: function (sql, params, callback) {
      db.all(sql, params, (err, rows) => {
          if (callback) callback(err, rows);
      });
  }
};

module.exports = { pool, db };
