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