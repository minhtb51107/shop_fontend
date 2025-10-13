<template>
  <div class="card shadow-sm" style="width: 400px;">
    <div class="card-body p-5">
      <h3 class="card-title text-center mb-4">
        <i class="bi bi-shop me-2"></i>Đăng nhập
      </h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input type="password" class="form-control" id="password" v-model="password" required>
        </div>
        <div class="d-flex justify-content-end mb-3">
            <router-link :to="{ name: 'forgot-password' }" class="small">Quên mật khẩu?</router-link>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Đăng nhập</span>
        </button>
      </form>

      <div class="divider text-center my-3"><span>HOẶC</span></div>

      <div id="google-btn" class="d-flex justify-content-center"></div>

      <div class="text-center mt-4">
        <small>Chưa có tài khoản? <router-link :to="{ name: 'register' }">Tạo tài khoản mới</router-link></small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const email = ref('admin@shop.com');
const password = ref('admin123');
const error = ref('');
const loading = ref(false);
const authStore = useAuthStore();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (err) {
    error.value = err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.';
  } finally {
    loading.value = false;
  }
};

// Hàm callback khi đăng nhập Google thành công
const handleCredentialResponse = async (response) => {
    const idToken = response.credential;
    try {
        await authStore.loginWithGoogle(idToken);
    } catch (err) {
        error.value = "Đăng nhập với Google thất bại.";
    }
};

onMounted(() => {
    // Khởi tạo nút đăng nhập Google
    google.accounts.id.initialize({
        client_id: '758520677856-j98pg9k2fju9545q0ffffmsnr9b1qtk9.apps.googleusercontent.com', // << THAY BẰNG CLIENT ID CỦA BẠN
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        { theme: "outline", size: "large", width: "318" }  // Tùy chỉnh nút
    );
});
</script>
<style scoped>
.divider { display: flex; align-items: center; }
.divider::before, .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #dee2e6;
}
.divider span { padding: 0 1rem; }
</style>