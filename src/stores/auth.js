// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '@/services/authService';
import api from '@/services/api'; // Import api instance để cập nhật header
import router from '@/router'; // Import router để điều hướng

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null); // Thông tin người dùng { id, email, fullname, userType, roles, permissions }
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const refreshToken = ref(localStorage.getItem('refreshToken') || null);
  const returnUrl = ref(null); // Lưu lại URL người dùng muốn truy cập trước khi bị chuyển đến login

  // --- Getters ---
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const userRoles = computed(() => user.value?.roles || []);
  const userPermissions = computed(() => user.value?.permissions || []);

  // --- Actions ---

  /**
   * Lưu token và cập nhật header cho Axios.
   * @param {string} newAccessToken
   * @param {string} newRefreshToken
   */
  function setTokens(newAccessToken, newRefreshToken) {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    // Cập nhật header mặc định cho các request sau này
    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  }

  /**
   * Xóa token và thông tin người dùng.
   */
  function clearAuthData() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Xóa header Authorization
    delete api.defaults.headers.common['Authorization'];
  }

  /**
   * Xử lý đăng nhập.
   * @param {object} credentials - { email, password }
   */
  async function login(credentials) {
    try {
      const data = await authService.login(credentials);
      setTokens(data.accessToken, data.refreshToken);
      // Sau khi có token, lấy thông tin user
      await fetchUser();
      // Điều hướng đến trang trước đó hoặc trang chủ
      router.push(returnUrl.value || '/');
      returnUrl.value = null; // Reset returnUrl
    } catch (error) {
      clearAuthData(); // Xóa thông tin nếu đăng nhập thất bại
      console.error('Login action failed:', error);
      throw error; // Ném lỗi để component xử lý (hiển thị thông báo)
    }
  }

   /**
   * Xử lý đăng ký.
   * @param {object} userData
   */
  async function register(userData) {
    try {
      await authService.register(userData);
      // Có thể tự động đăng nhập sau khi đăng ký thành công hoặc yêu cầu kích hoạt email
      // Hiện tại chỉ điều hướng về trang đăng nhập và báo thành công
    } catch (error) {
      console.error('Register action failed:', error);
      throw error; // Ném lỗi để component xử lý
    }
  }

  /**
   * Lấy thông tin người dùng từ API /auth/me.
   */
  async function fetchUser() {
    if (!accessToken.value) return; // Không fetch nếu không có token

    try {
      // Đảm bảo header được set đúng trước khi gọi
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`;
      const userData = await authService.getCurrentUser();
      user.value = userData;
    } catch (error) {
       console.error('Fetch user failed:', error);
       // Nếu lỗi (ví dụ: token hết hạn), thử refresh token
       await attemptRefreshToken();
       // Nếu refresh thành công, fetchUser sẽ được gọi lại trong attemptRefreshToken
       // Nếu refresh thất bại, user sẽ bị logout
    }
  }

  /**
   * Xử lý đăng xuất.
   */
  async function logout() {
    const currentRefreshToken = refreshToken.value; // Lưu lại refresh token trước khi xóa
    clearAuthData(); // Xóa thông tin ở client ngay lập tức
    router.push('/login'); // Điều hướng về trang đăng nhập
    try {
      if(currentRefreshToken) {
        await authService.logout(currentRefreshToken); // Gọi API để backend xử lý (nếu cần)
      }
    } catch (error) {
        // Lỗi từ API logout không quá nghiêm trọng vì client đã logout
      console.error('Logout API call failed, but client data cleared:', error);
    }
  }

   /**
    * Cố gắng làm mới access token bằng refresh token.
    */
   async function attemptRefreshToken() {
        if (!refreshToken.value) {
            console.log("No refresh token available, clearing auth data.");
            clearAuthData(); // Không có refresh token, logout hẳn
            return false; // Refresh thất bại
        }

        try {
            console.log("Attempting to refresh token...");
            const data = await authService.refreshToken(refreshToken.value);
            setTokens(data.accessToken, data.refreshToken); // Lưu token mới
            console.log("Token refreshed successfully.");
            await fetchUser(); // Lấy lại thông tin user với token mới
            return true; // Refresh thành công
        } catch (error) {
            console.error("Failed to refresh token, logging out:", error);
            clearAuthData(); // Refresh thất bại (có thể do refresh token hết hạn), logout
            router.push('/login'); // Chuyển về trang đăng nhập
            return false; // Refresh thất bại
        }
    }


  /**
   * Kiểm tra trạng thái đăng nhập khi ứng dụng khởi chạy.
   */
  async function checkAuthStatus() {
     console.log("Checking auth status...");
    if (accessToken.value) {
        console.log("Access token found, fetching user...");
      await fetchUser(); // Nếu có access token, thử lấy thông tin user
      // fetchUser sẽ tự xử lý refresh token nếu access token hết hạn
    } else {
        console.log("No access token found.");
        // Có thể thử refresh token nếu không có access token nhưng có refresh token
        // await attemptRefreshToken();
        clearAuthData(); // Đảm bảo trạng thái sạch nếu không có token nào
    }
  }

  /**
   * Xử lý đăng nhập bằng Google.
   * @param {string} idToken - ID Token từ Google
   */
  async function loginWithGoogle(idToken) {
    try {
      const data = await authService.loginWithGoogle(idToken);
      setTokens(data.accessToken, data.refreshToken);
      await fetchUser(); // Lấy thông tin user sau khi có token
      router.push(returnUrl.value || '/'); // Điều hướng
      returnUrl.value = null;
    } catch (error) {
      clearAuthData();
      console.error('Google login action failed:', error);
      throw error; // Ném lỗi để component xử lý
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    userRoles,
    userPermissions,
    returnUrl,
    login,
    register,
    fetchUser,
    logout,
    checkAuthStatus,
    attemptRefreshToken, // Expose hàm này để interceptor có thể gọi
    setTokens, // Expose để interceptor cập nhật token sau khi refresh
    clearAuthData // Expose để interceptor logout nếu refresh thất bại
  };
});