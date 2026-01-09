// Update this to your Vercel deployed URL or localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const authApi = {
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, email, password })
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    return response.json();
  }
};

export const habitsApi = {
  getAll: async (token) => {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  create: async (token, id, name) => {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, name })
    });
    return response.json();
  },

  update: async (token, id, name) => {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, name })
    });
    return response.json();
  },

  delete: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    });
    return response.json();
  }
};

export const weeklyHabitsApi = {
  getAll: async (token) => {
    const response = await fetch(`${API_BASE_URL}/weekly-habits`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  create: async (token, id, week, name) => {
    const response = await fetch(`${API_BASE_URL}/weekly-habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, week, name })
    });
    return response.json();
  },

  update: async (token, id, name, completed) => {
    const response = await fetch(`${API_BASE_URL}/weekly-habits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, name, completed })
    });
    return response.json();
  },

  delete: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/weekly-habits`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    });
    return response.json();
  }
};
