// src/services/authService.js
import api from './api';

// Các hàm này tương ứng với các endpoint trong AuthController.java
export default {
  register(data) {
    return api.post('/api/v1/auth/register', data);
  },

  activate(token) {
    return api.get(`/api/v1/auth/activate?token=${token}`);
  },

  login(credentials) {
    return api.post('/api/v1/auth/login', credentials);
  },

  getCurrentUser() {
    return api.get('/api/v1/auth/me');
  },

  logout(refreshToken) {
    return api.post('/api/v1/auth/logout', { refreshToken });
  },

  forgotPassword(email) {
    return api.post('/api/v1/auth/forgot-password', { email });
  },

  resetPassword(data) {
    return api.post('/api/v1/auth/reset-password', data);
  },

  changePassword(passwords) {
    return api.post('/api/v1/auth/change-password', passwords);
  },

  loginWithGoogle(idToken) {
    return api.post('/api/v1/auth/google', { idToken });
  },

  refreshToken(refreshToken) {
    return api.post('/api/v1/auth/refresh-token', { refreshToken });
  },

  // 2FA and email verification
  sendVerificationCode(email) {
    return api.post('/api/v1/auth/send-verification-code', { email });
  },

  verifyCode(email, code) {
    return api.post('/api/v1/auth/verify-code', { email, code });
  },

  // Admin 2FA
  sendAdminVerificationCode() {
    return api.post('/api/v1/auth/admin/send-verification-code');
  },

  verifyAdminCode(code) {
    return api.post('/api/v1/auth/admin/verify-code', { code });
  },
};

