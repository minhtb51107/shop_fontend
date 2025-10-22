// src/services/userService.js
import api from './api';

const userService = {
  /**
   * Cập nhật thông tin hồ sơ người dùng hiện tại.
   * @param {object} profileData - Dữ liệu cần cập nhật (vd: { fullname, phoneNumber, photo })
   * @returns {Promise<object>} - Thông tin người dùng đã được cập nhật
   */
  updateMyProfile: async (profileData) => {
    try {
      // SỬA Ở ĐÂY: Đổi đường dẫn API
      const response = await api.put('/customers/me/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile failed:', error.response?.data || error.message);
      throw error.response?.data || new Error('Cập nhật hồ sơ thất bại.');
    }
  },

  /**
   * Cập nhật mật khẩu người dùng hiện tại.
   * (Đã có trong authService, nhưng có thể để ở đây cho tập trung)
   * @param {object} passwordData - { oldPassword, newPassword }
   * @returns {Promise<any>}
   */
  changeMyPassword: async (passwordData) => {
     try {
       const response = await api.post('/auth/change-password', passwordData);
       return response.data;
     } catch (error) {
       console.error('Change password failed:', error.response?.data || error.message);
       throw error.response?.data || new Error('Đổi mật khẩu thất bại.');
     }
  }

  // Thêm các hàm khác nếu cần (ví dụ: upload avatar, lấy lịch sử đơn hàng...)
};

export default userService;