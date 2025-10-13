<template>
  <div class="modal fade" ref="employeeModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Họ và tên</label>
                <input v-model="form.fullname" type="text" class="form-control" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Mã nhân viên</label>
                <input v-model="form.employeeCode" type="text" class="form-control" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" :disabled="isEditMode" required>
            </div>
             <div class="mb-3" v-if="!isEditMode">
              <label class="form-label">Mật khẩu</label>
              <input v-model="form.password" type="password" class="form-control" required>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Chức vụ</label>
                <input v-model="form.position" type="text" class="form-control">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phòng ban</label>
                <input v-model="form.department" type="text" class="form-control">
              </div>
            </div>
             <div class="mb-3">
                <label class="form-label">Vai trò</label>
                <select v-model="form.roleNames" class="form-select" multiple required>
                    <option value="ADMIN">Admin</option>
                    <option value="SALE_MANAGER">Sale Manager</option>
                </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary" @click="submitForm">Lưu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps({
  employeeData: Object // Nhận dữ liệu nhân viên cần sửa
});
const emit = defineEmits(['form-submitted']);

const employeeModal = ref(null);
let modalInstance = null;

onMounted(() => {
    modalInstance = new Modal(employeeModal.value);
});

const form = ref({});
const isEditMode = ref(false);

// Theo dõi sự thay đổi của props để điền form
watch(() => props.employeeData, (newData) => {
  if (newData && newData.id) {
    form.value = { ...newData, roleNames: [...newData.roleNames] }; // Copy để tránh thay đổi trực tiếp props
    isEditMode.value = true;
  } else {
    form.value = { roleNames: [] }; // Reset form cho chế độ thêm mới
    isEditMode.value = false;
  }
}, { immediate: true });

const submitForm = () => {
  // Gửi sự kiện ra component cha cùng với dữ liệu form
  emit('form-submitted', form.value, isEditMode.value);
  modalInstance.hide();
};
</script>