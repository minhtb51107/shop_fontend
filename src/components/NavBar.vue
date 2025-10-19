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
         :prepend-avatar="user.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'" :title="user.fullname || user.email"
         :subtitle="user.email"
         class="pa-4 bg-primary"
       ></v-list-item>
       <v-divider></v-divider>
     </template>

    <v-list nav dense>
      <v-list-item prepend-icon="mdi-home-outline" title="Trang Chủ" value="home" to="/" exact></v-list-item>
      <v-list-item prepend-icon="mdi-laptop" title="Sản Phẩm" value="products" to="/products"></v-list-item>
       <v-list-item prepend-icon="mdi-cart-outline" title="Giỏ Hàng" value="cart" to="/cart">
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
<v-list-item prepend-icon="mdi-history" title="Lịch sử đơn hàng" :to="{ name: 'orders' }"></v-list-item> <v-list-item prepend-icon="mdi-logout" title="Đăng xuất" @click="emit('logout')"></v-list-item>
          <v-list-item prepend-icon="mdi-logout" title="Đăng xuất" @click="emit('logout')"></v-list-item>
       </template>

        <template v-else>
         <v-list-item prepend-icon="mdi-login-variant" title="Đăng Nhập" to="/login"></v-list-item>
         <v-list-item prepend-icon="mdi-account-plus-outline" title="Đăng Ký" to="/register"></v-list-item>
       </template>

       <v-divider></v-divider>
       <v-list-subheader>Danh Mục</v-list-subheader>
       <v-list-item prepend-icon="mdi-cellphone" title="Điện thoại" value="phones"></v-list-item>
       <v-list-item prepend-icon="mdi-laptop" title="Laptop" value="laptops"></v-list-item>
       <v-list-item prepend-icon="mdi-tablet-ipad" title="Máy tính bảng" value="tablets"></v-list-item>
       <v-list-item prepend-icon="mdi-headphones" title="Phụ kiện" value="accessories"></v-list-item>

       <v-divider></v-divider>
       <v-list-item prepend-icon="mdi-cog-outline" title="Cài đặt" value="settings"></v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
const cartStore = useCartStore();

// Props từ App.vue
defineProps({
  modelValue: Boolean,
  isAuthenticated: Boolean,
  user: Object | null
});

// Emit event để cập nhật modelValue và xử lý logout
const emit = defineEmits(['update:modelValue', 'logout']);
</script>

<style scoped>
.v-navigation-drawer {
  transition: transform 0.2s ease-in-out;
}
.bg-primary {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: white;
}
</style>