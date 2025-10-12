<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Quản lý Biến thể</h4>
      <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#variantModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm biến thể
      </button>
    </div>

    <p>Thêm hoặc chỉnh sửa các phiên bản sản phẩm (ví dụ: theo màu sắc, giá tiền...).</p>

    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>SKU</th>
          <th>Màu sắc</th>
          <th>Giá bán</th>
          <th class="text-end">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="4" class="text-center">
            <div class="spinner-border spinner-border-sm"></div>
          </td>
        </tr>
        <tr v-else-if="variants.length === 0">
            <td colspan="4" class="text-center text-muted">Chưa có biến thể nào.</td>
        </tr>
        <tr v-for="variant in variants" :key="variant.id">
          <td class="fw-bold">{{ variant.sku }}</td>
          <td>{{ variant.color || 'N/A' }}</td>
          <td>{{ formatCurrency(variant.price) }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#variantModal" @click="openModal(variant)">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="handleDelete(variant)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="modal fade" id="variantModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Biến thể' : 'Thêm biến thể mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">SKU (Mã định danh sản phẩm)</label>
                <input v-model="form.sku" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Màu sắc</label>
                <input v-model="form.color" type="text" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Giá bán</label>
                <input v-model.number="form.price" type="number" class="form-control" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productService } from '../services/productService';
import { Modal } from 'bootstrap';

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  }
});

let modalInstance = null;
const modalRef = ref(null);

const variants = ref([]);
const loading = ref(false);
const form = ref({});
const isEditMode = ref(false);

onMounted(() => {
    fetchVariants();
    modalInstance = new Modal(modalRef.value);
});

const fetchVariants = async () => {
    loading.value = true;
    try {
        const response = await productService.getVariantsForProduct(props.productId);
        variants.value = response.data;
    } catch (error) {
        console.error("Lỗi tải danh sách biến thể:", error);
        alert('Không thể tải danh sách biến thể.');
    } finally {
        loading.value = false;
    }
};

const openModal = (variant = null) => {
    if (variant) {
        isEditMode.value = true;
        form.value = { ...variant };
    } else {
        isEditMode.value = false;
        form.value = { sku: '', color: '', price: 0 };
    }
};

const handleSubmit = async () => {
    try {
        if (isEditMode.value) {
            await productService.updateVariant(form.value.id, form.value);
        } else {
            await productService.createVariant(props.productId, form.value);
        }
        fetchVariants();
        modalInstance.hide();
    } catch (error) {
        console.error("Lưu biến thể thất bại:", error);
        alert('Lưu thất bại! SKU có thể đã tồn tại.');
    }
};

const handleDelete = async (variant) => {
    if(confirm(`Bạn có chắc muốn xóa biến thể với SKU "${variant.sku}"?`)) {
        try {
            await productService.deleteVariant(variant.id);
            fetchVariants();
        } catch (error) {
            console.error("Xóa biến thể thất bại:", error);
            alert('Xóa thất bại!');
        }
    }
};

const formatCurrency = (value) => {
  if (!value) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>