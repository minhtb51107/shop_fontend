<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Đơn hàng</h2>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        <table v-else class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã ĐH</th>
              <th>Khách hàng</th>
              <th>Ngày tạo</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>
                Khách hàng #{{ order.customerId }}
              </td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td class="fw-bold">{{ formatCurrency(order.grandTotal) }}</td>
              <td>
                <span class="badge" :class="getStatusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="text-end">
                <router-link :to="{ name: 'order-details', params: { id: order.id } }" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-eye"></i> Xem chi tiết
                </router-link>
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
import { orderService } from '../services/saleService';

const orders = ref([]);
const loading = ref(false);
const error = ref('');

const fetchOrders = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await orderService.getAll();
    orders.value = response.data;
  } catch (err) {
    console.error(err);
    error.value = 'Không thể tải danh sách đơn hàng.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);

const formatCurrency = (value) => {
  if (!value) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
};

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-warning text-dark';
    case 'CONFIRMED': return 'bg-info text-dark';
    case 'SHIPPING': return 'bg-primary';
    case 'COMPLETED': return 'bg-success';
    case 'CANCELLED': return 'bg-danger';
    default: return 'bg-secondary';
  }
};
</script>