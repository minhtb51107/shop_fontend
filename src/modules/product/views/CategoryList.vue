<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Danh mục</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#categoryModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm danh mục
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id">
              <td>{{ cat.id }}</td>
              <td>{{ cat.name }}</td>
              <td class="text-end">
                 <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#categoryModal" @click="openModal(cat)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(cat)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="modal fade" id="categoryModal" tabindex="-1" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Danh mục' : 'Thêm mới' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <label class="form-label">Tên danh mục</label>
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
import { categoryService } from '../services/productService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);
const categories = ref([]);
const form = ref({});
const isEditMode = ref(false);

onMounted(() => {
    fetchCategories();
    modalInstance = new Modal(modalRef.value);
});

const fetchCategories = async () => {
    const response = await categoryService.getAll();
    categories.value = response.data;
};

const openModal = (category = null) => {
    isEditMode.value = !!category;
    form.value = category ? { ...category } : { name: '' };
};

const handleSubmit = async () => {
    if (isEditMode.value) {
        await categoryService.update(form.value.id, form.value);
    } else {
        await categoryService.create(form.value);
    }
    fetchCategories();
    modalInstance.hide();
};

const handleDelete = async (category) => {
    if(confirm(`Xóa danh mục "${category.name}"?`)) {
        await categoryService.delete(category.id);
        fetchCategories();
    }
};
</script>