<template>
  <div>
    <div class="d-flex align-items-center mb-4">
      <router-link :to="{ name: 'orders-list' }" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i>
      </router-link>
      <h2 class="mb-0">Chi tiết Đơn hàng #{{ id }}</h2>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="order" class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header">
            <h5 class="mb-0">Các sản phẩm trong đơn</h5>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th class="text-center">Số lượng</th>
                  <th class="text-end">Đơn giá</th>
                  <th class="text-end">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.items" :key="item.id">
                  <td>
                    <div class="fw-bold">{{ item.variantName }}</div>
                    <small class="text-muted">SKU: {{ item.variantSku }}</small>
                  </td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-end">{{ formatCurrency(item.unitPrice) }}</td>
                  <td class="text-end fw-bold">{{ formatCurrency(item.totalPrice) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="fw-bold fs-5">
                  <td colspan="3" class="text-end">Tổng cộng:</td>
                  <td class="text-end text-primary">{{ formatCurrency(order.grandTotal) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="card shadow-sm mb-4">
              <div class="card-header"><h5 class="mb-0">Thanh toán</h5></div>
              <div class="card-body">
                <div v-if="payment">
                  <p><strong>Phương thức:</strong> {{ payment.method }}</p>
                  <p><strong>Số tiền:</strong> {{ formatCurrency(payment.amount) }}</p>
                  <p><strong>Trạng thái:</strong> <span class="badge bg-success">{{ payment.status }}</span></p>
                  <p class="mb-0"><strong>Mã giao dịch:</strong> {{ payment.transactionCode }}</p>
                </div>
                <div v-else class="text-muted">Chưa có thông tin thanh toán.</div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card shadow-sm mb-4">
              <div class="card-header"><h5 class="mb-0">Vận chuyển</h5></div>
              <div class="card-body">
                <div v-if="shipment">
                  <p><strong>Mã vận đơn:</strong> {{ shipment.trackingCode }}</p>
                  <p><strong>Trạng thái:</strong> <span class="badge bg-info text-dark">{{ shipment.status }}</span></p>
                  <p class="mb-0"><strong>Ngày giao:</strong> {{ formatDate(shipment.shippedAt) }}</p>
                </div>
                <div v-else class="text-muted">Chưa có thông tin vận chuyển.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm mb-4">
          <div class="card-header"><h5 class="mb-0">Thông tin Khách hàng</h5></div>
          <div class="card-body">
            <p><strong>ID Khách hàng:</strong> {{ order.customerId }}</p>
            <p class="mb-0"><strong>Địa chỉ giao hàng:</strong><br>{{ order.shippingAddress }}</p>
          </div>
        </div>
        <div class="card shadow-sm mb-4">
          <div class="card-header"><h5 class="mb-0">Trạng thái đơn hàng</h5></div>
          <div class="card-body">
            <p><strong>Trạng thái hiện tại: </strong>
              <span class="badge fs-6" :class="getStatusClass(order.status)">{{ order.status }}</span>
            </p>
            <label class="form-label">Cập nhật trạng thái:</label>
            <div class="input-group">
              <select class="form-select" v-model="newStatus" :disabled="isUpdating">
                <option>PENDING</option>
                <option>CONFIRMED</option>
                <option>SHIPPING</option>
                <option>COMPLETED</option>
                <option>CANCELLED</option>
              </select>
              <button class="btn btn-primary" @click="updateStatus" :disabled="isUpdating">
                <span v-if="isUpdating" class="spinner-border spinner-border-sm"></span>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
         <div class="card shadow-sm mb-4">
            <div class="card-header"><h5 class="mb-0">Lịch sử trạng thái</h5></div>
            <div class="card-body">
                <div v-if="statusHistory.length > 0">
                    <ul class="list-group list-group-flush">
                        <li v-for="history in statusHistory" :key="history.id" class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold">{{ history.status }}</span>
                                <br><small class="text-muted">{{ formatDate(history.createdAt) }}</small>
                            </div>
                            <small class="text-secondary">#{{ history.updatedByEmployeeId }}</small>
                        </li>
                    </ul>
                </div>
                <div v-else class="text-muted">Không có lịch sử trạng thái.</div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { orderService, paymentService, shipmentService, orderStatusHistoryService } from '../services/saleService';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const order = ref(null);
const payment = ref(null);
const shipment = ref(null);
const statusHistory = ref([]);
const loading = ref(false);
const isUpdating = ref(false);
const error = ref('');
const newStatus = ref('');

const fetchOrderDetails = async () => {
  loading.value = true;
  error.value = '';
  try {
    const [orderResponse, historyResponse] = await Promise.all([
      orderService.getById(props.id),
      orderStatusHistoryService.getHistoryByOrderId(props.id)
    ]);
    
    order.value = orderResponse.data;
    newStatus.value = order.value.status;
    statusHistory.value = historyResponse.data;

    // GHI CHÚ: Tải thông tin thanh toán và vận chuyển một cách độc lập
    // Giả định backend trả về một mảng, chúng ta lấy phần tử đầu tiên
    const [paymentResponse, shipmentResponse] = await Promise.all([
      paymentService.getByOrderId(props.id),
      shipmentService.getByOrderId(props.id)
    ]);
    payment.value = paymentResponse.data[0]; 
    shipment.value = shipmentResponse.data[0];
    
  } catch (err) {
    console.error(err);
    error.value = 'Không thể tải chi tiết đơn hàng.';
  } finally {
    loading.value = false;
  }
};

const updateStatus = async () => {
  isUpdating.value = true;
  try {
    await orderService.updateStatus(props.id, newStatus.value);
    await fetchOrderDetails(); // Tải lại toàn bộ dữ liệu để cập nhật lịch sử trạng thái
    alert('Cập nhật trạng thái thành công!');
  } catch (err) {
    console.error(err);
    alert('Cập nhật trạng thái thất bại.');
  } finally {
    isUpdating.value = false;
  }
};

onMounted(fetchOrderDetails);

// Các hàm tiện ích
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