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
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Đăng nhập</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const email = ref('admin@shop.com'); // Dữ liệu test từ DataSeeder.java
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
    error.value = 'Email hoặc mật khẩu không chính xác.';
  } finally {
    loading.value = false;
  }
};
</script>