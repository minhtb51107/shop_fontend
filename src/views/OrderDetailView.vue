<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-4">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-row v-if="loading">
       <v-col cols="12">
           <v-skeleton-loader type="article, paragraph"></v-skeleton-loader>
           <v-skeleton-loader type="table-heading, list-item-avatar-two-line@3"></v-skeleton-loader>
       </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="start" closable @click:close="error = false">
          <v-alert-title>Không thể tải chi tiết đơn hàng</v-alert-title>
          Đã có lỗi xảy ra hoặc bạn không có quyền xem đơn hàng này.
          <br><small>{{ errorMessage }}</small>
        </v-alert>
         <v-btn to="/orders" color="primary" class="mt-4">
            <v-icon left>mdi-arrow-left</v-icon>
            Quay lại Lịch sử đơn hàng
          </v-btn>
      </v-col>
    </v-row>

    <v-row v-else-if="order">
       <v-col cols="12">
         <h1 class="text-h4 font-weight-bold mb-2">Chi tiết Đơn hàng #{{ order.id }}</h1>
         <div class="d-flex flex-wrap align-center mb-4 text-body-1">
             <span class="me-4"><v-icon start>mdi-calendar-clock-outline</v-icon>Ngày đặt: {{ formatDate(order.createdAt) }}</span>
             <span><v-icon start>mdi-list-status</v-icon>Trạng thái:
                <v-chip :color="getStatusColor(order.status)" label small class="ms-1">
                    {{ getStatusText(order.status) }}
                 </v-chip>
             </span>
         </div>
      </v-col>

       <v-col cols="12" md="8">
        <v-card flat border class="mb-6">
           <v-card-title class="text-subtitle-1 font-weight-medium">Các sản phẩm đã mua</v-card-title>
           <v-divider></v-divider>
            <v-list lines="three" class="py-0">
               <template v-for="(item, index) in order.items" :key="item.id">
                 <v-list-item>
                   <template v-slot:prepend>
                     <v-avatar rounded="0" size="80" class="me-4 border">
                        <v-img src="https://cdn.vuetifyjs.com/images/wireframes/square.png" cover></v-img>
                     </v-avatar>
                   </template>

                   <v-list-item-title class="font-weight-medium mb-1">{{ item.variantName || `Sản phẩm #${item.variantId}` }}</v-list-item-title>
                   <v-list-item-subtitle>SKU: {{ item.variantSku }}</v-list-item-subtitle>
                   <div class="text-body-2 mt-1">
                     Số lượng: {{ item.quantity }} x <span class="text-grey-darken-1">{{ formatCurrency(item.unitPrice) }}</span>
                   </div>

                   <template v-slot:append>
                     <div class="font-weight-bold text-subtitle-1">
                       {{ formatCurrency(item.totalPrice) }}
                     </div>
                   </template>
                 </v-list-item>
                 <v-divider v-if="index < order.items.length - 1"></v-divider>
               </template>
            </v-list>
        </v-card>

        <v-card flat border>
            <v-card-text>
                <div class="d-flex justify-space-between mb-2 text-body-1">
                    <span>Tạm tính ({{ totalOrderItems }} sản phẩm):</span>
                    <span class="font-weight-medium">{{ formatCurrency(subTotal) }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2 text-body-1">
                    <span>Phí vận chuyển:</span>
                    <span class="font-weight-medium">{{ formatCurrency(shippingFee) }}</span>
                </div>
                <div class="d-flex justify-space-between mb-3 text-body-1 text-success" v-if="discount > 0">
                    <span>Giảm giá:</span>
                    <span class="font-weight-medium">- {{ formatCurrency(discount) }}</span>
                </div>
                <v-divider class="my-3"></v-divider>
                <div class="d-flex justify-space-between text-h6">
                    <span>Tổng cộng:</span>
                    <span class="font-weight-bold text-red">{{ formatCurrency(order.grandTotal) }}</span>
                </div>
            </v-card-text>
         </v-card>
      </v-col>

      <v-col cols="12" md="4">
         <v-card flat border class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-medium d-flex align-center">
                <v-icon start>mdi-map-marker-radius-outline</v-icon>
                Địa chỉ giao hàng
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-body-2">
                <p><strong>{{ order.receiverFullname || authStore.user?.fullname || 'Người nhận' }}</strong></p>
                <p>{{ order.receiverPhoneNumber || authStore.user?.phoneNumber || 'Chưa có SĐT' }}</p>
                <p>{{ order.shippingAddress || 'Chưa có địa chỉ' }}</p>
            </v-card-text>
         </v-card>

          <v-card flat border class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-medium d-flex align-center">
                <v-icon start>mdi-truck-fast-outline</v-icon>
                Vận chuyển & Thanh toán
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-body-2">
                <p>Vận chuyển: {{ getShippingMethodText(order.shippingMethod) }}</p>
                <p>Thanh toán: {{ getPaymentMethodText(order.paymentMethod) }}</p>
            </v-card-text>
         </v-card>

         <v-btn color="primary" block variant="elevated" class="mb-3" @click="reOrder">
             <v-icon left>mdi-cart-refresh</v-icon>
             Mua lại đơn hàng
          </v-btn>
          <v-btn block variant="outlined" to="/orders">
              <v-icon left>mdi-arrow-left</v-icon>
              Quay lại Lịch sử đơn hàng
          </v-btn>
           <v-btn v-if="canCancelOrder" color="error" block variant="tonal" class="mt-3" @click="cancelOrder">
               <v-icon left>mdi-cancel</v-icon>
               Hủy đơn hàng
           </v-btn>
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
import { useRoute, useRouter } from 'vue-router';
import orderService from '@/services/orderService';
import { useAuthStore } from '@/stores/auth'; // Để lấy thông tin người nhận mặc định
import { useCartStore } from '@/stores/cart'; // Để thêm lại vào giỏ khi mua lại
import { VChip } from 'vuetify/components';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const order = ref(null);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 3000 });

// Lấy ID đơn hàng từ route params
const orderId = computed(() => route.params.id);

// Breadcrumbs data
const breadcrumbs = computed(() => [
  { title: 'Trang Chủ', disabled: false, to: '/' },
  { title: 'Lịch Sử Đơn Hàng', disabled: false, to: '/orders' },
  { title: `Đơn hàng #${orderId.value}`, disabled: true },
]);

// Hàm hiển thị snackbar
const showSnackbar = (text, color = 'success') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Hàm fetch chi tiết đơn hàng
const fetchOrderDetail = async () => {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  try {
    const data = await orderService.getOrderById(orderId.value);
    order.value = data;
    // Cập nhật tiêu đề trang
    document.title = `Chi tiết Đơn hàng #${data.id} - Shop Điện Tử`;
  } catch (err) {
    error.value = true;
    errorMessage.value = err.response?.data?.message || err.message || 'Lỗi không xác định.';
    showSnackbar(errorMessage.value, 'error');
    document.title = `Lỗi Đơn hàng - Shop Điện Tử`;
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

// --- Logic trạng thái, vận chuyển, thanh toán (Copy/Tương tự OrderHistoryView & CheckoutView) ---
const getStatusColor = (status) => { /* ... copy từ OrderHistoryView ... */
    const colors = {
      'PENDING': 'orange', 'PROCESSING': 'blue', 'SHIPPED': 'info',
      'DELIVERED': 'cyan', 'COMPLETED': 'success', 'CANCELLED': 'error', 'RETURNED': 'grey'
    };
    return colors[status?.toUpperCase()] || 'default';
};
const getStatusText = (status) => { /* ... copy từ OrderHistoryView ... */
    const texts = {
      'PENDING': 'Chờ xác nhận', 'PROCESSING': 'Đang xử lý', 'SHIPPED': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng', 'COMPLETED': 'Hoàn thành', 'CANCELLED': 'Đã hủy', 'RETURNED': 'Đã trả hàng'
    };
    return texts[status?.toUpperCase()] || status || 'N/A';
};
const getShippingMethodText = (method) => (method === 'express' ? 'Giao hàng nhanh' : 'Giao hàng tiêu chuẩn');
const getPaymentMethodText = (method) => {
    const texts = { 'cod': 'Thanh toán khi nhận hàng (COD)', 'bank': 'Chuyển khoản ngân hàng', 'vnpay': 'VNPay' };
    return texts[method] || method || 'N/A';
};
// ---

// Tính toán các giá trị tổng
const totalOrderItems = computed(() => order.value?.items?.length || 0);
const subTotal = computed(() =>
    order.value?.items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0
);
// Giả sử phí ship và discount được lưu trong đơn hàng (cần backend trả về)
const shippingFee = computed(() => order.value?.shippingFee || (order.value?.shippingMethod === 'express' ? 20000 : 0));
const discount = computed(() => order.value?.discountAmount || 0);

// Kiểm tra xem có thể hủy đơn hàng không (ví dụ: chỉ khi PENDING)
const canCancelOrder = computed(() => order.value?.status === 'PENDING');

// Hàm xử lý mua lại (thêm các item vào giỏ hàng)
const reOrder = () => {
    if (!order.value || !order.value.items) return;
    try {
        order.value.items.forEach(item => {
             // Cần thông tin đầy đủ của ProductVariant để thêm vào giỏ
             // Giả định item có đủ thông tin (id, name, price, imageUrl) - Cần backend trả về đầy đủ
             const productToAdd = {
                 id: item.variantId, // Cần ID của variant
                 name: item.variantName || `Sản phẩm #${item.variantId}`,
                 price: item.unitPrice, // Lấy giá lúc mua
                 // imageUrl: item.variantImageUrl // Cần backend trả về ảnh
             };
             cartStore.addItem(productToAdd, item.quantity);
        });
        showSnackbar('Đã thêm lại các sản phẩm vào giỏ hàng!', 'success');
        router.push('/cart'); // Chuyển đến giỏ hàng
    } catch (err) {
        console.error("Error re-ordering:", err);
        showSnackbar('Có lỗi xảy ra khi thêm lại sản phẩm.', 'error');
    }
}

// Hàm xử lý hủy đơn hàng (gọi API)
const cancelOrder = async () => {
    if (!canCancelOrder.value) return;
    loading.value = true; // Có thể dùng loading riêng cho nút hủy
    try {
        // Gọi API cập nhật trạng thái đơn hàng (cần có trong orderService)
        // await orderService.updateOrderStatus(orderId.value, 'CANCELLED');
        // Sau khi thành công, fetch lại dữ liệu để cập nhật trạng thái trên UI
        await fetchOrderDetail();
        showSnackbar(`Đã hủy đơn hàng #${orderId.value}.`, 'info');
    } catch (err) {
         errorMessage.value = err.response?.data?.message || err.message || 'Lỗi hủy đơn hàng.';
         showSnackbar(errorMessage.value, 'error');
    } finally {
        loading.value = false;
    }
}


// Fetch chi tiết đơn hàng khi component mount
onMounted(fetchOrderDetail);

</script>

<style scoped>
.border {
    border: 1px solid #e0e0e0;
}
</style>