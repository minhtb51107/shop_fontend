<template>
  <div class="promotion-management">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="bi bi-tag me-3"></i>
          Quản lý Khuyến mãi
        </h1>
        <button @click="showAddModal = true" class="btn btn-primary">
          <i class="bi bi-plus-lg me-2"></i>
          Tạo khuyến mãi mới
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="row g-3">
        <div class="col-md-4">
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control" 
            placeholder="Tìm kiếm khuyến mãi..."
          />
        </div>
        <div class="col-md-3">
          <select v-model="statusFilter" class="form-select">
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang áp dụng</option>
            <option value="INACTIVE">Không áp dụng</option>
            <option value="EXPIRED">Đã hết hạn</option>
          </select>
        </div>
        <div class="col-md-2">
          <button @click="loadPromotions" class="btn btn-outline-secondary w-100">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Promotion List -->
    <div class="promotions-section">
      <!-- Loading State -->
      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Đang tải danh sách khuyến mãi...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="promotions.length === 0" class="text-center p-5">
        <i class="bi bi-tag" style="font-size: 3rem; color: #6c757d;"></i>
        <h3>Không có khuyến mãi nào</h3>
        <p>Hiện tại chưa có khuyến mãi nào trong hệ thống.</p>
      </div>

      <!-- Promotion Cards -->
      <div v-else class="row g-4">
        <div v-for="promotion in filteredPromotions" :key="promotion.id" class="col-lg-6 col-xl-4">
          <div class="promotion-card">
            <div class="promotion-header">
              <div class="promotion-status" :class="getStatusClass(promotion)">
                {{ getStatusText(promotion) }}
              </div>
              <div class="promotion-actions">
                <button @click="editPromotion(promotion)" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="deletePromotion(promotion)" class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            
            <div class="promotion-body">
              <h5 class="promotion-name">{{ promotion.name }}</h5>
              
              <div class="promotion-discount">
                <span class="discount-value">
                  {{ promotion.discountType === 'PERCENTAGE' ? promotion.discountValue + '%' : formatCurrency(promotion.discountValue) }}
                </span>
              </div>
              
              <div class="promotion-dates">
                <div class="date-item">
                  <i class="bi bi-calendar-check me-2"></i>
                  <span>Bắt đầu: {{ formatDate(promotion.startDate) }}</span>
                </div>
                <div class="date-item">
                  <i class="bi bi-calendar-x me-2"></i>
                  <span>Kết thúc: {{ formatDate(promotion.endDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-backdrop show" @click="closeModal">
      <div class="modal-dialog modal-lg" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ showEditModal ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới' }}
            </h5>
            <button @click="closeModal" class="btn-close"></button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Tên khuyến mãi</label>
                <input v-model="promotionForm.name" type="text" class="form-control" required />
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Loại giảm giá</label>
                  <select v-model="promotionForm.discountType" class="form-select" required>
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Giá trị giảm</label>
                  <input 
                    v-model="promotionForm.discountValue" 
                    type="number" 
                    step="0.01" 
                    class="form-control" 
                    required 
                  />
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Ngày bắt đầu</label>
                  <input v-model="promotionForm.startDate" type="datetime-local" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ngày kết thúc</label>
                  <input v-model="promotionForm.endDate" type="datetime-local" class="form-control" required />
                </div>
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">Hủy</button>
            <button @click="handleSubmit" class="btn btn-primary">
              {{ showEditModal ? 'Cập nhật' : 'Tạo mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { promotionService } from '../services/saleService.js'

// Reactive data
const promotions = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedPromotion = ref(null)

const promotionForm = ref({
  name: '',
  discountType: 'PERCENTAGE',
  discountValue: 0,
  startDate: '',
  endDate: ''
})

// Computed
const filteredPromotions = computed(() => {
  let filtered = promotions.value

  if (searchQuery.value) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(p => getStatusText(p) === statusFilter.value)
  }

  return filtered
})

// Methods
const loadPromotions = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await promotionService.getAll()
    promotions.value = response.data || []
  } catch (err) {
    console.error('Error loading promotions:', err)
    
    // Handle specific error types
    if (err.response?.status === 403) {
      error.value = 'Bạn không có quyền truy cập danh sách khuyến mãi. Vui lòng liên hệ quản trị viên.'
    } else if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    } else {
      error.value = 'Không thể tải danh sách khuyến mãi. Vui lòng thử lại sau.'
    }
    
    promotions.value = []
  } finally {
    loading.value = false
  }
}

const editPromotion = (promotion) => {
  selectedPromotion.value = promotion
  promotionForm.value = {
    name: promotion.name,
    discountType: promotion.discountType,
    discountValue: promotion.discountValue,
    startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().slice(0, 16) : '',
    endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().slice(0, 16) : ''
  }
  showEditModal.value = true
}

const deletePromotion = async (promotion) => {
  if (confirm(`Bạn có chắc muốn xóa khuyến mãi "${promotion.name}"?`)) {
    try {
      await promotionService.delete(promotion.id)
      await loadPromotions()
    } catch (err) {
      console.error('Error deleting promotion:', err)
      alert('Không thể xóa khuyến mãi. Vui lòng thử lại.')
    }
  }
}

const handleSubmit = async () => {
  try {
    const data = {
      ...promotionForm.value,
      startDate: new Date(promotionForm.value.startDate).toISOString(),
      endDate: new Date(promotionForm.value.endDate).toISOString(),
      isActive: true
    }

    if (showEditModal.value) {
      await promotionService.update(selectedPromotion.value.id, data)
    } else {
      await promotionService.create(data)
    }

    closeModal()
    await loadPromotions()
  } catch (err) {
    console.error('Error saving promotion:', err)
    alert('Không thể lưu khuyến mãi. Vui lòng thử lại.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedPromotion.value = null
  promotionForm.value = {
    name: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    startDate: '',
    endDate: ''
  }
}

const getStatusClass = (promotion) => {
  const now = new Date()
  const startDate = new Date(promotion.startDate)
  const endDate = new Date(promotion.endDate)

  if (!promotion.isActive) return 'status-inactive'
  if (now < startDate) return 'status-pending'
  if (now > endDate) return 'status-expired'
  return 'status-active'
}

const getStatusText = (promotion) => {
  const now = new Date()
  const startDate = new Date(promotion.startDate)
  const endDate = new Date(promotion.endDate)

  if (!promotion.isActive) return 'INACTIVE'
  if (now < startDate) return 'PENDING'
  if (now > endDate) return 'EXPIRED'
  return 'ACTIVE'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  loadPromotions()
})
</script>

<style scoped>
.promotion-management {
  padding: 0;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 0 0 1rem 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 2rem;
}

.promotion-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.promotion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.promotion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.promotion-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-active { background: #d1edff; color: #0c63e4; }
.status-pending { background: #fff3cd; color: #856404; }
.status-expired { background: #f8d7da; color: #721c24; }
.status-inactive { background: #e2e3e5; color: #383d41; }

.promotion-actions {
  display: flex;
  gap: 0.5rem;
}

.promotion-body {
  padding: 1.5rem;
}

.promotion-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.promotion-discount {
  text-align: center;
  margin-bottom: 1.5rem;
}

.discount-value {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.promotion-dates {
  space-y: 0.5rem;
}

.date-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  margin: 0;
  max-width: 600px;
}
</style>