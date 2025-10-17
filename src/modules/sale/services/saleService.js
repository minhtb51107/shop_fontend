// src/modules/sale/services/saleService.js
import api from '@/services/api';

export const orderService = {
    getOrders(params) {
        return api.get('/orders', { params });
    },
    getById(id) {
        return api.get(`/orders/${id}`);
    },
    updateStatus(id, status) {
        return api.patch(`/orders/${id}/status`, { status });
    },
    getStatusHistory: (orderId) => api.get(`/order-status-histories/order/${orderId}`),
};

export const promotionService = {
    getAll() {
        return api.get('/promotions');
    },
    getById(id) {
        return api.get(`/promotions/${id}`);
    },
    create(data) {
        return api.post('/promotions', data);
    },
    update(id, data) {
        return api.put(`/promotions/${id}`, data);
    },
    remove(id) {
        return api.delete(`/promotions/${id}`);
    }
};

export const returnService = {
    getReturns(params) {
        return api.get('/returns', { params });
    },
    getById(id) {
        return api.get(`/returns/${id}`);
    },
    updateStatus(id, status) {
        return api.patch(`/returns/${id}/status`, { status });
    }
};

export const warrantyService = {
    getWarrantyCases(params) {
        return api.get('/warranty', { params });
    },
    getById(id) {
        return api.get(`/warranty/${id}`);
    },
    // Phương thức mới để cập nhật trạng thái yêu cầu bảo hành
    updateStatus(id, status) {
        return api.patch(`/warranty/${id}/status`, { status });
    }
};

export const paymentService = {
    getByOrderId: (orderId) => api.get(`/payments?orderId=${orderId}`),
    getById: (id) => api.get(`/payments/${id}`),
};

export const shipmentService = {
    getByOrderId: (orderId) => api.get(`/shipments?orderId=${orderId}`),
    getById: (id) => api.get(`/shipments/${id}`),
};

export const orderStatusHistoryService = {
    getHistoryByOrderId: (orderId) => api.get(`/order-status-histories/order/${orderId}`),
};