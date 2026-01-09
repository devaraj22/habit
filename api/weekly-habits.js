import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const authenticateToken = (token) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return user;
  } catch (error) {
    return null;
  }
};

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const user = authenticateToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('weekly_habits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch weekly habits' });
      }
      res.json(data);
    } else if (req.method === 'POST') {
      const { id, week, name } = req.body;
      if (!id || week === undefined || !name) {
        return res.status(400).json({ error: 'ID, week, and name required' });
      }

      const { data, error } = await supabase
        .from('weekly_habits')
        .insert([{ id, user_id: user.id, week, name, completed: false }])
        .select();

      if (error) {
        return res.status(400).json({ error: 'Failed to create weekly habit' });
      }
      res.json(data[0]);
    } else if (req.method === 'PUT') {
      const { id, name, completed } = req.body;
      const updateData = {};
      if (name) updateData.name = name;
      if (completed !== undefined) updateData.completed = completed;

      const { data, error } = await supabase
        .from('weekly_habits')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        return res.status(500).json({ error: 'Failed to update weekly habit' });
      }
      res.json(data[0]);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase
        .from('weekly_habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return res.status(500).json({ error: 'Failed to delete weekly habit' });
      }
      res.json({ message: 'Weekly habit deleted' });
    }
  } catch (error) {
    console.error('Weekly habits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
