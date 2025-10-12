<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Kho hàng</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#warehouseModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm kho hàng
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Tên kho</th>
              <th>Địa chỉ</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="warehouse in warehouses" :key="warehouse.id">
              <td>{{ warehouse.name }}</td>
              <td>{{ warehouse.address }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#warehouseModal" @click="openModal(warehouse)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(warehouse)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="warehouseModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Kho hàng' : 'Thêm mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Tên kho</label>
                <input v-model="form.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <textarea v-model="form.address" class="form-control" rows="3" required></textarea>
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
import { warehouseService } from '../services/supplyChainService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);

const warehouses = ref([]);
const form = ref({});
const isEditMode = ref(false);

onMounted(() => {
    fetchWarehouses();
    modalInstance = new Modal(modalRef.value);
});

const fetchWarehouses = async () => {
    try {
        const response = await warehouseService.getAll();
        warehouses.value = response.data;
    } catch (error) {
        console.error(error);
        alert('Lỗi tải danh sách kho hàng!');
    }
};

const openModal = (warehouse = null) => {
    if (warehouse) {
        isEditMode.value = true;
        form.value = { ...warehouse };
    } else {
        isEditMode.value = false;
        form.value = {};
    }
};

const handleSubmit = async () => {
    try {
        if (isEditMode.value) {
            await warehouseService.update(form.value.id, form.value);
        } else {
            await warehouseService.create(form.value);
        }
        fetchWarehouses();
        modalInstance.hide();
    } catch (error) {
        console.error(error);
        alert('Lưu thất bại!');
    }
};

const handleDelete = async (warehouse) => {
    if(confirm(`Bạn có chắc muốn xóa kho "${warehouse.name}"?`)) {
        try {
            await warehouseService.delete(warehouse.id);
            fetchWarehouses();
        } catch (error) {
            console.error(error);
            alert('Xóa thất bại!');
        }
    }
};
</script>