// src/modules/user/services/userService.js
import api from '@/services/api';

export const permissionService = {
  getAll: () => api.get('/api/v1/permissions'),
  create: (data) => api.post('/api/v1/permissions', data),
  update: (id, data) => api.put(`/api/v1/permissions/${id}`, data),
  delete: (id) => api.delete(`/api/v1/permissions/${id}`),
};

export const roleService = {
  getAll: () => api.get('/api/v1/roles'),
  create: (data) => api.post('/api/v1/roles', data),
  delete: (id) => api.delete(`/api/v1/roles/${id}`),
  assignPermissions: (roleId, data) => api.post(`/api/v1/roles/${roleId}/permissions`, data),
};

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
};

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
    updateStatus: (id, isActive) => api.patch(`/api/v1/employees/${id}/status?isActive=${isActive}`),
    assignRoles: (id, data) => api.post(`/api/v1/employees/${id}/roles`, data),
};

export const activityLogService = {
    search: (params) => api.get('/activity-logs', { params }),
};