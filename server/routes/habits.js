const express = require('express');
const { db } = require('../db');
const { authenticateToken } = require('../auth');

const router = express.Router();

// Get all habits for user
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM habits WHERE user_id = ?',
    [req.user.id],
    (err, habits) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch habits' });
      }
      res.json(habits);
    }
  );
});

// Create habit
router.post('/', authenticateToken, (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: 'ID and name required' });
  }

  db.run(
    'INSERT INTO habits (id, user_id, name) VALUES (?, ?, ?)',
    [id, req.user.id, name],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to create habit' });
      }
      res.json({ id, user_id: req.user.id, name });
    }
  );
});

// Update habit
router.put('/:id', authenticateToken, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }

  db.run(
    'UPDATE habits SET name = ? WHERE id = ? AND user_id = ?',
    [name, req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update habit' });
      }
      res.json({ id: req.params.id, name });
    }
  );
});

// Delete habit
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM habits WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete habit' });
      }
      res.json({ message: 'Habit deleted' });
    }
  );
});

// Toggle habit check for a date
router.post('/:id/check', authenticateToken, (req, res) => {
  const { date, checked } = req.body;

  if (!date) {
    return res.status(400).json({ error: 'Date required' });
  }

  db.run(
    `INSERT INTO habit_checks (habit_id, date, checked) VALUES (?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET checked = ?`,
    [req.params.id, date, checked ? 1 : 0, checked ? 1 : 0],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update check' });
      }
      res.json({ habit_id: req.params.id, date, checked });
    }
  );
});

// Get habit checks for a specific habit
router.get('/:id/checks', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM habit_checks WHERE habit_id = ?',
    [req.params.id],
    (err, checks) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch checks' });
      }
      res.json(checks);
    }
  );
});

module.exports = router;
