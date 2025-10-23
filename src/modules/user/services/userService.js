// src/modules/user/services/userService.js
import api from '@/services/api';

// ===================================================================
// PERMISSION SERVICES - Quản lý quyền
// Backend: PermissionController.java
// ===================================================================
export const permissionService = {
  getAll: () => api.get('/api/v1/permissions'),
  
  create: (data) => api.post('/api/v1/permissions', data),
  
  update: (id, data) => api.put(`/api/v1/permissions/${id}`, data),
  
  delete: (id) => api.delete(`/api/v1/permissions/${id}`),
  
  // Note: Backend chưa có endpoint getById
  // getById: (id) => api.get(`/api/v1/permissions/${id}`),
};

// ===================================================================
// ROLE SERVICES - Quản lý vai trò
// Backend: RoleController.java
// ===================================================================
export const roleService = {
  getAll: () => api.get('/api/v1/roles'),
  
  create: (data) => api.post('/api/v1/roles', data),
  
  delete: (id) => api.delete(`/api/v1/roles/${id}`),
  
  // Gán permissions cho role
  assignPermissions: (roleId, data) => api.post(`/api/v1/roles/${roleId}/permissions`, data),
  
  // Note: Backend chưa có các endpoint sau:
  // getById: (id) => api.get(`/api/v1/roles/${id}`),
  // update: (id, data) => api.put(`/api/v1/roles/${id}`, data),
  // removePermission: (roleId, permissionId) => api.delete(`/api/v1/roles/${roleId}/permissions/${permissionId}`),
};

// ===================================================================
// CUSTOMER SERVICES - Quản lý khách hàng
// Backend: CustomerController.java
// ===================================================================
export const customerService = {
  getAll: (params = {}) => {
    // Backend expects Pageable parameters: page, size, sort
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.search) queryParams.append('search', params.search);
    
    const url = `/api/v1/customers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById: (id) => api.get(`/api/v1/customers/${id}`),
  
  update: (id, data) => api.put(`/api/v1/customers/${id}`, data),
  
  delete: (id) => api.delete(`/api/v1/customers/${id}`),
  
  // Note: Backend chưa có endpoint create customer (đăng ký qua auth)
  // create: (data) => api.post('/api/v1/customers', data),
};

// ===================================================================
// EMPLOYEE SERVICES - Quản lý nhân viên
// Backend: EmployeeController.java
// ===================================================================
export const employeeService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const url = `/api/v1/employees${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  getById: (id) => api.get(`/api/v1/employees/${id}`),
  
  create: (data) => api.post('/api/v1/employees', data),
  
  update: (id, data) => api.put(`/api/v1/employees/${id}`, data),
  
  // Gán roles cho nhân viên
  assignRoles: (id, data) => api.post(`/api/v1/employees/${id}/roles`, data),
  
  // Note: Backend chưa có các endpoint sau:
  // updateStatus: (id, isActive) => api.patch(`/api/v1/employees/${id}/status?isActive=${isActive}`),
  // delete: (id) => api.delete(`/api/v1/employees/${id}`),
};

// ===================================================================
// ACTIVITY LOG SERVICES - Quản lý nhật ký hoạt động
// Backend: UserActivityLogController.java
// ===================================================================
export const activityLogService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.action) queryParams.append('action', params.action);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    const url = `/api/v1/activity-logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get(url);
  },
  
  // Note: Backend chưa có các endpoint sau:
  // getById: (id) => api.get(`/api/v1/activity-logs/${id}`),
};