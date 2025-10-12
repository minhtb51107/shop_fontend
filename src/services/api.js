// src/services/api.js
import axios from 'axios';

const api = axios.create({
  // Bỏ baseURL đi, chúng ta sẽ dùng đường dẫn tương đối để proxy xử lý
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;