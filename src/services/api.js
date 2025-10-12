// src/services/api.js
import axios from 'axios';

// Cấu hình URL cơ sở của backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Trỏ đến backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: "Chặn" và xử lý yêu cầu trước khi nó được gửi đi
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