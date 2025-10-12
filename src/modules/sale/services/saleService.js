// src/modules/sale/services/saleService.js
import api from '@/services/api';

export const orderService = {
  getAll() {
    return api.get('/orders');
  },
  getById(id) {
    return api.get(`/orders/${id}`);
  },
  updateStatus(id, status) {
    return api.put(`/orders/${id}/status?status=${status}`);
  }
};

export const promotionService = {
  getAll() {
    return api.get('/promotions');
  },
  create(data) {
    return api.post('/promotions', data);
  },
  update(id, data) {
    // Backend dường như chưa có API update, tạm thời comment lại
    // return api.put(`/promotions/${id}`, data);
  },
  delete(id) {
    // Backend dường như chưa có API delete
  }
}