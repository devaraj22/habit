import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const dbPath = join(__dirname, '../habits.db');
const db = new sqlite3.Database(dbPath);

const initializeDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

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

initializeDb();

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      const token = jwt.sign(
        { id: this.lastID, username, email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      res.json({ token, user: { id: this.lastID, username, email } });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

export default app;
