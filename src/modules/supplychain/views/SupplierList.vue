<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Nhà cung cấp</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#supplierModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm nhà cung cấp
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Tên nhà cung cấp</th>
              <th>Người liên hệ</th>
              <th>Email</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supplier in suppliers" :key="supplier.id">
              <td>{{ supplier.name }}</td>
              <td>{{ supplier.contactPerson }}</td>
              <td>{{ supplier.email }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#supplierModal" @click="openModal(supplier)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(supplier)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="supplierModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Nhà cung cấp' : 'Thêm mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Tên nhà cung cấp</label>
                <input v-model="form.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Người liên hệ</label>
                <input v-model="form.contactPerson" type="text" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control">
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
import { supplierService } from '../services/supplyChainService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);

const suppliers = ref([]);
const form = ref({});
const isEditMode = ref(false);

onMounted(() => {
    fetchSuppliers();
    modalInstance = new Modal(modalRef.value);
});

const fetchSuppliers = async () => {
    try {
        const response = await supplierService.getAll();
        suppliers.value = response.data;
    } catch (error) {
        console.error(error);
        alert('Lỗi tải danh sách nhà cung cấp!');
    }
};

const openModal = (supplier = null) => {
    if (supplier) {
        isEditMode.value = true;
        form.value = { ...supplier };
    } else {
        isEditMode.value = false;
        form.value = {};
    }
};

const handleSubmit = async () => {
    try {
        if (isEditMode.value) {
            await supplierService.update(form.value.id, form.value);
        } else {
            await supplierService.create(form.value);
        }
        fetchSuppliers();
        modalInstance.hide();
    } catch (error) {
        console.error(error);
        alert('Lưu thất bại!');
    }
};

const handleDelete = async (supplier) => {
    if(confirm(`Bạn có chắc muốn xóa nhà cung cấp "${supplier.name}"?`)) {
        try {
            await supplierService.delete(supplier.id);
            fetchSuppliers();
        } catch (error) {
            console.error(error);
            alert('Xóa thất bại!');
        }
    }
};
</script>