// src/modules/supplychain/services/supplyChainService.js
import api from '@/services/api';

// ===================================================================
// SUPPLIER SERVICES - Quản lý nhà cung cấp
// ===================================================================
export const supplierService = {
  getAll: () => api.get('/api/v1/suppliers'),
  getById: (id) => api.get(`/api/v1/suppliers/${id}`),
  create: (data) => api.post('/api/v1/suppliers', data),
  update: (id, data) => api.put(`/api/v1/suppliers/${id}`, data),
  delete: (id) => api.delete(`/api/v1/suppliers/${id}`)
};

// ===================================================================
// WAREHOUSE SERVICES - Quản lý kho hàng
// ===================================================================
export const warehouseService = {
  getAll: () => api.get('/api/v1/warehouses'),
  getById: (id) => api.get(`/api/v1/warehouses/${id}`),
  create: (data) => api.post('/api/v1/warehouses', data),
  update: (id, data) => api.put(`/api/v1/warehouses/${id}`, data),
  delete: (id) => api.delete(`/api/v1/warehouses/${id}`),
  
  // Lấy thống kê tồn kho theo kho
  getInventory: (id, params) => api.get(`/api/v1/warehouses/${id}/inventory`, { params })
};

// ===================================================================
// PURCHASE ORDER SERVICES - Quản lý đơn đặt hàng
// ===================================================================
export const purchaseOrderService = {
  getAll(params = {}) {
    console.log('🔍 Calling purchaseOrderService.getAll with params:', params);
    
    // Use the working endpoint based on console logs
    console.log('🔍 Using working endpoint /api/v1/orders');
    return api.get('/api/v1/orders');
  },
  getById: (id) => api.get(`/api/v1/purchase-orders/${id}`),
  create: (data) => api.post('/api/v1/purchase-orders', data),
  update: (id, data) => api.put(`/api/v1/purchase-orders/${id}`, data),
  delete: (id) => api.delete(`/api/v1/purchase-orders/${id}`),
  
  // Các hành động trên đơn hàng
  approve: (id) => api.patch(`/api/v1/purchase-orders/${id}/approve`),
  cancel: (id) => api.patch(`/api/v1/purchase-orders/${id}/cancel`),
  submit: (id) => api.patch(`/api/v1/purchase-orders/${id}/submit`),
  
  // API cho các mục trong đơn hàng
  addItem: (orderId, itemData) => api.post(`/api/v1/purchase-orders/${orderId}/items`, itemData),
  updateItem: (itemId, itemData) => api.put(`/api/v1/purchase-orders/items/${itemId}`, itemData),
  deleteItem: (itemId) => api.delete(`/api/v1/purchase-orders/items/${itemId}`),
  
  // Lấy danh sách items
  getItems: (orderId) => api.get(`/api/v1/purchase-orders/${orderId}/items`)
};

// ===================================================================
// GOODS RECEIPT SERVICES - Quản lý phiếu nhập kho
// ===================================================================
export const goodsReceiptService = {
  getAll: (params) => api.get('/api/v1/goods-receipts', { params }),
  getById: (id) => api.get(`/api/v1/goods-receipts/${id}`),
  create: (data) => api.post('/api/v1/goods-receipts', data),
  update: (id, data) => api.put(`/api/v1/goods-receipts/${id}`, data),
  delete: (id) => api.delete(`/api/v1/goods-receipts/${id}`),
  
  // Hoàn thành phiếu nhập kho (cập nhật tồn kho)
  complete: (id) => api.patch(`/api/v1/goods-receipts/${id}/complete`),
  
  // API cho các items trong phiếu nhập
  addItem: (receiptId, itemData) => api.post(`/api/v1/goods-receipts/${receiptId}/items`, itemData),
  updateItem: (itemId, itemData) => api.put(`/api/v1/goods-receipts/items/${itemId}`, itemData),
  deleteItem: (itemId) => api.delete(`/api/v1/goods-receipts/items/${itemId}`),
  
  // Lấy danh sách items
  getItems: (receiptId) => api.get(`/api/v1/goods-receipts/${receiptId}/items`)
};

// ===================================================================
// INVENTORY SERVICES - Quản lý tồn kho
// ===================================================================
export const inventoryService = {
  // Lấy tồn kho theo variant và warehouse
  getStock: (variantId, warehouseId) => api.get(`/api/v1/inventory/${variantId}/${warehouseId}`),
  
  // Lấy tất cả tồn kho
  getAll: (params) => api.get('/api/v1/inventory', { params }),
  
  // Lấy lịch sử giao dịch tồn kho
  getTransactions: (params) => api.get('/api/v1/inventory/transactions', { params }),
  
  // Điều chỉnh tồn kho thủ công (nếu có quyền)
  adjust: (data) => api.post('/api/v1/inventory/adjust', data)
};