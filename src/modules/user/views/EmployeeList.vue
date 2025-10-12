<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Nhân viên</h2>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i>Thêm nhân viên
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        <table v-else class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in employees" :key="emp.id">
              <td>{{ emp.employeeCode }}</td>
              <td>{{ emp.fullname }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.position }}</td>
              <td>
                <span :class="['badge', emp.isActive ? 'bg-success' : 'bg-secondary']">
                  {{ emp.isActive ? 'Hoạt động' : 'Bị khóa' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-secondary me-2" @click="openModal(emp)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm" :class="[emp.isActive ? 'btn-outline-danger' : 'btn-outline-success']" @click="toggleStatus(emp)">
                  <i :class="['bi', emp.isActive ? 'bi-lock' : 'bi-unlock']"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <EmployeeModal :employee-data="selectedEmployee" @form-submitted="handleFormSubmit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { employeeService } from '../services/employeeService';
import EmployeeModal from '../components/EmployeeModal.vue';

const employees = ref([]);
const loading = ref(false);
const error = ref('');
const selectedEmployee = ref(null);

const fetchEmployees = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await employeeService.getAll({ page: 0, size: 20 });
    employees.value = response.data.content;
  } catch (err) {
    error.value = 'Không thể tải danh sách nhân viên.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEmployees);

const openModal = (employee = null) => {
  selectedEmployee.value = employee;
  // Modal sẽ được mở từ component con thông qua Bootstrap instance
};

const handleFormSubmit = async (formData, isEdit) => {
  try {
    if (isEdit) {
      await employeeService.update(formData.id, formData);
    } else {
        const payload = {
            ...formData,
            hiredDate: new Date().toISOString().split('T')[0] // Gửi ngày tuyển dụng hiện tại
        };
      await employeeService.create(payload);
    }
    fetchEmployees(); // Tải lại danh sách sau khi lưu
  } catch (err) {
    alert('Đã xảy ra lỗi khi lưu thông tin nhân viên.');
  }
};

const toggleStatus = async (employee) => {
    if (confirm(`Bạn có chắc muốn ${employee.isActive ? 'khóa' : 'mở khóa'} tài khoản này?`)) {
        try {
            await employeeService.updateStatus(employee.id, !employee.isActive);
            fetchEmployees();
        } catch (err) {
            alert('Cập nhật trạng thái thất bại.');
        }
    }
};

</script>