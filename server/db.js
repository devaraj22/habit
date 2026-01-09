const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'habits.db');
const db = new sqlite3.Database(dbPath);

const initializeDb = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Habits table
    db.run(`
      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Habit checks table (track completions)
    db.run(`
      CREATE TABLE IF NOT EXISTS habit_checks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id TEXT NOT NULL,
        date TEXT NOT NULL,
        checked INTEGER DEFAULT 0,
        FOREIGN KEY (habit_id) REFERENCES habits(id),
        UNIQUE(habit_id, date)
      )
    `);

    // Weekly habits table
    db.run(`
      CREATE TABLE IF NOT EXISTS weekly_habits (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        week INTEGER NOT NULL,
        name TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  });
};

module.exports = {
  db,
  initializeDb
};
