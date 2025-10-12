<template>
  <div>
    <h2 class="mb-4">Quản lý Khách hàng</h2>
    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id">
              <td>
                <div class="d-flex align-items-center">
                  <img :src="customer.photo || 'https://via.placeholder.com/40'" class="rounded-circle me-3" width="40" height="40" alt="Avatar">
                  <span class="fw-bold">{{ customer.fullname }}</span>
                </div>
              </td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.phoneNumber || 'N/A' }}</td>
              <td>
                <span class="badge" :class="getStatusClass(customer.status)">
                  {{ getStatusText(customer.status) }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" title="Chỉnh sửa (đang phát triển)" disabled>
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button v-if="customer.status !== 'SUSPENDED'" class="btn btn-sm btn-outline-danger" @click="handleDelete(customer)">
                  <i class="bi bi-person-x-fill"></i> Khóa
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
import { ref, onMounted } from 'vue';
import { customerService } from '../services/userService';

const customers = ref([]);

onMounted(fetchCustomers);

async function fetchCustomers() {
  try {
    const response = await customerService.getAll({ page: 0, size: 20 });
    customers.value = response.data.content;
  } catch (error) {
    alert('Không thể tải danh sách khách hàng.');
  }
}

async function handleDelete(customer) {
  if (confirm(`Bạn có chắc muốn khóa tài khoản của khách hàng "${customer.fullname}"?`)) {
    try {
      await customerService.delete(customer.id);
      fetchCustomers(); // Tải lại danh sách
    } catch (error) {
      alert(`Khóa tài khoản thất bại: ${error.response?.data?.message || error.message}`);
    }
  }
}

const getStatusClass = (status) => ({
  'bg-success': status === 'ACTIVE',
  'bg-secondary': status === 'SUSPENDED',
  'bg-warning text-dark': status === 'PENDING_ACTIVATION',
});

const getStatusText = (status) => ({
  ACTIVE: 'Hoạt động',
  SUSPENDED: 'Đã khóa',
  PENDING_ACTIVATION: 'Chờ kích hoạt',
}[status] || status);
</script>