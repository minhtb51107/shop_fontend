<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <router-link :to="{ name: 'purchase-orders-list' }" class="btn btn-outline-secondary me-3">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div>
          <h2 class="mb-0">{{ isEditMode ? `Chi tiết Đơn Mua Hàng #${id}` : 'Tạo Đơn Mua Hàng Mới' }}</h2>
          <span v-if="isEditMode && purchaseOrder.status" class="badge fs-6" :class="getStatusClass(purchaseOrder.status)">
            {{ getStatusText(purchaseOrder.status) }}
          </span>
        </div>
      </div>
      <div v-if="isEditMode">
        <button v-if="canBeApproved" class="btn btn-success me-2" @click="approveOrder" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-circle me-1"></i>
            Duyệt đơn
        </button>
        <button v-if="canBeCancelled" class="btn btn-danger" @click="cancelOrder" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-x-circle me-1"></i>
            Hủy đơn
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <PurchaseOrderItems 
                v-if="isEditMode" 
                :purchase-order-id="id" 
                :order-items="purchaseOrder.items"
                :is-order-read-only="!canEditItems"
                @items-updated="reloadOrder"
            />
            <div v-else class="text-center text-muted p-5">
                Vui lòng lưu thông tin chung trước khi thêm sản phẩm.
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-header"><h5 class="mb-0">Thông tin chung</h5></div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Nhà cung cấp</label>
              <select v-model="form.supplierId" class="form-select" :disabled="isEditMode" required>
                <option disabled :value="null">-- Chọn nhà cung cấp --</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option>
              </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Ngày giao hàng dự kiến</label>
                <input v-model="form.expectedDeliveryDate" type="date" class="form-control" :disabled="!canEditInfo">
            </div>
             <div v-if="isEditMode" class="mb-3">
                <label class="form-label">Ngày đặt hàng</label>
                <input :value="formatDate(purchaseOrder.orderDate)" type="text" class="form-control" disabled>
            </div>
             <div v-if="isEditMode" class="mb-3">
                <label class="form-label">Người tạo</label>
                <input :value="purchaseOrder.createdByName" type="text" class="form-control" disabled>
            </div>
            <button v-if="!isEditMode" class="btn btn-primary w-100" @click="createOrder" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
                Lưu và Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { purchaseOrderService, supplierService } from '../services/supplyChainService';
import PurchaseOrderItems from '../components/PurchaseOrderItems.vue';

const props = defineProps({ id: String });
const router = useRouter();

const isEditMode = computed(() => !!props.id);

const purchaseOrder = ref({});
const form = ref({});
const suppliers = ref([]);
const loading = ref(false);
const isSaving = ref(false);

const canEditInfo = computed(() => !isEditMode.value || purchaseOrder.value.status === 'DRAFT');
const canEditItems = computed(() => isEditMode.value && purchaseOrder.value.status === 'DRAFT');
const canBeApproved = computed(() => isEditMode.value && (purchaseOrder.value.status === 'DRAFT' || purchaseOrder.value.status === 'SUBMITTED'));
const canBeCancelled = computed(() => isEditMode.value && (purchaseOrder.value.status === 'DRAFT' || purchaseOrder.value.status === 'APPROVED'));

const loadData = async () => {
    loading.value = true;
    try {
        const supplierRes = await supplierService.getAll();
        suppliers.value = supplierRes.data;

        if (isEditMode.value) {
            await reloadOrder();
        } else {
            form.value = { supplierId: null, expectedDeliveryDate: '' };
        }
    } catch (error) {
        console.error(error);
        alert('Không thể tải dữ liệu.');
    } finally {
        loading.value = false;
    }
};

const reloadOrder = async () => {
    if (!props.id) return;
    try {
        const poRes = await purchaseOrderService.getById(props.id);
        purchaseOrder.value = poRes.data;
    } catch(e) {
        console.error(e);
        alert("Không thể tải lại thông tin đơn hàng!");
    }
};

onMounted(loadData);

const createOrder = async () => {
    if (!form.value.supplierId) {
        alert('Vui lòng chọn nhà cung cấp.');
        return;
    }
    isSaving.value = true;
    try {
        const response = await purchaseOrderService.create({ 
            supplierId: form.value.supplierId,
            expectedDeliveryDate: form.value.expectedDeliveryDate || null
        });
        router.push({ name: 'purchase-order-detail', params: { id: response.data.id } });
    } catch (error) {
        alert('Tạo đơn hàng thất bại.');
    } finally {
        isSaving.value = false;
    }
};

const approveOrder = async () => {
    if (confirm('Bạn có chắc muốn DUYỆT đơn hàng này?')) {
        isSaving.value = true;
        try {
            const response = await purchaseOrderService.approve(props.id);
            purchaseOrder.value = response.data;
        } catch (error) {
            alert('Duyệt đơn hàng thất bại!');
        } finally {
            isSaving.value = false;
        }
    }
};

const cancelOrder = async () => {
    if (confirm('Bạn có chắc muốn HỦY đơn hàng này?')) {
        isSaving.value = true;
        try {
            const response = await purchaseOrderService.cancel(props.id);
            purchaseOrder.value = response.data;
        } catch (error) {
            alert('Hủy đơn hàng thất bại!');
        } finally {
            isSaving.value = false;
        }
    }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};
const getStatusClass = (status) => {
    const classes = { DRAFT: 'bg-secondary', SUBMITTED: 'bg-info text-dark', APPROVED: 'bg-success', COMPLETED: 'bg-primary', CANCELLED: 'bg-danger' };
    return classes[status] || 'bg-light text-dark';
};
const getStatusText = (status) => {
    const texts = { DRAFT: 'Nháp', SUBMITTED: 'Đã gửi', APPROVED: 'Đã duyệt', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy' };
    return texts[status] || status;
}
</script>

<style scoped>
/* Page Layout */
h2 {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.75rem;
}

.badge {
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
}

/* Cards */
.card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.25rem 1.5rem;
  border-radius: 16px 16px 0 0;
}

.card-header h5 {
  margin: 0;
  font-weight: 600;
}

.card-body {
  padding: 1.5rem;
}

/* Form Elements */
.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-control,
.form-select {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  padding: 0.65rem 1rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

/* Buttons */
.btn {
  border-radius: 10px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  border: none;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(86, 171, 47, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
  border: none;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 9, 121, 0.4);
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
  background: white;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
  transform: translateX(-3px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Loading Spinner */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Back Button Animation */
.btn-outline-secondary {
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover i {
  transform: translateX(-3px);
}

/* Status Badges */
.bg-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%) !important;
}

.bg-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
}

.bg-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
}

.bg-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
}

.bg-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
}

/* Responsive */
@media (max-width: 992px) {
  .col-lg-4 {
    margin-top: 1rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .badge {
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
  }
}
</style>