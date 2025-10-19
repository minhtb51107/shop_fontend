// src/services/orderService.js
import api from './api';

const orderService = {
  /**
   * Tạo đơn hàng mới.
   * @param {object} orderData - Dữ liệu đơn hàng
   * { customerId, warehouseId, shippingAddress, items: [{ variantId, quantity, unitPrice }] }
   * @returns {Promise<object>} - Thông tin đơn hàng đã tạo
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data; // Trả về OrderResponse từ backend
    } catch (error) {
      console.error('Create order failed:', error.response?.data || error.message);
      throw error.response?.data || new Error('Đặt hàng thất bại.');
    }
  },

  /**
   * Lấy thông tin chi tiết đơn hàng bằng ID.
   * @param {number|string} orderId
   * @returns {Promise<object>} - Chi tiết đơn hàng
   */
    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching order ${orderId}:`, error.response?.data || error.message);
            throw error.response?.data || new Error('Không thể lấy thông tin đơn hàng.');
        }
    },

  // Thêm các hàm khác nếu cần (lấy lịch sử đơn hàng của user, hủy đơn hàng...)
};

export default orderService;