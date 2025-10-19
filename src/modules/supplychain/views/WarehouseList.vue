<template>
  <div class="warehouse-list">
    <!-- Header -->
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="mb-1">
            <i class="bi bi-warehouse text-info me-2"></i>Quản lý Kho hàng
          </h2>
          <p class="text-muted mb-0">Quản lý thông tin các kho hàng và tồn kho</p>
        </div>
        <button class="btn btn-info btn-lg shadow-sm text-white" data-bs-toggle="modal" data-bs-target="#warehouseModal" @click="openModal()">
          <i class="bi bi-plus-circle me-2"></i>Thêm kho hàng
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="input-group input-group-lg">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control border-start-0 ps-0" 
            placeholder="Tìm kiếm theo tên kho, địa chỉ..."
          >
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-info" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-muted">Đang tải dữ liệu...</p>
    </div>

    <!-- Warehouse Cards Grid -->
    <div v-else>
      <transition-group name="fade-scale" tag="div" class="row g-4">
        <div 
          v-for="warehouse in filteredWarehouses" 
          :key="warehouse.id" 
          class="col-12 col-md-6 col-xl-4"
        >
          <div class="warehouse-card">
            <!-- Card Header with Gradient -->
            <div class="warehouse-header" :style="{ background: getGradient(warehouse.id) }">
              <div class="d-flex justify-content-between align-items-start">
                <div class="warehouse-icon">
                  <i class="bi bi-building"></i>
                </div>
                <div class="dropdown">
                  <button class="btn btn-sm btn-light-custom" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#warehouseModal" @click.prevent="openModal(warehouse)">
                        <i class="bi bi-pencil me-2"></i>Chỉnh sửa
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="viewInventory(warehouse)">
                        <i class="bi bi-box-seam me-2"></i>Xem tồn kho
                      </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <a class="dropdown-item text-danger" href="#" @click.prevent="handleDelete(warehouse)">
                        <i class="bi bi-trash me-2"></i>Xóa
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <h4 class="text-white mt-3 mb-2">{{ warehouse.name }}</h4>
              <p class="text-white-50 mb-0">
                <i class="bi bi-geo-alt me-1"></i>
                {{ warehouse.address }}
              </p>
            </div>

            <!-- Card Body with Stats -->
            <div class="warehouse-body">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value text-primary">{{ warehouse.totalProducts || 0 }}</div>
                  <div class="stat-label">Sản phẩm</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value text-success">{{ warehouse.totalStock || 0 }}</div>
                  <div class="stat-label">Tồn kho</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value text-warning">{{ warehouse.lowStock || 0 }}</div>
                  <div class="stat-label">Sắp hết</div>
                </div>
              </div>

              <!-- Progress Bar for Capacity -->
              <div class="capacity-info mt-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-muted small">Công suất sử dụng</span>
                  <span class="fw-bold">{{ warehouse.capacity || 0 }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div 
                    class="progress-bar" 
                    :class="getCapacityClass(warehouse.capacity)"
                    :style="{ width: (warehouse.capacity || 0) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex gap-2 mt-4">
                <button class="btn btn-outline-info btn-sm flex-grow-1" @click="viewDetails(warehouse)">
                  <i class="bi bi-eye me-1"></i>Chi tiết
                </button>
                <button class="btn btn-outline-primary btn-sm flex-grow-1" @click="viewInventory(warehouse)">
                  <i class="bi bi-box-seam me-1"></i>Tồn kho
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="filteredWarehouses.length === 0" class="text-center py-5">
        <div class="empty-state">
          <i class="bi bi-inbox display-1 text-muted mb-3"></i>
          <h4>Không tìm thấy kho hàng</h4>
          <p class="text-muted">{{ searchQuery ? 'Thử thay đổi từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm kho hàng mới' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal Add/Edit Warehouse -->
    <div class="modal fade" id="warehouseModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-gradient-info text-white border-0">
            <h5 class="modal-title">
              <i class="bi bi-{{ isEditMode ? 'pencil-square' : 'plus-circle' }} me-2"></i>
              {{ isEditMode ? 'Chỉnh sửa Kho hàng' : 'Thêm kho hàng mới' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-bold">
                    <i class="bi bi-warehouse me-2 text-info"></i>Tên kho hàng
                    <span class="text-danger">*</span>
                  </label>
                  <input v-model="form.name" type="text" class="form-control form-control-lg" required placeholder="Nhập tên kho">
                </div>
                
                <div class="col-12">
                  <label class="form-label fw-bold">
                    <i class="bi bi-geo-alt me-2 text-info"></i>Địa chỉ
                    <span class="text-danger">*</span>
                  </label>
                  <textarea v-model="form.address" class="form-control form-control-lg" rows="3" required placeholder="Nhập địa chỉ kho hàng"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 bg-light">
            <button type="button" class="btn btn-lg btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-2"></i>Hủy
            </button>
            <button type="button" class="btn btn-lg btn-info text-white" @click="handleSubmit" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-circle me-2"></i>
              {{ isEditMode ? 'Cập nhật' : 'Tạo mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { warehouseService } from '../services/supplyChainService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);

const warehouses = ref([]);
const form = ref({});
const isEditMode = ref(false);
const searchQuery = ref('');
const loading = ref(false);
const submitting = ref(false);

// Gradients for warehouse cards
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
];

onMounted(() => {
    fetchWarehouses();
    modalInstance = new Modal(modalRef.value);
});

const fetchWarehouses = async () => {
    loading.value = true;
    try {
        const response = await warehouseService.getAll();
        warehouses.value = response.data;
    } catch (error) {
        console.error(error);
        alert('❌ Lỗi tải danh sách kho hàng!');
    } finally {
        loading.value = false;
    }
};

const filteredWarehouses = computed(() => {
    if (!searchQuery.value) return warehouses.value;
    const query = searchQuery.value.toLowerCase();
    return warehouses.value.filter(w => 
        w.name?.toLowerCase().includes(query) ||
        w.address?.toLowerCase().includes(query)
    );
});

const getGradient = (id) => {
    return gradients[id % gradients.length];
};

const getCapacityClass = (capacity) => {
    if (capacity >= 80) return 'bg-danger';
    if (capacity >= 50) return 'bg-warning';
    return 'bg-success';
};

const openModal = (warehouse = null) => {
    if (warehouse) {
        isEditMode.value = true;
        form.value = { ...warehouse };
    } else {
        isEditMode.value = false;
        form.value = {};
    }
};

const handleSubmit = async () => {
    submitting.value = true;
    try {
        if (isEditMode.value) {
            await warehouseService.update(form.value.id, form.value);
            alert('✅ Cập nhật thành công!');
        } else {
            await warehouseService.create(form.value);
            alert('✅ Thêm kho hàng mới thành công!');
        }
        await fetchWarehouses();
        modalInstance.hide();
    } catch (error) {
        console.error(error);
        alert('❌ Lưu thất bại!');
    } finally {
        submitting.value = false;
    }
};

const handleDelete = async (warehouse) => {
    if(confirm(`Bạn có chắc muốn xóa kho "${warehouse.name}"?`)) {
        try {
            await warehouseService.delete(warehouse.id);
            alert('✅ Xóa thành công!');
            await fetchWarehouses();
        } catch (error) {
            console.error(error);
            alert('❌ Xóa thất bại!');
        }
    }
};

const viewDetails = (warehouse) => {
    console.log('View details:', warehouse);
};

const viewInventory = (warehouse) => {
    console.log('View inventory:', warehouse);
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

/* Warehouse Cards */
.warehouse-card {
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.warehouse-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.warehouse-header {
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.warehouse-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

.warehouse-card:hover .warehouse-header::before {
  right: 100%;
}

.warehouse-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  transition: all 0.3s ease;
}

.warehouse-card:hover .warehouse-icon {
  transform: rotate(15deg) scale(1.1);
}

.btn-light-custom {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
}

.btn-light-custom:hover {
  background: rgba(255, 255, 255, 0.5);
}

.warehouse-body {
  padding: 2rem;
  background: white;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  background: #e9ecef;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Progress Bar */
.capacity-info {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.progress {
  border-radius: 10px;
  background-color: #e9ecef;
}

.progress-bar {
  border-radius: 10px;
  transition: width 0.6s ease;
}

/* Fade Scale Animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.fade-scale-move {
  transition: transform 0.5s ease;
}

/* Modal Enhancements */
.bg-gradient-info {
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
}

.modal-content {
  border-radius: 16px;
}

/* Dropdown */
.dropdown-menu {
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 0.5rem;
}

.dropdown-item {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

/* Empty State */
.empty-state i {
  opacity: 0.3;
}

.empty-state h4 {
  color: #6c757d;
  font-weight: 600;
}

/* Form Controls */
.form-control-lg,
.form-select-lg {
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control-lg:focus {
  border-color: #00c6ff;
  box-shadow: 0 0 0 0.2rem rgba(0, 198, 255, 0.25);
}

/* Buttons */
.btn {
  border-radius: 10px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-info {
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
  border: none;
}

.btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 198, 255, 0.4);
}

.btn-outline-info:hover {
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
  border-color: transparent;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .stat-label {
    font-size: 0.65rem;
  }
}
</style>