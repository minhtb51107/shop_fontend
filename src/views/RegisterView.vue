<template>
  <div class="card shadow-sm" style="width: 450px;">
    <div class="card-body p-5">
      <h3 class="card-title text-center mb-4">
        <i class="bi bi-person-plus-fill me-2"></i>Tạo tài khoản
      </h3>
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <form v-else @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">Họ và tên</label>
          <input type="text" class="form-control" v-model="form.fullname" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="form.email" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <input type="tel" class="form-control" v-model="form.phoneNumber" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input type="password" class="form-control" v-model="form.password" required>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Đăng ký</span>
        </button>
      </form>
      <div class="text-center mt-3">
        <small>Đã có tài khoản? <router-link :to="{ name: 'login' }">Đăng nhập ngay</router-link></small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const form = ref({
  fullname: '',
  email: '',
  phoneNumber: '',
  password: ''
});
const error = ref('');
const successMessage = ref('');
const loading = ref(false);
const authStore = useAuthStore();

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.register(form.value);
    successMessage.value = 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.';
  } catch (err) {
    error.value = err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};
</script>