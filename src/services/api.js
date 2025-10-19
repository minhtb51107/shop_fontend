// src/services/api.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  // Bỏ baseURL đi, chúng ta sẽ dùng đường dẫn tương đối để proxy xử lý
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Thêm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug logging (only for non-auth requests to reduce noise)
    if (!config.url.includes('/auth/')) {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Xử lý refresh token khi 401 hoặc 403
api.interceptors.response.use(
  (response) => {
    // Only log successful auth responses to reduce noise
    if (response.config?.url?.includes('/auth/')) {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    
    // Không xử lý refresh token cho chính endpoint refresh-token (tránh vòng lặp vô tận)
    const isRefreshTokenRequest = originalRequest.url?.includes('/auth/refresh-token');
    const isLoginRequest = originalRequest.url?.includes('/auth/login');
    
    // Handle 401 (unauthenticated) vs 403 (forbidden/insufficient permissions) differently
    if (error.response && !originalRequest._retry) {
      if (error.response.status === 401 && !isRefreshTokenRequest && !isLoginRequest) {
        // 401: Try to refresh token first
        originalRequest._retry = true;
        console.log('🔄 Attempting to refresh token due to 401 Unauthorized');
        
        try {
          if (!authStore.refreshToken) {
            console.log('❌ No refresh token available, logging out');
            authStore.logout();
            return Promise.reject(error);
          }
          
          const newAccessToken = await authStore.refreshAccessToken();
          if (newAccessToken && newAccessToken !== authStore.accessToken) {
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            console.log('✅ Token refreshed successfully, retrying request');
            return api(originalRequest);
          } else {
            console.log('❌ Token refresh failed');
            authStore.logout();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error('❌ Refresh token failed:', refreshError);
          authStore.logout();
          return Promise.reject(refreshError);
        }
      } else if (error.response.status === 403) {
        // 403: User is authenticated but lacks permissions - don't logout, just show error
        console.log('🚫 Access denied (403) - user lacks permissions for this resource');
        
        // Check if it's an API endpoint that might need token refresh first
        if (!isRefreshTokenRequest && !isLoginRequest) {
          // Try token refresh once for 403, in case token is valid but expired
          if (!originalRequest._retry && authStore.refreshToken) {
            originalRequest._retry = true;
            try {
              const newAccessToken = await authStore.refreshAccessToken();
              if (newAccessToken) {
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                return api(originalRequest);
              }
            } catch (refreshError) {
              console.log('🔄 Token refresh failed for 403, treating as permission error');
              // Fall through to return the original 403 error
            }
          }
        }
        
        // Return the 403 error without logging out - let the component handle it
        return Promise.reject(error);
      }
    }
    
    // Handle specific error cases
    if (error.response?.status === 401 || error.response?.status === 403) {
      // If we've already retried and still getting auth errors, logout
      if (originalRequest._retry) {
        console.log('❌ Still getting auth error after retry, logging out');
        authStore.logout();
      }
    }
    
    // Log error details
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

export default api;