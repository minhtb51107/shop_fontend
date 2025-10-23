// src/modules/sale/services/saleService.js
import api from '@/services/api';

// ===================================================================
// ORDER SERVICES - Quản lý đơn hàng
// Backend: OrderController.java
// ===================================================================
export const orderService = {
  // Lấy tất cả đơn hàng (admin)
  getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  // Lấy đơn hàng của user hiện tại
  getMyOrders(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/orders/my-orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById(id) {
    return api.get(`/api/v1/orders/${id}`);
  },
  
  create(data) {
    return api.post('/api/v1/orders', data);
  },
  
  // Cập nhật trạng thái đơn hàng
  updateStatus(id, status) {
    return api.put(`/api/v1/orders/${id}/status?status=${status}`);
  }
};

// ===================================================================
// ORDER STATUS HISTORY SERVICES
// Backend: OrderStatusHistoryController.java
// ===================================================================
export const orderStatusHistoryService = {
  // Lấy lịch sử trạng thái của đơn hàng
  getByOrderId(orderId) {
    return api.get(`/api/v1/order-status-histories/order/${orderId}`);
  }
};

// ===================================================================
// PROMOTION SERVICES - Quản lý khuyến mãi
// Backend: PromotionController.java
// ===================================================================
export const promotionService = {
  getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/promotions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById(id) {
    return api.get(`/api/v1/promotions/${id}`);
  },
  
  create(data) {
    return api.post('/api/v1/promotions', data);
  },
  
  // Note: Backend chưa có endpoint update promotion
  // update(id, data) {
  //   return api.put(`/api/v1/promotions/${id}`, data);
  // },
  
  // Note: Backend chưa có endpoint delete promotion
  // delete(id) {
  //   return api.delete(`/api/v1/promotions/${id}`);
  // }
};

// ===================================================================
// PAYMENT SERVICES - Quản lý thanh toán
// Backend: PaymentController.java
// ===================================================================
export const paymentService = {
  create(data) {
    return api.post('/api/v1/payments', data);
  },
  
  getById(id) {
    return api.get(`/api/v1/payments/${id}`);
  }
};

// ===================================================================
// RETURN SERVICES - Quản lý trả hàng
// Backend: ReturnController.java
// ===================================================================
export const returnService = {
  getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    
    const url = `/api/v1/returns${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById(id) {
    return api.get(`/api/v1/returns/${id}`);
  },
  
  create(data) {
    return api.post('/api/v1/returns', data);
  }
};

// ===================================================================
// SHIPMENT SERVICES - Quản lý vận chuyển
// Backend: ShipmentController.java
// ===================================================================
export const shipmentService = {
  getById(id) {
    return api.get(`/api/v1/shipments/${id}`);
  }
};

// ===================================================================
// WARRANTY SERVICES - Quản lý bảo hành
// Backend: WarrantyController.java
// ===================================================================
export const warrantyService = {
  getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    
    const url = `/api/v1/warranty${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById(id) {
    return api.get(`/api/v1/warranty/${id}`);
  },
  
  create(data) {
    return api.post('/api/v1/warranty', data);
  }
};