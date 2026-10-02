import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data)
};

export const restaurants = {
  getAll: (search = '') => api.get(`/restaurants${search ? '?search='+encodeURIComponent(search) : ''}`),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`)
};

export const foods = {
  getMenu: (restaurantId) => api.get(`/restaurants/${restaurantId}/menu`),
  create: (data) => api.post('/foods', data),
  update: (id, data) => api.put(`/foods/${id}`, data),
  delete: (id) => api.delete(`/foods/${id}`)
};

export const cart = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (data) => api.put('/cart/update', data),
  remove: (id) => api.delete(`/cart/remove/${id}`)
};

export const orders = {
  place: () => api.post('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/users/orders'),
  getAll: () => api.get('/admin/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data)
};

export default api;
