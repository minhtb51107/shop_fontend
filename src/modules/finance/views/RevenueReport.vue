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

    <!-- Error State -->
    <div v-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <strong>{{ error }}</strong>
      <div class="mt-3">
        <button class="btn btn-outline-danger btn-sm" @click="fetchReport">
          <i class="bi bi-arrow-clockwise me-1"></i>Thử lại
        </button>
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
const error = ref(null);

const fetchReport = async () => {
  loading.value = true;
  report.value = null;
  error.value = null;
  
  try {
    console.log('🔍 Fetching revenue report...');
    const response = await reportService.getRevenueReport(filter.value);
    report.value = response.data;
    console.log('✅ Revenue report loaded successfully');
  } catch (err) {
    console.error('❌ Error loading revenue report:', err);
    
    // Handle different error types
    if (err.response?.status === 500) {
      error.value = 'Lỗi máy chủ khi tải báo cáo. Vui lòng thử lại sau.';
    } else if (err.response?.status === 403) {
      error.value = 'Không có quyền truy cập báo cáo tài chính.';
    } else if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn.';
    } else {
      error.value = 'Không thể tải báo cáo. Vui lòng thử lại.';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Don't auto-fetch on mount to avoid 500 error
  // fetchReport();
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN');
};
</script>