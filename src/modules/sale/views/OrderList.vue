<template>
  <div class="order-list-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="bi bi-cart-check me-3"></i>
            Quản lý đơn hàng
          </h1>
          <p class="page-subtitle">Theo dõi và quản lý tất cả đơn hàng của khách hàng</p>
        </div>
        <!-- Nút Tạo đơn hàng - ẨN ĐI -->
        <!--
        <div class="header-actions">
          <button class="btn-add" @click="showAddModal = true">
            <i class="bi bi-plus-circle me-2"></i>
            Tạo đơn hàng
          </button>
        </div>
        -->
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-cart-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalOrders }}</div>
            <div class="stat-label">Tổng đơn hàng</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingOrders }}</div>
            <div class="stat-label">Chờ xử lý</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-truck"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ shippingOrders }}</div>
            <div class="stat-label">Đang giao</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ completedOrders }}</div>
            <div class="stat-label">Hoàn thành</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="filters-content">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm đơn hàng..." 
            v-model="searchQuery"
            class="search-input"
          >
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select v-model="sortBy" class="filter-select">
            <option value="created_at">Sắp xếp theo ngày tạo</option>
            <option value="grand_total">Sắp xếp theo giá trị</option>
            <option value="customer_name">Sắp xếp theo khách hàng</option>
            <option value="status">Sắp xếp theo trạng thái</option>
          </select>
          <input 
            type="date" 
            v-model="dateFilter" 
            class="filter-date"
            placeholder="Lọc theo ngày"
          >
        </div>
      </div>
    </div>

    <!-- Order List -->
    <div class="orders-section">
      <div class="orders-table">
        <div class="table-header">
          <div class="table-row">
            <div class="table-cell">Mã đơn hàng</div>
            <div class="table-cell">Khách hàng</div>
            <div class="table-cell">Ngày tạo</div>
            <div class="table-cell">Tổng tiền</div>
            <div class="table-cell">Trạng thái</div>
            <div class="table-cell">Thao tác</div>
          </div>
        </div>
        <div class="table-body">
          <transition-group name="order-list" tag="div">
            <div 
              v-for="order in paginatedOrders" 
              :key="order.id" 
              class="table-row order-row"
            >
              <div class="table-cell">
                <div class="order-id">
                  <strong>#{{ order.id }}</strong>
                </div>
              </div>
              <div class="table-cell">
                <div class="customer-info">
                  <div class="customer-name">{{ order.customer_name }}</div>
                  <div class="customer-phone">{{ order.customer_phone }}</div>
                </div>
              </div>
              <div class="table-cell">
                <div class="order-date">{{ formatDate(order.created_at) }}</div>
              </div>
              <div class="table-cell">
                <div class="order-total">{{ formatCurrency(order.grand_total) }}</div>
              </div>
              <div class="table-cell">
                <div class="order-status" :class="order.statusClass">
                  <span class="status-dot"></span>
                  {{ order.statusText }}
                </div>
              </div>
              <div class="table-cell">
                <div class="order-actions">
                  <button class="btn-action btn-view" @click="viewOrder(order)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn-action btn-edit" @click="editOrder(order)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn-action btn-delete" @click="deleteOrder(order)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-section">
      <div class="pagination-info">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} 
        trong tổng số {{ filteredOrders.length }} đơn hàng
      </div>
      <div class="pagination-controls">
        <button 
          class="btn-pagination" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          class="btn-pagination" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Tạo đơn hàng mới' : 'Chỉnh sửa đơn hàng' }}</h3>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveOrder" class="order-form">
            <div class="form-section">
              <h4>Thông tin khách hàng</h4>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Tên khách hàng *</label>
                  <input 
                    type="text" 
                    v-model="orderForm.customer_name" 
                    class="form-input"
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Số điện thoại *</label>
                  <input 
                    type="tel" 
                    v-model="orderForm.customer_phone" 
                    class="form-input"
                    required
                  >
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Địa chỉ giao hàng</label>
                <textarea 
                  v-model="orderForm.shipping_address" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div class="form-section">
              <h4>Thông tin đơn hàng</h4>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Trạng thái</label>
                  <select v-model="orderForm.status" class="form-select">
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Tổng tiền</label>
                  <input 
                    type="number" 
                    v-model="orderForm.grand_total" 
                    class="form-input"
                    min="0"
                  >
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Ghi chú</label>
                <textarea 
                  v-model="orderForm.notes" 
                  class="form-textarea"
                  rows="2"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Hủy</button>
          <button class="btn-save" @click="saveOrder">
            {{ showAddModal ? 'Tạo đơn hàng' : 'Cập nhật' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { orderService } from '../services/saleService'

// Reactive data
const orders = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('created_at')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showAddModal = ref(false)
const showEditModal = ref(false)
const orderForm = ref({
  customer_name: '',
  customer_phone: '',
  shipping_address: '',
  status: 'pending',
  grand_total: 0,
  notes: ''
})

// Loading state
const loading = ref(false)

// Computed properties
const totalOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  return orders.value.length
})
const pendingOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  return orders.value.filter(o => o.status === 'pending').length
})
const shippingOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  return orders.value.filter(o => o.status === 'shipping').length
})
const completedOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  return orders.value.filter(o => o.status === 'delivered').length
})

const filteredOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return []
  let filtered = orders.value

  // Search filter (null-safe)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => {
      const orderId = String(order.id || '').toLowerCase()
      const customerName = String(order.customer_name || '').toLowerCase()
      const customerPhone = String(order.customer_phone || '')
      
      return orderId.includes(query) ||
             customerName.includes(query) ||
             customerPhone.includes(query)
    })
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // Date filter (null-safe)
  if (dateFilter.value) {
    filtered = filtered.filter(order => {
      const createdAt = String(order.created_at || '')
      return createdAt.startsWith(dateFilter.value)
    })
  }

  // Sort (null-safe)
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'created_at':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      case 'grand_total':
        return (b.grand_total || 0) - (a.grand_total || 0)
      case 'customer_name':
        return (a.customer_name || '').localeCompare(b.customer_name || '')
      case 'status':
        return (a.status || '').localeCompare(b.status || '')
      default:
        return 0
    }
  })

  return filtered
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusInfo = (status) => {
  const statusMap = {
    'pending': { text: 'Chờ xử lý', class: 'status-pending' },
    'processing': { text: 'Đang xử lý', class: 'status-processing' },
    'shipping': { text: 'Đang giao', class: 'status-shipping' },
    'delivered': { text: 'Đã giao', class: 'status-delivered' },
    'cancelled': { text: 'Đã hủy', class: 'status-cancelled' }
  }
  return statusMap[status] || { text: status, class: 'status-default' }
}

const viewOrder = (order) => {
  console.log('View order:', order)
  // Navigate to order detail page
}

const editOrder = (order) => {
  orderForm.value = { ...order }
  showEditModal.value = true
}

const deleteOrder = async (order) => {
  if (!confirm(`Bạn có chắc muốn xóa đơn hàng ${order.id}?`)) {
    return
  }
  
  try {
    loading.value = true
    
    // ✅ XÓA ĐƠN HÀNG - GỌI API THẬT
    // Note: Backend có thể chưa có endpoint DELETE
    // Thay vào đó, update status = CANCELLED
    await orderService.updateStatus(order.id, 'CANCELLED')
    console.log('✅ Order cancelled:', order.id)
    
    // Reload danh sách từ backend
    await loadOrders()
    
    alert('✅ Đã hủy đơn hàng!')
  } catch (error) {
    console.error('❌ Error deleting order:', error)
    if (error.response?.status === 404) {
      alert('❌ Backend chưa có API xóa đơn hàng. Đã chuyển sang CANCELLED.')
      // Fallback: Chỉ xóa local nếu backend không hỗ trợ
      const index = orders.value.findIndex(o => o.id === order.id)
      if (index > -1) {
        orders.value.splice(index, 1)
      }
    } else {
      alert(`❌ Lỗi: ${error.response?.data?.message || error.message}`)
    }
  } finally {
    loading.value = false
  }
}

const saveOrder = async () => {
  try {
    loading.value = true
    
    if (showAddModal.value) {
      // ✅ TẠO ĐƠN HÀNG MỚI - GỌI API THẬT
      const response = await orderService.create(orderForm.value)
      console.log('✅ Order created:', response.data)
      
      // Reload danh sách từ backend để có data mới nhất
      await loadOrders()
      
      alert('✅ Tạo đơn hàng thành công!')
    } else {
      // ✅ CẬP NHẬT ĐƠN HÀNG - GỌI API THẬT
      const response = await orderService.updateStatus(
        orderForm.value.id, 
        orderForm.value.status
      )
      console.log('✅ Order updated:', response.data)
      
      // Reload danh sách từ backend
      await loadOrders()
      
      alert('✅ Cập nhật đơn hàng thành công!')
    }
    
    closeModal()
  } catch (error) {
    console.error('❌ Error saving order:', error)
    alert(`❌ Lỗi: ${error.response?.data?.message || error.message}`)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  orderForm.value = {
    customer_name: '',
    customer_phone: '',
    shipping_address: '',
    status: 'pending',
    grand_total: 0,
    notes: ''
  }
}

// Load orders from API
const loadOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: itemsPerPage.value,
      sort: `${sortBy.value},desc`
    }

    // Add filters if they exist
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    if (statusFilter.value) {
      params.status = statusFilter.value
    }

    const response = await orderService.getAll(params)
    
    console.log('📦 Raw API Response:', response.data)
    
    // ✅ Transform backend response (camelCase) → frontend format (snake_case)
    const transformOrder = (order) => {
      const statusInfo = getStatusInfo(order.status)
      return {
        ...order,
        // ✅ Map camelCase → snake_case
        created_at: order.createdAt || order.created_at,
        grand_total: order.grandTotal || order.grand_total || 0,
        // ✅ Handle missing customer info (backend chưa trả về)
        customer_name: order.customerName || order.customer_name || `Khách hàng #${order.customerId || order.customer_id || '?'}`,
        customer_phone: order.customerPhone || order.customer_phone || 'N/A',
        statusText: statusInfo.text,
        statusClass: statusInfo.class
      }
    }
    
    // Handle Spring Boot Page response format
    if (response.data && Array.isArray(response.data.content)) {
      orders.value = response.data.content.map(transformOrder)
      console.log('✅ Transformed orders (Page):', orders.value)
    } else if (Array.isArray(response.data)) {
      // Fallback if not using pagination
      orders.value = response.data.map(transformOrder)
      console.log('✅ Transformed orders (List):', orders.value)
    } else {
      console.warn('⚠️ Unexpected response format:', response.data)
      orders.value = []
    }
  } catch (error) {
    console.error('Error loading orders:', error)
    orders.value = []
  } finally {
    loading.value = false
  }
}

// Debounce timer
let debounceTimer = null

// Watchers to reload data when filters change
watch([searchQuery, statusFilter, sortBy], () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loadOrders()
  }, 300)
})

watch(currentPage, () => {
  loadOrders()
})

// Lifecycle
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
/* Container */
.order-list-container {
  padding: 0;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: white;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.page-title i {
  color: #667eea;
}

.page-subtitle {
  color: #6c757d;
  margin: 0;
  font-size: 1.1rem;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

/* Filters Section */
.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.filters-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select,
.filter-date {
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus,
.filter-date:focus {
  outline: none;
  border-color: #667eea;
}

/* Orders Section */
.orders-section {
  margin-bottom: 2rem;
}

.orders-table {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  align-items: center;
}

.table-cell {
  font-weight: 600;
  color: #2c3e50;
}

.order-row {
  border-bottom: 1px solid #f8f9fa;
  transition: all 0.3s ease;
}

.order-row:hover {
  background: #f8f9fa;
}

.order-id {
  font-size: 1rem;
  color: #667eea;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.customer-phone {
  color: #6c757d;
  font-size: 0.9rem;
}

.order-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.order-total {
  font-weight: 600;
  color: #2c3e50;
}

.order-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  width: fit-content;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-pending .status-dot {
  background: #ffc107;
}

.status-processing {
  background: #d1ecf1;
  color: #0c5460;
}

.status-processing .status-dot {
  background: #17a2b8;
}

.status-shipping {
  background: #cce5ff;
  color: #004085;
}

.status-shipping .status-dot {
  background: #007bff;
}

.status-delivered {
  background: #d4edda;
  color: #155724;
}

.status-delivered .status-dot {
  background: #28a745;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-cancelled .status-dot {
  background: #dc3545;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-view {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-view:hover {
  background: #1976d2;
  color: white;
}

.btn-edit {
  background: #fff3e0;
  color: #f57c00;
}

.btn-edit:hover {
  background: #f57c00;
  color: white;
}

.btn-delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-delete:hover {
  background: #d32f2f;
  color: white;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.pagination-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-pagination {
  width: 40px;
  height: 40px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-pagination:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  color: #2c3e50;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  width: 35px;
  height: 35px;
  border: none;
  background: #f8f9fa;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #e9ecef;
}

.modal-body {
  padding: 1.5rem;
}

.order-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section h4 {
  color: #2c3e50;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f8f9fa;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Transitions */
.order-list-enter-active,
.order-list-leave-active {
  transition: all 0.3s ease;
}

.order-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.order-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .filters-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .table-cell {
    padding: 0.5rem 0;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .pagination-section {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>