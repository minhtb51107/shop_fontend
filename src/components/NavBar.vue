<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    app
    temporary
  >
     <template v-if="isAuthenticated && user" v-slot:prepend>
       <v-list-item
         lines="two"
         :prepend-avatar="user.photo || defaultAvatar" :title="user.fullname || user.email"
         :subtitle="user.email"
         class="pa-4 bg-primary"
       ></v-list-item>
       <v-divider></v-divider>
     </template>

    <v-list nav dense>
      <v-list-item prepend-icon="mdi-home-outline" title="Trang Chủ" value="home" to="/" exact></v-list-item>
      <v-list-item prepend-icon="mdi-storefront-outline" title="Sản Phẩm" value="products" to="/products"></v-list-item> <v-list-item prepend-icon="mdi-cart-outline" title="Giỏ Hàng" value="cart" to="/cart">
          <template v-slot:append>
               <v-badge
                  color="error"
                  :content="cartStore.totalItemsCount"
                  :model-value="cartStore.totalItemsCount > 0"
                  inline
               ></v-badge>
          </template>
       </v-list-item>

      <v-divider></v-divider>

      <v-list-subheader>Tài Khoản</v-list-subheader>

       <template v-if="isAuthenticated">
          <v-list-item prepend-icon="mdi-account-circle-outline" title="Hồ sơ" :to="{ name: 'profile' }"></v-list-item>
          <v-list-item prepend-icon="mdi-history" title="Lịch sử đơn hàng" :to="{ name: 'orders' }"></v-list-item>
          <v-list-item prepend-icon="mdi-logout" title="Đăng xuất" @click="emit('logout')"></v-list-item>
       </template>

        <template v-else>
         <v-list-item prepend-icon="mdi-login-variant" title="Đăng Nhập" to="/login"></v-list-item>
         <v-list-item prepend-icon="mdi-account-plus-outline" title="Đăng Ký" to="/register"></v-list-item>
       </template>

       <v-divider></v-divider>
       <v-list-subheader>Danh Mục</v-list-subheader>
       <v-skeleton-loader v-if="loadingCategories" type="list-item@4" class="mx-4"></v-skeleton-loader>
       <v-list-item
         v-else
         v-for="category in categories"
         :key="category.id"
         :prepend-icon="getCategoryIcon(category.name)"
         :title="category.name"
         :value="`category-${category.id}`"
         :to="{ name: 'products', query: { categoryId: category.id } }"
         exact
       >
       </v-list-item>
       <v-divider></v-divider>
       <v-list-item prepend-icon="mdi-cog-outline" title="Cài đặt" value="settings" disabled></v-list-item> </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // THÊM: ref, onMounted
import { useCartStore } from '@/stores/cart';
import productService from '@/services/productService'; // THÊM: Import service
import defaultAvatar from '@/assets/default-avatar.png'; // THÊM: Import ảnh avatar mặc định

const cartStore = useCartStore();

// Props từ App.vue
defineProps({
  modelValue: Boolean,
  isAuthenticated: Boolean,
  user: Object | null
});

// Emit event
const emit = defineEmits(['update:modelValue', 'logout']);

// --- THÊM: Logic fetch categories ---
const categories = ref([]);
const loadingCategories = ref(true);

const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    categories.value = await productService.getAllCategories();
  } catch (error) {
    console.error("Error fetching categories for NavBar:", error);
    categories.value = []; // Đặt mảng rỗng nếu lỗi
  } finally {
    loadingCategories.value = false;
  }
};

onMounted(fetchCategories); // Gọi khi component được tạo
// --- KẾT THÚC THÊM ---

// --- THÊM: Hàm lấy icon (giống HomeView) ---
// (Bạn nên tạo file riêng ví dụ: src/utils/iconUtils.js rồi import vào)
const getCategoryIcon = (categoryName) => {
    const nameLower = categoryName?.toLowerCase() || '';
    if (nameLower.includes('laptop')) return 'mdi-laptop';
    if (nameLower.includes('phone') || nameLower.includes('điện thoại')) return 'mdi-cellphone';
    if (nameLower.includes('tablet') || nameLower.includes('máy tính bảng')) return 'mdi-tablet-ipad';
    if (nameLower.includes('headphone') || nameLower.includes('tai nghe')) return 'mdi-headphones';
    if (nameLower.includes('watch') || nameLower.includes('đồng hồ')) return 'mdi-watch';
    if (nameLower.includes('accessory') || nameLower.includes('phụ kiện')) return 'mdi-usb-port';
    return 'mdi-shape-outline'; // Icon mặc định
}
// --- KẾT THÚC THÊM ---

</script>

<style scoped>
.v-navigation-drawer {
  transition: transform 0.2s ease-in-out;
}
.bg-primary {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: white;
}
/* Thêm style cho skeleton loader */
.mx-4 {
    margin-left: 16px;
    margin-right: 16px;
}
</style>