<template>
  <div class="purchase-order-list">
    <!-- Header -->
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="mb-1">
            <i class="bi bi-cart-check text-primary me-2"></i>Đơn Mua Hàng
          </h2>
          <p class="text-muted mb-0">Quản lý các đơn đặt hàng từ nhà cung cấp</p>
        </div>
        <router-link :to="{ name: 'purchase-order-create' }" class="btn btn-primary btn-lg shadow-sm">
          <i class="bi bi-plus-circle me-2"></i>Tạo đơn mới
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-2 col-sm-4 col-6">
        <div class="stat-card stat-card-all">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Tổng đơn</div>
        </div>
      </div>
      <div class="col-md-2 col-sm-4 col-6">
        <div class="stat-card stat-card-draft">
          <div class="stat-value">{{ stats.draft }}</div>
          <div class="stat-label">Nháp</div>
        </div>
      </div>
      <div class="col-md-2 col-sm-4 col-6">
        <div class="stat-card stat-card-submitted">
          <div class="stat-value">{{ stats.submitted }}</div>
          <div class="stat-label">Đã gửi</div>
        </div>
      </div>
      <div class="col-md-2 col-sm-4 col-6">
        <div class="stat-card stat-card-approved">
          <div class="stat-value">{{ stats.approved }}</div>
          <div class="stat-label">Đã duyệt</div>
        </div>
      </div>
      <div class="col-md-2 col-sm-4 col-6">
        <div class="stat-card stat-card-completed">
          <div class="stat-value">{{ stats.completed }}</div>
          <div class="stat-label">Hoàn thành</div>
        </div>
      </div>
      <div class="col-md-2 col-sm-4 col-6">
        <div class="stat-card stat-card-cancelled">
          <div class="stat-value">{{ stats.cancelled }}</div>
          <div class="stat-label">Đã hủy</div>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search"></i>
              </span>
              <input 
                v-model="filters.search" 
                type="text" 
                class="form-control border-start-0" 
                placeholder="Tìm mã đơn, nhà cung cấp..."
              >
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="filters.status" class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option value="DRAFT">Nháp</option>
              <option value="SUBMITTED">Đã gửi</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div class="col-md-3">
            <input v-model="filters.dateFrom" type="date" class="form-control" placeholder="Từ ngày">
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-arrow-counterclockwise me-2"></i>Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-muted">Đang tải dữ liệu...</p>
    </div>

    <!-- Orders List -->
    <div v-else class="orders-container">
      <transition-group name="list-fade" tag="div">
        <div 
          v-for="po in filteredOrders" 
          :key="po.id" 
          class="order-card card shadow-sm mb-3"
        >
          <div class="card-body">
            <div class="row align-items-center">
              <!-- Order ID & Status -->
              <div class="col-md-2">
                <div class="order-id">
                  <i class="bi bi-receipt-cutoff me-2 text-primary"></i>
                  <span class="fw-bold">#{{ po.id }}</span>
                </div>
                <span class="badge mt-2" :class="getStatusBadge(po.status)">
                  {{ getStatusText(po.status) }}
                </span>
              </div>

              <!-- Supplier Info -->
              <div class="col-md-3">
                <div class="info-item">
                  <i class="bi bi-building text-muted"></i>
                  <span class="fw-semibold">{{ po.supplierName }}</span>
                </div>
              </div>

              <!-- Dates -->
              <div class="col-md-3">
                <div class="info-item">
                  <i class="bi bi-calendar text-muted"></i>
                  <div>
                    <small class="text-muted">Ngày đặt:</small>
                    <div>{{ formatDate(po.orderDate) }}</div>
                  </div>
                </div>
              </div>

              <!-- Created By -->
              <div class="col-md-2">
                <div class="info-item">
                  <i class="bi bi-person text-muted"></i>
                  <span>{{ po.createdByName || 'N/A' }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="col-md-2 text-end">
                <router-link 
                  :to="{ name: 'purchase-order-detail', params: { id: po.id } }" 
                  class="btn btn-outline-primary btn-sm"
                >
                  <i class="bi bi-eye me-1"></i>Chi tiết
                </router-link>
              </div>
            </div>

            <!-- Progress Indicator -->
            <div class="progress mt-3" style="height: 4px;">
              <div 
                class="progress-bar" 
                :class="getProgressClass(po.status)"
                :style="{ width: getProgress(po.status) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted mb-3"></i>
        <h4>Không tìm thấy đơn mua hàng</h4>
        <p class="text-muted">{{ filters.search || filters.status ? 'Thử thay đổi bộ lọc' : 'Bắt đầu bằng cách tạo đơn mới' }}</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredOrders.length > 0" class="d-flex justify-content-center mt-4">
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage--">
                <i class="bi bi-chevron-left"></i>
              </a>
            </li>
            <li class="page-item active">
              <span class="page-link">{{ currentPage }}</span>
            </li>
            <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage++">
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { purchaseOrderService } from '../services/supplyChainService';

const purchaseOrders = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

const filters = ref({
  search: '',
  status: '',
  dateFrom: ''
});

onMounted(async () => {
  await fetchOrders();
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    // Try without sort first to avoid 500 error, then add sort if backend supports it
    const params = { 
      page: currentPage.value - 1, 
      size: 20
    };
    // Add sort only if we're sure the field exists in backend
    // params.sort = 'orderDate,desc';
    
    const response = await purchaseOrderService.getAll(params);
    
    // Handle both Page<> and List<> response formats
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data.content)) {
        // Spring Page format
        purchaseOrders.value = response.data.content;
        totalPages.value = response.data.totalPages || 1;
      } else if (Array.isArray(response.data)) {
        // Direct List format
        purchaseOrders.value = response.data;
        totalPages.value = 1;
      } else {
        purchaseOrders.value = [];
        totalPages.value = 1;
      }
    } else {
      purchaseOrders.value = [];
      totalPages.value = 1;
    }
  } catch (error) {
    console.error('Error loading purchase orders:', error);
    purchaseOrders.value = [];
    totalPages.value = 1;
    // Don't show alert for now, just log error - might be permission issue
  } finally {
    loading.value = false;
  }
};

// Computed: Filtered Orders
const filteredOrders = computed(() => {
  if (!purchaseOrders.value || !Array.isArray(purchaseOrders.value)) {
    return [];
  }
  let result = [...purchaseOrders.value];
  
  if (filters.value.search) {
    const query = filters.value.search.toLowerCase();
    result = result.filter(po => 
      po.id.toString().includes(query) ||
      po.supplierName?.toLowerCase().includes(query)
    );
  }
  
  if (filters.value.status) {
    result = result.filter(po => po.status === filters.value.status);
  }
  
  if (filters.value.dateFrom) {
    result = result.filter(po => po.orderDate >= filters.value.dateFrom);
  }
  
  return result;
});

// Computed: Stats
const stats = computed(() => {
  if (!purchaseOrders.value || !Array.isArray(purchaseOrders.value)) {
    return {
      total: 0,
      draft: 0,
      submitted: 0,
      approved: 0,
      completed: 0,
      cancelled: 0
    };
  }
  
  return {
    total: purchaseOrders.value.length,
    draft: purchaseOrders.value.filter(po => po.status === 'DRAFT').length,
    submitted: purchaseOrders.value.filter(po => po.status === 'SUBMITTED').length,
    approved: purchaseOrders.value.filter(po => po.status === 'APPROVED').length,
    completed: purchaseOrders.value.filter(po => po.status === 'COMPLETED').length,
    cancelled: purchaseOrders.value.filter(po => po.status === 'CANCELLED').length
  };
});

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    dateFrom: ''
  };
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const getStatusBadge = (status) => {
  const badges = {
    DRAFT: 'bg-secondary',
    SUBMITTED: 'bg-info',
    APPROVED: 'bg-success',
    COMPLETED: 'bg-primary',
    CANCELLED: 'bg-danger',
  };
  return badges[status] || 'bg-light text-dark';
};

const getStatusText = (status) => {
  const texts = {
    DRAFT: 'Nháp',
    SUBMITTED: 'Đã gửi',
    APPROVED: 'Đã duyệt',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  };
  return texts[status] || status;
};

const getProgressClass = (status) => {
  const classes = {
    DRAFT: 'bg-secondary',
    SUBMITTED: 'bg-info',
    APPROVED: 'bg-success',
    COMPLETED: 'bg-primary',
    CANCELLED: 'bg-danger',
  };
  return classes[status] || 'bg-secondary';
};

const getProgress = (status) => {
  const progress = {
    DRAFT: 20,
    SUBMITTED: 40,
    APPROVED: 60,
    COMPLETED: 100,
    CANCELLED: 0
  };
  return progress[status] || 0;
};
</script>

<style scoped>
/* Page Header */
.page-header {
  padding: 1.5rem 0;
  border-bottom: 2px solid #f0f0f0;
}

.page-header h2 {
  font-weight: 700;
  color: #2c3e50;
}

/* Stats Cards */
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-card-all { border-left-color: #667eea; }
.stat-card-draft { border-left-color: #6c757d; }
.stat-card-submitted { border-left-color: #17a2b8; }
.stat-card-approved { border-left-color: #28a745; }
.stat-card-completed { border-left-color: #007bff; }
.stat-card-cancelled { border-left-color: #dc3545; }

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Order Cards */
.order-card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid #667eea;
}

.order-card:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

.order-id {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
}

.info-item i {
  font-size: 1.1rem;
}

/* Progress Bar */
.progress {
  border-radius: 10px;
  background-color: #e9ecef;
}

.progress-bar {
  border-radius: 10px;
  transition: width 0.6s ease;
}

/* List Fade Animation */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.4s ease;
}

.list-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-fade-move {
  transition: transform 0.4s ease;
}

/* Badges */
.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.85rem;
}

/* Pagination */
.pagination {
  gap: 0.5rem;
}

.page-link {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  color: #667eea;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.page-link:hover {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
  transform: translateY(-2px);
}

.page-item.active .page-link {
  background-color: #667eea;
  border-color: #667eea;
}

.page-item.disabled .page-link {
  opacity: 0.5;
}

/* Form Controls */
.form-control,
.form-select {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Buttons */
.btn {
  border-radius: 10px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-outline-primary {
  border-color: #667eea;
  color: #667eea;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-value {
    font-size: 1.5rem;
  }
  
  .order-card .row > div {
    margin-bottom: 0.5rem;
  }
}
</style>