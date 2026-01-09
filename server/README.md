# Habit Tracker Backend

Express.js backend API for the Habit Tracker application.

## Features
- User authentication with JWT
- Manage daily habits with check tracking
- Manage weekly habits
- SQLite database

## Installation

```bash
npm install
```

## Running

```bash
npm start        # Production
npm run dev      # Development with auto-reload
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/check` - Toggle habit check
- `GET /api/habits/:id/checks` - Get habit checks

### Weekly Habits
- `GET /api/weekly-habits` - Get all weekly habits
- `POST /api/weekly-habits` - Create weekly habit
- `PUT /api/weekly-habits/:id` - Update weekly habit
- `DELETE /api/weekly-habits/:id` - Delete weekly habit

## Environment Variables
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
