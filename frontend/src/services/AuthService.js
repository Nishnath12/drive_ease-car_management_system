import api from './api';

const parseJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

const AuthService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      const userData = {
        token: response.data.token,
        ...(response.data.user || {}),
        ...(parseJwt(response.data.token) || {})
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('storage'));
    }
    return response.data;
  },

  register: async (name, email, password, phone, role = 'customer') => {
    return api.post('/auth/register', { name, email, password, phone, role });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  },

  setupInterceptors: () => {
    // Authorization is attached centrally by api.js.
  }
};

export default AuthService;
