const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDb } = require('./db');
const authRoutes = require('./routes/auth');
const habitsRoutes = require('./routes/habits');
const weeklyHabitsRoutes = require('./routes/weeklyHabits');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/weekly-habits', weeklyHabitsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
