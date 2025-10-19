// src/services/userService.js
import api from './api'

export const userService = {
  // Customer Management
  async getCustomers(params = {}) {
    try {
      const response = await api.get('/api/v1/customers', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  },

  async getCustomerById(id) {
    try {
      const response = await api.get(`/api/v1/customers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer:', error)
      throw error
    }
  },

  async createCustomer(customerData) {
    try {
      const response = await api.post('/api/v1/customers', customerData)
      return response.data
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  },

  async updateCustomer(id, customerData) {
    try {
      const response = await api.put(`/api/v1/customers/${id}`, customerData)
      return response.data
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  },

  async deleteCustomer(id) {
    try {
      const response = await api.delete(`/api/v1/customers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  },

  async getCustomerOrders(customerId) {
    try {
      const response = await api.get(`/api/v1/customers/${customerId}/orders`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer orders:', error)
      throw error
    }
  },

  // Employee Management
  async getEmployees(params = {}) {
    try {
      const response = await api.get('/api/v1/employees', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching employees:', error)
      throw error
    }
  },

  async getEmployeeById(id) {
    try {
      const response = await api.get(`/api/v1/employees/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching employee:', error)
      throw error
    }
  },

  async createEmployee(employeeData) {
    try {
      const response = await api.post('/api/v1/employees', employeeData)
      return response.data
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    }
  },

  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(`/api/v1/employees/${id}`, employeeData)
      return response.data
    } catch (error) {
      console.error('Error updating employee:', error)
      throw error
    }
  },

  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/api/v1/employees/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    }
  },

  async getEmployeeRoles(employeeId) {
    try {
      const response = await api.get(`/api/v1/employees/${employeeId}/roles`)
      return response.data
    } catch (error) {
      console.error('Error fetching employee roles:', error)
      throw error
    }
  },

  async assignRoleToEmployee(employeeId, roleId) {
    try {
      const response = await api.post(`/api/v1/employees/${employeeId}/roles`, { roleId })
      return response.data
    } catch (error) {
      console.error('Error assigning role to employee:', error)
      throw error
    }
  },

  async removeRoleFromEmployee(employeeId, roleId) {
    try {
      const response = await api.delete(`/api/v1/employees/${employeeId}/roles/${roleId}`)
      return response.data
    } catch (error) {
      console.error('Error removing role from employee:', error)
      throw error
    }
  },

  // Role Management
  async getRoles() {
    try {
      const response = await api.get('/api/v1/roles')
      return response.data
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  },

  async getRoleById(id) {
    try {
      const response = await api.get(`/api/v1/roles/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching role:', error)
      throw error
    }
  },

  async createRole(roleData) {
    try {
      const response = await api.post('/api/v1/roles', roleData)
      return response.data
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  },

  async updateRole(id, roleData) {
    try {
      const response = await api.put(`/api/v1/roles/${id}`, roleData)
      return response.data
    } catch (error) {
      console.error('Error updating role:', error)
      throw error
    }
  },

  async deleteRole(id) {
    try {
      const response = await api.delete(`/api/v1/roles/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting role:', error)
      throw error
    }
  },

  // Permission Management
  async getPermissions() {
    try {
      const response = await api.get('/api/v1/permissions')
      return response.data
    } catch (error) {
      console.error('Error fetching permissions:', error)
      throw error
    }
  },

  async getPermissionById(id) {
    try {
      const response = await api.get(`/api/v1/permissions/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching permission:', error)
      throw error
    }
  },

  async createPermission(permissionData) {
    try {
      const response = await api.post('/api/v1/permissions', permissionData)
      return response.data
    } catch (error) {
      console.error('Error creating permission:', error)
      throw error
    }
  },

  async updatePermission(id, permissionData) {
    try {
      const response = await api.put(`/api/v1/permissions/${id}`, permissionData)
      return response.data
    } catch (error) {
      console.error('Error updating permission:', error)
      throw error
    }
  },

  async deletePermission(id) {
    try {
      const response = await api.delete(`/api/v1/permissions/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting permission:', error)
      throw error
    }
  },

  // Role-Permission Management
  async getRolePermissions(roleId) {
    try {
      const response = await api.get(`/api/v1/roles/${roleId}/permissions`)
      return response.data
    } catch (error) {
      console.error('Error fetching role permissions:', error)
      throw error
    }
  },

  async assignPermissionToRole(roleId, permissionId) {
    try {
      const response = await api.post(`/api/v1/roles/${roleId}/permissions`, { permissionId })
      return response.data
    } catch (error) {
      console.error('Error assigning permission to role:', error)
      throw error
    }
  },

  async removePermissionFromRole(roleId, permissionId) {
    try {
      const response = await api.delete(`/api/v1/roles/${roleId}/permissions/${permissionId}`)
      return response.data
    } catch (error) {
      console.error('Error removing permission from role:', error)
      throw error
    }
  },

  // Activity Logs
  async getActivityLogs(params = {}) {
    try {
      const response = await api.get('/api/v1/activity-logs', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      throw error
    }
  },

  async getActivityLogById(id) {
    try {
      const response = await api.get(`/api/v1/activity-logs/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching activity log:', error)
      throw error
    }
  },

  async getUserActivityLogs(userId, params = {}) {
    try {
      const response = await api.get(`/api/v1/users/${userId}/activity-logs`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching user activity logs:', error)
      throw error
    }
  },

  // User Sessions
  async getUserSessions(userId) {
    try {
      const response = await api.get(`/api/v1/users/${userId}/sessions`)
      return response.data
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      throw error
    }
  },

  async revokeUserSession(userId, sessionId) {
    try {
      const response = await api.delete(`/api/v1/users/${userId}/sessions/${sessionId}`)
      return response.data
    } catch (error) {
      console.error('Error revoking user session:', error)
      throw error
    }
  },

  async revokeAllUserSessions(userId) {
    try {
      const response = await api.delete(`/api/v1/users/${userId}/sessions`)
      return response.data
    } catch (error) {
      console.error('Error revoking all user sessions:', error)
      throw error
    }
  },

  // Statistics
  async getUserStats() {
    try {
      const response = await api.get('/api/v1/users/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }
  },

  async getCustomerStats() {
    try {
      const response = await api.get('/api/v1/customers/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching customer stats:', error)
      throw error
    }
  },

  async getEmployeeStats() {
    try {
      const response = await api.get('/api/v1/employees/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching employee stats:', error)
      throw error
    }
  }
}

export default userService

