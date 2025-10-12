<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý Đơn Mua Hàng</h2>
      <router-link :to="{ name: 'purchase-order-create' }" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>Tạo đơn mua hàng
      </router-link>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã Đơn</th>
              <th>Nhà cung cấp</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="po in purchaseOrders" :key="po.id">
              <td>#{{ po.id }}</td>
              <td>{{ po.supplierName }}</td>
              <td>{{ formatDate(po.orderDate) }}</td>
              <td>
                <span class="badge" :class="getStatusClass(po.status)">
                  {{ getStatusText(po.status) }}
                </span>
              </td>
              <td class="text-end">
                <router-link :to="{ name: 'purchase-order-detail', params: { id: po.id } }" class="btn btn-sm btn-outline-primary">
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
import { purchaseOrderService } from '../services/supplyChainService';

const purchaseOrders = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await purchaseOrderService.getAll({ page: 0, size: 20, sort: 'orderDate,desc' });
    purchaseOrders.value = response.data.content;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const getStatusClass = (status) => {
    const classes = {
        DRAFT: 'bg-secondary',
        SUBMITTED: 'bg-info text-dark',
        APPROVED: 'bg-success',
        COMPLETED: 'bg-primary',
        CANCELLED: 'bg-danger',
    };
    return classes[status] || 'bg-light text-dark';
};

const getStatusText = (status) => {
    const texts = {
        DRAFT: 'Nháp',
        SUBMITTED: 'Đã gửi',
        APPROVED: 'Đã duyệt',
        COMPLETED: 'Hoàn thành',
        CANCELLED: 'Đã hủy',
    };
    return texts[status] || status;
}
</script>