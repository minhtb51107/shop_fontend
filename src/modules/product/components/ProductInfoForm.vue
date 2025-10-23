<template>
  <form @submit.prevent="saveProduct" novalidate>
    <!-- Basic Info Section -->
    <div class="row mb-4">
      <div class="col-12">
        <h6 class="text-primary mb-3">
          <i class="bi bi-info-circle me-2"></i>Thông tin cơ bản
        </h6>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 mb-3">
        <label class="form-label">
          Tên sản phẩm <span class="text-danger">*</span>
        </label>
        <input 
          v-model="product.name" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors.name }"
          placeholder="VD: iPhone 15 Pro Max 256GB"
          required
        >
        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">
          Tiền tố SKU <span class="text-danger">*</span>
        </label>
        <input 
          v-model="product.skuPrefix" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors.skuPrefix }"
          placeholder="VD: IPHONE15PM"
          required
        >
        <div v-if="errors.skuPrefix" class="invalid-feedback">{{ errors.skuPrefix }}</div>
        <div class="form-text">Dùng để tạo mã SKU cho các biến thể</div>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Mô tả sản phẩm</label>
      <textarea 
        v-model="product.description" 
        class="form-control" 
        rows="4"
        placeholder="Mô tả chi tiết về sản phẩm..."
      ></textarea>
      <div class="form-text">{{ product.description?.length || 0 }}/500 ký tự</div>
    </div>

    <!-- Category & Brand Section -->
    <div class="row mb-4">
      <div class="col-12">
        <h6 class="text-primary mb-3">
          <i class="bi bi-tags me-2"></i>Phân loại sản phẩm
        </h6>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 mb-3">
        <label class="form-label">
          Thương hiệu <span class="text-danger">*</span>
        </label>
        <select 
          v-model="product.brandId" 
          class="form-select" 
          :class="{ 'is-invalid': errors.brandId }"
          required
        >
          <option value="" disabled>-- Chọn thương hiệu --</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>
        <div v-if="errors.brandId" class="invalid-feedback">{{ errors.brandId }}</div>
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">
          Danh mục <span class="text-danger">*</span>
        </label>
        <select 
          v-model="product.categoryId" 
          class="form-select" 
          :class="{ 'is-invalid': errors.categoryId }"
          required 
          @change="onCategoryChange"
        >
          <option value="" disabled>-- Chọn danh mục --</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <div v-if="errors.categoryId" class="invalid-feedback">{{ errors.categoryId }}</div>
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">
          Trạng thái <span class="text-danger">*</span>
        </label>
        <select 
          v-model="product.isActive" 
          class="form-select" 
          required
        >
          <option :value="true">✅ Đang bán</option>
          <option :value="false">❌ Ngừng bán</option>
        </select>
      </div>
    </div>

    <!-- Technical Specs Section -->
    <div v-if="specFields.length > 0" class="card mb-4">
      <div class="card-header bg-light">
        <h6 class="mb-0">
          <i class="bi bi-gear me-2"></i>Thông số kỹ thuật
        </h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div v-for="field in specFields" :key="field.key" class="col-md-6 mb-3">
            <label class="form-label">{{ field.label }}</label>
            <input 
              v-model="product.specs[field.key]" 
              type="text" 
              class="form-control" 
              :placeholder="`Nhập ${field.label.toLowerCase()}`"
            >
          </div>
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="d-flex justify-content-end align-items-center py-3 border-top">
      <div class="me-auto text-muted small">
        <i class="bi bi-info-circle me-1"></i>
        Dấu <span class="text-danger">*</span> là thông tin bắt buộc
      </div>
      <div class="btn-group">
        <router-link :to="{ name: 'products-list' }" class="btn btn-outline-secondary">
          <i class="bi bi-x-lg me-2"></i>Hủy
        </router-link>
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="isSaving || hasValidationErrors"
        >
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-check-lg me-2"></i>
          {{ isEditMode ? 'Cập nhật' : 'Tạo sản phẩm' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { brandService, categoryService, productService } from '../services/productService';

const props = defineProps({ 
  productId: String,
  product: Object // For external product data
});
const emit = defineEmits(['product-saved', 'product-loaded', 'error']);

// State
const loading = ref(false);
const isSaving = ref(false);
const errors = ref({});

const product = ref({ 
  name: '',
  skuPrefix: '',
  description: '',
  brandId: '',
  categoryId: '',
  isActive: true,
  specs: {} 
});

const brands = ref([]);
const categories = ref([]);
const specFields = ref([]);
const isMounted = ref(true); // Track if component is mounted

// Computed
const isEditMode = computed(() => !!props.productId);
const hasValidationErrors = computed(() => Object.keys(errors.value).length > 0);

// Spec templates for different categories
const specTemplates = {
  'laptop': [
    { key: 'cpu', label: 'CPU' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Ổ cứng' },
    { key: 'gpu', label: 'Card đồ họa' },
    { key: 'screenSize', label: 'Màn hình' },
    { key: 'weight', label: 'Trọng lượng' }
  ],
  'phone': [
    { key: 'screenSize', label: 'Màn hình' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Bộ nhớ trong' },
    { key: 'battery', label: 'Pin' },
    { key: 'os', label: 'Hệ điều hành' },
    { key: 'camera', label: 'Camera' }
  ],
  'tablet': [
    { key: 'screenSize', label: 'Màn hình' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Bộ nhớ trong' },
    { key: 'battery', label: 'Pin' },
    { key: 'os', label: 'Hệ điều hành' }
  ]
};

// Watch for external product prop
let stopWatch = null;
stopWatch = watch(() => props.product, (newProduct) => {
  if (newProduct && isMounted.value) {
    loadProductData(newProduct);
    emit('product-loaded', newProduct);
  }
}, { immediate: true });

// Methods
const loadBrandsAndCategories = async () => {
  if (!isMounted.value) return;
  
  loading.value = true;
  try {
    const [brandRes, catRes] = await Promise.all([
      brandService.getAll(),
      categoryService.getAll()
    ]);
    
    if (!isMounted.value) return; // Check if still mounted
    
    brands.value = brandRes.data || [];
    categories.value = catRes.data || [];
  } catch (error) {
    if (!isMounted.value) return;
    console.error('Failed to load brands/categories:', error);
    emit('error', 'Không thể tải danh sách thương hiệu và danh mục');
  } finally {
    if (isMounted.value) {
      loading.value = false;
    }
  }
};

const loadProduct = async () => {
  if (!props.productId || !isMounted.value) return;
  
  loading.value = true;
  try {
    const response = await productService.getById(props.productId);
    
    if (!isMounted.value) return; // Check if still mounted
    
    loadProductData(response.data);
    emit('product-loaded', response.data);
  } catch (error) {
    if (!isMounted.value) return;
    console.error('Failed to load product:', error);
    emit('error', 'Không thể tải thông tin sản phẩm');
  } finally {
    if (isMounted.value) {
      loading.value = false;
    }
  }
};

const loadProductData = (productData) => {
  product.value = {
    id: productData.id,
    name: productData.name || '',
    skuPrefix: productData.skuPrefix || '',
    description: productData.description || '',
    brandId: productData.brand?.id || '',
    categoryId: productData.category?.id || '',
    isActive: productData.isActive !== undefined ? productData.isActive : true,
    specs: productData.specs || {}
  };
  updateSpecFields();
};

const validateForm = () => {
  errors.value = {};

  if (!product.value.name?.trim()) {
    errors.value.name = 'Tên sản phẩm không được để trống';
  }
  
  if (!product.value.skuPrefix?.trim()) {
    errors.value.skuPrefix = 'Tiền tố SKU không được để trống';
  } else if (product.value.skuPrefix.includes(' ')) {
    errors.value.skuPrefix = 'Tiền tố SKU không được chứa khoảng trắng';
  }
  
  if (!product.value.brandId) {
    errors.value.brandId = 'Vui lòng chọn thương hiệu';
  }
  
  if (!product.value.categoryId) {
    errors.value.categoryId = 'Vui lòng chọn danh mục';
  }

  if (product.value.description?.length > 500) {
    errors.value.description = 'Mô tả không được vượt quá 500 ký tự';
  }

  return Object.keys(errors.value).length === 0;
};

const onCategoryChange = () => {
  product.value.specs = {};
  updateSpecFields();
};

const updateSpecFields = () => {
  const selectedCategory = categories.value.find(c => c.id === product.value.categoryId);
  if (!selectedCategory) {
    specFields.value = [];
    return;
  }
  
  const categoryName = selectedCategory.name.toLowerCase();
  for (const [key, fields] of Object.entries(specTemplates)) {
    if (categoryName.includes(key)) {
      specFields.value = fields;
      return;
    }
  }
  specFields.value = [];
};

const saveProduct = async () => {
  if (!validateForm()) {
    return;
  }

  isSaving.value = true;
  errors.value = {};

  try {
    // Prepare data for API
    const productData = {
      name: product.value.name.trim(),
      skuPrefix: product.value.skuPrefix.trim().toUpperCase(),
      description: product.value.description?.trim(),
      brandId: parseInt(product.value.brandId),
      categoryId: parseInt(product.value.categoryId),
      isActive: product.value.isActive,
      specs: product.value.specs
    };

    let savedProduct;
    if (isEditMode.value) {
      const response = await productService.update(product.value.id, productData);
      savedProduct = response.data;
    } else {
      const response = await productService.create(productData);
      savedProduct = response.data;
    }
    
    emit('product-saved', savedProduct.id);
  } catch (error) {
    console.error('Failed to save product:', error);
    
    if (error.response?.data?.message) {
      // Handle specific backend validation errors
      const message = error.response.data.message;
      if (message.includes('SKU')) {
        errors.value.skuPrefix = message;
      } else if (message.includes('name')) {
        errors.value.name = message;
      } else {
        emit('error', message);
      }
    } else {
      emit('error', 'Lưu sản phẩm thất bại. Vui lòng thử lại.');
    }
  } finally {
    isSaving.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await loadBrandsAndCategories();
  if (isEditMode.value && !props.product) {
    await loadProduct();
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
  
  // Clear data
  product.value = {
    id: null,
    name: '',
    skuPrefix: '',
    description: '',
    brandId: '',
    categoryId: '',
    isActive: true,
    specs: {}
  };
  errors.value = {};
  loading.value = false;
  submitting.value = false;
});
</script>

<style scoped>
.border-dashed {
    border-style: dashed !important;
}
</style>