// src/modules/user/services/employeeService.js
import api from '@/services/api';

export const employeeService = {
  getAll(params) {
    return api.get('/api/v1/employees', { params });
  },
  create(data) {
    return api.post('/api/v1/employees', data);
  },
  update(id, data) {
    return api.put(`/api/v1/employees/${id}`, data);
  },
  // Dùng để khóa/mở khóa tài khoản
  updateStatus(id, isActive) {
    return api.patch(`/api/v1/employees/${id}/status?isActive=${isActive}`);
  }
};