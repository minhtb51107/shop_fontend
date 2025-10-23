<template>
  <!-- Modal with Teleport -->
  <Teleport to="body">
    <div v-if="product" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="$emit('close')">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-diagram-3 me-2"></i>
            Quản lý biến thể - {{ product.name }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <!-- Product Info -->
          <div class="alert alert-info mb-3">
            <strong>Sản phẩm:</strong> {{ product.name }} | 
            <strong>SKU:</strong> {{ product.skuPrefix }} | 
            <strong>Danh mục:</strong> {{ product.category?.name }}
          </div>

          <!-- Header Actions -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0">Danh sách biến thể sản phẩm</h6>
            <button class="btn btn-primary btn-sm" @click="openAddModal()">
              <i class="bi bi-plus-lg me-2"></i>Thêm biến thể
            </button>
          </div>

          <!-- Variants Table -->
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>SKU</th>
                  <th>Màu sắc</th>
                  <th>Giá bán</th>
                  <th>Tồn kho</th>
                  <th class="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="6" class="text-center py-4">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="variants.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    <i class="bi bi-box-seam display-6 text-muted"></i>
                    <div class="mt-2">Chưa có biến thể nào</div>
                    <button class="btn btn-sm btn-outline-primary mt-2" @click="openAddModal()">
                      <i class="bi bi-plus-lg me-1"></i>Thêm biến thể đầu tiên
                    </button>
                  </td>
                </tr>
                <tr v-for="variant in variants" :key="variant.id">
                  <td>
                    <span class="badge bg-light text-dark">{{ variant.id }}</span>
                  </td>
                  <td>
                    <code class="fw-bold">{{ variant.sku }}</code>
                  </td>
                  <td>
                    <span v-if="variant.color" class="badge bg-secondary">
                      {{ variant.color }}
                    </span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td>
                    <strong class="text-success">{{ formatCurrency(variant.price) }}</strong>
                  </td>
                  <td>
                    <span class="badge bg-info">{{ getTotalStock(variant.id) || 0 }} sản phẩm</span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group" role="group">
                      <button 
                        class="btn btn-sm btn-outline-secondary" 
                        title="Chỉnh sửa"
                        @click="openEditModal(variant)"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger" 
                        title="Xóa"
                        @click="confirmDelete(variant)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            <i class="bi bi-x-lg me-2"></i>Đóng
          </button>
        </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Add/Edit Variant Modal with Teleport -->
  <Teleport to="body">
    <div v-if="showVariantForm" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="closeVariantForm">
      <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Chỉnh sửa biến thể' : 'Thêm biến thể mới' }}
          </h5>
          <button type="button" class="btn-close" @click="closeVariantForm"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">SKU <span class="text-danger">*</span></label>
              <input 
                v-model="form.sku" 
                type="text" 
                class="form-control" 
                :class="{ 'is-invalid': errors.sku }"
                placeholder="VD: IPHONE15-RED-128GB"
                required
              >
              <div v-if="errors.sku" class="invalid-feedback">{{ errors.sku }}</div>
              <div class="form-text">Mã định danh duy nhất cho biến thể này</div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Màu sắc</label>
              <input 
                v-model="form.color" 
                type="text" 
                class="form-control"
                placeholder="VD: Đỏ, Xanh, Vàng, Bạc..."
              >
              <div class="form-text">Màu sắc hoặc đặc điểm phân biệt</div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Giá bán (VND) <span class="text-danger">*</span></label>
              <input 
                v-model.number="form.price" 
                type="number" 
                class="form-control" 
                :class="{ 'is-invalid': errors.price }"
                min="0"
                step="1000"
                required
              >
              <div v-if="errors.price" class="invalid-feedback">{{ errors.price }}</div>
              <div class="form-text">Giá bán cho khách hàng cuối</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeVariantForm">
            Hủy
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            :disabled="submitting"
            @click="handleSubmit"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEditMode ? 'Cập nhật' : 'Thêm biến thể' }}
          </button>
        </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { productService } from '../services/productService';
import { inventoryService } from '../../supplychain/services/supplyChainService';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'updated']);

// State
const variants = ref([]);
const loading = ref(false);
const showVariantForm = ref(false);
const isEditMode = ref(false);
const submitting = ref(false);
const errors = ref({});
const isMounted = ref(true); // Track if component is mounted

// Form data
const form = ref({
  id: null,
  sku: '',
  color: '',
  price: 0
});

// Stock data
const inventory = ref({});

// Methods
const fetchVariants = async () => {
  if (!props.product?.id || !isMounted.value) return;
  
  loading.value = true;
  try {
    const response = await productService.getVariantsForProduct(props.product.id);
    if (!isMounted.value) return; // Check if still mounted
    
    variants.value = response.data || [];
    
    // Load inventory data for all variants
    await loadInventoryData();
  } catch (error) {
    if (!isMounted.value) return; // Don't log if unmounted
    console.error("Failed to fetch variants:", error);
  } finally {
    if (isMounted.value) {
      loading.value = false;
    }
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  form.value = {
    id: null,
    sku: '',
    color: '',
    price: 0
  };
  errors.value = {};
  showVariantForm.value = true;
};

const openEditModal = (variant) => {
  isEditMode.value = true;
  form.value = {
    id: variant.id,
    sku: variant.sku,
    color: variant.color || '',
    price: variant.price
  };
  errors.value = {};
  showVariantForm.value = true;
};

const closeVariantForm = () => {
  showVariantForm.value = false;
  errors.value = {};
};

const handleSubmit = async () => {
  submitting.value = true;
  errors.value = {};

  try {
    // Validation
    if (!form.value.sku.trim()) {
      errors.value.sku = 'SKU không được để trống';
    }
    if (!form.value.price || form.value.price <= 0) {
      errors.value.price = 'Giá phải lớn hơn 0';
    }

    if (Object.keys(errors.value).length > 0) {
      submitting.value = false;
      return;
    }

    if (isEditMode.value) {
      await productService.updateVariant(form.value.id, {
        sku: form.value.sku,
        color: form.value.color,
        price: form.value.price
      });
    } else {
      await productService.createVariant(props.product.id, {
        sku: form.value.sku,
        color: form.value.color,
        price: form.value.price
      });
    }

    closeVariantForm();
    await fetchVariants();
    emit('updated');
  } catch (error) {
    console.error('Failed to save variant:', error);
    if (error.response?.data?.message) {
      errors.value.sku = error.response.data.message;
    } else {
      errors.value.sku = 'Lưu thất bại! SKU có thể đã tồn tại.';
    }
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = async (variant) => {
  if (confirm(`Bạn có chắc muốn xóa biến thể "${variant.sku}"?\n\nHành động này không thể hoàn tác.`)) {
    try {
      await productService.deleteVariant(variant.id);
      await fetchVariants();
      emit('updated');
    } catch (error) {
      console.error('Failed to delete variant:', error);
      alert('Xóa thất bại! Biến thể có thể đang được sử dụng trong đơn hàng.');
    }
  }
};

// Load inventory data for all variants
const loadInventoryData = async () => {
  if (!variants.value.length || !isMounted.value) return;
  
  try {
    for (const variant of variants.value) {
      if (!isMounted.value) return; // Stop if component unmounted
      
      const response = await inventoryService.getAll({ variantId: variant.id });
      if (!isMounted.value) return; // Check again after async operation
      
      let totalStock = 0;
      
      if (response.data && Array.isArray(response.data.content)) {
        totalStock = response.data.content.reduce((total, item) => total + (item.quantityOnHand || 0), 0);
      } else if (Array.isArray(response.data)) {
        totalStock = response.data.reduce((total, item) => total + (item.quantityOnHand || 0), 0);
      }
      
      if (isMounted.value) {
        inventory.value[variant.id] = totalStock;
      }
    }
  } catch (error) {
    if (isMounted.value) {
      console.warn('Failed to load inventory data:', error);
    }
  }
};

const getTotalStock = (variantId) => {
  return inventory.value[variantId] || 0;
};

const formatCurrency = (value) => {
  if (!value) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

// Watch for product changes
let stopWatch = null;
stopWatch = watch(() => props.product, (newProduct) => {
  if (newProduct && isMounted.value) {
    fetchVariants();
  }
}, { immediate: true });

// Lifecycle
onMounted(() => {
  if (props.product) {
    fetchVariants();
  }
});

// Cleanup on unmount
onBeforeUnmount(() => {
  // Mark as unmounted to prevent state updates
  isMounted.value = false;
  
  // Stop watcher
  if (stopWatch) {
    stopWatch();
  }
  
  // Close any open modals
  showVariantForm.value = false;
  
  // Clear data
  variants.value = [];
  inventory.value = {};
});
</script>