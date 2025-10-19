<template>
  <div class="goods-receipt-list">
    <!-- Header -->
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="mb-1">
            <i class="bi bi-box-seam text-success me-2"></i>Phiếu Nhập Kho
          </h2>
          <p class="text-muted mb-0">Theo dõi các phiếu nhập hàng vào kho</p>
        </div>
        <button class="btn btn-success btn-lg shadow-sm" data-bs-toggle="modal" data-bs-target="#receiptModal" @click="openModal()">
          <i class="bi bi-plus-circle me-2"></i>Tạo phiếu nhập
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="bi bi-receipt"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.total }}</h3>
            <p>Tổng phiếu</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.completed }}</h3>
            <p>Đã hoàn thành</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-warning">
            <i class="bi bi-clock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.pending }}</h3>
            <p>Đang xử lý</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-info">
            <i class="bi bi-box"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.items }}</h3>
            <p>Sản phẩm nhập</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input 
              v-model="filters.search" 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm mã phiếu, kho..."
            >
          </div>
          <div class="col-md-3">
            <select v-model="filters.warehouse" class="form-select">
              <option value="">Tất cả kho</option>
              <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filters.status" class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="PENDING">Đang xử lý</option>
            </select>
          </div>
          <div class="col-md-2">
            <input v-model="filters.date" type="date" class="form-control">
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-muted">Đang tải dữ liệu...</p>
    </div>

    <!-- Receipts Timeline -->
    <div v-else class="receipts-container">
      <transition-group name="list" tag="div">
        <div v-for="receipt in filteredReceipts" :key="receipt.id" class="receipt-item">
          <div class="receipt-timeline">
            <div class="timeline-dot" :class="getStatusClass(receipt.status)"></div>
            <div class="timeline-line"></div>
          </div>
          
          <div class="receipt-card card shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <!-- Receipt Info -->
                <div class="col-md-3">
                  <div class="receipt-header">
                    <h5 class="mb-2">
                      <i class="bi bi-receipt me-2 text-success"></i>
                      Phiếu #{{ receipt.id }}
                    </h5>
                    <span class="badge" :class="getBadgeClass(receipt.status)">
                      {{ getStatusText(receipt.status) }}
                    </span>
                  </div>
                </div>

                <!-- Warehouse & PO Info -->
                <div class="col-md-4">
                  <div class="info-group">
                    <div class="info-item">
                      <i class="bi bi-warehouse text-muted"></i>
                      <span>{{ receipt.warehouseName }}</span>
                    </div>
                    <div class="info-item">
                      <i class="bi bi-file-text text-muted"></i>
                      <span>ĐH #{{ receipt.purchaseOrderId || 'N/A' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Date & Employee -->
                <div class="col-md-3">
                  <div class="info-group">
                    <div class="info-item">
                      <i class="bi bi-calendar text-muted"></i>
                      <span>{{ formatDate(receipt.receiptDate) }}</span>
                    </div>
                    <div class="info-item">
                      <i class="bi bi-person text-muted"></i>
                      <span>{{ receipt.employeeName }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="col-md-2 text-end">
                  <button class="btn btn-outline-primary btn-sm me-2" @click="viewDetails(receipt)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="deleteReceipt(receipt)" v-if="receipt.status === 'PENDING'">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Items Summary -->
              <div class="mt-3 pt-3 border-top">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">
                    <i class="bi bi-box me-2"></i>
                    {{ receipt.totalItems || 0 }} sản phẩm
                  </span>
                  <button class="btn btn-sm btn-link" @click="toggleItems(receipt.id)">
                    <i class="bi" :class="expandedItems.includes(receipt.id) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                    {{ expandedItems.includes(receipt.id) ? 'Thu gọn' : 'Xem chi tiết' }}
                  </button>
                </div>

                <!-- Expanded Items -->
                <transition name="expand">
                  <div v-if="expandedItems.includes(receipt.id)" class="items-detail mt-3">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>SKU</th>
                          <th class="text-end">Số lượng</th>
                          <th class="text-end">Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in receipt.items" :key="item.id">
                          <td>{{ item.productName }}</td>
                          <td><code>{{ item.sku }}</code></td>
                          <td class="text-end">{{ item.quantity }}</td>
                          <td class="text-end">{{ formatCurrency(item.unitCost) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="filteredReceipts.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted mb-3"></i>
        <h4>Không có phiếu nhập kho</h4>
        <p class="text-muted">Bắt đầu bằng cách tạo phiếu nhập kho mới</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="receiptModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>Tạo phiếu nhập kho mới
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Kho nhận <span class="text-danger">*</span></label>
                  <select v-model="form.warehouseId" class="form-select form-select-lg" required>
                    <option value="">Chọn kho</option>
                    <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Đơn đặt hàng</label>
                  <select v-model="form.purchaseOrderId" class="form-select form-select-lg">
                    <option value="">Không liên kết</option>
                    <option v-for="po in purchaseOrders" :key="po.id" :value="po.id">ĐH #{{ po.id }}</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label fw-bold">Ngày nhập</label>
                  <input v-model="form.receiptDate" type="date" class="form-control form-control-lg" required>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-success" @click="handleSubmit" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              Tạo phiếu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { goodsReceiptService, warehouseService, purchaseOrderService } from '../services/supplyChainService';

const modalRef = ref(null);
let modalInstance = null;

const loading = ref(false);
const submitting = ref(false);
const receipts = ref([]);
const warehouses = ref([]);
const purchaseOrders = ref([]);
const expandedItems = ref([]);

const form = ref({
  warehouseId: '',
  purchaseOrderId: '',
  receiptDate: new Date().toISOString().split('T')[0]
});

const filters = ref({
  search: '',
  warehouse: '',
  status: '',
  date: ''
});

const stats = computed(() => {
  if (!receipts.value || !Array.isArray(receipts.value)) {
    return {
      total: 0,
      completed: 0,
      pending: 0,
      items: 0
    };
  }
  
  return {
    total: receipts.value.length,
    completed: receipts.value.filter(r => r.status === 'COMPLETED').length,
    pending: receipts.value.filter(r => r.status === 'PENDING').length,
    items: receipts.value.reduce((sum, r) => sum + (r.totalItems || 0), 0)
  };
});

const filteredReceipts = computed(() => {
  if (!receipts.value || !Array.isArray(receipts.value)) {
    return [];
  }
  
  return receipts.value.filter(r => {
    if (filters.value.search && !r.id.toString().includes(filters.value.search)) return false;
    if (filters.value.warehouse && r.warehouseId !== filters.value.warehouse) return false;
    if (filters.value.status && r.status !== filters.value.status) return false;
    if (filters.value.date && r.receiptDate !== filters.value.date) return false;
    return true;
  });
});

onMounted(() => {
  fetchData();
  modalInstance = new Modal(modalRef.value);
});

const fetchData = async () => {
  loading.value = true;
  try {
    // Load goods receipts from API
    const receiptsResponse = await goodsReceiptService.getAll({ 
      page: 0, 
      size: 100 
    });
    
    // Handle both Page<> and List<> response formats
    if (receiptsResponse.data && typeof receiptsResponse.data === 'object') {
      if (Array.isArray(receiptsResponse.data.content)) {
        receipts.value = receiptsResponse.data.content;
      } else if (Array.isArray(receiptsResponse.data)) {
        receipts.value = receiptsResponse.data;
      } else {
        receipts.value = [];
      }
    } else {
      receipts.value = [];
    }

    // Load warehouses for dropdown
    try {
      const warehousesResponse = await warehouseService.getAll();
      warehouses.value = Array.isArray(warehousesResponse.data?.content) 
        ? warehousesResponse.data.content 
        : Array.isArray(warehousesResponse.data) 
        ? warehousesResponse.data 
        : [];
    } catch (err) {
      console.warn('Failed to load warehouses:', err);
      warehouses.value = [];
    }

    // Load purchase orders for dropdown (only approved ones)
    try {
      const purchaseOrdersResponse = await purchaseOrderService.getAll({ 
        page: 0, 
        size: 100 
      });
      const allOrders = Array.isArray(purchaseOrdersResponse.data?.content) 
        ? purchaseOrdersResponse.data.content 
        : Array.isArray(purchaseOrdersResponse.data) 
        ? purchaseOrdersResponse.data 
        : [];
      
      // Filter only approved purchase orders that can be used for goods receipt
      purchaseOrders.value = allOrders.filter(po => 
        po.status === 'APPROVED' || po.status === 'COMPLETED'
      );
    } catch (err) {
      console.warn('Failed to load purchase orders:', err);
      purchaseOrders.value = [];
    }

  } catch (error) {
    console.error('Error loading goods receipts:', error);
    receipts.value = [];
    warehouses.value = [];
    purchaseOrders.value = [];
  } finally {
    loading.value = false;
  }
};

const toggleItems = (id) => {
  const index = expandedItems.value.indexOf(id);
  if (index > -1) {
    expandedItems.value.splice(index, 1);
  } else {
    expandedItems.value.push(id);
  }
};

const getStatusClass = (status) => {
  return {
    'dot-success': status === 'COMPLETED',
    'dot-warning': status === 'PENDING'
  };
};

const getBadgeClass = (status) => {
  return status === 'COMPLETED' ? 'badge-success' : 'badge-warning';
};

const getStatusText = (status) => {
  return status === 'COMPLETED' ? 'Hoàn thành' : 'Đang xử lý';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const openModal = () => {
  form.value = {
    warehouseId: '',
    purchaseOrderId: '',
    receiptDate: new Date().toISOString().split('T')[0]
  };
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    // Validate form
    if (!form.value.warehouseId || !form.value.receiptDate) {
      alert('Vui lòng chọn kho và ngày nhập');
      return;
    }

    // Create goods receipt data
    const receiptData = {
      warehouseId: parseInt(form.value.warehouseId),
      purchaseOrderId: form.value.purchaseOrderId ? parseInt(form.value.purchaseOrderId) : null,
      receiptDate: form.value.receiptDate
    };

    // API call to create goods receipt
    await goodsReceiptService.create(receiptData);
    
    modalInstance.hide();
    await fetchData(); // Reload data
    alert('Tạo phiếu nhập kho thành công!');
  } catch (error) {
    console.error('Error creating goods receipt:', error);
    alert('Có lỗi xảy ra khi tạo phiếu nhập kho');
  } finally {
    submitting.value = false;
  }
};

const viewDetails = (receipt) => {
  console.log('View details:', receipt);
};

const deleteReceipt = async (receipt) => {
  if (confirm(`Xóa phiếu nhập #${receipt.id}?`)) {
    try {
      await goodsReceiptService.delete(receipt.id);
      await fetchData(); // Reload data
      alert('Xóa phiếu nhập kho thành công!');
    } catch (error) {
      console.error('Error deleting goods receipt:', error);
      alert('Có lỗi xảy ra khi xóa phiếu nhập kho');
    }
  }
};
</script>

<style scoped>
/* Stats Cards */
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-icon.bg-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.bg-success { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
.stat-icon.bg-warning { background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%); }
.stat-icon.bg-info { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); }

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Timeline */
.receipts-container {
  position: relative;
}

.receipt-item {
  display: flex;
  margin-bottom: 2rem;
  position: relative;
}

.receipt-timeline {
  position: relative;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #e0e0e0;
  z-index: 2;
}

.timeline-dot.dot-success {
  background: #28a745;
  box-shadow: 0 0 0 3px #28a745;
}

.timeline-dot.dot-warning {
  background: #ffc107;
  box-shadow: 0 0 0 3px #ffc107;
}

.timeline-line {
  position: absolute;
  top: 20px;
  width: 2px;
  height: calc(100% + 2rem);
  background: #e0e0e0;
}

.receipt-card {
  flex: 1;
  margin-left: 1.5rem;
  border: none;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.receipt-card:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

/* Info Items */
.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.info-item i {
  font-size: 1rem;
}

/* Badges */
.badge-success {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
}

.badge-warning {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
}

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Responsive */
@media (max-width: 768px) {
  .receipt-timeline {
    display: none;
  }
  
  .receipt-card {
    margin-left: 0;
  }
}
</style>

