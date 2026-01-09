import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, username, email, password } = req.body;

  try {
    if (action === 'register') {
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const hashedPassword = bcryptjs.hashSync(password, 10);

      const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, password: hashedPassword }])
        .select();

      if (error) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      const user = data[0];
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({ token, user: { id: user.id, username, email } });
    } else if (action === 'login') {
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

      if (error || users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = users[0];
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
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
