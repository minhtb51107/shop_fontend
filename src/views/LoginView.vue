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

      <button @click="handleGoogleLogin" class="btn btn-light border w-100">
        <img src="https://img.icons8.com/color/16/000000/google-logo.png" class="me-2"/> Đăng nhập với Google
      </button>

      <div class="text-center mt-4">
        <small>Chưa có tài khoản? <router-link :to="{ name: 'register' }">Tạo tài khoản mới</router-link></small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'; // inject
import { useAuthStore } from '@/stores/auth';

const email = ref('admin@shop.com');
const password = ref('admin123');
const error = ref('');
const loading = ref(false);
const authStore = useAuthStore();

// Inject GAuth
const Vue3GoogleOauth = inject('Vue3GoogleOauth');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (err) {
    error.value = 'Email hoặc mật khẩu không chính xác.';
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
    try {
        const googleUser = await Vue3GoogleOauth.instance.signIn();
        const idToken = googleUser.getAuthResponse().id_token;
        await authStore.loginWithGoogle(idToken);
    } catch (error) {
        console.error("Google Sign-In error", error);
        error.value = "Đăng nhập với Google thất bại.";
    }
};
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