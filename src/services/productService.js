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
  /**
     * Lấy danh sách sản phẩm liên quan.
     * @param {number|string} productId ID của sản phẩm hiện tại.
     * @param {number} limit Số lượng sản phẩm muốn lấy.
     * @returns {Promise<Array<Object>>} Danh sách sản phẩm liên quan.
     */
    getRelatedProducts: async (productId, limit = 4) => {
        try {
            const response = await api.get(`/products/${productId}/related`, {
                params: { limit }
            });
            return response.data; // Trả về mảng sản phẩm
        } catch (error) {
            console.error(`Error fetching related products for ID ${productId}:`, error);
            throw error; // Ném lỗi để component xử lý
        }
    },
/**
   * Lấy danh sách sản phẩm có phân trang, lọc và sắp xếp.
   * @param {object} params - Các tham số
   * @param {number} params.page - Trang hiện tại (0-based)
   * @param {number} params.size - Số lượng item mỗi trang
   * @param {string} [params.sort] - Tiêu chí sắp xếp (vd: 'name,asc' or 'price,desc')
   * @param {string} [params.search] - Từ khóa tìm kiếm
   * @param {number} [params.categoryId] - ID danh mục
   * @param {number} [params.brandId] - ID thương hiệu
   * @returns {Promise<object>} - Đối tượng Page từ backend
   */
  getAllProducts: async (params) => { // Nhận object params
    try {
      // Gửi các tham số trong query string
      const response = await api.get('/products', { params });
      return response.data; // Trả về đối tượng Page { content: [], totalElements, totalPages, ... }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  /**
   * Lấy tất cả danh mục sản phẩm.
   * @returns {Promise<Array<Object>>} Danh sách category ({ id, name })
   */
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories'); // Gọi API categories
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Lấy tất cả thương hiệu.
   * @returns {Promise<Array<Object>>} Danh sách brand ({ id, name })
   */
  getAllBrands: async () => {
    try {
      const response = await api.get('/brands'); // Gọi API brands
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  // ==================================================
  // ===             PHẦN MỚI THÊM VÀO             ===
  // ==================================================
  /**
   * Lấy tất cả banner cho slideshow.
   * @returns {Promise<Array<Object>>} Danh sách banner ({ id, src, title })
   */
  getAllBanners: async () => {
    try {
      // Giả định endpoint là '/banners' hoặc '/api/v1/banners'
      const response = await api.get('/banners'); 
      return response.data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  },
  // ==================================================

  // Thêm các hàm khác sau này: createProduct, updateProduct, deleteProduct, getProductVariants,...
};

export default productService;