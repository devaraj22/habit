const express = require('express');
const { db } = require('../db');
const { authenticateToken } = require('../auth');

const router = express.Router();

// Get all weekly habits for user
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM weekly_habits WHERE user_id = ?',
    [req.user.id],
    (err, habits) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch weekly habits' });
      }
      res.json(habits);
    }
  );
});

// Create weekly habit
router.post('/', authenticateToken, (req, res) => {
  const { id, week, name } = req.body;

  if (!id || week === undefined || !name) {
    return res.status(400).json({ error: 'ID, week, and name required' });
  }

  db.run(
    'INSERT INTO weekly_habits (id, user_id, week, name, completed) VALUES (?, ?, ?, ?, ?)',
    [id, req.user.id, week, name, 0],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to create weekly habit' });
      }
      res.json({ id, user_id: req.user.id, week, name, completed: 0 });
    }
  );
});

// Update weekly habit
router.put('/:id', authenticateToken, (req, res) => {
  const { name, completed } = req.body;

  db.run(
    'UPDATE weekly_habits SET name = ?, completed = ? WHERE id = ? AND user_id = ?',
    [name || null, completed !== undefined ? completed : null, req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update weekly habit' });
      }
      res.json({ id: req.params.id, name, completed });
    }
  );
});

// Delete weekly habit
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM weekly_habits WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete weekly habit' });
      }
      res.json({ message: 'Weekly habit deleted' });
    }
  );
});

module.exports = router;
