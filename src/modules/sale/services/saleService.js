// src/modules/sale/services/saleService.js
import api from '@/services/api';

// 1. Service cho Đơn hàng (Order)
export const orderService = {
  getAll(params) {
    return api.get('/orders', { params }); // Hỗ trợ params cho phân trang/tìm kiếm
  },
  getById(id) {
    return api.get(`/orders/${id}`);
  },
  updateStatus(id, status) {
    return api.put(`/orders/${id}/status?status=${status}`);
  }
};

// 2. Service cho Khuyến mãi (Promotion)
export const promotionService = {
  getAll: () => api.get('/promotions'),
  getById: (id) => api.get(`/promotions/${id}`),
  create: (data) => api.post('/promotions', data),
  updateStatus: (id, isActive) => api.patch(`/promotions/${id}/status?isActive=${isActive}`),
}

// 3. Service cho Đổi/Trả hàng (Return)
export const returnService = {
    getReturns: (params) => api.get('/returns', { params }), // Hỗ trợ Listing/Search
    getById: (id) => api.get(`/returns/${id}`),
    create: (data) => api.post('/returns', data),
    // API cập nhật trạng thái (để ReturnDetail.vue gọi được)
    updateStatus: (id, status) => api.patch(`/returns/${id}/status?status=${status}`),
};

// 4. Service cho Bảo hành (Warranty)
export const warrantyService = {
    getWarrantyCases: (params) => api.get('/warranty', { params }), // Hỗ trợ Listing/Search
    getById: (id) => api.get(`/warranty/${id}`),
    create: (data) => api.post('/warranty', data),
    // API cập nhật trạng thái (để WarrantyDetail.vue gọi được)
    updateStatus: (id, status) => api.patch(`/warranty/${id}/status?status=${status}`),
};

// 5. Service cho Lịch sử Trạng thái Đơn hàng (Status History)
export const statusHistoryService = {
    getHistoryByOrderId: (orderId) => api.get(`/order-status-histories/order/${orderId}`),
};