<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Danh sách Sản phẩm</h2>

      <!-- Nút thêm sản phẩm chuyển hướng đến trang tạo mới -->
      <router-link to="/products/create" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>Thêm sản phẩm
      </router-link>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>
                <div class="fw-bold">{{ product.name }}</div>
                <small class="text-muted">{{ product.skuPrefix }}</small>
              </td>
              <td>{{ product.brand?.name }}</td>
              <td>{{ product.category?.name }}</td>
              <td>
                <span :class="['badge', product.isActive ? 'bg-success' : 'bg-secondary']">
                  {{ product.isActive ? 'Đang bán' : 'Ngừng bán' }}
                </span>
              </td>
              <td class="text-end">
                <!-- Quản lý biến thể -->
                <button class="btn btn-sm btn-outline-info me-2" title="Quản lý biến thể">
                  <i class="bi bi-diagram-3"></i>
                </button>

                <!-- Nút chỉnh sửa chuyển hướng đến trang edit -->
                <router-link
                  :to="{ name: 'product-edit', params: { id: product.id } }"
                  class="btn btn-sm btn-outline-secondary me-2"
                  title="Chỉnh sửa"
                >
                  <i class="bi bi-pencil-square"></i>
                </router-link>

                <!-- Xóa -->
                <button class="btn btn-sm btn-outline-danger" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productService } from '../services/productService'

const products = ref([])

onMounted(async () => {
  try {
    const response = await productService.getAll()
    products.value = response.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
})
</script>
