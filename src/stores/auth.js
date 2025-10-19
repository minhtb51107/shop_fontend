// src/stores/auth.js
import { defineStore } from 'pinia';
import authService from '@/services/authService';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  // State: Dữ liệu của store, lấy từ localStorage để giữ trạng thái sau khi tải lại trang
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    returnUrl: null
  }),

  // Getters: Các hàm tính toán dựa trên state
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user,
    isAdmin: (state) => {
      if (!state.user) return false;
      
      // Check roles array
      const roles = state.user.roles;
      if (Array.isArray(roles)) {
        return roles.includes('ADMIN') || roles.some(role => role.name === 'ADMIN');
      }
      
      // Check roleNames (Set format from backend)
      const roleNames = state.user.roleNames;
      if (roleNames && typeof roleNames === 'object') {
        if (roleNames.has && typeof roleNames.has === 'function') {
          return roleNames.has('ADMIN');
        }
        if (Array.isArray(roleNames)) {
          return roleNames.includes('ADMIN');
        }
      }
      
      return false;
    },
    userRoles: (state) => {
      if (!state.user?.roles) return [];
      const roles = state.user.roles;
      if (Array.isArray(roles)) {
        return roles.map(role => typeof role === 'string' ? role : role.name);
      }
      return [];
    },
    hasRole: (state) => (roleName) => {
      if (!state.user) return false;
      const roles = state.user?.roles;
      if (Array.isArray(roles)) {
        const roleNames = roles.map(role => typeof role === 'string' ? role : role.name);
        return roleNames.includes(roleName);
      }
      return false;
    },
    hasPermission: (state) => (permission) => {
      if (!state.user) return false;
      
      // Get user roles directly from state
      const roles = state.user?.roles;
      if (!Array.isArray(roles)) return false;
      
      const userRoles = roles.map(role => typeof role === 'string' ? role : role.name);
      
      // Admin has all permissions
      if (userRoles.includes('ADMIN')) return true;
      
      // Role-based permission mapping
      const rolePermissions = {
        'MANAGER': ['EMPLOYEE_READ', 'EMPLOYEE_WRITE', 'CUSTOMER_READ', 'CUSTOMER_WRITE', 'PRODUCT_READ', 'PRODUCT_WRITE', 'ORDER_READ', 'ORDER_WRITE'],
        'EMPLOYEE': ['CUSTOMER_READ', 'PRODUCT_READ', 'ORDER_READ', 'ORDER_WRITE'],
        'CUSTOMER': ['CUSTOMER_READ']
      };
      
      return userRoles.some(role => 
        rolePermissions[role]?.includes(permission)
      );
    }
  },

  // Actions: Các hàm để thay đổi state (tương tác với API)
  actions: {
    async login(credentials) {
      try {
        console.log('🔄 Starting login process...');
        const response = await authService.login(credentials);
        
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);
        
        console.log('✅ Login successful, fetching user data...');
        await this.fetchCurrentUser();
        
        // Handle redirect for login
        const currentRoute = router.currentRoute.value;
        const redirectPath = currentRoute.query.redirect || this.returnUrl || '/';
        
        console.log('🔄 Redirecting to:', redirectPath);
        this.returnUrl = null; // Clear returnUrl after using it
        router.push(redirectPath);
      } catch (error) {
        console.error("❌ Login failed:", error);
        // Clear tokens on login failure
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw error;
      }
    },

    async fetchCurrentUser() {
      if (!this.accessToken) {
        console.log('❌ No access token for fetching user');
        return;
      }
      
      try {
        console.log('🔄 Fetching current user...');
        const response = await authService.getCurrentUser();
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        console.log('✅ User data fetched successfully:', this.user);
      } catch (error) {
        console.error("❌ Failed to fetch user:", error);
        
        // Only logout if it's an authentication error (401/403)
        // Don't logout on network errors or other issues
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('❌ Authentication error when fetching user, logging out');
          this.logout();
        } else {
          console.log('⚠️ Non-auth error when fetching user, keeping token');
          throw error; // Let the caller handle it
        }
      }
    },

    async register(userInfo) {
      return authService.register(userInfo);
    },

    async activateAccount(token) {
      return authService.activate(token);
    },

    async handleForgotPassword(email) {
      return authService.forgotPassword(email);
    },

    async handleResetPassword(data) {
      return authService.resetPassword(data);
    },

    async handleChangePassword(passwords) {
      return authService.changePassword(passwords);
    },

    async handleGoogleLogin(googleToken) {
      try {
        console.log('Processing Google login...');
        
        if (!googleToken) {
          throw new Error('No Google token provided');
        }

        const response = await authService.loginWithGoogle(googleToken);
        
        if (response.data?.accessToken) {
          // Store tokens
          this.accessToken = response.data.accessToken;
          this.refreshToken = response.data.refreshToken;
          localStorage.setItem('accessToken', this.accessToken);
          localStorage.setItem('refreshToken', this.refreshToken);

          // Fetch user info and redirect
          await this.fetchCurrentUser();
          router.push(this.returnUrl || '/');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Google Login failed:', error);
        
        // Log detailed error information for debugging backend issues
        if (error.response?.status === 500) {
          console.error('Backend 500 error details:', {
            status: error.response.status,
            data: error.response.data,
            message: error.response.data?.message
          });
        }
        
        throw error;
      }
    },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      router.push('/auth/login');
    },


    // HÀM LÀM MỚI TOKEN
    async refreshAccessToken() {
      try {
        if (!this.refreshToken) {
          console.log('❌ No refresh token available');
          throw new Error('No refresh token available');
        }
        
        console.log('🔄 Attempting to refresh access token...');
        const response = await authService.refreshToken(this.refreshToken);
        
        if (response.data && response.data.accessToken) {
          // Store old token for comparison
          const oldToken = this.accessToken;
          
          // Cập nhật cả access token và refresh token mới
          this.accessToken = response.data.accessToken;
          localStorage.setItem('accessToken', this.accessToken);
          
          if (response.data.refreshToken) {
            this.refreshToken = response.data.refreshToken;
            localStorage.setItem('refreshToken', this.refreshToken);
          }
          
          console.log('✅ Token refreshed successfully, old token different:', oldToken !== this.accessToken);
          return this.accessToken;
        } else {
          console.log('❌ Invalid refresh response:', response.data);
          throw new Error('Invalid refresh token response');
        }
      } catch (error) {
        console.error('❌ Refresh token failed:', error);
        
        // Don't logout here - let the API interceptor handle it
        // This prevents double logout calls
        console.log('❌ Refresh token failed with status:', error.response?.status);
        
        return Promise.reject(error);
      }
    },
  }
});