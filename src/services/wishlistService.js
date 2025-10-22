// src/services/wishlistService.js
import api from './api';

const wishlistService = {
  /**
   * Lấy danh sách ID các variant trong wishlist của người dùng hiện tại.
   * @returns {Promise<Array<number>>} - Mảng các variantId
   */
  getMyWishlistVariantIds: async () => {
    try {
      // API Backend: GET /api/v1/wishlist/my/ids
      const response = await api.get('/wishlist/my/ids');
      return response.data || []; // Trả về mảng rỗng nếu data null
    } catch (error) {
      console.error('Failed to fetch wishlist variant IDs:', error.response?.data || error.message);
      // Trả về mảng rỗng để không làm crash UI, nhưng log lỗi
      return [];
    }
  },

  /**
   * Thêm variant vào wishlist.
   * @param {number} variantId - ID của variant cần thêm
   * @returns {Promise<void>}
   */
  addToWishlist: async (variantId) => {
    try {
       // API Backend: POST /api/v1/wishlist/{variantId}
      await api.post(`/wishlist/${variantId}`);
    } catch (error) {
      console.error(`Failed to add variant ${variantId} to wishlist:`, error.response?.data || error.message);
      // Ném lỗi ra để component xử lý (ví dụ: hiển thị snackbar lỗi)
      throw error.response?.data || new Error('Thêm vào yêu thích thất bại.');
    }
  },

  /**
   * Xóa variant khỏi wishlist.
   * @param {number} variantId - ID của variant cần xóa
   * @returns {Promise<void>}
   */
  removeFromWishlist: async (variantId) => {
    try {
      // API Backend: DELETE /api/v1/wishlist/{variantId}
      await api.delete(`/wishlist/${variantId}`);
    } catch (error) {
      console.error(`Failed to remove variant ${variantId} from wishlist:`, error.response?.data || error.message);
      // Ném lỗi ra để component xử lý
      throw error.response?.data || new Error('Xóa khỏi yêu thích thất bại.');
    }
  },

   /** // ========== SỬA TÊN HÀM Ở ĐÂY ==========
    * Lấy danh sách chi tiết các mục trong wishlist (bao gồm thông tin sản phẩm).
    * @returns {Promise<Array<object>>} - Mảng các WishlistItemResponse từ backend
    */
   getMyWishlist: async () => { // <--- Đổi tên từ getMyWishlistDetails thành getMyWishlist
       try {
           // API Backend: GET /api/v1/wishlist/my
           const response = await api.get('/wishlist/my');
           return response.data || []; // Trả về mảng rỗng nếu data null/undefined
       } catch (error) {
           console.error('Failed to fetch wishlist details:', error.response?.data || error.message);
           // Ném lỗi ra để ProfileView.vue có thể bắt và hiển thị thông báo lỗi
           throw error.response?.data || new Error('Lấy danh sách yêu thích thất bại.');
       }
   },
   // ========== KẾT THÚC SỬA TÊN HÀM ==========

};

export default wishlistService; // Giữ nguyên export default