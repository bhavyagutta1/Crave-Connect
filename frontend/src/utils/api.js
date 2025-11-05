import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Recipe APIs
export const recipeAPI = {
  getAll: (params) => api.get('/recipes', { params }),
  getById: (id) => api.get(`/recipes/${id}`),
  getTrending: () => api.get('/recipes/trending'),
  getFeatured: () => api.get('/recipes/featured'),
  create: (data) => api.post('/recipes', data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`),
  like: (id) => api.post(`/recipes/${id}/like`),
  rate: (id, rating) => api.post(`/recipes/${id}/rate`, { rating }),
  getComments: (id) => api.get(`/recipes/${id}/comments`),
  addComment: (id, text) => api.post(`/recipes/${id}/comments`, { text })
};

// User APIs
export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  follow: (id) => api.post(`/users/${id}/follow`),
  bookmark: (recipeId) => api.post(`/users/bookmark/${recipeId}`),
  getBookmarks: (id) => api.get(`/users/${id}/bookmarks`),
  getTopChefs: () => api.get('/users/top-chefs'),
  getNotifications: (id) => api.get(`/users/${id}/notifications`),
  markNotificationRead: (id) => api.put(`/users/notifications/${id}/read`)
};

// Chat APIs
export const chatAPI = {
  getMessages: (room) => api.get('/chat/messages', { params: { room } }),
  sendMessage: (message, room) => api.post('/chat/messages', { message, room }),
  deleteMessage: (id) => api.delete(`/chat/messages/${id}`)
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPendingRecipes: () => api.get('/admin/recipes/pending'),
  approveRecipe: (id, isApproved) => api.put(`/admin/recipes/${id}/approve`, { isApproved }),
  featureRecipe: (id, isFeatured) => api.put(`/admin/recipes/${id}/feature`, { isFeatured }),
  getComments: (params) => api.get('/admin/comments', { params }),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`),
  getCookOffs: () => api.get('/admin/cookoff'),
  createCookOff: (data) => api.post('/admin/cookoff', data),
  resetWeeklyPoints: () => api.post('/admin/reset-weekly-points')
};

export default api;
