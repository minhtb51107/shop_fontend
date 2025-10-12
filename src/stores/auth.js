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
        const response = await api.post('/auth/login', credentials);
        const { accessToken, refreshToken } = response.data;

        // Lưu token
        this.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
        // Bạn cũng nên lưu refreshToken vào localStorage hoặc httpOnly cookie

        // Lấy thông tin người dùng
        await this.fetchUser();

        // Chuyển hướng đến dashboard
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
        // Hiện thông báo lỗi cho người dùng
        throw error;
      }
    },
    async fetchUser() {
        if (this.accessToken) {
            try {
                const response = await api.get('/auth/me');
                this.user = response.data;
                localStorage.setItem('user', JSON.stringify(this.user));
            } catch (error) {
                this.logout(); // Nếu token không hợp lệ, đăng xuất
            }
        }
    },
    logout() {
      // Xóa tất cả thông tin
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      // Chuyển hướng về trang đăng nhập
      router.push('/login');
    },
  },
});