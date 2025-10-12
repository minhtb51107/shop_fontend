// src/modules/user/services/userService.js
import api from '@/services/api';

export const permissionService = {
  getAll: () => api.get('/permissions'),
  create: (data) => api.post('/permissions', data),
  update: (id, data) => api.put(`/permissions/${id}`, data),
  delete: (id) => api.delete(`/permissions/${id}`),
};

export const roleService = {
  getAll: () => api.get('/roles'),
  create: (data) => api.post('/roles', data),
  delete: (id) => api.delete(`/roles/${id}`),
  assignPermissions: (roleId, permissionNames) => api.post(`/roles/${roleId}/permissions`, { permissionNames }),
};

export const customerService = {
    getAll: (params) => api.get('/customers', { params }),
    getById: (id) => api.get(`/customers/${id}`),
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`), // Soft delete
};

export const activityLogService = {
    search: (params) => api.get('/activity-logs', { params }),
};