<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">🛒 Giỏ Hàng Của Bạn</h1>
      </v-col>
    </v-row>

    <v-row v-if="cartStore.items.length === 0" justify="center" class="text-center mt-10">
      <v-col cols="12" md="6">
        <v-icon size="80" color="grey-lighten-1">mdi-cart-off</v-icon>
        <p class="text-h6 mt-4">Giỏ hàng của bạn đang trống.</p>
        <p class="text-body-1 mb-6">Hãy khám phá thêm sản phẩm nhé!</p>
        <v-btn color="primary" to="/products">
          <v-icon left>mdi-shopping-outline</v-icon>
          Tiếp tục mua sắm
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card flat border>
           <v-toolbar flat density="compact">
             <v-toolbar-title class="text-subtitle-1 font-weight-medium">Sản phẩm trong giỏ</v-toolbar-title>
             <v-spacer></v-spacer>
              <v-btn variant="text" color="error" @click="confirmClearCart" :disabled="cartStore.items.length === 0">
                <v-icon left>mdi-delete-sweep-outline</v-icon>
                Xóa tất cả
              </v-btn>
           </v-toolbar>
           <v-divider></v-divider>

          <v-list lines="three">
            <template v-for="(item, index) in cartStore.items" :key="item.id">
              <v-list-item>
                 <template v-slot:prepend>
                  <v-avatar rounded="0" size="80" class="me-4">
                     <v-img :src="item.imageUrl || 'https://cdn.vuetifyjs.com/images/wireframes/square.png'" cover></v-img>
                  </v-avatar>
                </template>

                 <v-list-item-title class="font-weight-medium mb-1">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-red font-weight-bold">{{ formatCurrency(item.price) }}</v-list-item-subtitle>

                 <template v-slot:append>
                  <div class="d-flex align-center">
                    <v-btn
                      icon="mdi-minus"
                      variant="text"
                      size="small"
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      density="compact"
                    ></v-btn>
                    <span class="mx-3">{{ item.quantity }}</span>
                    <v-btn
                      icon="mdi-plus"
                      variant="text"
                      size="small"
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      density="compact"
                    ></v-btn>
                    <v-btn
                      icon="mdi-delete-outline"
                      color="grey"
                      variant="text"
                      size="small"
                      @click="removeItemFromCart(item.id)"
                      class="ms-3"
                      density="compact"
                    ></v-btn>
                  </div>
                   <div class="text-right mt-1 text-subtitle-1 font-weight-bold">
                       {{ formatCurrency(item.price * item.quantity) }}
                   </div>
                </template>
              </v-list-item>
              <v-divider v-if="index < cartStore.items.length - 1"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card flat border>
          <v-card-title class="text-subtitle-1 font-weight-medium">Tóm tắt đơn hàng</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex justify-space-between mb-3">
              <span class="text-body-1">Tạm tính ({{ cartStore.totalItemsCount }} sản phẩm):</span>
              <span class="text-body-1 font-weight-medium">{{ cartStore.formattedTotalPrice }}</span>
            </div>
             <div class="d-flex justify-space-between mb-3">
              <span class="text-body-1">Phí vận chuyển:</span>
              <span class="text-body-1 font-weight-medium">Miễn phí</span> </div>
             <v-text-field label="Nhập mã giảm giá" variant="outlined" density="compact" hide-details class="mb-4"></v-text-field>
              <v-btn variant="tonal" block small>Áp dụng</v-btn>

          </v-card-text>
          <v-divider></v-divider>
           <v-card-text>
            <div class="d-flex justify-space-between mb-4">
              <span class="text-h6">Tổng cộng:</span>
              <span class="text-h6 font-weight-bold text-red">{{ cartStore.formattedTotalPrice }}</span>
            </div>
            <v-btn color="primary" block size="large" @click="proceedToCheckout">
               <v-icon left>mdi-credit-card-check-outline</v-icon>
              Tiến hành thanh toán
            </v-btn>
          </v-card-text>
        </v-card>
         <v-btn variant="text" to="/products" class="mt-4">
             <v-icon left>mdi-arrow-left</v-icon>
             Tiếp tục mua sắm
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

     <v-dialog v-model="clearCartDialog" max-width="400">
        <v-card>
            <v-card-title class="text-h5">Xác nhận xóa giỏ hàng</v-card-title>
            <v-card-text>Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="clearCartDialog = false">Hủy</v-btn>
                <v-btn color="red darken-1" text @click="executeClearCart">Xóa</v-btn>
            </v-card-actions>
        </v-card>
     </v-dialog>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

// State cho Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

// State cho dialog xác nhận
const clearCartDialog = ref(false);

// Hàm hiển thị Snackbar
const showSnackbar = (text, color = 'success') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hàm cập nhật số lượng
const updateQuantity = (productId, newQuantity) => {
  if (newQuantity >= 1) {
    cartStore.updateItemQuantity(productId, newQuantity);
    // Không cần snackbar khi chỉ tăng/giảm số lượng
  } else {
      // Nếu giảm về 0, thực hiện xóa
      removeItemFromCart(productId);
  }
};

// Hàm xóa sản phẩm
const removeItemFromCart = (productId) => {
  const item = cartStore.items.find(i => i.id === productId);
  if (item) {
      cartStore.removeItem(productId);
      showSnackbar(`Đã xóa "${item.name}" khỏi giỏ hàng.`, 'info');
  }
};

// Hàm mở dialog xác nhận xóa tất cả
const confirmClearCart = () => {
    clearCartDialog.value = true;
}

// Hàm thực hiện xóa tất cả
const executeClearCart = () => {
    cartStore.clearCart();
    clearCartDialog.value = false; // Đóng dialog
    showSnackbar('Đã xóa toàn bộ giỏ hàng.', 'warning');
}

// Hàm xử lý khi nhấn nút thanh toán (sẽ hoàn thiện sau)
const proceedToCheckout = () => {
  console.log('Tiến hành thanh toán...');
  // Điều hướng đến trang thanh toán
  router.push('/checkout'); // Cần tạo route và component CheckoutView
};
</script>

<style scoped>
/* CSS tùy chỉnh cho trang giỏ hàng nếu cần */
.v-list-item--density-default:not(.v-list-item--nav).v-list-item--three-line {
    padding-top: 16px;
    padding-bottom: 16px;
}
</style>