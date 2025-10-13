// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.roles?.includes('ADMIN'),
  },
  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials);
        const { accessToken, refreshToken } = response.data;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken); // Lưu refreshToken
        await this.fetchUser();
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    async fetchUser() {
        if (this.accessToken) {
            const response = await api.get('/auth/me');
            this.user = response.data;
            localStorage.setItem('user', JSON.stringify(this.user));
        }
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      router.push('/auth/login');
    },
    async register(userInfo) {
      try {
        await api.post('/api/v1/auth/register', userInfo);
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    // ... forgotPassword và resetPassword giữ nguyên ...
    async forgotPassword(email) {
      try {
        await api.post('/auth/forgot-password', { email });
      } catch (error) {
        console.error('Forgot password request failed:', error);
        throw error;
      }
    },
    async resetPassword(data) {
        try {
            await api.post('/auth/reset-password', data);
        } catch (error) {
            console.error('Password reset failed:', error);
            throw error;
        }
    },
        async logout() {
      try {
        // Gọi API backend để vô hiệu hóa token
        await api.post('/auth/logout', { refreshToken: this.refreshToken });
      } catch (error) {
        console.error("Logout API call failed, proceeding with client-side logout.", error);
      } finally {
        // Dù API có lỗi hay không, vẫn xóa thông tin ở client
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/auth/login');
      }
    },
    // *** HÀM MỚI CHO GOOGLE LOGIN ***
    async loginWithGoogle(idToken) {
      try {
        const response = await api.post('/api/v1/auth/google', { idToken });
        const { accessToken } = response.data;
        this.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
        await this.fetchUser();
        router.push('/');
      } catch (error) {
        console.error('Google login failed:', error);
        throw error;
      }
    }
  },
});