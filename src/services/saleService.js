// src/services/saleService.js
import api from './api'

export const saleService = {
  // Order Management
  async getOrders(params = {}) {
    try {
      const response = await api.get('/api/v1/orders', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  async getOrderById(id) {
    try {
      const response = await api.get(`/api/v1/orders/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  },

  async createOrder(orderData) {
    try {
      const response = await api.post('/api/v1/orders', orderData)
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  async updateOrder(id, orderData) {
    try {
      const response = await api.put(`/api/v1/orders/${id}`, orderData)
      return response.data
    } catch (error) {
      console.error('Error updating order:', error)
      throw error
    }
  },

  async deleteOrder(id) {
    try {
      const response = await api.delete(`/api/v1/orders/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  },

  async updateOrderStatus(id, status, notes = '') {
    try {
      const response = await api.patch(`/api/v1/orders/${id}/status`, { status, notes })
      return response.data
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  },

  async getOrderHistory(id) {
    try {
      const response = await api.get(`/api/v1/orders/${id}/history`)
      return response.data
    } catch (error) {
      console.error('Error fetching order history:', error)
      throw error
    }
  },

  // Order Items Management
  async getOrderItems(orderId) {
    try {
      const response = await api.get(`/api/v1/orders/${orderId}/items`)
      return response.data
    } catch (error) {
      console.error('Error fetching order items:', error)
      throw error
    }
  },

  async addOrderItem(orderId, itemData) {
    try {
      const response = await api.post(`/api/v1/orders/${orderId}/items`, itemData)
      return response.data
    } catch (error) {
      console.error('Error adding order item:', error)
      throw error
    }
  },

  async updateOrderItem(orderId, itemId, itemData) {
    try {
      const response = await api.put(`/api/v1/orders/${orderId}/items/${itemId}`, itemData)
      return response.data
    } catch (error) {
      console.error('Error updating order item:', error)
      throw error
    }
  },

  async removeOrderItem(orderId, itemId) {
    try {
      const response = await api.delete(`/api/v1/orders/${orderId}/items/${itemId}`)
      return response.data
    } catch (error) {
      console.error('Error removing order item:', error)
      throw error
    }
  },

  // Promotion Management
  async getPromotions(params = {}) {
    try {
      const response = await api.get('/api/v1/promotions', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching promotions:', error)
      throw error
    }
  },

  async getPromotionById(id) {
    try {
      const response = await api.get(`/api/v1/promotions/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching promotion:', error)
      throw error
    }
  },

  async createPromotion(promotionData) {
    try {
      const response = await api.post('/api/v1/promotions', promotionData)
      return response.data
    } catch (error) {
      console.error('Error creating promotion:', error)
      throw error
    }
  },

  async updatePromotion(id, promotionData) {
    try {
      const response = await api.put(`/api/v1/promotions/${id}`, promotionData)
      return response.data
    } catch (error) {
      console.error('Error updating promotion:', error)
      throw error
    }
  },

  async deletePromotion(id) {
    try {
      const response = await api.delete(`/api/v1/promotions/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting promotion:', error)
      throw error
    }
  },

  async activatePromotion(id) {
    try {
      const response = await api.patch(`/api/v1/promotions/${id}/activate`)
      return response.data
    } catch (error) {
      console.error('Error activating promotion:', error)
      throw error
    }
  },

  async deactivatePromotion(id) {
    try {
      const response = await api.patch(`/api/v1/promotions/${id}/deactivate`)
      return response.data
    } catch (error) {
      console.error('Error deactivating promotion:', error)
      throw error
    }
  },

  // Promotion Applied Orders
  async getPromotionAppliedOrders(promotionId) {
    try {
      const response = await api.get(`/api/v1/promotions/${promotionId}/applied-orders`)
      return response.data
    } catch (error) {
      console.error('Error fetching promotion applied orders:', error)
      throw error
    }
  },

  async applyPromotionToOrder(orderId, promotionId) {
    try {
      const response = await api.post(`/api/v1/orders/${orderId}/promotions`, { promotionId })
      return response.data
    } catch (error) {
      console.error('Error applying promotion to order:', error)
      throw error
    }
  },

  async removePromotionFromOrder(orderId, promotionId) {
    try {
      const response = await api.delete(`/api/v1/orders/${orderId}/promotions/${promotionId}`)
      return response.data
    } catch (error) {
      console.error('Error removing promotion from order:', error)
      throw error
    }
  },

  // Shipment Management
  async getShipments(params = {}) {
    try {
      const response = await api.get('/api/v1/shipments', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching shipments:', error)
      throw error
    }
  },

  async getShipmentById(id) {
    try {
      const response = await api.get(`/api/v1/shipments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching shipment:', error)
      throw error
    }
  },

  async createShipment(shipmentData) {
    try {
      const response = await api.post('/api/v1/shipments', shipmentData)
      return response.data
    } catch (error) {
      console.error('Error creating shipment:', error)
      throw error
    }
  },

  async updateShipment(id, shipmentData) {
    try {
      const response = await api.put(`/api/v1/shipments/${id}`, shipmentData)
      return response.data
    } catch (error) {
      console.error('Error updating shipment:', error)
      throw error
    }
  },

  async updateShipmentStatus(id, status) {
    try {
      const response = await api.patch(`/api/v1/shipments/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating shipment status:', error)
      throw error
    }
  },

  async getOrderShipments(orderId) {
    try {
      const response = await api.get(`/api/v1/orders/${orderId}/shipments`)
      return response.data
    } catch (error) {
      console.error('Error fetching order shipments:', error)
      throw error
    }
  },

  // Payment Management
  async getPayments(params = {}) {
    try {
      const response = await api.get('/api/v1/payments', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching payments:', error)
      throw error
    }
  },

  async getPaymentById(id) {
    try {
      const response = await api.get(`/api/v1/payments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching payment:', error)
      throw error
    }
  },

  async createPayment(paymentData) {
    try {
      const response = await api.post('/api/v1/payments', paymentData)
      return response.data
    } catch (error) {
      console.error('Error creating payment:', error)
      throw error
    }
  },

  async updatePayment(id, paymentData) {
    try {
      const response = await api.put(`/api/v1/payments/${id}`, paymentData)
      return response.data
    } catch (error) {
      console.error('Error updating payment:', error)
      throw error
    }
  },

  async updatePaymentStatus(id, status) {
    try {
      const response = await api.patch(`/api/v1/payments/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  },

  async getOrderPayments(orderId) {
    try {
      const response = await api.get(`/api/v1/orders/${orderId}/payments`)
      return response.data
    } catch (error) {
      console.error('Error fetching order payments:', error)
      throw error
    }
  },

  // Return Management
  async getReturns(params = {}) {
    try {
      const response = await api.get('/api/v1/returns', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching returns:', error)
      throw error
    }
  },

  async getReturnById(id) {
    try {
      const response = await api.get(`/api/v1/returns/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching return:', error)
      throw error
    }
  },

  async createReturn(returnData) {
    try {
      const response = await api.post('/api/v1/returns', returnData)
      return response.data
    } catch (error) {
      console.error('Error creating return:', error)
      throw error
    }
  },

  async updateReturn(id, returnData) {
    try {
      const response = await api.put(`/api/v1/returns/${id}`, returnData)
      return response.data
    } catch (error) {
      console.error('Error updating return:', error)
      throw error
    }
  },

  async updateReturnStatus(id, status) {
    try {
      const response = await api.patch(`/api/v1/returns/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating return status:', error)
      throw error
    }
  },

  async getOrderReturns(orderId) {
    try {
      const response = await api.get(`/api/v1/orders/${orderId}/returns`)
      return response.data
    } catch (error) {
      console.error('Error fetching order returns:', error)
      throw error
    }
  },

  // Return Items Management
  async getReturnItems(returnId) {
    try {
      const response = await api.get(`/api/v1/returns/${returnId}/items`)
      return response.data
    } catch (error) {
      console.error('Error fetching return items:', error)
      throw error
    }
  },

  async addReturnItem(returnId, itemData) {
    try {
      const response = await api.post(`/api/v1/returns/${returnId}/items`, itemData)
      return response.data
    } catch (error) {
      console.error('Error adding return item:', error)
      throw error
    }
  },

  async updateReturnItem(returnId, itemId, itemData) {
    try {
      const response = await api.put(`/api/v1/returns/${returnId}/items/${itemId}`, itemData)
      return response.data
    } catch (error) {
      console.error('Error updating return item:', error)
      throw error
    }
  },

  async removeReturnItem(returnId, itemId) {
    try {
      const response = await api.delete(`/api/v1/returns/${returnId}/items/${itemId}`)
      return response.data
    } catch (error) {
      console.error('Error removing return item:', error)
      throw error
    }
  },

  // Warranty Management
  async getWarrantyCases(params = {}) {
    try {
      const response = await api.get('/api/v1/warranty-cases', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching warranty cases:', error)
      throw error
    }
  },

  async getWarrantyCaseById(id) {
    try {
      const response = await api.get(`/api/v1/warranty-cases/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching warranty case:', error)
      throw error
    }
  },

  async createWarrantyCase(warrantyData) {
    try {
      const response = await api.post('/api/v1/warranty-cases', warrantyData)
      return response.data
    } catch (error) {
      console.error('Error creating warranty case:', error)
      throw error
    }
  },

  async updateWarrantyCase(id, warrantyData) {
    try {
      const response = await api.put(`/api/v1/warranty-cases/${id}`, warrantyData)
      return response.data
    } catch (error) {
      console.error('Error updating warranty case:', error)
      throw error
    }
  },

  async updateWarrantyCaseStatus(id, status) {
    try {
      const response = await api.patch(`/api/v1/warranty-cases/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating warranty case status:', error)
      throw error
    }
  },

  // Statistics
  async getSalesStats(params = {}) {
    try {
      const response = await api.get('/api/v1/sales/stats', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching sales stats:', error)
      throw error
    }
  },

  async getOrderStats() {
    try {
      const response = await api.get('/api/v1/orders/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching order stats:', error)
      throw error
    }
  },

  async getRevenueStats(params = {}) {
    try {
      const response = await api.get('/api/v1/sales/revenue', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue stats:', error)
      throw error
    }
  },

  async getTopSellingProducts(params = {}) {
    try {
      const response = await api.get('/api/v1/sales/top-products', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching top selling products:', error)
      throw error
    }
  },

  async getCustomerSalesStats(customerId) {
    try {
      const response = await api.get(`/api/v1/customers/${customerId}/sales-stats`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer sales stats:', error)
      throw error
    }
  }
}

export default saleService

