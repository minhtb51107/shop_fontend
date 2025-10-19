<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Danh sách Sản phẩm</h2>
      <router-link to="/products/create" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>Thêm sản phẩm
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Tìm kiếm</label>
            <input 
              v-model="filters.search" 
              type="text" 
              class="form-control" 
              placeholder="Tên sản phẩm, SKU..."
              @input="debouncedSearch"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Thương hiệu</label>
            <select v-model="filters.brandId" class="form-select" @change="loadProducts">
              <option value="">Tất cả thương hiệu</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Danh mục</label>
            <select v-model="filters.categoryId" class="form-select" @change="loadProducts">
              <option value="">Tất cả danh mục</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Trạng thái</label>
            <select v-model="filters.status" class="form-select" @change="loadProducts">
              <option value="">Tất cả</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert alert-danger" role="alert">
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-3 fs-5"></i>
        <div>
          <h6 class="alert-heading mb-1">Lỗi truy cập</h6>
          <p class="mb-0">{{ error }}</p>
          <hr class="my-2">
          <small class="text-muted">
            <strong>Khắc phục:</strong> Vui lòng chạy script <code>minimal_setup.sql</code> trong database để setup quyền cho user.
          </small>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div v-else class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>
                  <button 
                    class="btn btn-sm btn-link p-0 fw-bold" 
                    @click="sortBy('name')"
                  >
                    Tên sản phẩm
                    <i class="bi" :class="getSortIcon('name')"></i>
                  </button>
                </th>
                <th>SKU</th>
                <th>Thương hiệu</th>
                <th>Danh mục</th>
                <th>Biến thể</th>
                <th>
                  <button 
                    class="btn btn-sm btn-link p-0 fw-bold" 
                    @click="sortBy('isActive')"
                  >
                    Trạng thái
                    <i class="bi" :class="getSortIcon('isActive')"></i>
                  </button>
                </th>
                <th class="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <span class="badge bg-light text-dark">{{ product.id }}</span>
                </td>
                <td>
                  <div class="fw-bold">{{ product.name }}</div>
                  <small class="text-muted">{{ product.description || 'Chưa có mô tả' }}</small>
                </td>
                <td>
                  <code>{{ product.skuPrefix || '-' }}</code>
                </td>
                <td>
                  <span v-if="product.brand" class="badge bg-info">
                    {{ product.brand.name }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <span class="badge bg-secondary">{{ product.category?.name }}</span>
                </td>
                <td>
                  <span class="badge bg-primary">{{ product.variantCount || 0 }} biến thể</span>
                </td>
                <td>
                  <span :class="['badge', product.isActive ? 'bg-success' : 'bg-secondary']">
                    {{ product.isActive ? 'Đang bán' : 'Ngừng bán' }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group" role="group">
                    <!-- Variant Manager -->
                    <button 
                      class="btn btn-sm btn-outline-info" 
                      title="Quản lý biến thể"
                      @click="openVariantModal(product)"
                    >
                      <i class="bi bi-diagram-3"></i>
                    </button>

                    <!-- Edit -->
                    <router-link
                      :to="{ name: 'product-edit', params: { id: product.id } }"
                      class="btn btn-sm btn-outline-secondary"
                      title="Chỉnh sửa"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </router-link>

                    <!-- Delete -->
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      title="Xóa"
                      @click="confirmDelete(product)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="products.length === 0 && !loading" class="text-center py-5">
          <i class="bi bi-box-seam display-1 text-muted"></i>
          <h5 class="mt-3">Không có sản phẩm nào</h5>
          <p class="text-muted">Hãy thêm sản phẩm đầu tiên của bạn</p>
          <router-link to="/products/create" class="btn btn-primary">
            <i class="bi bi-plus-lg me-2"></i>Thêm sản phẩm
          </router-link>
        </div>
      </div>
    </div>

    <!-- Variant Manager Modal -->
    <VariantManager 
      v-if="selectedProduct" 
      :product="selectedProduct"
      @close="selectedProduct = null"
      @updated="loadProducts"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { productService, brandService, categoryService } from '../services/productService'
import VariantManager from '../components/VariantManager.vue'

// Data
const products = ref([])
const brands = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref('')
const selectedProduct = ref(null)

// Filters & Sorting
const filters = ref({
  search: '',
  brandId: '',
  categoryId: '',
  status: ''
})

const sortField = ref('id')
const sortDirection = ref('asc')

// Search debounce
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 500)
}

// Methods
const loadProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = new URLSearchParams()
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.brandId) params.append('brandId', filters.value.brandId)
    if (filters.value.categoryId) params.append('categoryId', filters.value.categoryId)
    if (filters.value.status) {
      params.append('isActive', filters.value.status === 'active')
    }
    
    const response = await productService.getAll(params.toString() ? `?${params.toString()}` : '')
    products.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch products:', err)
    
    // Handle specific error types
    if (err.response?.status === 403) {
      error.value = 'Bạn không có quyền truy cập danh sách sản phẩm. Vui lòng liên hệ quản trị viên.'
    } else if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    } else {
      error.value = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.'
    }
    
    products.value = []
  } finally {
    loading.value = false
  }
}

const loadBrands = async () => {
  try {
    const response = await brandService.getAll()
    brands.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch brands:', err)
    // Don't show error for brands - just use empty array
    brands.value = []
  }
}

const loadCategories = async () => {
  try {
    const response = await categoryService.getAll()
    categories.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch categories:', err)
    // Don't show error for categories - just use empty array
    categories.value = []
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  // Implement sorting logic here or call API with sort params
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return 'bi-arrow-down-up'
  return sortDirection.value === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'
}

const openVariantModal = (product) => {
  selectedProduct.value = product
}

const confirmDelete = async (product) => {
  if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
    try {
      await productService.delete(product.id)
      await loadProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
      error.value = 'Không thể xóa sản phẩm'
    }
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadBrands(),
    loadCategories()
  ])
})
</script>
