<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">📦 Thanh Toán Đơn Hàng</h1>
         <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-6"></v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row v-if="cartStore.items.length === 0" justify="center" class="text-center mt-10">
      <v-col cols="12" md="6">
        <v-icon size="80" color="grey-lighten-1">mdi-cart-remove</v-icon>
        <p class="text-h6 mt-4">Giỏ hàng trống để thanh toán.</p>
        <p class="text-body-1 mb-6">Vui lòng thêm sản phẩm vào giỏ trước.</p>
        <v-btn color="primary" to="/products">
          <v-icon left>mdi-shopping-outline</v-icon>
          Quay lại cửa hàng
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="7" lg="8">
        <v-form ref="checkoutForm" @submit.prevent="placeOrder">
          <v-card flat border class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-medium d-flex align-center">
                <v-icon start color="primary">mdi-account-box-outline</v-icon>
                Thông tin người nhận
            </v-card-title>
             <v-divider></v-divider>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shippingInfo.fullname"
                    label="Họ và tên người nhận"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shippingInfo.phoneNumber"
                    label="Số điện thoại"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required, rules.phone]"
                  ></v-text-field>
                </v-col>
                 <v-col cols="12">
                  <v-text-field
                     :model-value="authStore.user?.email"
                    label="Email (để nhận thông tin đơn hàng)"
                    variant="outlined"
                    density="comfortable"
                    readonly disabled
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card flat border class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-medium d-flex align-center">
                 <v-icon start color="primary">mdi-map-marker-outline</v-icon>
                Địa chỉ giao hàng
            </v-card-title>
             <v-divider></v-divider>
            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="shippingInfo.address"
                    label="Địa chỉ chi tiết (Số nhà, tên đường)"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                 <v-col cols="12" sm="4">
                   <v-select label="Tỉnh/Thành phố" :items="['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng']" variant="outlined" density="comfortable" :rules="[rules.required]"></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                   <v-select label="Quận/Huyện" :items="['Quận 1', 'Quận 3', 'Quận Tân Bình']" variant="outlined" density="comfortable" :rules="[rules.required]"></v-select>
                </v-col>
                 <v-col cols="12" sm="4">
                   <v-select label="Phường/Xã" :items="['Phường Bến Nghé', 'Phường Đa Kao']" variant="outlined" density="comfortable" :rules="[rules.required]"></v-select>
                </v-col>
                 <v-col cols="12">
                   <v-textarea v-model="shippingInfo.notes" label="Ghi chú thêm (tùy chọn)" variant="outlined" density="comfortable" rows="2"></v-textarea>
                 </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card flat border class="mb-6">
             <v-card-title class="text-subtitle-1 font-weight-medium d-flex align-center">
                 <v-icon start color="primary">mdi-truck-fast-outline</v-icon>
                Phương thức vận chuyển
            </v-card-title>
             <v-divider></v-divider>
             <v-radio-group v-model="shippingMethod" inline class="pa-4">
                 <v-radio label="Giao hàng tiêu chuẩn (Miễn phí)" value="standard"></v-radio>
                 <v-radio label="Giao hàng nhanh (20.000đ)" value="express"></v-radio>
             </v-radio-group>
          </v-card>

          <v-card flat border>
             <v-card-title class="text-subtitle-1 font-weight-medium d-flex align-center">
                 <v-icon start color="primary">mdi-credit-card-outline</v-icon>
                Phương thức thanh toán
            </v-card-title>
             <v-divider></v-divider>
             <v-radio-group v-model="paymentMethod" class="pa-4">
               <v-radio value="cod">
                 <template v-slot:label>
                   <div>
                     <strong class="text-subtitle-1">Thanh toán khi nhận hàng (COD)</strong>
                     <div class="text-body-2">Thanh toán tiền mặt cho nhân viên giao hàng khi nhận sản phẩm.</div>
                   </div>
                 </template>
               </v-radio>
                <v-divider class="my-3"></v-divider>
                <v-radio value="bank">
                 <template v-slot:label>
                   <div>
                     <strong class="text-subtitle-1">Chuyển khoản ngân hàng</strong>
                     <div class="text-body-2">Thực hiện chuyển khoản theo thông tin sẽ được cung cấp sau khi đặt hàng.</div>
                   </div>
                 </template>
               </v-radio>
                 <v-divider class="my-3"></v-divider>
               <v-radio value="vnpay" disabled> <template v-slot:label>
                   <div>
                     <strong class="text-subtitle-1">Thanh toán online qua VNPay (Sắp có)</strong>
                      <div class="text-body-2">Thanh toán an toàn qua cổng VNPay.</div>
                   </div>
                 </template>
               </v-radio>
             </v-radio-group>
          </v-card>

            </v-form>
      </v-col>

      <v-col cols="12" md="5" lg="4">
        <v-card flat border style="position: sticky; top: 80px;"> <v-card-title class="text-subtitle-1 font-weight-medium">Tóm tắt đơn hàng</v-card-title>
          <v-divider></v-divider>
          <v-list density="compact" class="py-0">
             <v-list-item v-for="item in cartStore.items" :key="item.id" lines="two">
                <template v-slot:prepend>
                   <v-avatar rounded="0" size="60" class="me-3 border">
                     <v-img :src="item.imageUrl || 'https://cdn.vuetifyjs.com/images/wireframes/square.png'" cover></v-img>
                   </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium mb-1">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                    SL: {{ item.quantity }} x <span class="text-red">{{ formatCurrency(item.price) }}</span>
                </v-list-item-subtitle>
                 <template v-slot:append>
                     <span class="font-weight-bold">{{ formatCurrency(item.quantity * item.price) }}</span>
                 </template>
             </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-card-text>
             <div class="d-flex justify-space-between mb-2 text-body-1">
              <span>Tạm tính:</span>
              <span class="font-weight-medium">{{ cartStore.formattedTotalPrice }}</span>
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
              <span class="font-weight-bold text-red">{{ formatCurrency(finalTotal) }}</span>
            </div>
          </v-card-text>
           <v-divider></v-divider>
           <v-card-actions class="pa-4">
               <v-btn
                color="primary"
                block
                size="large"
                @click="placeOrder"
                :loading="placingOrder"
                :disabled="placingOrder"
                variant="elevated"
                >
                 <v-icon left>mdi-check-circle-outline</v-icon>
                 Đặt Hàng
               </v-btn>
           </v-card-actions>
            <v-alert
                v-if="orderError"
                type="error"
                density="compact"
                variant="tonal"
                closable
                class="ma-4 mt-0"
                @click:close="orderError = ''"
              >
               {{ orderError }}
             </v-alert>
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
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import orderService from '@/services/orderService';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const checkoutForm = ref(null); // Ref cho form
const shippingInfo = ref({
  fullname: '',
  phoneNumber: '',
  address: '',
  city: '',
  district: '',
  ward: '',
  notes: '',
});
const shippingMethod = ref('standard'); // 'standard' or 'express'
const paymentMethod = ref('cod'); // 'cod', 'bank', 'vnpay'
const placingOrder = ref(false); // Trạng thái loading khi đặt hàng
const orderError = ref(''); // Thông báo lỗi khi đặt hàng
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 3000 });

// Breadcrumbs
const breadcrumbs = ref([
  { title: 'Giỏ hàng', disabled: false, to: '/cart' },
  { title: 'Thanh toán', disabled: true },
]);

// Validation Rules
const rules = {
  required: value => !!value || 'Thông tin bắt buộc.',
  phone: value => /^(0[3|5|7|8|9])+([0-9]{8})\b/.test(value) || 'Số điện thoại không hợp lệ.',
};

// Tính toán phí vận chuyển và tổng tiền
const shippingFee = computed(() => (shippingMethod.value === 'express' ? 20000 : 0));
const discount = ref(0); // Tạm thời chưa có giảm giá
const finalTotal = computed(() => cartStore.totalPrice + shippingFee.value - discount.value);

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hàm hiển thị snackbar
const showSnackbar = (text, color = 'success') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Lấy thông tin user để điền sẵn vào form
onMounted(() => {
  if (authStore.user) {
    shippingInfo.value.fullname = authStore.user.fullname || '';
    shippingInfo.value.phoneNumber = authStore.user.phoneNumber || ''; // Giả sử user có phoneNumber
  }
   // Nếu giỏ hàng trống, chuyển về trang sản phẩm
   if (cartStore.items.length === 0) {
       router.replace('/products'); // Dùng replace để không lưu vào history
       showSnackbar('Giỏ hàng trống, vui lòng chọn sản phẩm.', 'warning');
   }
});

// Hàm xử lý đặt hàng
const placeOrder = async () => {
  orderError.value = '';
  const { valid } = await checkoutForm.value.validate();
  if (!valid) {
      showSnackbar('Vui lòng kiểm tra lại thông tin.', 'error');
      return;
  }

  placingOrder.value = true;

  // Chuẩn bị dữ liệu gửi đi
  const orderData = {
    // customerId: authStore.user?.id, // Backend thường lấy customerId từ user đang đăng nhập
    warehouseId: 1, // Tạm thời chọn kho mặc định, cần logic chọn kho phù hợp
    shippingAddress: `${shippingInfo.value.address}, ${shippingInfo.value.ward}, ${shippingInfo.value.district}, ${shippingInfo.value.city}`, // Ghép địa chỉ
    // Thêm các trường địa chỉ riêng nếu backend yêu cầu
    notes: shippingInfo.value.notes,
    shippingMethod: shippingMethod.value,
    paymentMethod: paymentMethod.value,
    // Thông tin người nhận nếu khác người đăng nhập (backend có thể tự lấy)
    receiverFullname: shippingInfo.value.fullname,
    receiverPhoneNumber: shippingInfo.value.phoneNumber,
    items: cartStore.items.map(item => ({
      variantId: item.id,
      quantity: item.quantity,
      unitPrice: item.price, // Giá tại thời điểm đặt hàng
    })),
  };

  try {
    const createdOrder = await orderService.createOrder(orderData);
    console.log('Order created:', createdOrder);

    // Xóa giỏ hàng sau khi đặt thành công
    cartStore.clearCart();

    // Điều hướng đến trang xác nhận đơn hàng
    router.push({ name: 'orderConfirmation', params: { orderId: createdOrder.id } }); // Truyền ID đơn hàng mới tạo

  } catch (error) {
    orderError.value = error.message || 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.';
    showSnackbar(orderError.value, 'error');
  } finally {
    placingOrder.value = false;
  }
};

</script>

<style scoped>
/* Thêm style nếu cần */
.border {
    border: 1px solid #e0e0e0;
}
</style>