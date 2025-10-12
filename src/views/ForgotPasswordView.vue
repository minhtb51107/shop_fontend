<template>
  <div class="card shadow-sm" style="width: 400px;">
    <div class="card-body p-5">
      <h3 class="card-title text-center mb-4">Quên mật khẩu</h3>
       <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <form v-else @submit.prevent="handleForgotPassword">
        <p class="text-muted">Nhập địa chỉ email của bạn. Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.</p>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="email" required>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Gửi liên kết</span>
        </button>
      </form>
       <div class="text-center mt-3">
        <router-link :to="{ name: 'login' }">Quay lại Đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const error = ref('');
const successMessage = ref('');
const loading = ref(false);
const authStore = useAuthStore();

const handleForgotPassword = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.forgotPassword(email.value);
    successMessage.value = 'Nếu email của bạn tồn tại trong hệ thống, bạn sẽ nhận được một liên kết để đặt lại mật khẩu.';
  } catch (err) {
    // Thông báo thành công ngay cả khi email không tồn tại để bảo mật
    successMessage.value = 'Nếu email của bạn tồn tại trong hệ thống, bạn sẽ nhận được một liên kết để đặt lại mật khẩu.';
  } finally {
    loading.value = false;
  }
};
</script>