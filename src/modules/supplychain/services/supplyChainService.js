// src/modules/supplychain/services/supplyChainService.js
import api from '@/services/api';

export const supplierService = {
  getAll() {
    return api.get('/suppliers');
  },
  create(data) {
    return api.post('/suppliers', data);
  },
  update(id, data) {
    return api.put(`/suppliers/${id}`, data);
  },
  delete(id) {
    return api.delete(`/suppliers/${id}`);
  }
};

export const warehouseService = {
  getAll() {
    return api.get('/warehouses');
  },
  create(data) {
    return api.post('/warehouses', data);
  },
  update(id, data) {
    return api.put(`/warehouses/${id}`, data);
  },
  delete(id) {
    return api.delete(`/warehouses/${id}`);
  }
};