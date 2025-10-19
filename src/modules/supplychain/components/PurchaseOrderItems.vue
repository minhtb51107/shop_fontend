<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Sản phẩm trong đơn</h5>
      <button v-if="!isOrderReadOnly" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#poItemModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm sản phẩm
      </button>
    </div>

    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th>Sản phẩm (Biến thể)</th>
          <th class="text-center">Số lượng</th>
          <th class="text-end">Đơn giá</th>
          <th class="text-end">Thành tiền</th>
          <th v-if="!isOrderReadOnly" class="text-end">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td colspan="5" class="text-center p-4"><div class="spinner-border spinner-border-sm"></div></td></tr>
        <tr v-else-if="items.length === 0"><td colspan="5" class="text-center text-muted p-4">Chưa có sản phẩm nào trong đơn.</td></tr>
        <tr v-for="item in items" :key="item.id">
          <td>
            <div class="fw-bold">{{ item.variantName || 'N/A' }}</div>
            <small class="text-muted">SKU: {{ item.variantSku }}</small>
          </td>
          <td class="text-center">{{ item.quantity }}</td>
          <td class="text-end">{{ formatCurrency(item.unitPrice) }}</td>
          <td class="text-end fw-bold">{{ formatCurrency(item.quantity * item.unitPrice) }}</td>
          <td v-if="!isOrderReadOnly" class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#poItemModal" @click="openModal(item)">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="modal fade" id="poItemModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm vào đơn' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Tìm & Chọn sản phẩm (biến thể)</label>
                <select v-model="form.variantId" class="form-select" :disabled="isEditMode" required>
                    <option disabled :value="null">-- Chọn một biến thể --</option>
                    <optgroup v-for="product in productList" :key="product.id" :label="product.name">
                        <option v-for="variant in product.variants" :key="variant.id" :value="variant.id">
                            {{ variant.sku }} - {{ variant.color || 'Mặc định' }}
                        </option>
                    </optgroup>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Số lượng</label>
                <input v-model.number="form.quantity" type="number" class="form-control" min="1" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Đơn giá nhập</label>
                <input v-model.number="form.unitPrice" type="number" class="form-control" min="0" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { purchaseOrderService } from '../services/supplyChainService';
import { productService } from '@/modules/product/services/productService';
import { Modal } from 'bootstrap';

const props = defineProps({
  purchaseOrderId: { type: [String, Number], required: true },
  orderItems: { type: Array, default: () => [] }, // Nhận items từ component cha
  isOrderReadOnly: { type: Boolean, default: false }
});
const emit = defineEmits(['items-updated']);

let modalInstance = null;
const modalRef = ref(null);

const items = ref([]);
const loading = ref(false);
const form = ref({});
const isEditMode = ref(false);
const productList = ref([]);

// Cập nhật danh sách items khi prop từ component cha thay đổi
watch(() => props.orderItems, (newItems) => {
    items.value = newItems || [];
}, { immediate: true });


onMounted(async () => {
    modalInstance = new Modal(modalRef.value);
    await fetchAllProductsAndVariants();
});

const fetchAllProductsAndVariants = async () => {
    try {
        const productRes = await productService.getAll();
        const products = Array.isArray(productRes.data) ? productRes.data : [];
        
        if (products.length === 0) {
            productList.value = [];
            return;
        }
        
        const variantPromises = products.map(async (p) => {
            try {
                const variantRes = await productService.getVariantsForProduct(p.id);
                return Array.isArray(variantRes.data) ? variantRes.data : [];
            } catch (err) {
                console.warn(`Failed to load variants for product ${p.id}:`, err);
                return [];
            }
        });
        
        const variantResponses = await Promise.all(variantPromises);
        products.forEach((p, index) => {
            p.variants = variantResponses[index] || [];
        });
        
        productList.value = products.filter(p => p.variants && p.variants.length > 0);
    } catch (error) {
        console.error("Lỗi tải danh sách sản phẩm/biến thể: ", error);
        productList.value = [];
    }
};

const openModal = (item = null) => {
    if (item) {
        isEditMode.value = true;
        // Dữ liệu cho form sửa
        form.value = {
            id: item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        };
    } else {
        isEditMode.value = false;
        // Dữ liệu cho form thêm mới
        form.value = { variantId: null, quantity: 1, unitPrice: 0 };
    }
};

const handleSubmit = async () => {
    try {
        if (isEditMode.value) {
            await purchaseOrderService.updateItem(form.value.id, form.value);
        } else {
            await purchaseOrderService.addItem(props.purchaseOrderId, form.value);
        }
        emit('items-updated'); // Báo cho component cha tải lại toàn bộ đơn hàng
        modalInstance.hide();
    } catch (error) {
        console.error("Lưu sản phẩm thất bại:", error);
        alert('Lưu sản phẩm thất bại! SKU có thể đã tồn tại.');
    }
};

const handleDelete = async (item) => {
    if(confirm(`Bạn có chắc muốn xóa sản phẩm "${item.variantName}" khỏi đơn hàng?`)) {
        try {
            await purchaseOrderService.deleteItem(item.id);
            emit('items-updated'); // Báo cho cha tải lại
        } catch (error) {
            console.error("Xóa sản phẩm thất bại:", error);
            alert('Xóa sản phẩm thất bại!');
        }
    }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};
</script>