// src/modules/supplychain/services/supplyChainService.js
import api from '@/services/api';

// ===================================================================
// SUPPLIER SERVICES - Quản lý nhà cung cấp
// Backend: SupplierController.java
// ===================================================================
export const supplierService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/suppliers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/api/v1/suppliers/${id}`),
  create: (data) => api.post('/api/v1/suppliers', data),
  update: (id, data) => api.put(`/api/v1/suppliers/${id}`, data),
  delete: (id) => api.delete(`/api/v1/suppliers/${id}`)
};

// ===================================================================
// WAREHOUSE SERVICES - Quản lý kho hàng
// Backend: WarehouseController.java
// ===================================================================
export const warehouseService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/warehouses${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/api/v1/warehouses/${id}`),
  create: (data) => api.post('/api/v1/warehouses', data),
  update: (id, data) => api.put(`/api/v1/warehouses/${id}`, data),
  delete: (id) => api.delete(`/api/v1/warehouses/${id}`),
  
  // Lấy danh sách kho cho web
  getAllForWeb: () => api.get('/api/v1/warehouses/web'),
  
  // Tìm kiếm kho theo tên
  searchByName: (name, params = {}) => {
    const queryParams = new URLSearchParams();
    if (name) queryParams.append('name', name);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    
    return api.get(`/api/v1/warehouses/search/name?${queryParams.toString()}`);
  },
  
  // Tìm kiếm kho theo địa chỉ
  searchByAddress: (address, params = {}) => {
    const queryParams = new URLSearchParams();
    if (address) queryParams.append('address', address);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    
    return api.get(`/api/v1/warehouses/search/address?${queryParams.toString()}`);
  }
  
  // Note: Backend chưa có endpoint lấy inventory theo warehouse
  // getInventory: (id, params) => api.get(`/api/v1/warehouses/${id}/inventory`, { params })
};

// ===================================================================
// PURCHASE ORDER SERVICES - Quản lý đơn đặt hàng
// Backend: PurchaseOrderController.java
// ===================================================================
export const purchaseOrderService = {
  getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.status) queryParams.append('status', params.status);
    if (params.supplierId) queryParams.append('supplierId', params.supplierId);
    
    const url = `/api/v1/purchase-orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById: (id) => api.get(`/api/v1/purchase-orders/${id}`),
  
  create: (data) => api.post('/api/v1/purchase-orders', data),
  
  // Note: Backend chưa có endpoint update purchase order
  // update: (id, data) => api.put(`/api/v1/purchase-orders/${id}`, data),
  
  // Note: Backend chưa có endpoint delete purchase order
  // delete: (id) => api.delete(`/api/v1/purchase-orders/${id}`),
  
  // Approve, Cancel, Submit purchase orders
  approve: (id) => api.patch(`/api/v1/purchase-orders/${id}/approve`),
  cancel: (id) => api.patch(`/api/v1/purchase-orders/${id}/cancel`),
  // Note: Backend chưa có endpoint submit
  // submit: (id) => api.patch(`/api/v1/purchase-orders/${id}/submit`),
  
  // API cho các mục trong đơn hàng
  // Backend: PurchaseOrderItemController.java
  addItem: (orderId, itemData) => api.post(`/api/v1/purchase-orders/${orderId}/items`, itemData),
  updateItem: (itemId, itemData) => api.put(`/api/v1/purchase-orders/items/${itemId}`, itemData),
  
  // Note: Backend chưa có endpoint delete item
  // deleteItem: (itemId) => api.delete(`/api/v1/purchase-orders/items/${itemId}`),
  
  // Note: Backend chưa có endpoint get items
  // getItems: (orderId) => api.get(`/api/v1/purchase-orders/${orderId}/items`)
};

// ===================================================================
// GOODS RECEIPT SERVICES - Quản lý phiếu nhập kho
// Backend: GoodsReceiptController.java
// ===================================================================
export const goodsReceiptService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.status) queryParams.append('status', params.status);
    if (params.warehouseId) queryParams.append('warehouseId', params.warehouseId);
    
    const url = `/api/v1/goods-receipts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById: (id) => api.get(`/api/v1/goods-receipts/${id}`),
  
  create: (data) => api.post('/api/v1/goods-receipts', data),
  
  // Note: Backend chưa có endpoint update goods receipt
  // update: (id, data) => api.put(`/api/v1/goods-receipts/${id}`, data),
  
  delete: (id) => api.delete(`/api/v1/goods-receipts/${id}`),
  
  // Hoàn thành phiếu nhập kho (cập nhật tồn kho)
  complete: (id) => api.post(`/api/v1/goods-receipts/${id}/complete`),
  
  // API cho các items trong phiếu nhập
  // Backend: GoodsReceiptItemController.java
  // Note: Base path là /api/goods-receipts (không có v1)
  addItem: (receiptId, itemData) => api.post(`/api/goods-receipts/${receiptId}/items`, itemData),
  
  // Note: Backend chưa có các endpoint sau cho items:
  // updateItem: (itemId, itemData) => api.put(`/api/goods-receipts/items/${itemId}`, itemData),
  // deleteItem: (itemId) => api.delete(`/api/goods-receipts/items/${itemId}`),
  // getItems: (receiptId) => api.get(`/api/goods-receipts/${receiptId}/items`)
};

// ===================================================================
// INVENTORY SERVICES - Quản lý tồn kho
// Backend: InventoryController.java
// ===================================================================
export const inventoryService = {
  // Lấy tồn kho theo variant và warehouse
  getStock: (variantId, warehouseId) => api.get(`/api/v1/inventory/${variantId}/${warehouseId}`),
  
  // Lấy tất cả tồn kho
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.variantId) queryParams.append('variantId', params.variantId);
    if (params.warehouseId) queryParams.append('warehouseId', params.warehouseId);
    
    const url = `/api/v1/inventory${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  // Tạo bản ghi tồn kho mới
  create: (data) => api.post('/api/v1/inventory', data),
  
  // Cập nhật tồn kho
  update: (variantId, warehouseId, data) => {
    return api.put(`/api/v1/inventory/${variantId}/${warehouseId}`, data);
  },
  
  // Xóa bản ghi tồn kho
  delete: (variantId, warehouseId) => {
    return api.delete(`/api/v1/inventory/${variantId}/${warehouseId}`);
  }
  
  // Note: Backend chưa có các endpoint sau:
  // getTransactions: (params) => api.get('/api/v1/inventory/transactions', { params }),
  // adjust: (data) => api.post('/api/v1/inventory/adjust', data)
};