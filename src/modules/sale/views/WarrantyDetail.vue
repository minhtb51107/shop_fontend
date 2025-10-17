<template>
  <div>
    <div class="d-flex align-items-center mb-4">
      <router-link :to="{ name: 'warranty-list' }" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <h2 class="mb-0">Chi tiết Yêu cầu Bảo hành #{{ id }}</h2>
      <div class="ms-auto">
        <span class="badge fs-6" :class="getStatusClass(warrantyCase.status)">
          {{ getStatusText(warrantyCase.status) }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="warrantyCase" class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header">
            <h5 class="mb-0">Thông tin sản phẩm & Bảo hành</h5>
          </div>
          <div class="card-body">
            <p><strong>Mã sản phẩm trong đơn:</strong> #{{ warrantyCase.orderItemId }}</p>
            <p><strong>Số serial:</strong> {{ warrantyCase.serialNumber || 'N/A' }}</p>
            <p class="mb-0"><strong>Mô tả lỗi:</strong><br>{{ warrantyCase.description }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm mb-4">
          <div class="card-header"><h5 class="mb-0">Thông tin chung</h5></div>
          <div class="card-body">
            <p><strong>ID Khách hàng:</strong> {{ warrantyCase.customerId }}</p>
            <p><strong>Người tạo yêu cầu:</strong> Nhân viên #{{ warrantyCase.createdByEmployeeId }}</p>
            <hr>
            <h6>Cập nhật trạng thái</h6>
            <div class="input-group mb-3">
              <select class="form-select" v-model="newStatus">
                <option value="RECEIVED">Đã tiếp nhận</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="RESOLVED">Đã giải quyết</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
              <button class="btn btn-primary" @click="updateWarrantyStatus">Cập nhật</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { warrantyService } from '../services/saleService';

const route = useRoute();
const id = route.params.id;

const warrantyCase = ref(null);
const loading = ref(false);
const error = ref('');
const newStatus = ref('');

const fetchWarrantyDetails = async () => {
    loading.value = true;
    error.value = '';
    try {
        const response = await warrantyService.getById(id);
        warrantyCase.value = response.data;
        newStatus.value = warrantyCase.value.status; // Khởi tạo trạng thái mới
    } catch (err) {
        console.error(err);
        error.value = 'Không thể tải chi tiết yêu cầu bảo hành.';
    } finally {
        loading.value = false;
    }
};

const updateWarrantyStatus = async () => {
    try {
        await warrantyService.updateStatus(id, newStatus.value);
        warrantyCase.value.status = newStatus.value;
        alert('Cập nhật trạng thái thành công!');
    } catch (err) {
        alert('Lỗi khi cập nhật trạng thái yêu cầu bảo hành.');
    }
};

onMounted(fetchWarrantyDetails);

const getStatusClass = (status) => {
    switch (status) {
        case 'RECEIVED': return 'bg-info text-dark';
        case 'IN_PROGRESS': return 'bg-warning text-dark';
        case 'RESOLVED': return 'bg-success';
        case 'CANCELLED': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

const getStatusText = (status) => {
    const texts = {
        'RECEIVED': 'Đã tiếp nhận',
        'IN_PROGRESS': 'Đang xử lý',
        'RESOLVED': 'Đã giải quyết',
        'CANCELLED': 'Đã hủy'
    };
    return texts[status] || status;
};
</script>