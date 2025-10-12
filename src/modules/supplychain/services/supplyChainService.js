// src/modules/supplychain/services/supplyChainService.js
import api from '@/services/api';

export const supplierService = {
  getAll: () => api.get('/suppliers'),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`)
};

export const warehouseService = {
  getAll: () => api.get('/warehouses'),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  delete: (id) => api.delete(`/warehouses/${id}`)
};

export const purchaseOrderService = {
  getAll: (params) => api.get('/purchase-orders', { params }),
  getById: (id) => api.get(`/purchase-orders/${id}`),
  create: (data) => api.post('/purchase-orders', data),
  approve: (id) => api.patch(`/purchase-orders/${id}/approve`),
  cancel: (id) => api.patch(`/purchase-orders/${id}/cancel`),
  
  // API cho các mục trong đơn hàng
  addItem: (orderId, itemData) => api.post(`/purchase-orders/${orderId}/items`, itemData),
  updateItem: (itemId, itemData) => api.put(`/purchase-orders/items/${itemId}`, itemData),
  deleteItem: (itemId) => api.delete(`/purchase-orders/items/${itemId}`),
};