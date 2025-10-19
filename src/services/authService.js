// src/services/authService.js
import api from './api';

const authService = {
  /**
   * Đăng nhập người dùng.
   * @param {object} credentials - { email, password }
   * @returns {Promise<object>} - { accessToken, refreshToken }
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data; // Trả về { accessToken, refreshToken }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error.response?.data || new Error('Đăng nhập thất bại.');
    }
  },

  /**
   * Đăng ký tài khoản mới.
   * @param {object} userData - { fullname, email, password, phoneNumber }
   * @returns {Promise<any>}
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data; // Trả về thông báo thành công hoặc dữ liệu khác từ backend
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error.response?.data || new Error('Đăng ký thất bại.');
    }
  },

  /**
   * Lấy thông tin người dùng hiện tại (cần token).
   * @returns {Promise<object>} - Thông tin chi tiết người dùng
   */
  getCurrentUser: async () => {
    try {
      // Interceptor trong api.js sẽ tự động thêm token
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error.response?.data || error.message);
      throw error.response?.data || new Error('Không thể lấy thông tin người dùng.');
    }
  },

   /**
   * Đăng xuất người dùng (cần token).
   * @param {string} refreshToken - Refresh token để backend vô hiệu hóa
   * @returns {Promise<any>}
   */
  logout: async (refreshToken) => {
    try {
      // Interceptor trong api.js sẽ tự động thêm access token
      const response = await api.post('/auth/logout', { refreshToken });
      return response.data;
    } catch (error) {
      // Ngay cả khi logout API lỗi, chúng ta vẫn nên xóa token ở client
      console.error('Logout API failed:', error.response?.data || error.message);
      // Không ném lỗi ra ngoài để đảm bảo quá trình logout ở client vẫn diễn ra
      // throw error.response?.data || new Error('Đăng xuất thất bại.');
       return Promise.resolve(); // Coi như thành công ở client
    }
  },

   /**
    * Lấy access token mới bằng refresh token.
    * @param {string} refreshToken
    * @returns {Promise<object>} - { accessToken, refreshToken } (refreshToken có thể giữ nguyên)
    */
   refreshToken: async (refreshToken) => {
        try {
            // Gửi refresh token trong header Authorization
            const response = await api.post('/auth/refresh-token', null, { // data là null
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });
            return response.data; // { accessToken, refreshToken }
        } catch (error) {
            console.error('Token refresh failed:', error.response?.data || error.message);
            throw error.response?.data || new Error('Làm mới token thất bại.');
        }
    },
/**
   * Yêu cầu đặt lại mật khẩu.
   * @param {string} email - Email của người dùng
   * @returns {Promise<any>}
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data; // Thường backend chỉ trả về thông báo thành công
    } catch (error) {
      console.error('Forgot password request failed:', error.response?.data || error.message);
      // Không nên ném lỗi chi tiết ra ngoài để tránh lộ thông tin email có tồn tại hay không
      // throw error.response?.data || new Error('Yêu cầu đặt lại mật khẩu thất bại.');
      // Thay vào đó, trả về một Promise thành công giả để UI luôn hiển thị thông báo chung
      return Promise.resolve({ message: "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn." });
    }
  },

  /**
   * Đặt lại mật khẩu bằng token.
   * @param {string} token - Token nhận được từ email
   * @param {string} newPassword - Mật khẩu mới
   * @returns {Promise<any>}
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data; // Thường backend trả về thông báo thành công
    } catch (error) {
      console.error('Reset password failed:', error.response?.data || error.message);
      throw error.response?.data || new Error('Đặt lại mật khẩu thất bại. Token có thể không hợp lệ hoặc đã hết hạn.');
    }
  },
  /**
   * Đăng nhập bằng Google ID Token.
   * @param {string} idToken - ID Token nhận được từ Google Sign-In
   * @returns {Promise<object>} - { accessToken, refreshToken }
   */
  loginWithGoogle: async (idToken) => {
    try {
      // Backend mong đợi object { idToken: "..." }
      const response = await api.post('/auth/google', { idToken });
      return response.data; // Trả về { accessToken, refreshToken }
    } catch (error) {
      console.error('Google login failed:', error.response?.data || error.message);
      throw error.response?.data || new Error('Đăng nhập bằng Google thất bại.');
    }
  },

};

export default authService;