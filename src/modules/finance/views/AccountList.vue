<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Hệ thống tài khoản kế toán</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#accountModal" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm tài khoản
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã TK</th>
              <th>Tên tài khoản</th>
              <th>Loại tài khoản</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acc in accounts" :key="acc.id">
              <td class="fw-bold">{{ acc.accountCode }}</td>
              <td>{{ acc.accountName }}</td>
              <td>{{ acc.accountType }}</td>
              <td>
                <span :class="['badge', acc.isActive ? 'bg-success' : 'bg-secondary']">
                  {{ acc.isActive ? 'Hoạt động' : 'Vô hiệu hóa' }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#accountModal" @click="openModal(acc)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button v-if="acc.isActive" class="btn btn-sm btn-outline-danger" @click="handleDelete(acc)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="accountModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Tài khoản' : 'Thêm tài khoản mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Mã tài khoản</label>
                <input v-model="form.accountCode" type="text" class="form-control" :disabled="isEditMode" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Tên tài khoản</label>
                <input v-model="form.accountName" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Loại tài khoản</label>
                <select v-model="form.accountType" class="form-select" required>
                    <option>ASSET</option>
                    <option>LIABILITY</option>
                    <option>EQUITY</option>
                    <option>REVENUE</option>
                    <option>EXPENSE</option>
                </select>
              </div>
               <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
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
import { accountService } from '../services/financeService';
import { Modal } from 'bootstrap';

let modalInstance = null;
const modalRef = ref(null);
const accounts = ref([]);
const form = ref({});
const isEditMode = ref(false);

onMounted(() => {
    fetchAccounts();
    modalInstance = new Modal(modalRef.value);
});

const fetchAccounts = async () => {
    try {
        const response = await accountService.getAll();
        accounts.value = response.data;
    } catch (error) {
        alert('Lỗi tải danh sách tài khoản!');
    }
};

const openModal = (account = null) => {
    if (account) {
        isEditMode.value = true;
        form.value = { ...account };
    } else {
        isEditMode.value = false;
        form.value = { accountType: 'ASSET' };
    }
};

const handleSubmit = async () => {
    try {
        if (isEditMode.value) {
            await accountService.update(form.value.id, form.value);
        } else {
            await accountService.create(form.value);
        }
        fetchAccounts();
        modalInstance.hide();
    } catch (error) {
        alert('Lưu thất bại!');
    }
};

const handleDelete = async (account) => {
    if(confirm(`Bạn có chắc muốn vô hiệu hóa tài khoản "${account.accountName}"?`)) {
        try {
            await accountService.deactivate(account.id);
            fetchAccounts();
        } catch (error) {
            alert('Vô hiệu hóa thất bại!');
        }
    }
};
</script>