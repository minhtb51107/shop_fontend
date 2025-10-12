<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Quyền</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#permissionModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm Quyền
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Tên Quyền (Name)</th>
              <th>Mô tả</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="perm in permissions" :key="perm.id">
              <td class="fw-bold font-monospace">{{ perm.name }}</td>
              <td>{{ perm.description }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#permissionModal" @click="openModal(perm)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(perm)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="permissionModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Quyền' : 'Thêm Quyền mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên Quyền (viết hoa, không dấu, VD: CREATE_PRODUCT)</label>
              <input v-model="form.name" type="text" class="form-control font-monospace" :disabled="isEditMode" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea v-model="form.description" class="form-control" rows="3"></textarea>
            </div>
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
import { permissionService } from '../services/userService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);
const permissions = ref([]);
const form = ref({});
const isEditMode = ref(false);

onMounted(() => {
  fetchPermissions();
  modalInstance = new Modal(modalRef.value);
});

const fetchPermissions = async () => {
  try {
    const response = await permissionService.getAll();
    permissions.value = response.data;
  } catch (error) {
    alert('Lỗi tải danh sách quyền!');
  }
};

const openModal = (perm = null) => {
  isEditMode.value = !!perm;
  form.value = perm ? { ...perm } : { name: '', description: '' };
};

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      await permissionService.update(form.value.id, { description: form.value.description });
    } else {
      await permissionService.create(form.value);
    }
    fetchPermissions();
    modalInstance.hide();
  } catch (error) {
    alert(`Lưu thất bại: ${error.response?.data?.message || error.message}`);
  }
};

const handleDelete = async (perm) => {
  if (confirm(`Bạn có chắc muốn xóa quyền "${perm.name}"?`)) {
    try {
      await permissionService.delete(perm.id);
      fetchPermissions();
    } catch (error) {
       alert(`Xóa thất bại: ${error.response?.data?.message || error.message}`);
    }
  }
};
</script>