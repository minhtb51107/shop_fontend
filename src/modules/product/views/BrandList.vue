<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Thương hiệu</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#brandModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm thương hiệu
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Tên thương hiệu</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brand in brands" :key="brand.id">
              <td>{{ brand.id }}</td>
              <td>{{ brand.name }}</td>
              <td class="text-end">
                 <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#brandModal" @click="openModal(brand)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(brand)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="modal fade" id="brandModal" tabindex="-1" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <label class="form-label">Tên thương hiệu</label>
                    <input v-model="form.name" type="text" class="form-control" required>
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
import { brandService } from '../services/productService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);
const brands = ref([]);
const form = ref({});
const isEditMode = ref(false);

onMounted(() => {
    fetchBrands();
    modalInstance = new Modal(modalRef.value);
});

const fetchBrands = async () => {
    const response = await brandService.getAll();
    brands.value = response.data;
};

const openModal = (brand = null) => {
    isEditMode.value = !!brand;
    form.value = brand ? { ...brand } : { name: '' };
};

const handleSubmit = async () => {
    if (isEditMode.value) {
        await brandService.update(form.value.id, form.value);
    } else {
        await brandService.create(form.value);
    }
    fetchBrands();
    modalInstance.hide();
};

const handleDelete = async (brand) => {
    if(confirm(`Xóa thương hiệu "${brand.name}"?`)) {
        await brandService.delete(brand.id);
        fetchBrands();
    }
};
</script>