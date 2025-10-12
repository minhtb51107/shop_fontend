<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Vai trò</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#roleModal" @click="openRoleModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm Vai trò
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Tên Vai trò</th>
              <th>Mô tả</th>
              <th>Các quyền</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id">
              <td class="fw-bold">{{ role.name }}</td>
              <td>{{ role.description }}</td>
              <td>
                <span v-for="perm in role.permissions" :key="perm.name" class="badge bg-secondary me-1 mb-1 font-monospace">
                  {{ perm.name }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#assignPermissionModal" @click="openAssignModal(role)">
                    <i class="bi bi-key-fill"></i> Gán quyền
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(role)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="roleModal" tabindex="-1" ref="roleModalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm Vai trò mới</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên Vai trò (viết hoa, VD: SALE_MANAGER)</label>
              <input v-model="form.name" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea v-model="form.description" class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleRoleSubmit">Lưu</button>
          </div>
        </div>
      </div>
    </div>

     <div class="modal fade" id="assignPermissionModal" tabindex="-1" ref="assignModalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Gán quyền cho vai trò: {{ selectedRole?.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
                <div v-for="perm in allPermissions" :key="perm.id" class="col-md-4">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" :value="perm.name" :id="'perm-' + perm.id" v-model="selectedPermissions">
                        <label class="form-check-label font-monospace" :for="'perm-' + perm.id">
                            {{ perm.name }}
                        </label>
                    </div>
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleAssignSubmit">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { roleService, permissionService } from '../services/userService';
import { Modal } from 'bootstrap';

let roleModalInstance = null;
let assignModalInstance = null;
const roleModalRef = ref(null);
const assignModalRef = ref(null);

const roles = ref([]);
const allPermissions = ref([]);
const form = ref({});
const selectedRole = ref(null);
const selectedPermissions = ref([]);

onMounted(() => {
  fetchRoles();
  fetchAllPermissions();
  roleModalInstance = new Modal(roleModalRef.value);
  assignModalInstance = new Modal(assignModalRef.value);
});

const fetchRoles = async () => {
  const response = await roleService.getAll();
  roles.value = response.data;
};

const fetchAllPermissions = async () => {
  const response = await permissionService.getAll();
  allPermissions.value = response.data;
};

const openRoleModal = () => {
  form.value = { name: '', description: '' };
};

const handleRoleSubmit = async () => {
  try {
    await roleService.create(form.value);
    fetchRoles();
    roleModalInstance.hide();
  } catch (error) {
    alert(`Thêm vai trò thất bại: ${error.response?.data?.message || error.message}`);
  }
};

const openAssignModal = (role) => {
    selectedRole.value = role;
    selectedPermissions.value = role.permissions.map(p => p.name);
};

const handleAssignSubmit = async () => {
    if (!selectedRole.value) return;
    try {
        await roleService.assignPermissions(selectedRole.value.id, selectedPermissions.value);
        fetchRoles();
        assignModalInstance.hide();
    } catch (error) {
        alert(`Gán quyền thất bại: ${error.response?.data?.message || error.message}`);
    }
}

const handleDelete = async (role) => {
  if (confirm(`Bạn có chắc muốn xóa vai trò "${role.name}"?`)) {
    try {
      await roleService.delete(role.id);
      fetchRoles();
    } catch (error) {
      alert(`Xóa thất bại: ${error.response?.data?.message || error.message}`);
    }
  }
};
</script>