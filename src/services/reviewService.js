// src/services/reviewService.js
import api from './api';

const reviewService = {
  /**
   * Lấy đánh giá của sản phẩm (phân trang)
   * @param {number|string} productId ID sản phẩm
   * @param {number} page Số trang (0-based)
   * @param {number} size Số lượng mỗi trang
   * @returns {Promise<object>} Đối tượng Page từ backend
   */
  getReviewsByProductId: async (productId, page = 0, size = 5) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`, {
        params: {
          page: page,
          size: size,
          sort: 'createdAt,desc'
        }
      });
      return response.data; // Trả về { content: [], totalElements, ... }
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error.response?.data || new Error('Lỗi tải đánh giá.');
    }
  },

  /**
   * Tạo một đánh giá mới (yêu cầu token)
   * @param {object} reviewData { productId, rating, comment }
   * @returns {Promise<object>} Đối tượng ReviewResponse
   */
  createReview: async (reviewData) => {
    try {
      // Interceptor sẽ tự thêm token
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error.response?.data || new Error('Gửi đánh giá thất bại.');
    }
  }
};

export default reviewService;