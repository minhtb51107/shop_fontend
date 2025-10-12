// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    accessToken: localStorage.getItem('accessToken'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.roles?.includes('ADMIN'),
  },
  actions: {
    async login(credentials) {
      try {
        // API path giờ là tương đối
        const response = await api.post('/api/v1/auth/login', credentials);
        const { accessToken } = response.data;
        this.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
        await this.fetchUser();
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    async fetchUser() {
      if (this.accessToken) {
        try {
          const response = await api.get('/api/v1/auth/me');
          this.user = response.data;
          localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error) { this.logout(); }
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