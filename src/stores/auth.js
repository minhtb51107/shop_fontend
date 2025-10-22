// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '@/services/authService';
import api from '@/services/api'; // Import api instance để cập nhật header
import router from '@/router'; // Import router để điều hướng
import { useWishlistStore } from './wishlistStore'; // <-- THÊM IMPORT

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null); // Thông tin người dùng { id, email, fullname, userType, roles, permissions }
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const refreshToken = ref(localStorage.getItem('refreshToken') || null);
  const returnUrl = ref(null); // Lưu lại URL người dùng muốn truy cập trước khi bị chuyển đến login
  // Khởi tạo wishlist store sau khi authStore được định nghĩa hoàn toàn
  // Lưu ý: Không thể dùng wishlistStore trực tiếp ở top level vì nó cần authStore
  // Cách giải quyết là inject wishlistStore bên trong các action khi cần,
  // Hoặc dùng một plugin Pinia (phức tạp hơn),
  // Hoặc khởi tạo nó bên trong nhưng đảm bảo không tạo dependency cycle.
  // Cách đơn giản nhất là gọi useWishlistStore() bên trong action khi cần.

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
    delete api.defaults.headers.common['Authorization'];
    // Gọi clearWishlist ở đây để đảm bảo wishlist cũng bị xóa khi auth data bị xóa
    const wishlistStore = useWishlistStore();
    wishlistStore.clearWishlist();
  }

  /**
   * Xử lý đăng nhập.
   * @param {object} credentials - { email, password }
   */
  async function login(credentials) {
    const wishlistStore = useWishlistStore(); // <-- Lấy wishlist store ở đây
    try {
      const data = await authService.login(credentials);
      setTokens(data.accessToken, data.refreshToken);
      await fetchUser(); // Lấy thông tin user
      // Chỉ fetch wishlist nếu fetchUser thành công (có user.value)
      if(user.value) {
        await wishlistStore.fetchWishlistIds(); // <-- GỌI FETCH WISHLIST
      }
      router.push(returnUrl.value || '/');
      returnUrl.value = null;
    } catch (error) {
      clearAuthData(); // Đã bao gồm clearWishlist()
      console.error('Login action failed:', error);
      throw error;
    }
  }

   /**
   * Xử lý đăng ký.
   * @param {object} userData
   */
  async function register(userData) {
    try {
      await authService.register(userData);
    } catch (error) {
      console.error('Register action failed:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin người dùng từ API /auth/me.
   */
  async function fetchUser() {
    if (!accessToken.value) return;
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`;
      const userData = await authService.getCurrentUser();
      user.value = userData;
    } catch (error) {
       console.error('Fetch user failed:', error);
       // Thử refresh token, nếu thất bại attemptRefreshToken sẽ tự clearAuthData
       const refreshed = await attemptRefreshToken();
       // Nếu refresh thành công, fetchUser đã được gọi lại bên trong attemptRefreshToken
       if (!refreshed) {
           throw error; // Ném lỗi gốc ra nếu refresh thất bại
       }
    }
  }

  /**
   * Xử lý đăng xuất.
   */
  async function logout() {
    const currentRefreshToken = refreshToken.value;
    const wishlistStore = useWishlistStore(); // <-- Lấy wishlist store
    clearAuthData(); // Đã bao gồm clearWishlist()
    router.push('/login');
    try {
      if(currentRefreshToken) {
        await authService.logout(currentRefreshToken);
      }
    } catch (error) {
      console.error('Logout API call failed, but client data cleared:', error);
    }
  }

   /**
    * Cố gắng làm mới access token bằng refresh token.
    */
   async function attemptRefreshToken() {
        const wishlistStore = useWishlistStore(); // <-- Lấy wishlist store
        if (!refreshToken.value) {
            console.log("No refresh token available, clearing auth data.");
            clearAuthData(); // Đã bao gồm clearWishlist()
            return false;
        }
        try {
            console.log("Attempting to refresh token...");
            const data = await authService.refreshToken(refreshToken.value);
            setTokens(data.accessToken, data.refreshToken);
            console.log("Token refreshed successfully.");
            // Fetch lại user SAU KHI refresh thành công
            await fetchUser();
            // Fetch lại wishlist SAU KHI fetchUser thành công (đảm bảo user.value có)
             if (user.value) {
                await wishlistStore.fetchWishlistIds(); // <-- GỌI FETCH WISHLIST
            }
            return true;
        } catch (error) {
            console.error("Failed to refresh token, logging out:", error);
            clearAuthData(); // Đã bao gồm clearWishlist()
            // Không nên tự động push('/login') ở đây vì có thể gây vòng lặp vô hạn nếu API lỗi liên tục
            // Interceptor hoặc nơi gọi attemptRefreshToken sẽ xử lý việc điều hướng
            return false;
        }
    }


  /**
   * Kiểm tra trạng thái đăng nhập khi ứng dụng khởi chạy.
   */
  async function checkAuthStatus() {
     console.log("Checking auth status...");
     const wishlistStore = useWishlistStore(); // <-- Lấy wishlist store
    if (accessToken.value) {
        console.log("Access token found, attempting to fetch user...");
        try {
            await fetchUser(); // fetchUser sẽ tự xử lý refresh nếu cần
            // Fetch wishlist chỉ khi fetchUser thành công VÀ user có giá trị
            if (user.value) {
                 console.log("User fetched successfully, fetching wishlist IDs...");
                 await wishlistStore.fetchWishlistIds(); // <-- GỌI FETCH WISHLIST
            } else {
                 // Nếu fetchUser chạy xong nhưng user vẫn null (có thể do lỗi lạ), vẫn clear
                 console.warn("fetchUser completed but user is still null. Clearing auth data.");
                 clearAuthData(); // Đã bao gồm clearWishlist()
            }
        } catch (error) {
             console.error("Failed initial auth check (fetchUser or refreshToken failed):", error);
             // clearAuthData() đã được gọi bên trong attemptRefreshToken nếu lỗi refresh
             // Hoặc nếu fetchUser lỗi mà không phải do token hết hạn (ví dụ lỗi mạng), cần clear ở đây
             if (!accessToken.value) { // Kiểm tra lại nếu attemptRefreshToken đã clear token
                 clearAuthData(); // Đảm bảo clear nếu có lỗi khác
             }
        }
    } else {
        console.log("No access token found.");
        clearAuthData(); // Đã bao gồm clearWishlist()
    }
  }

  /**
   * Xử lý đăng nhập bằng Google.
   */
  async function loginWithGoogle(idToken) {
    const wishlistStore = useWishlistStore(); // <-- Lấy wishlist store
    try {
      const data = await authService.loginWithGoogle(idToken);
      setTokens(data.accessToken, data.refreshToken);
      await fetchUser();
       // Chỉ fetch wishlist nếu fetchUser thành công
       if(user.value) {
           await wishlistStore.fetchWishlistIds(); // <-- GỌI FETCH WISHLIST
       }
      router.push(returnUrl.value || '/');
      returnUrl.value = null;
    } catch (error) {
      clearAuthData(); // Đã bao gồm clearWishlist()
      console.error('Google login action failed:', error);
      throw error;
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
    attemptRefreshToken,
    setTokens,
    clearAuthData,
    loginWithGoogle // Thêm hàm này vào return
  };
});