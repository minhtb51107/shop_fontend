<template>
    <v-card flat :border="!flat" :variant="flat ? 'flat' : undefined">
        <v-card-title v-if="title" class="text-subtitle-1 font-weight-medium">{{ title }}</v-card-title>
        <v-divider v-if="title"></v-divider>

        <v-list v-if="showItems" density="compact" class="py-0">
             <v-list-item v-for="item in items" :key="item.id || item.variantId" lines="two">
                <template v-slot:prepend>
                   <v-avatar rounded="0" size="60" class="me-3 border">
                     <v-img :src="item.imageUrl || 'https://cdn.vuetifyjs.com/images/wireframes/square.png'" cover></v-img>
                   </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium mb-1">{{ item.name || item.variantName }}</v-list-item-title>
                <v-list-item-subtitle>
                    SL: {{ item.quantity }} x <span class="text-grey-darken-1">{{ formatCurrency(item.price || item.unitPrice) }}</span>
                </v-list-item-subtitle>
                 <template v-slot:append>
                     <span class="font-weight-medium text-body-2">{{ formatCurrency((item.price || item.unitPrice) * item.quantity) }}</span>
                 </template>
             </v-list-item>
          </v-list>
          <v-divider v-if="showItems"></v-divider>

          <v-card-text>
             <div class="d-flex justify-space-between mb-2 text-body-1">
              <span>Tạm tính ({{ totalQuantity }} sản phẩm):</span>
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
              <span class="font-weight-bold text-red">{{ formatCurrency(grandTotal) }}</span>
            </div>
          </v-card-text>
    </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  shippingFee: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  grandTotal: { // Nhận tổng cuối cùng từ component cha
    type: Number,
    required: true,
  },
  title: { // Tiêu đề tùy chọn
      type: String,
      default: null,
  },
  showItems: { // Có hiển thị danh sách item không
      type: Boolean,
      default: false, // Mặc định ẩn đi để dùng trong Checkout Stepper step 3
  },
  flat: { // Bỏ border và shadow
      type: Boolean,
      default: false,
  }
});

// Tính toán nội bộ
const totalQuantity = computed(() =>
    props.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
);
const subTotal = computed(() =>
    props.items.reduce((sum, item) => sum + ((item.price || item.unitPrice || 0) * (item.quantity || 0)), 0)
);

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>

<style scoped>
.border {
    border: 1px solid #e0e0e0;
}
</style>