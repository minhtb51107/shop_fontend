// src/modules/finance/services/financeService.js
import axios from 'axios';

// Tạo một instance axios riêng cho module finance
const apiFinance = axios.create({
  baseURL: 'http://localhost:8080/finance',
});

// Sử dụng interceptor để thêm token
apiFinance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const accountService = {
  getAll: () => apiFinance.get('/accounts'),
  create: (data) => apiFinance.post('/accounts', data),
  update: (id, data) => apiFinance.put(`/accounts/${id}`, data),
  // Backend dùng soft-delete (thay đổi trạng thái)
  deactivate: (id) => apiFinance.delete(`/accounts/${id}`),
};

export const reportService = {
  getRevenueReport: (params) => apiFinance.get('/reports/revenue', { params }), // { year: 2025, month: 10 }
};