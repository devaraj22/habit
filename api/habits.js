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
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch habits' });
      }
      res.json(data);
    } else if (req.method === 'POST') {
      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json({ error: 'ID and name required' });
      }

      const { data, error } = await supabase
        .from('habits')
        .insert([{ id, user_id: user.id, name }])
        .select();

      if (error) {
        return res.status(400).json({ error: 'Failed to create habit' });
      }
      res.json(data[0]);
    } else if (req.method === 'PUT') {
      const { id, name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name required' });
      }

      const { data, error } = await supabase
        .from('habits')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        return res.status(500).json({ error: 'Failed to update habit' });
      }
      res.json(data[0]);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return res.status(500).json({ error: 'Failed to delete habit' });
      }
      res.json({ message: 'Habit deleted' });
    }
  } catch (error) {
    console.error('Habits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
