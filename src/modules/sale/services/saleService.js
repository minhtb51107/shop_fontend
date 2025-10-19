// src/modules/sale/services/saleService.js
import api from '@/services/api';

export const orderService = {
  getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getById(id) {
    return api.get(`/api/v1/orders/${id}`);
  },
  create(data) {
    return api.post('/api/v1/orders', data);
  },
  update(id, data) {
    return api.put(`/api/v1/orders/${id}`, data);
  },
  updateStatus(id, status) {
    return api.patch(`/api/v1/orders/${id}/status`, { status });
  }
};

export const promotionService = {
  getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    
    const url = `/api/v1/promotions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getById(id) {
    return api.get(`/api/v1/promotions/${id}`);
  },
  create(data) {
    return api.post('/api/v1/promotions', data);
  },
  update(id, data) {
    return api.put(`/api/v1/promotions/${id}`, data);
  },
  delete(id) {
    return api.delete(`/api/v1/promotions/${id}`);
  }
};