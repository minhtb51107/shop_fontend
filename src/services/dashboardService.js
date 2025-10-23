// src/services/dashboardService.js
import api from './api'

/**
 * Dashboard Service - CHỈ SỬ DỤNG API CÓ THẬT TỪ BACKEND
 * 
 * API endpoints có thật:
 * - GET /api/v1/orders (trả về List<OrderResponse>, KHÔNG có pagination)
 * - GET /api/v1/customers?page=X&size=Y (trả về Page<CustomerResponse>)
 * - GET /api/v1/products?page=X&size=Y (trả về Page<ProductResponse>)
 * - GET /api/v1/finance/reports/revenue?year=X&month=Y (trả về RevenueReportResponse, cần ADMIN)
 * - GET /api/v1/activity-logs?page=X&size=Y (trả về Page<UserActivityLogResponse>, cần ADMIN)
 * - GET /api/v1/purchase-orders/test (health check, không cần auth)
 */
export const dashboardService = {
  /**
   * Lấy thống kê tổng quan (stats cards)
   * Gọi các API THẬT để lấy số liệu
   */
  async getOverviewStats() {
    try {
      console.log('📊 Fetching overview stats from REAL backend APIs...')
      
      // API 1: GET /api/v1/orders - Trả về List (không phải Page!)
      const ordersRes = await api.get('/api/v1/orders')
      const allOrders = ordersRes.data || []
      
      // API 2: GET /api/v1/customers - Trả về Page
      const customersRes = await api.get('/api/v1/customers', { 
        params: { page: 0, size: 1 } 
      })
      
      // API 3: GET /api/v1/products - Trả về Page
      const productsRes = await api.get('/api/v1/products', { 
        params: { page: 0, size: 1 } 
      })
      
      // Tính tổng doanh thu từ tất cả orders
      // ✅ Backend trả về grandTotal (camelCase), KHÔNG phải totalAmount
      const totalRevenue = allOrders.reduce((sum, order) => {
        return sum + (order.grandTotal || order.totalAmount || 0)
      }, 0)
      
      console.log('✅ Got stats:', {
        orders: allOrders.length,
        customers: customersRes.data.totalElements,
        products: productsRes.data.totalElements,
        revenue: totalRevenue
      })

      return {
        totalOrders: allOrders.length,
        totalCustomers: customersRes.data.totalElements || 0,
        totalProducts: productsRes.data.totalElements || 0,
        totalRevenue: totalRevenue,
        // Growth: Không có API backend để tính, để 0
        orderGrowth: 0,
        customerGrowth: 0,
        productGrowth: 0,
        revenueGrowth: 0
      }
    } catch (error) {
      console.error('❌ Error fetching overview stats:', error)
      throw error
    }
  },

  /**
   * Lấy danh sách đơn hàng gần đây
   * API: GET /api/v1/orders (trả về List, không pagination)
   */
  async getRecentOrders(limit = 5) {
    try {
      console.log(`📦 Fetching ${limit} recent orders...`)
      
      const response = await api.get('/api/v1/orders')
      const allOrders = response.data || []
      
      // Sort by ID descending (giả định ID cao hơn = mới hơn)
      // và lấy N đơn đầu tiên
      const recentOrders = allOrders
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, limit)
      
      console.log(`✅ Got ${recentOrders.length} recent orders`)
      return recentOrders
    } catch (error) {
      console.error('❌ Error fetching recent orders:', error)
      throw error
    }
  },

  /**
   * Lấy top sản phẩm
   * Backend KHÔNG CÓ endpoint /best-selling
   * Chỉ lấy sản phẩm active đầu tiên
   */
  async getTopProducts(limit = 5) {
    try {
      console.log(`🏆 Fetching top ${limit} products...`)
      
      const response = await api.get('/api/v1/products', {
        params: {
          page: 0,
          size: limit,
          isActive: true
        }
      })
      
      const products = response.data.content || []
      console.log(`✅ Got ${products.length} products`)
      return products
    } catch (error) {
      console.error('❌ Error fetching top products:', error)
      throw error
    }
  },

  /**
   * Lấy báo cáo doanh thu
   * API: GET /api/v1/finance/reports/revenue?year=X&month=Y
   * Yêu cầu: hasRole('ADMIN')
   */
  async getRevenueReport(year = null, month = null) {
    try {
      console.log('💰 Fetching revenue report...')
      
      const params = {}
      if (year) params.year = year
      if (month) params.month = month
      
      const response = await api.get('/api/v1/finance/reports/revenue', { params })
      
      console.log('✅ Got revenue report')
      return response.data
    } catch (error) {
      console.warn('⚠️ Revenue report not accessible (need ADMIN role or 403):', error.response?.status)
      // Nếu không có quyền hoặc lỗi, return null
      return null
    }
  },

  /**
   * Lấy activity logs
   * API: GET /api/v1/activity-logs?page=X&size=Y
   * Yêu cầu: hasRole('ADMIN')
   */
  async getRecentActivities(limit = 10) {
    try {
      console.log(`📝 Fetching ${limit} recent activities...`)
      
      const response = await api.get('/api/v1/activity-logs', {
        params: {
          page: 0,
          size: limit,
          sort: 'timestamp,desc'
        }
      })
      
      const activities = response.data.content || []
      console.log(`✅ Got ${activities.length} activities`)
      return activities
    } catch (error) {
      console.warn('⚠️ Activity logs not accessible (need ADMIN role or 403):', error.response?.status)
      // Nếu không có quyền hoặc lỗi, return empty array
      return []
    }
  },

  /**
   * Kiểm tra system status
   * API: GET /api/v1/purchase-orders/test (không cần auth)
   */
  async getSystemStatus() {
    try {
      console.log('💻 Checking system status...')
      
      await api.get('/api/v1/purchase-orders/test')
      
      console.log('✅ System is online')
      return {
        backend: 'online',
        database: 'connected',
        api: 'active'
      }
    } catch (error) {
      console.error('❌ System is offline')
      return {
        backend: 'offline',
        database: 'unknown',
        api: 'error'
      }
    }
  }
}

export default dashboardService

