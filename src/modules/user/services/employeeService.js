// src/modules/user/services/employeeService.js
import api from '@/services/api';

// ===================================================================
// EMPLOYEE SERVICES - Quản lý nhân viên (MERGED VERSION)
// Backend: EmployeeController.java
// ===================================================================
export const employeeService = {
  // Lấy danh sách nhân viên
  getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.search) queryParams.append('search', params.search);
    
    const url = `/api/v1/employees${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  // Lấy thông tin nhân viên theo ID
  getById(id) {
    return api.get(`/api/v1/employees/${id}`);
  },
  
  // Tạo nhân viên mới
  create(data) {
    return api.post('/api/v1/employees', data);
  },
  
  // Cập nhật thông tin nhân viên
  update(id, data) {
    return api.put(`/api/v1/employees/${id}`, data);
  },
  
  // Khóa/mở khóa tài khoản nhân viên
  updateStatus(id, isActive) {
    return api.patch(`/api/v1/employees/${id}/status?isActive=${isActive}`);
  },
  
  // Gán roles cho nhân viên
  assignRoles(id, data) {
    return api.post(`/api/v1/employees/${id}/roles`, data);
  },
  
  // Note: Backend chưa có endpoint delete employee
  // delete: (id) => api.delete(`/api/v1/employees/${id}`),
};