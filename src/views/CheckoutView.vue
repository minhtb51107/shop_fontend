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
        <v-stepper v-model="currentStep" :items="steps" show-actions>
          <template v-slot:[`item.1`]>
            <v-card title="Thông tin giao hàng" flat>
                <v-card-text>
                    <v-form ref="step1Form">
                         <v-row dense>
                            <v-col cols="12">
                                <span class="text-subtitle-2">Thông tin người nhận</span>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="shippingInfo.fullname" label="Họ và tên người nhận"
                                variant="outlined" density="comfortable" :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="shippingInfo.phoneNumber" label="Số điện thoại"
                                variant="outlined" density="comfortable" :rules="[rules.required, rules.phone]"
                              ></v-text-field>
                            </v-col>
                             <v-col cols="12">
                              <v-text-field
                                 :model-value="authStore.user?.email" label="Email (để nhận thông tin đơn hàng)"
                                variant="outlined" density="comfortable" readonly disabled
                              ></v-text-field>
                            </v-col>
                            <v-divider class="my-3"></v-divider>
                             <v-col cols="12">
                                <span class="text-subtitle-2">Địa chỉ giao hàng</span>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="shippingInfo.address" label="Địa chỉ chi tiết (Số nhà, tên đường)"
                                variant="outlined" density="comfortable" :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                               <v-select label="Tỉnh/Thành phố" v-model="shippingInfo.city" :items="['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng']" variant="outlined" density="comfortable" :rules="[rules.required]"></v-select>
                            </v-col>
                            <v-col cols="12" sm="4">
                               <v-select label="Quận/Huyện" v-model="shippingInfo.district" :items="['Quận 1', 'Quận 3', 'Quận Tân Bình']" variant="outlined" density="comfortable" :rules="[rules.required]"></v-select>
                            </v-col>
                             <v-col cols="12" sm="4">
                               <v-select label="Phường/Xã" v-model="shippingInfo.ward" :items="['Phường Bến Nghé', 'Phường Đa Kao']" variant="outlined" density="comfortable" :rules="[rules.required]"></v-select>
                            </v-col>
                         </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
          </template>

          <template v-slot:[`item.2`]>
            <v-card title="Vận chuyển & Thanh toán" flat>
                 <v-card-text>
                    <v-form ref="step2Form">
                        <span class="text-subtitle-2 d-block mb-2">Phương thức vận chuyển</span>
                         <v-radio-group v-model="shippingMethod" inline class="mb-4">
                             <v-radio label="Giao hàng tiêu chuẩn (Miễn phí)" value="standard"></v-radio>
                             <v-radio label="Giao hàng nhanh (+ 20.000đ)" value="express"></v-radio>
                         </v-radio-group>
                         <v-divider class="mb-4"></v-divider>
                         <span class="text-subtitle-2 d-block mb-2">Phương thức thanh toán</span>
                         <v-radio-group v-model="paymentMethod" :rules="[rules.requiredSelection]">
                           <v-radio value="cod" class="mb-3">
                             <template v-slot:label>
                               <div>
                                 <strong class="text-subtitle-1">Thanh toán khi nhận hàng (COD)</strong>
                                 <div class="text-body-2 text-grey-darken-1">Thanh toán tiền mặt khi nhận sản phẩm.</div>
                               </div>
                             </template>
                           </v-radio>
                            <v-divider class="my-1"></v-divider>
                            <v-radio value="bank" class="my-3">
                             <template v-slot:label>
                               <div>
                                 <strong class="text-subtitle-1">Chuyển khoản ngân hàng</strong>
                                 <div class="text-body-2 text-grey-darken-1">Thông tin chuyển khoản sẽ được cung cấp sau khi đặt hàng.</div>
                               </div>
                             </template>
                           </v-radio>
                             <v-divider class="my-1"></v-divider>
                           <v-radio value="vnpay" disabled class="mt-3">
                             <template v-slot:label>
                               <div>
                                 <strong class="text-subtitle-1 text--disabled">Thanh toán online qua VNPay (Sắp có)</strong>
                                  <div class="text-body-2 text-grey">Thanh toán an toàn qua cổng VNPay.</div>
                               </div>
                             </template>
                           </v-radio>
                         </v-radio-group>
                    </v-form>
                </v-card-text>
            </v-card>
          </template>

          <template v-slot:[`item.3`]>
             <v-card title="Xem lại đơn hàng" flat>
                 <v-card-text>
                    <div class="mb-4">
                        <strong class="text-subtitle-1 d-block mb-1">Thông tin nhận hàng</strong>
                         <p class="text-body-2 mb-0">{{ shippingInfo.fullname }} - {{ shippingInfo.phoneNumber }}</p>
                         <p class="text-body-2">{{ fullAddress }}</p>
                    </div>
                     <v-divider class="mb-4"></v-divider>
                     <div>
                         <strong class="text-subtitle-1 d-block mb-1">Vận chuyển & Thanh toán</strong>
                         <p class="text-body-2 mb-0">Vận chuyển: {{ getShippingMethodText(shippingMethod) }}</p>
                         <p class="text-body-2">Thanh toán: {{ getPaymentMethodText(paymentMethod) }}</p>
                     </div>
                     <v-divider class="my-4"></v-divider>
                     <OrderSummaryCard :items="cartStore.items" :shippingFee="shippingFee" :discount="discount" :grandTotal="finalTotal" />
                      <v-alert
                        v-if="orderError"
                        type="error" density="compact" variant="tonal" closable
                        class="mt-4" @click:close="orderError = ''"
                      >
                       {{ orderError }}
                     </v-alert>
                 </v-card-text>
            </v-card>
          </template>

           <template v-slot:actions="{ prev, next }">
                <v-btn @click="prev" :disabled="currentStep === 1 || placingOrder">
                  <v-icon start>mdi-menu-left</v-icon> Quay lại
                </v-btn>
                <v-spacer></v-spacer>
                 <v-btn v-if="currentStep < steps.length" @click="validateAndNext(next)" color="primary">
                    Tiếp theo <v-icon end>mdi-menu-right</v-icon>
                 </v-btn>
                 <v-btn v-else @click="placeOrder" color="primary" variant="elevated" :loading="placingOrder" :disabled="placingOrder">
                    <v-icon start>mdi-check-circle-outline</v-icon> Đặt Hàng
                 </v-btn>
           </template>

        </v-stepper>
      </v-col>

      <v-col cols="12" md="5" lg="4">
        <v-card flat border style="position: sticky; top: 80px;">
          <OrderSummaryCard :items="cartStore.items" :shippingFee="shippingFee" :discount="discount" :grandTotal="finalTotal" title="Tóm tắt đơn hàng" />
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
        v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout"
        location="top right" variant="elevated"
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
// Import component tóm tắt đơn hàng (sẽ tạo ở dưới)
import OrderSummaryCard from '@/components/OrderSummaryCard.vue';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

// Stepper state
const currentStep = ref(1);
const steps = ref([
    'Địa chỉ giao hàng',
    'Vận chuyển & Thanh toán',
    'Xác nhận'
]);

// Form refs
const step1Form = ref(null);
const step2Form = ref(null);
// const checkoutForm = ref(null); // Không cần form tổng nữa

// Data refs (giữ nguyên)
const shippingInfo = ref({
  fullname: '', phoneNumber: '', address: '',
  city: null, district: null, ward: null, // Đặt là null để validation hoạt động tốt hơn với v-select
  notes: '',
});
const shippingMethod = ref('standard');
const paymentMethod = ref(null); // Bắt đầu là null để yêu cầu chọn
const placingOrder = ref(false);
const orderError = ref('');
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
  requiredSelection: value => !!value || 'Vui lòng chọn một phương thức.',
};

// Computed properties (giữ nguyên)
const shippingFee = computed(() => (shippingMethod.value === 'express' ? 20000 : 0));
const discount = ref(0);
const finalTotal = computed(() => cartStore.totalPrice + shippingFee.value - discount.value);
const fullAddress = computed(() => {
    const parts = [shippingInfo.value.address, shippingInfo.value.ward, shippingInfo.value.district, shippingInfo.value.city];
    return parts.filter(p => !!p).join(', '); // Lọc bỏ phần null/rỗng
});

// Helper functions (giữ nguyên)
const formatCurrency = (value) => { /* ... */
   if (value === null || value === undefined) return 'N/A';
   return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
const showSnackbar = (text, color = 'success') => { /* ... */
    snackbar.value.text = text;
    snackbar.value.color = color;
    snackbar.value.show = true;
};
const getShippingMethodText = (method) => (method === 'express' ? 'Giao hàng nhanh' : 'Giao hàng tiêu chuẩn');
const getPaymentMethodText = (method) => { /* ... copy từ OrderDetailView ... */
    const texts = { 'cod': 'Thanh toán khi nhận hàng (COD)', 'bank': 'Chuyển khoản ngân hàng', 'vnpay': 'VNPay' };
    return texts[method] || method || 'N/A';
};

// Điền thông tin user khi mount
onMounted(() => {
  if (authStore.user) {
    shippingInfo.value.fullname = authStore.user.fullname || '';
    shippingInfo.value.phoneNumber = authStore.user.phoneNumber || '';
  }
  if (cartStore.items.length === 0) {
     router.replace('/products');
     showSnackbar('Giỏ hàng trống, vui lòng chọn sản phẩm.', 'warning');
   }
});

// Validate step hiện tại và chuyển sang step tiếp theo
const validateAndNext = async (next) => {
    let formRef;
    if (currentStep.value === 1) formRef = step1Form;
    else if (currentStep.value === 2) formRef = step2Form;

    if (formRef && formRef.value) {
        const { valid } = await formRef.value.validate();
        if (valid) {
            next(); // Chỉ chuyển step nếu form hợp lệ
        } else {
             showSnackbar('Vui lòng kiểm tra lại thông tin.', 'error');
        }
    } else {
        next(); // Chuyển step nếu không có form để validate
    }
}

// Hàm đặt hàng (chỉ gọi ở step cuối)
const placeOrder = async () => {
  orderError.value = '';
  // Validate lại tất cả các form (đề phòng)
  const { valid: valid1 } = await step1Form.value.validate();
  const { valid: valid2 } = await step2Form.value.validate();
  if (!valid1 || !valid2) {
      showSnackbar('Vui lòng quay lại kiểm tra thông tin các bước trước.', 'error');
      // Tự động chuyển về step lỗi đầu tiên (tùy chọn)
      if (!valid1) currentStep.value = 1;
      else if (!valid2) currentStep.value = 2;
      return;
  }

  placingOrder.value = true;
  const orderData = {
    // customerId: authStore.user?.id, // Backend tự lấy
    warehouseId: 1, // Tạm thời
    shippingAddress: fullAddress.value, // Dùng địa chỉ đã ghép
    // Cần thêm các trường city, district, ward riêng nếu backend yêu cầu
    notes: shippingInfo.value.notes,
    shippingMethod: shippingMethod.value,
    paymentMethod: paymentMethod.value,
    receiverFullname: shippingInfo.value.fullname,
    receiverPhoneNumber: shippingInfo.value.phoneNumber,
    items: cartStore.items.map(item => ({
      variantId: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
    })),
     // Cần thêm shippingFee và discount nếu backend yêu cầu
     // shippingFee: shippingFee.value,
     // discountAmount: discount.value,
  };

  try {
    const createdOrder = await orderService.createOrder(orderData);
    cartStore.clearCart();
    router.push({ name: 'orderConfirmation', params: { orderId: createdOrder.id } });
  } catch (error) {
    orderError.value = error.response?.data?.message || error.message || 'Lỗi đặt hàng.';
    showSnackbar(orderError.value, 'error');
  } finally {
    placingOrder.value = false;
  }
};
</script>

<style scoped>
.v-stepper-item--selected .v-stepper-item__avatar {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}
/* Thêm style nếu cần */
</style>