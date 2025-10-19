<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item">
              <router-link to="/products">Sản phẩm</router-link>
            </li>
            <li class="breadcrumb-item active">
              {{ isEditMode ? 'Chỉnh sửa' : 'Tạo mới' }}
            </li>
          </ol>
        </nav>
        <h2 class="mb-0">
          <i class="bi bi-box-seam me-2"></i>
          {{ isEditMode ? 'Chỉnh sửa Sản phẩm' : 'Tạo Sản phẩm mới' }}
        </h2>
      </div>
      
      <div class="btn-group">
        <button 
          class="btn btn-outline-secondary" 
          @click="$router.go(-1)"
        >
          <i class="bi bi-arrow-left me-2"></i>Quay lại
        </button>
        <button 
          v-if="isEditMode" 
          class="btn btn-outline-primary"
          @click="viewProduct"
        >
          <i class="bi bi-eye me-2"></i>Xem chi tiết
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-2">Đang tải thông tin sản phẩm...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
      <div class="mt-2">
        <button class="btn btn-outline-danger btn-sm" @click="$router.go(-1)">
          Quay lại
        </button>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="card shadow-sm">
      <div class="card-header bg-white border-bottom">
        <ul class="nav nav-tabs card-header-tabs border-0">
          <li class="nav-item">
            <button 
              class="nav-link"
              :class="{ active: activeTab === 'info' }"
              @click="activeTab = 'info'"
              type="button"
            >
              <i class="bi bi-info-circle me-2"></i>
              Thông tin chung
            </button>
          </li>
          <li class="nav-item" v-if="isEditMode">
            <button 
              class="nav-link"
              :class="{ active: activeTab === 'variants' }"
              @click="activeTab = 'variants'"
              type="button"
            >
              <i class="bi bi-diagram-3 me-2"></i>
              Biến thể sản phẩm
              <span v-if="variantCount > 0" class="badge bg-primary ms-1">{{ variantCount }}</span>
            </button>
          </li>
          <li class="nav-item" v-if="isEditMode">
            <button 
              class="nav-link"
              :class="{ active: activeTab === 'inventory' }"
              @click="activeTab = 'inventory'"
              type="button"
            >
              <i class="bi bi-boxes me-2"></i>
              Tồn kho
            </button>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <!-- Product Info Tab -->
        <div v-show="activeTab === 'info'">
          <ProductInfoForm 
            :product-id="id" 
            :product="product"
            @product-saved="onProductSaved"
            @product-loaded="onProductLoaded"
            @error="onError"
          />
        </div>

        <!-- Variants Tab -->
        <div v-show="activeTab === 'variants'" v-if="isEditMode && product">
          <VariantManager 
            :product="product"
            @updated="onVariantsUpdated"
          />
        </div>

        <!-- Inventory Tab -->
        <div v-show="activeTab === 'inventory'" v-if="isEditMode">
          <div class="text-center py-5 text-muted">
            <i class="bi bi-boxes display-4"></i>
            <h5 class="mt-3">Quản lý tồn kho</h5>
            <p>Tính năng quản lý tồn kho sẽ được phát triển trong phiên bản tiếp theo.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductInfoForm from '../components/ProductInfoForm.vue';
import VariantManager from '../components/VariantManager.vue';

const props = defineProps({
  id: String // Nhận id từ router
});

const router = useRouter();

// State
const loading = ref(false);
const error = ref('');
const product = ref(null);
const variantCount = ref(0);
const activeTab = ref('info');

// Computed
const isEditMode = computed(() => !!props.id);

// Methods
const onProductSaved = (productId) => {
  if (!isEditMode.value) {
    // Tạo mới thành công, chuyển đến edit mode để có thể thêm variants
    router.replace({ name: 'product-edit', params: { id: productId } });
  } else {
    // Chỉnh sửa thành công, reload data
    loadProduct(productId);
  }
};

const onProductLoaded = (loadedProduct) => {
  product.value = loadedProduct;
  if (loadedProduct.variantCount !== undefined) {
    variantCount.value = loadedProduct.variantCount;
  }
};

const onError = (errorMessage) => {
  error.value = errorMessage;
  loading.value = false;
};

const onVariantsUpdated = () => {
  // Refresh variant count when variants are updated
  if (product.value?.id) {
    loadProduct(product.value.id);
  }
};

const loadProduct = async (id) => {
  if (!id) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const { productService } = await import('../services/productService');
    const response = await productService.getById(id);
    product.value = response.data;
    
    // Load variant count
    try {
      const variantsResponse = await productService.getVariantsForProduct(id);
      variantCount.value = variantsResponse.data?.length || 0;
    } catch (err) {
      console.warn('Could not load variant count:', err);
      variantCount.value = 0;
    }
  } catch (err) {
    console.error('Failed to load product:', err);
    error.value = 'Không thể tải thông tin sản phẩm';
  } finally {
    loading.value = false;
  }
};

const viewProduct = () => {
  // Could implement a product detail view
  console.log('View product:', product.value);
};

// Lifecycle
onMounted(() => {
  if (isEditMode.value && props.id) {
    loadProduct(props.id);
  }
});
</script>