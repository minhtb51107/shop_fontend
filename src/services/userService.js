// src/services/userService.js
// NOTE: File này có thể bị trùng lặp với src/modules/user/services/userService.js
// Nên cân nhắc sử dụng một trong hai file để tránh nhầm lẫn

import api from './api'

// ===================================================================
// USER MANAGEMENT SERVICES
// Tập hợp các services quản lý users, customers, employees, roles, permissions
// ===================================================================

export const userService = {
  // ===================================================================
  // CUSTOMER MANAGEMENT - Quản lý khách hàng
  // Backend: CustomerController.java
  // ===================================================================
  async getCustomers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.search) queryParams.append('search', params.search);
      
      const url = `/api/v1/customers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getCustomerById(id) {
    try {
      const response = await api.get(`/api/v1/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Note: Backend không có endpoint tạo customer trực tiếp
  // Customer được tạo qua endpoint register trong auth
  async createCustomer(customerData) {
    try {
      const response = await api.post('/api/v1/auth/register', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  async updateCustomer(id, customerData) {
    try {
      const response = await api.put(`/api/v1/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  async deleteCustomer(id) {
    try {
      const response = await api.delete(`/api/v1/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Note: Backend chưa có endpoint lấy orders của customer
  async getCustomerOrders(customerId) {
    try {
      // Có thể sử dụng order service với filter customerId
      const response = await api.get(`/api/v1/orders?customerId=${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  // ===================================================================
  // EMPLOYEE MANAGEMENT - Quản lý nhân viên
  // Backend: EmployeeController.java
  // ===================================================================
  async getEmployees(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sort) queryParams.append('sort', params.sort);
      
      const url = `/api/v1/employees${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async getEmployeeById(id) {
    try {
      const response = await api.get(`/api/v1/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  async createEmployee(employeeData) {
    try {
      const response = await api.post('/api/v1/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(`/api/v1/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Note: Backend chưa có endpoint delete employee
  async deleteEmployee(id) {
    console.warn('Backend does not have delete employee endpoint');
    throw new Error('Delete employee endpoint not available in backend');
  },

  // Note: Backend chưa có endpoint lấy roles của employee riêng
  async getEmployeeRoles(employeeId) {
    try {
      const response = await api.get(`/api/v1/employees/${employeeId}`);
      // Roles được trả về trong employee object
      return response.data.roles || [];
    } catch (error) {
      console.error('Error fetching employee roles:', error);
      throw error;
    }
  },

  async assignRoleToEmployee(employeeId, roleData) {
    try {
      const response = await api.post(`/api/v1/employees/${employeeId}/roles`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error assigning role to employee:', error);
      throw error;
    }
  },

  // Note: Backend chưa có endpoint remove role từ employee
  async removeRoleFromEmployee(employeeId, roleId) {
    console.warn('Backend does not have remove role from employee endpoint');
    throw new Error('Remove role endpoint not available in backend');
  },

  // ===================================================================
  // ROLE MANAGEMENT - Quản lý vai trò
  // Backend: RoleController.java
  // ===================================================================
  async getRoles() {
    try {
      const response = await api.get('/api/v1/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Note: Backend chưa có endpoint getById cho role
  async getRoleById(id) {
    console.warn('Backend does not have get role by id endpoint');
    throw new Error('Get role by id endpoint not available in backend');
  },

  async createRole(roleData) {
    try {
      const response = await api.post('/api/v1/roles', roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Note: Backend chưa có endpoint update role
  async updateRole(id, roleData) {
    console.warn('Backend does not have update role endpoint');
    throw new Error('Update role endpoint not available in backend');
  },

  async deleteRole(id) {
    try {
      const response = await api.delete(`/api/v1/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },

  // ===================================================================
  // PERMISSION MANAGEMENT - Quản lý quyền
  // Backend: PermissionController.java
  // ===================================================================
  async getPermissions() {
    try {
      const response = await api.get('/api/v1/permissions');
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },

  // Note: Backend chưa có endpoint getById cho permission
  async getPermissionById(id) {
    console.warn('Backend does not have get permission by id endpoint');
    throw new Error('Get permission by id endpoint not available in backend');
  },

  async createPermission(permissionData) {
    try {
      const response = await api.post('/api/v1/permissions', permissionData);
      return response.data;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  },

  async updatePermission(id, permissionData) {
    try {
      const response = await api.put(`/api/v1/permissions/${id}`, permissionData);
      return response.data;
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  },

  async deletePermission(id) {
    try {
      const response = await api.delete(`/api/v1/permissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting permission:', error);
      throw error;
    }
  },

  // ===================================================================
  // ROLE-PERMISSION MANAGEMENT
  // ===================================================================
  
  // Note: Backend chưa có endpoint lấy permissions của role riêng
  async getRolePermissions(roleId) {
    console.warn('Backend does not have get role permissions endpoint');
    throw new Error('Get role permissions endpoint not available in backend');
  },

  async assignPermissionToRole(roleId, permissionData) {
    try {
      const response = await api.post(`/api/v1/roles/${roleId}/permissions`, permissionData);
      return response.data;
    } catch (error) {
      console.error('Error assigning permission to role:', error);
      throw error;
    }
  },

  // Note: Backend chưa có endpoint remove permission từ role
  async removePermissionFromRole(roleId, permissionId) {
    console.warn('Backend does not have remove permission from role endpoint');
    throw new Error('Remove permission endpoint not available in backend');
  },

  // ===================================================================
  // ACTIVITY LOGS - Nhật ký hoạt động
  // Backend: UserActivityLogController.java
  // ===================================================================
  async getActivityLogs(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.action) queryParams.append('action', params.action);
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      
      const url = `/api/v1/activity-logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  },

  // Note: Các endpoint sau chưa có trong backend
  async getActivityLogById(id) {
    console.warn('Backend does not have get activity log by id endpoint');
    throw new Error('Get activity log by id endpoint not available in backend');
  },

  async getUserActivityLogs(userId, params = {}) {
    // Sử dụng getActivityLogs với filter userId
    return this.getActivityLogs({ ...params, userId });
  },

  // ===================================================================
  // USER SESSIONS - Quản lý phiên đăng nhập
  // Note: Backend chưa có các endpoint này
  // ===================================================================
  async getUserSessions(userId) {
    console.warn('Backend does not have user sessions endpoints');
    throw new Error('User sessions endpoints not available in backend');
  },

  async revokeUserSession(userId, sessionId) {
    console.warn('Backend does not have revoke session endpoint');
    throw new Error('Revoke session endpoint not available in backend');
  },

  async revokeAllUserSessions(userId) {
    console.warn('Backend does not have revoke all sessions endpoint');
    throw new Error('Revoke all sessions endpoint not available in backend');
  },

  // ===================================================================
  // STATISTICS - Thống kê
  // Note: Backend chưa có các endpoint thống kê này
  // ===================================================================
  async getUserStats() {
    console.warn('Backend does not have user stats endpoint');
    throw new Error('User stats endpoint not available in backend');
  },

  async getCustomerStats() {
    console.warn('Backend does not have customer stats endpoint');
    throw new Error('Customer stats endpoint not available in backend');
  },

  async getEmployeeStats() {
    console.warn('Backend does not have employee stats endpoint');
    throw new Error('Employee stats endpoint not available in backend');
  }
}

export default userService
