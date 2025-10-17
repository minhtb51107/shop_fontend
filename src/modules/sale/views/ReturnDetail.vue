<template>
  <div>
    <div class="d-flex align-items-center mb-4">
      <router-link :to="{ name: 'returns-list' }" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <h2 class="mb-0">Chi tiết Yêu cầu Trả hàng #{{ id }}</h2>
      <div class="ms-auto">
        <span class="badge fs-6" :class="getStatusClass(returnRequest.status)">
          {{ getStatusText(returnRequest.status) }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="returnRequest" class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header">
            <h5 class="mb-0">Các sản phẩm được trả</h5>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Lý do</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in returnRequest.items" :key="item.id">
                  <td>#{{ item.orderItemId }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm mb-4">
          <div class="card-header"><h5 class="mb-0">Thông tin chung</h5></div>
          <div class="card-body">
            <p><strong>Mã Đơn hàng:</strong> #{{ returnRequest.orderId }}</p>
            <p><strong>Lý do chung:</strong> {{ returnRequest.reason }}</p>
            <hr>
            <h6>Cập nhật trạng thái</h6>
            <div class="input-group mb-3">
              <select class="form-select" v-model="newStatus">
                <option value="REQUESTED">Đã gửi</option>
                <option value="PROCESSING">Đang xử lý</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="REJECTED">Đã từ chối</option>
              </select>
              <button class="btn btn-primary" @click="updateReturnStatus">Cập nhật</button>
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
import { returnService } from '../services/saleService';

const route = useRoute();
const id = route.params.id;

const returnRequest = ref(null);
const loading = ref(false);
const error = ref('');
const newStatus = ref('');

const fetchReturnDetails = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await returnService.getById(id);
    returnRequest.value = response.data;
    newStatus.value = returnRequest.value.status; // Khởi tạo trạng thái mới
  } catch (err) {
    console.error(err);
    error.value = 'Không thể tải chi tiết yêu cầu trả hàng.';
  } finally {
    loading.value = false;
  }
};

const updateReturnStatus = async () => {
    try {
        await returnService.updateStatus(id, newStatus.value);
        returnRequest.value.status = newStatus.value;
        alert('Cập nhật trạng thái thành công!');
    } catch (err) {
        alert('Lỗi khi cập nhật trạng thái yêu cầu trả hàng.');
    }
};

onMounted(fetchReturnDetails);

const getStatusClass = (status) => {
    switch (status) {
        case 'REQUESTED': return 'bg-info text-dark';
        case 'PROCESSING': return 'bg-warning text-dark';
        case 'COMPLETED': return 'bg-success';
        case 'REJECTED': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

const getStatusText = (status) => {
    const texts = {
        'REQUESTED': 'Đã gửi',
        'PROCESSING': 'Đang xử lý',
        'COMPLETED': 'Hoàn thành',
        'REJECTED': 'Đã từ chối'
    };
    return texts[status] || status;
};
</script>