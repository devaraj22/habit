# Supabase Setup Guide

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project (select free tier)
5. Wait for project to initialize (~5 mins)

## Step 2: Get Your Credentials
In Supabase Dashboard:
- Go to **Settings** → **API**
- Copy `Project URL` 
- Copy `anon public` key
- Save these for later

## Step 3: Create Database Tables
Go to **SQL Editor** and run this:

```sql
-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habits table
CREATE TABLE habits (
  id TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habit checks table
CREATE TABLE habit_checks (
  id BIGSERIAL PRIMARY KEY,
  habit_id TEXT NOT NULL REFERENCES habits(id),
  date TEXT NOT NULL,
  checked BOOLEAN DEFAULT false,
  UNIQUE(habit_id, date)
);

-- Weekly habits table
CREATE TABLE weekly_habits (
  id TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  week INTEGER NOT NULL,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 4: Local Development Setup
Create `.env.local` in root directory:

```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_JWT_SECRET=your-super-secret-key
```

## Step 5: Vercel Deployment
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `SUPABASE_URL` = your project URL
   - `SUPABASE_ANON_KEY` = your anon key
   - `JWT_SECRET` = your secret key
   - `REACT_APP_SUPABASE_URL` = same as SUPABASE_URL
   - `REACT_APP_SUPABASE_ANON_KEY` = same as SUPABASE_ANON_KEY
   - `REACT_APP_JWT_SECRET` = same as JWT_SECRET

5. Redeploy project

## Done! 
Your backend is now cloud-hosted with Supabase!
