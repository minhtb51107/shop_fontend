<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">📜 Lịch Sử Đơn Hàng</h1>
      </v-col>
    </v-row>

    <v-row v-if="loading">
       <v-col cols="12" v-for="n in 3" :key="`sk-${n}`">
            <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
       </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="start" closable @click:close="error = false">
          <v-alert-title>Lỗi Tải Lịch Sử Đơn Hàng</v-alert-title>
          Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          <br><small>{{ errorMessage }}</small>
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="orders.length === 0" justify="center" class="text-center mt-10">
      <v-col cols="12" md="6">
        <v-icon size="80" color="grey-lighten-1">mdi-receipt-text-outline</v-icon>
        <p class="text-h6 mt-4">Bạn chưa có đơn hàng nào.</p>
        <p class="text-body-1 mb-6">Hãy bắt đầu mua sắm ngay thôi!</p>
        <v-btn color="primary" to="/products">
          <v-icon left>mdi-shopping-outline</v-icon>
          Khám phá sản phẩm
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card flat border>
           <v-list lines="three">
             <template v-for="(order, index) in orders" :key="order.id">
               <v-list-item @click="viewOrderDetail(order.id)" class="order-item">
                 <v-list-item-title class="font-weight-medium mb-1">
                    Đơn hàng #{{ order.id }}
                 </v-list-item-title>
                  <v-list-item-subtitle class="mb-2">
                    Ngày đặt: {{ formatDate(order.createdAt) }}
                  </v-list-item-subtitle>
                  <div class="text-body-2">
                      Tổng tiền: <strong class="text-red">{{ formatCurrency(order.grandTotal) }}</strong>
                  </div>

                 <template v-slot:append>
                   <div class="text-right">
                     <v-chip :color="getStatusColor(order.status)" label small class="mb-2">
                        {{ getStatusText(order.status) }}
                     </v-chip>
                     <div>
                        <v-btn variant="text" color="primary" size="small">
                            Xem chi tiết
                            <v-icon end>mdi-chevron-right</v-icon>
                        </v-btn>
                     </div>
                   </div>
                 </template>
               </v-list-item>
                <v-divider v-if="index < orders.length - 1"></v-divider>
             </template>
           </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!loading && !error && totalPages > 1" class="mt-8">
        <v-col cols="12">
            <v-pagination
                v-model="currentPage"
                :length="totalPages"
                rounded="circle"
                @update:modelValue="fetchOrders"
            ></v-pagination>
        </v-col>
    </v-row>

     <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        location="top right"
        variant="elevated"
      >
        {{ snackbar.text }}
        <template v-slot:actions>
            <v-btn icon="mdi-close" variant="text" @click="snackbar.show = false"></v-btn>
        </template>
     </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import orderService from '@/services/orderService';
import { VChip } from 'vuetify/components'; // Import VChip

const router = useRouter();
const orders = ref([]);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const snackbar = ref({ show: false, text: '', color: 'error', timeout: 3000 });

// Pagination state
const currentPage = ref(1); // v-pagination dùng 1-based index
const itemsPerPage = ref(10); // Số đơn hàng mỗi trang
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

// Hàm hiển thị snackbar
const showSnackbar = (text, color = 'error') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Hàm fetch đơn hàng
const fetchOrders = async () => {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  try {
    // currentPage là 1-based, API cần 0-based
    const pageData = await orderService.getMyOrders(currentPage.value - 1, itemsPerPage.value);
    orders.value = pageData.content;
    totalItems.value = pageData.totalElements;
    // totalPages đã được tính bằng computed property
  } catch (err) {
    error.value = true;
    errorMessage.value = err.response?.data?.message || err.message || 'Lỗi không xác định.';
    showSnackbar(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- Logic lấy màu và text cho trạng thái (Copy từ OrderConfirmationView) ---
const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'orange',
      'PROCESSING': 'blue',
      'SHIPPED': 'info',
      'DELIVERED': 'cyan', // Khác một chút để phân biệt
      'COMPLETED': 'success',
      'CANCELLED': 'error',
      'RETURNED': 'grey'
    };
    return colors[status?.toUpperCase()] || 'default';
  };

  const getStatusText = (status) => {
     const texts = {
      'PENDING': 'Chờ xác nhận',
      'PROCESSING': 'Đang xử lý',
      'SHIPPED': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'RETURNED': 'Đã trả hàng'
    };
    return texts[status?.toUpperCase()] || status || 'N/A';
  };
// ---

// Hàm xem chi tiết đơn hàng (sẽ tạo trang sau)
const viewOrderDetail = (orderId) => {
  // Điều hướng đến trang chi tiết đơn hàng
  router.push({ name: 'orderDetail', params: { id: orderId } });
};

// Fetch đơn hàng khi component mount
onMounted(fetchOrders);

</script>

<style scoped>
.order-item {
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}
.order-item:hover {
    background-color: rgba(var(--v-theme-on-surface), 0.04);
}
</style>