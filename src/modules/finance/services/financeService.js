// src/modules/finance/services/financeService.js
import api from '@/services/api';

export const accountService = {
  getAll: () => api.get('/finance/accounts'),
  create: (data) => api.post('/finance/accounts', data),
  update: (id, data) => api.put(`/finance/accounts/${id}`, data),
  deactivate: (id) => api.delete(`/finance/accounts/${id}`),
};

export const reportService = {
  getRevenueReport: (params) => api.get('/finance/reports/revenue', { params }),
};