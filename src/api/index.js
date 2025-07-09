import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile'),
};

// Restaurant API
export const restaurantAPI = {
  getAll: () => API.get('/restaurants'),
  getById: (id) => API.get(`/restaurants/${id}`),
  getRandom: (params) => API.get('/restaurants/random', { params }),
  search: (params) => API.get('/restaurants/search', { params }),
};

// Menu API
export const menuAPI = {
  getByRestaurant: (restaurantId) => API.get(`/menus/${restaurantId}`),
  getById: (id) => API.get(`/menus/${id}`),
};

// Order API
export const orderAPI = {
  create: (orderData) => API.post('/orders', orderData),
  getUserOrders: () => API.get('/orders/user'),
  getById: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  cancel: (id) => API.post(`/orders/${id}/cancel`),
};

// Reservation API
export const reservationAPI = {
  create: (reservationData) => API.post('/reservations', reservationData),
  getUserReservations: () => API.get('/reservations/me'),
  update: (id, reservationData) => API.put(`/reservations/${id}`, reservationData),
  cancel: (id) => API.delete(`/reservations/${id}`),
};

// User API
export const userAPI = {
  getPreferences: () => API.get('/users/preferences'),
  updatePreferences: (preferences) => API.put('/users/preferences', preferences),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (orderId) => API.post('/payments/create-payment-intent', { orderId }),
  confirmPayment: (orderId, paymentIntentId) => API.post('/payments/confirm-payment', { orderId, paymentIntentId }),
  getPaymentStatus: (orderId) => API.get(`/payments/status/${orderId}`),
  refundPayment: (orderId) => API.post(`/payments/refund/${orderId}`),
};

export default API; 