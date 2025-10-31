import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// API methods
export default {
  // Authentication
  login(username, password) {
    return api.post('/login', { username, password });
  },

  logout() {
    return api.post('/logout');
  },

  getCurrentUser() {
    return api.get('/me');
  },

  // Health check
  healthCheck() {
    return api.get('/health');
  },

  // Generate AI analysis
  generateAnalysis(idea) {
    return api.post('/analyze', idea);
  },

  // Get all initiatives
  getInitiatives(status = null) {
    const params = status && status !== 'all' ? { status } : {};
    return api.get('/initiatives', { params });
  },

  // Get single initiative
  getInitiative(id) {
    return api.get(`/initiatives/${id}`);
  },

  // Create new initiative
  createInitiative(data) {
    return api.post('/initiatives', data);
  },

  // Update initiative (approve/reject)
  updateInitiative(id, updates) {
    return api.patch(`/initiatives/${id}`, updates);
  },

  // Delete initiative
  deleteInitiative(id) {
    return api.delete(`/initiatives/${id}`);
  },
};

