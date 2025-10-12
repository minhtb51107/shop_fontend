// src/modules/user/services/employeeService.js
import api from '@/services/api';

export const employeeService = {
  getAll(params) {
    return api.get('/employees', { params });
  },
  create(data) {
    return api.post('/employees', data);
  },
  update(id, data) {
    return api.put(`/employees/${id}`, data);
  },
  // Dùng để khóa/mở khóa tài khoản
  updateStatus(id, isActive) {
    return api.patch(`/employees/${id}/status?isActive=${isActive}`);
  }
};