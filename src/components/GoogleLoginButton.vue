<template>
  <div>
    <div id="google-btn-native"></div> 
    <p v-if="error" class="text-error mt-2 small text-center">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const error = ref('');
// Lấy Client ID từ biến môi trường (file .env)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Hàm callback khi Google đăng nhập thành công
const handleGoogleLogin = async (response) => {
  const idToken = response.credential;
  if (!idToken) {
    error.value = "Không nhận được thông tin xác thực từ Google.";
    return;
  }
  
  try {
    // Gọi hàm 'loginWithGoogle' trong auth.js của shop_fontend
    await authStore.loginWithGoogle(idToken); 
    // Chuyển hướng đã được xử lý bên trong store
  } catch (err) {
    console.error("Lỗi xử lý token Google:", err);
    error.value = err.message || 'Xác thực với máy chủ thất bại.';
  }
};

onMounted(() => {
  if (!GOOGLE_CLIENT_ID) {
      error.value = "Lỗi cấu hình: VITE_GOOGLE_CLIENT_ID chưa được thiết lập trong file .env";
      console.error(error.value);
      return;
  }
    
  // Chờ cho script của Google tải xong
  const checkGoogle = setInterval(() => {
    if (typeof google !== 'undefined') {
      clearInterval(checkGoogle); // Dừng kiểm tra

      // Khởi tạo Google Identity Services
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID, // Sử dụng Client ID từ .env
        callback: handleGoogleLogin, // Hàm callback
      });

      // Render nút Google
      google.accounts.id.renderButton(
        document.getElementById('google-btn-native'), // Render vào thẻ div
        { 
            theme: 'outline', 
            size: 'large', 
            width: '100%', // Tự động co giãn theo thẻ cha
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
        } 
      );
    }
  }, 100); // Kiểm tra mỗi 100ms
});
</script>

<style scoped>
/* Đảm bảo nút Google chiếm đủ chiều rộng */
#google-btn-native {
    display: flex;
    justify-content: center;
    width: 100%;
}
.text-error {
    color: rgb(var(--v-theme-error));
    font-size: 0.875rem;
}
</style>