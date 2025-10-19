<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-card flat class="pa-8 rounded-lg elevation-2">
          <v-icon size="80" color="success" class="mb-4">mdi-check-circle-outline</v-icon>
          <h1 class="text-h4 font-weight-bold text-success mb-3">Đặt Hàng Thành Công!</h1>
          <p class="text-body-1 mb-6">
            Cảm ơn bạn đã mua hàng tại Shop Điện Tử. Đơn hàng của bạn <strong class="text-primary">#{{ orderId }}</strong> đã được ghi nhận.
          </p>
           <p class="text-body-2 mb-6">
             Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng trong thời gian sớm nhất. Bạn có thể theo dõi trạng thái đơn hàng trong mục "Lịch sử đơn hàng".
           </p>

           <div v-if="orderDetails" class="text-left mt-6 mb-6 border pa-4 rounded">
                <h3 class="text-subtitle-1 font-weight-medium mb-3">Chi tiết đơn hàng #{{ orderDetails.id }}</h3>
                <p><strong>Ngày đặt:</strong> {{ formatDate(orderDetails.createdAt) }}</p>
                <p><strong>Tổng tiền:</strong> <span class="text-red font-weight-bold">{{ formatCurrency(orderDetails.grandTotal) }}</span></p>
                <p><strong>Địa chỉ giao hàng:</strong> {{ orderDetails.shippingAddress }}</p>
                <p><strong>Trạng thái:</strong> <v-chip label small :color="getStatusColor(orderDetails.status)">{{ getStatusText(orderDetails.status) }}</v-chip></p>
                 </div>


          <v-row>
             <v-col cols="12" sm="6">
               <v-btn color="primary" block variant="elevated" to="/products">
                 <v-icon left>mdi-arrow-left</v-icon>
                 Tiếp tục mua sắm
               </v-btn>
             </v-col>
             <v-col cols="12" sm="6">
                <v-btn color="grey" block variant="outlined" to="/orders"> <v-icon left>mdi-history</v-icon>
                 Xem lịch sử đơn hàng
               </v-btn>
             </v-col>
           </v-row>

        </v-card>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import orderService from '@/services/orderService'; // Import orderService
import { VChip } from 'vuetify/components';

const props = defineProps({
  orderId: { // Nhận orderId từ router
    type: [String, Number],
    required: true,
  },
});

const route = useRoute();
const orderDetails = ref(null); // Lưu chi tiết đơn hàng
const loading = ref(false);
const error = ref('');
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 3000 });

// Hàm hiển thị snackbar
const showSnackbar = (text, color = 'error') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Hàm fetch chi tiết đơn hàng (tùy chọn, để hiển thị thêm thông tin)
const fetchOrderDetails = async () => {
    loading.value = true;
    error.value = '';
    try {
        orderDetails.value = await orderService.getOrderById(props.orderId);
    } catch (err) {
        error.value = 'Không thể tải chi tiết đơn hàng.';
        showSnackbar(error.value);
        console.error("Error fetching order details:", err);
    } finally {
        loading.value = false;
    }
}

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

// --- Logic lấy màu và text cho trạng thái (Tạm thời) ---
const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'orange',
      'PROCESSING': 'blue',
      'SHIPPED': 'info',
      'DELIVERED': 'success',
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

onMounted(() => {
    console.log("Order ID from prop:", props.orderId);
    fetchOrderDetails(); // Lấy chi tiết đơn hàng khi component mount
});

</script>

<style scoped>
/* Thêm style nếu cần */
.border {
    border: 1px solid #e0e0e0;
}
</style>