// src/services/productService.js
import api from './api';

const productService = {
  /**
   * Lấy tất cả sản phẩm.
   * @returns {Promise<Array<Object>>} Danh sách sản phẩm
   */
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      // Giả định backend trả về mảng sản phẩm trực tiếp trong response.data
      // Nếu backend trả về cấu trúc khác (ví dụ: { data: [...], total: ... }), cần điều chỉnh lại
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Ném lỗi ra ngoài để component có thể xử lý
      throw error;
    }
  },

  /**
   * Lấy chi tiết một sản phẩm bằng ID.
   * @param {number|string} productId ID của sản phẩm
   * @returns {Promise<Object>} Chi tiết sản phẩm
   */
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },

  // Thêm các hàm khác sau này: createProduct, updateProduct, deleteProduct, getProductVariants,...
};

export default productService;