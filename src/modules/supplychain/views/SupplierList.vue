<template>
  <div class="supplier-list">
    <!-- Header Section with Gradient -->
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="mb-1">
            <i class="bi bi-truck text-primary me-2"></i>Quản lý Nhà cung cấp
          </h2>
          <p class="text-muted mb-0">Quản lý thông tin các nhà cung cấp của bạn</p>
        </div>
        <button class="btn btn-primary btn-lg shadow-sm" data-bs-toggle="modal" data-bs-target="#supplierModal" @click="openModal()">
          <i class="bi bi-plus-circle me-2"></i>Thêm nhà cung cấp
        </button>
      </div>
    </div>

    <!-- Search & Filter Section -->
    <div class="card shadow-sm mb-4 search-card">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control border-start-0 ps-0" 
                placeholder="Tìm kiếm theo tên, email, người liên hệ..."
                @input="handleSearch"
              >
            </div>
          </div>
          <div class="col-md-4">
            <select v-model="sortBy" class="form-select form-select-lg" @change="handleSort">
              <option value="name">Sắp xếp theo tên</option>
              <option value="created">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Đang tải dữ liệu...</p>
    </div>

    <!-- Suppliers Grid -->
    <div v-else>
      <transition-group name="fade-slide" tag="div" class="row g-4">
        <div 
          v-for="supplier in filteredSuppliers" 
          :key="supplier.id" 
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="supplier-card card shadow-hover h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="supplier-icon">
                  <i class="bi bi-building"></i>
                </div>
                <div class="dropdown">
                  <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#supplierModal" @click.prevent="openModal(supplier)">
                        <i class="bi bi-pencil me-2"></i>Chỉnh sửa
                      </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <a class="dropdown-item text-danger" href="#" @click.prevent="handleDelete(supplier)">
                        <i class="bi bi-trash me-2"></i>Xóa
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <h5 class="card-title mb-3">{{ supplier.name }}</h5>
              
              <div class="supplier-info">
                <div class="info-item" v-if="supplier.contactPerson">
                  <i class="bi bi-person text-muted"></i>
                  <span>{{ supplier.contactPerson }}</span>
                </div>
                <div class="info-item" v-if="supplier.email">
                  <i class="bi bi-envelope text-muted"></i>
                  <span>{{ supplier.email }}</span>
                </div>
              </div>
            </div>

            <div class="card-footer bg-light border-0">
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  <i class="bi bi-box-seam me-1"></i>{{ supplier.totalOrders || 0 }} đơn hàng
                </small>
                <button class="btn btn-sm btn-primary" @click="viewDetails(supplier)">
                  Chi tiết <i class="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="filteredSuppliers.length === 0" class="text-center py-5">
        <div class="empty-state">
          <i class="bi bi-inbox display-1 text-muted mb-3"></i>
          <h4>Không tìm thấy nhà cung cấp</h4>
          <p class="text-muted">{{ searchQuery ? 'Thử thay đổi từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm nhà cung cấp mới' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal Add/Edit Supplier -->
    <div class="modal fade" id="supplierModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-gradient-primary text-white border-0">
            <h5 class="modal-title">
              <i class="bi bi-{{ isEditMode ? 'pencil-square' : 'plus-circle' }} me-2"></i>
              {{ isEditMode ? 'Chỉnh sửa Nhà cung cấp' : 'Thêm nhà cung cấp mới' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-bold">
                    <i class="bi bi-building me-2 text-primary"></i>Tên nhà cung cấp
                    <span class="text-danger">*</span>
                  </label>
                  <input v-model="form.name" type="text" class="form-control form-control-lg" required placeholder="Nhập tên nhà cung cấp">
                </div>
                
                <div class="col-md-6">
                  <label class="form-label fw-bold">
                    <i class="bi bi-person me-2 text-primary"></i>Người liên hệ
                  </label>
                  <input v-model="form.contactPerson" type="text" class="form-control form-control-lg" placeholder="Tên người liên hệ">
                </div>
                
                <div class="col-md-6">
                  <label class="form-label fw-bold">
                    <i class="bi bi-envelope me-2 text-primary"></i>Email
                  </label>
                  <input v-model="form.email" type="email" class="form-control form-control-lg" placeholder="email@example.com">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 bg-light">
            <button type="button" class="btn btn-lg btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-2"></i>Hủy
            </button>
            <button type="button" class="btn btn-lg btn-primary" @click="handleSubmit" :disabled="submitting">
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
import { supplierService } from '../services/supplyChainService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);

const suppliers = ref([]);
const form = ref({});
const isEditMode = ref(false);
const searchQuery = ref('');
const sortBy = ref('name');
const loading = ref(false);
const submitting = ref(false);

onMounted(() => {
    fetchSuppliers();
    modalInstance = new Modal(modalRef.value);
});

const fetchSuppliers = async () => {
    loading.value = true;
    try {
        const response = await supplierService.getAll();
        suppliers.value = response.data;
    } catch (error) {
        console.error(error);
        showNotification('Lỗi tải danh sách nhà cung cấp!', 'error');
    } finally {
        loading.value = false;
    }
};

// Computed property for filtered and sorted suppliers
const filteredSuppliers = computed(() => {
    let result = [...suppliers.value];
    
    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(s => 
            s.name?.toLowerCase().includes(query) ||
            s.email?.toLowerCase().includes(query) ||
            s.contactPerson?.toLowerCase().includes(query)
        );
    }
    
    // Sort
    if (sortBy.value === 'name') {
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy.value === 'created') {
        result.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortBy.value === 'oldest') {
        result.sort((a, b) => (a.id || 0) - (b.id || 0));
    }
    
    return result;
});

const handleSearch = () => {
    // Triggered by input event
};

const handleSort = () => {
    // Triggered by select change
};

const openModal = (supplier = null) => {
    if (supplier) {
        isEditMode.value = true;
        form.value = { ...supplier };
    } else {
        isEditMode.value = false;
        form.value = {};
    }
};

const handleSubmit = async () => {
    submitting.value = true;
    try {
        if (isEditMode.value) {
            await supplierService.update(form.value.id, form.value);
            showNotification('Cập nhật thành công!', 'success');
        } else {
            await supplierService.create(form.value);
            showNotification('Thêm nhà cung cấp mới thành công!', 'success');
        }
        await fetchSuppliers();
        modalInstance.hide();
    } catch (error) {
        console.error(error);
        showNotification(error.response?.data?.message || 'Có lỗi xảy ra!', 'error');
    } finally {
        submitting.value = false;
    }
};

const handleDelete = async (supplier) => {
    if(confirm(`Bạn có chắc muốn xóa nhà cung cấp "${supplier.name}"?`)) {
        try {
            await supplierService.delete(supplier.id);
            showNotification('Xóa thành công!', 'success');
            await fetchSuppliers();
        } catch (error) {
            console.error(error);
            showNotification('Xóa thất bại!', 'error');
        }
    }
};

const viewDetails = (supplier) => {
    // Navigate to supplier details page or show details modal
    console.log('View supplier details:', supplier);
};

const showNotification = (message, type = 'info') => {
    // Simple alert for now - you can integrate toast library later
    if (type === 'error') {
        alert('❌ ' + message);
    } else if (type === 'success') {
        alert('✅ ' + message);
    } else {
        alert(message);
    }
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

/* Search Card */
.search-card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.input-group-text {
  border-right: 0;
}

/* Supplier Cards */
.supplier-card {
  border: none;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.supplier-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15) !important;
}

.shadow-hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.supplier-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.supplier-card:hover .supplier-icon {
  transform: rotate(5deg) scale(1.1);
}

.supplier-info .info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.supplier-info .info-item i {
  font-size: 1.1rem;
}

/* Fade Slide Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-move {
  transition: transform 0.4s ease;
}

/* Empty State */
.empty-state i {
  opacity: 0.3;
}

.empty-state h4 {
  color: #6c757d;
  font-weight: 600;
}

/* Modal Enhancements */
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modal-content {
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem 2rem;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

/* Form Styling */
.form-control-lg,
.form-select-lg {
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control-lg:focus,
.form-select-lg:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Button Enhancements */
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

.btn-primary:disabled {
  opacity: 0.6;
  transform: none;
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

/* Loading Spinner */
.spinner-border {
  animation: spinner-border 0.75s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .supplier-card {
    margin-bottom: 1rem;
  }
  
  .page-header h2 {
    font-size: 1.5rem;
  }
}
</style>