<template>
  <div>
    <h2 class="mb-4">Báo cáo Doanh thu</h2>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <form class="row g-3 align-items-end" @submit.prevent="fetchReport">
          <div class="col-md-3">
            <label for="year" class="form-label">Năm</label>
            <input type="number" class="form-control" id="year" v-model.number="filter.year">
          </div>
          <div class="col-md-3">
            <label for="month" class="form-label">Tháng</label>
            <input type="number" class="form-control" id="month" v-model.number="filter.month">
          </div>
          <div class="col-md-3">
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              Xem báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="report" class="row">
      <div class="col-md-4">
        <div class="card text-white bg-success mb-3">
          <div class="card-header">Tổng doanh thu</div>
          <div class="card-body">
            <h4 class="card-title">{{ formatCurrency(report.totalRevenue) }}</h4>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-primary mb-3">
          <div class="card-header">Tổng số đơn hàng</div>
          <div class="card-body">
            <h4 class="card-title">{{ report.totalOrders }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div v-if="report" class="card shadow-sm">
      <div class="card-header"><h5 class="mb-0">Chi tiết các đơn hàng</h5></div>
      <div class="card-body">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Mã ĐH</th>
              <th>Ngày giao dịch</th>
              <th>Mô tả</th>
              <th class="text-end">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in report.orders" :key="order.orderId">
              <td>#{{ order.orderId }}</td>
              <td>{{ formatDate(order.transactionDate) }}</td>
              <td>{{ order.description }}</td>
              <td class="text-end">{{ formatCurrency(order.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { reportService } from '../services/financeService';

const filter = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
});
const report = ref(null);
const loading = ref(false);

const fetchReport = async () => {
  loading.value = true;
  report.value = null;
  try {
    const response = await reportService.getRevenueReport(filter.value);
    report.value = response.data;
  } catch (error) {
    console.error(error);
    alert('Không thể tải báo cáo.');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchReport);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN');
};
</script>