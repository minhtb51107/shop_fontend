<template>
  <v-app>
    <NavBar v-model="drawer" :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @logout="handleLogout" />

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="cursor-pointer" @click="$router.push('/')">Shop Điện Tử</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon to="/cart">
         <v-badge
            :content="cartStore.totalItemsCount"
            :model-value="cartStore.totalItemsCount > 0"
            color="error" offset-x="-2" offset-y="-2"
          >
            <v-icon>mdi-cart-outline</v-icon>
         </v-badge>
      </v-btn>

       <div v-if="authStore.isAuthenticated && authStore.user">
           <v-menu offset-y>
            <template v-slot:activator="{ props }">
               <v-btn icon v-bind="props">
                <v-avatar color="secondary" size="36">
                    <span class="white--text text-subtitle-1">{{ authStore.user.fullname?.charAt(0).toUpperCase() || authStore.user.email?.charAt(0).toUpperCase() }}</span>
                 </v-avatar>
               </v-btn>
            </template>
            <v-list density="compact">
               <v-list-item>
                 <v-list-item-title class="font-weight-medium">{{ authStore.user.fullname || authStore.user.email }}</v-list-item-title>
                 <v-list-item-subtitle>{{ authStore.user.email }}</v-list-item-subtitle>
               </v-list-item>
               <v-divider></v-divider>
              <v-list-item prepend-icon="mdi-account-circle-outline" title="Hồ sơ" to="/profile"></v-list-item>
               <v-list-item prepend-icon="mdi-history" title="Lịch sử đơn hàng" to="/orders"></v-list-item> <v-divider></v-divider>
              <v-list-item prepend-icon="mdi-logout" title="Đăng xuất" @click="handleLogout"></v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div v-else>
           <v-btn to="/login" variant="outlined" class="ms-2">Đăng Nhập</v-btn>
           <v-btn to="/register" variant="flat" color="white" class="ms-2 text-primary">Đăng Ký</v-btn>
        </div>
        </v-app-bar>

    <v-main class="bg-grey-lighten-4"> <v-container fluid>
         <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
             <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import AppFooter from '@/components/AppFooter.vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth'; // <-- Import auth store
import { useRouter } from 'vue-router';

const drawer = ref(false); // Bắt đầu đóng trên màn hình nhỏ
const cartStore = useCartStore();
const authStore = useAuthStore(); // <-- Sử dụng auth store
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  // Store đã tự động điều hướng về /login
};

// Kiểm tra trạng thái đăng nhập khi component được mount
onMounted(async () => {
    // Chỉ check khi khởi tạo app, không cần check mỗi lần App.vue re-render
    // Nếu cần check lại token mỗi khi F5, logic này nên nằm ngoài component, ví dụ trong main.js hoặc guard
    if (!authStore.user && authStore.accessToken) {
        await authStore.checkAuthStatus();
    }
});

</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
.v-main {
    padding-top: 64px; /* Đảm bảo nội dung không bị che bởi app bar */
}
</style>