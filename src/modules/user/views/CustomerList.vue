<template>
  <div class="customer-list-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="bi bi-people me-3"></i>
            Quản lý khách hàng
          </h1>
          <p class="page-subtitle">Quản lý thông tin khách hàng và lịch sử mua hàng</p>
        </div>
        <div class="header-actions">
          <button class="btn-add" @click="showAddModal = true">
            <i class="bi bi-plus-circle me-2"></i>
            Thêm khách hàng
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalCustomers }}</div>
            <div class="stat-label">Tổng khách hàng</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-person-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ activeCustomers }}</div>
            <div class="stat-label">Khách hàng hoạt động</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-calendar-plus"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ newCustomersThisMonth }}</div>
            <div class="stat-label">Khách hàng mới tháng này</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-graph-up"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">+{{ customerGrowth }}%</div>
            <div class="stat-label">Tăng trưởng</div>
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
            placeholder="Tìm kiếm khách hàng..." 
            v-model="searchQuery"
            class="search-input"
          >
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="blocked">Bị khóa</option>
          </select>
          <select v-model="sortBy" class="filter-select">
            <option value="name">Sắp xếp theo tên</option>
            <option value="created_at">Sắp xếp theo ngày tạo</option>
            <option value="last_order">Sắp xếp theo đơn hàng cuối</option>
            <option value="total_spent">Sắp xếp theo tổng chi tiêu</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Customer List -->
    <div class="customers-section">
      <div class="customers-grid">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Đang tải danh sách khách hàng...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredCustomers.length === 0" class="empty-state">
          <i class="bi bi-people" style="font-size: 3rem; color: #6c757d;"></i>
          <h3>Không có khách hàng nào</h3>
          <p>Hiện tại chưa có khách hàng nào trong hệ thống.</p>
        </div>

        <!-- Customer List -->
        <transition-group v-else name="customer-list" tag="div" class="customers-list">
          <div 
            v-for="customer in filteredCustomers" 
            :key="customer.id" 
            class="customer-card"
            @click="viewCustomer(customer)"
          >
            <div class="customer-header">
              <div class="customer-avatar">
                <img 
                  v-if="getCustomerAvatar(customer)" 
                  :src="getCustomerAvatar(customer)" 
                  :alt="customer.fullname" 
                />
                <div v-else class="avatar-default">
                  {{ customer.fullname?.charAt(0)?.toUpperCase() || '?' }}
                </div>
              </div>
              <div class="customer-status" :class="getStatusClass(customer.user?.status)">
                <span class="status-dot"></span>
                {{ getStatusText(customer.user?.status) }}
              </div>
            </div>
            
            <div class="customer-info">
              <h3 class="customer-name">{{ customer.fullname }}</h3>
              <p class="customer-email">{{ customer.user?.email || 'N/A' }}</p>
              <p class="customer-phone">{{ customer.phoneNumber || 'N/A' }}</p>
            </div>
            
            <div class="customer-stats">
              <div class="stat-item">
                <span class="stat-label">ID:</span>
                <span class="stat-value">{{ customer.id }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Ngày tạo:</span>
                <span class="stat-value">{{ formatDate(customer.createdAt || customer.created_at) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Trạng thái:</span>
                <span class="stat-value">{{ customer.user?.status || 'N/A' }}</span>
              </div>
            </div>
            
            <div class="customer-actions">
              <button class="btn-action btn-view" @click.stop="viewCustomer(customer)">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn-action btn-edit" @click.stop="editCustomer(customer)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-action btn-delete" @click.stop="deleteCustomer(customer)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-section" v-if="!loading && totalCustomers > 0">
      <div class="pagination-info">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, totalCustomers) }} 
        trong tổng số {{ totalCustomers }} khách hàng
      </div>
      <div class="pagination-controls">
        <button 
          class="btn-pagination" 
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          class="btn-pagination" 
          :disabled="currentPage >= totalPages"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
                </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm khách hàng mới' : 'Chỉnh sửa khách hàng' }}</h3>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x"></i>
                </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCustomer" class="customer-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Họ và tên *</label>
                <input 
                  type="text" 
                  v-model="customerForm.fullname" 
                  class="form-input"
                  required
                >
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input 
                  type="email" 
                  v-model="customerForm.email" 
                  class="form-input"
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Số điện thoại *</label>
                <input 
                  type="tel" 
                  v-model="customerForm.phone_number" 
                  class="form-input"
                  required
                >
              </div>
              <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select v-model="customerForm.status" class="form-select">
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="blocked">Bị khóa</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Địa chỉ</label>
              <textarea 
                v-model="customerForm.address" 
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Hủy</button>
          <button class="btn-save" @click="saveCustomer">
            {{ showAddModal ? 'Thêm khách hàng' : 'Cập nhật' }}
                </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { customerService } from '../services/userService.js'

// Reactive data
const customers = ref([])
const totalCustomers = ref(0)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedCustomer = ref(null)
const customerForm = ref({
  fullname: '',
  email: '',
  phone_number: '',
  status: 'ACTIVE'
})

// API methods
const loadCustomers = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = {
      page: currentPage.value - 1, // Backend uses 0-based indexing
      size: itemsPerPage.value,
      sort: `${sortBy.value === 'name' ? 'fullname' : sortBy.value},asc`
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    const response = await customerService.getAll(params)
    
    // Handle Spring Boot Page response format
    if (response.data && Array.isArray(response.data.content)) {
      customers.value = response.data.content
      totalCustomers.value = response.data.totalElements
    } else if (Array.isArray(response.data)) {
      // Fallback if not using pagination
      customers.value = response.data
      totalCustomers.value = response.data.length
    } else {
      // No data case
      customers.value = []
      totalCustomers.value = 0
    }
  } catch (err) {
    console.error('Error loading customers:', err)
    
    // Handle different error types
    if (err.response?.status === 403) {
      error.value = 'Bạn không có quyền truy cập trang quản lý khách hàng. Vui lòng liên hệ quản trị viên.'
    } else if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    } else {
      error.value = 'Không thể tải danh sách khách hàng. Vui lòng thử lại sau.'
    }
    
    customers.value = []
    totalCustomers.value = 0
  } finally {
    loading.value = false
  }
}

// Watch for search and filter changes
watch([searchQuery, currentPage, sortBy], () => {
  loadCustomers()
}, { deep: true })

// Computed properties
const activeCustomers = computed(() => customers.value.filter(c => c.user?.status === 'ACTIVE').length)
const newCustomersThisMonth = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  return customers.value.filter(c => {
    const createdDate = new Date(c.createdAt || c.created_at)
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
  }).length
})
const customerGrowth = computed(() => {
  // Calculate actual growth based on data if needed
  // For now, return 0 since we don't have historical data
  return 0
})

const filteredCustomers = computed(() => {
  let filtered = customers.value

  // Status filter (client-side filtering for now)
  if (statusFilter.value) {
    const statusMap = {
      'active': 'ACTIVE',
      'inactive': 'INACTIVE', 
      'blocked': 'BLOCKED'
    }
    filtered = filtered.filter(customer => 
      customer.user?.status === statusMap[statusFilter.value]
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(totalCustomers.value / itemsPerPage.value))

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

const getCustomerAvatar = (customer) => {
  if (customer.photo && customer.photo.trim() !== '') {
    return customer.photo
  }
  // Trả về null để CSS có thể xử lý hiển thị avatar mặc định
  return null
}

const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVE': return 'status-active'
    case 'INACTIVE': return 'status-inactive'
    case 'BLOCKED': return 'status-blocked'
    default: return 'status-inactive'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'ACTIVE': return 'Hoạt động'
    case 'INACTIVE': return 'Không hoạt động'
    case 'BLOCKED': return 'Bị khóa'
    default: return 'Không hoạt động'
  }
}

const viewCustomer = (customer) => {
  selectedCustomer.value = customer
  // Navigate to customer detail page or show details in modal
  console.log('View customer:', customer)
}

const editCustomer = (customer) => {
  customerForm.value = {
    fullname: customer.fullname,
    email: customer.user?.email || '',
    phone_number: customer.phoneNumber,
    status: customer.user?.status || 'ACTIVE'
  }
  selectedCustomer.value = customer
  showEditModal.value = true
}

const deleteCustomer = async (customer) => {
  if (confirm(`Bạn có chắc muốn xóa khách hàng ${customer.fullname}?`)) {
    try {
      await customerService.delete(customer.id)
      await loadCustomers() // Reload data
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Có lỗi xảy ra khi xóa khách hàng')
    }
  }
}

const saveCustomer = async () => {
  try {
    if (showAddModal.value) {
      // Note: Customer creation is handled through registration
      alert('Khách hàng mới cần đăng ký qua form đăng ký')
      closeModal()
      return
    } else {
      // Update existing customer
      const updateData = {
        fullname: customerForm.value.fullname,
        phoneNumber: customerForm.value.phone_number
      }
      
      await customerService.update(selectedCustomer.value.id, updateData)
      await loadCustomers() // Reload data
    }
    closeModal()
  } catch (error) {
    console.error('Error saving customer:', error)
    alert('Có lỗi xảy ra khi lưu thông tin khách hàng')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  customerForm.value = {
    fullname: '',
    email: '',
    phone_number: '',
    status: 'active',
    address: ''
  }
}

// Lifecycle
onMounted(() => {
  loadCustomers()
})
</script>

<style scoped>
/* Container */
.customer-list-container {
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

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Customers Section */
.customers-section {
  margin-bottom: 2rem;
}

.customers-grid {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

.customers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.customer-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.customer-card:hover {
  background: white;
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.customer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.customer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-default {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.customer-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-active .status-dot {
  background: #28a745;
}

.status-inactive {
  background: #fff3cd;
  color: #856404;
}

.status-inactive .status-dot {
  background: #ffc107;
}

.status-blocked {
  background: #f8d7da;
  color: #721c24;
}

.status-blocked .status-dot {
  background: #dc3545;
}

.customer-info {
  margin-bottom: 1rem;
}

.customer-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.customer-email,
.customer-phone {
  color: #6c757d;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.customer-stats {
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.customer-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
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
  max-width: 600px;
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

.customer-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

/* Loading and Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-state p {
  margin-top: 1rem;
  color: #6c757d;
}

.empty-state h3 {
  color: #2c3e50;
  margin: 1rem 0 0.5rem;
}

.empty-state p {
  color: #6c757d;
  margin: 0;
}

/* Transitions */
.customer-list-enter-active,
.customer-list-leave-active {
  transition: all 0.3s ease;
}

.customer-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.customer-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
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
  
  .customers-list {
    grid-template-columns: 1fr;
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