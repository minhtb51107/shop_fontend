// src/services/api.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; // Import auth store

const api = axios.create({
  baseURL: '/api/v1', // Sử dụng proxy đã cấu hình trong vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    if (token && !config.headers.Authorization) { // Chỉ thêm nếu chưa có header Authorization (tránh ghi đè khi gọi refreshToken)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- Response Interceptor ---
// Xử lý lỗi, đặc biệt là lỗi 401 Unauthorized (Token hết hạn)
let isRefreshing = false; // Cờ để tránh refresh token nhiều lần cùng lúc
let failedQueue = []; // Hàng đợi chứa các request bị lỗi 401

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Request thành công, không cần làm gì
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Chỉ xử lý lỗi 401 và request không phải là retry, không phải là request refresh token
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {

      if (isRefreshing) {
        // Nếu đang refresh token, đẩy request vào hàng đợi
         console.log("Token is refreshing, queuing request:", originalRequest.url);
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest); // Thực hiện lại request với token mới
        }).catch(err => {
            return Promise.reject(err); // Nếu refresh thất bại, reject request này
        });
      }

      // Đánh dấu là đang refresh và request này là retry
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshSuccess = await authStore.attemptRefreshToken(); // Gọi action refresh token
        if (refreshSuccess) {
            console.log("Token refreshed, processing queue and retrying original request:", originalRequest.url);
          // Gán token mới vào header của request gốc
          originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
          // Thực thi lại các request trong hàng đợi với token mới
          processQueue(null, authStore.accessToken);
          // Thực thi lại request gốc
          return axios(originalRequest);
        } else {
             // Refresh thất bại, các request trong hàng đợi sẽ bị reject
             console.log("Refresh token failed, rejecting queue.");
             processQueue(new Error('Token refresh failed'), null);
             return Promise.reject(error); // Ném lỗi gốc ra ngoài
        }
      } catch (refreshError) {
         console.error("Caught error during refresh token attempt:", refreshError);
         processQueue(refreshError, null); // Reject hàng đợi nếu có lỗi xảy ra khi refresh
         authStore.clearAuthData(); // Đảm bảo logout nếu refresh lỗi
         router.push('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Reset cờ
      }
    }

    // Nếu không phải lỗi 401 hoặc là request retry/refresh token, ném lỗi ra bình thường
    return Promise.reject(error);
  }
);


export default api;