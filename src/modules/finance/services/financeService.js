// src/modules/finance/services/financeService.js
import api from '@/services/api';

export const accountService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/finance/accounts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/api/v1/finance/accounts/${id}`),
  create: (data) => api.post('/api/v1/finance/accounts', data),
  update: (id, data) => api.put(`/api/v1/finance/accounts/${id}`, data),
  delete: (id) => api.delete(`/api/v1/finance/accounts/${id}`),
};

export const journalEntryService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    const url = `/api/v1/finance/journal-entries${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/api/v1/finance/journal-entries/${id}`),
  create: (data) => api.post('/api/v1/finance/journal-entries', data),
};

export const reportService = {
  getRevenueReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.year) queryParams.append('year', params.year);
    if (params.month) queryParams.append('month', params.month);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    const url = `/api/v1/finance/reports/revenue${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getProfitLossReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.year) queryParams.append('year', params.year);
    if (params.month) queryParams.append('month', params.month);
    
    const url = `/api/v1/finance/reports/profit-loss${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
};