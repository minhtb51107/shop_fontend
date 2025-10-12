<template>
  <div class="card shadow-sm" style="width: 400px;">
    <div class="card-body p-5">
      <h3 class="card-title text-center mb-4">Đặt lại mật khẩu</h3>
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
        <router-link :to="{ name: 'login' }" class="alert-link"> Quay lại trang đăng nhập.</router-link>
      </div>
      <form v-else @submit.prevent="handleResetPassword">
        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <input type="password" class="form-control" v-model="form.newPassword" required>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Lưu mật khẩu mới</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const form = ref({
  token: '',
  newPassword: ''
});
const error = ref('');
const successMessage = ref('');
const loading = ref(false);

onMounted(() => {
  // Lấy token từ URL query parameter
  form.value.token = route.query.token;
  if (!form.value.token) {
    error.value = 'Đường dẫn không hợp lệ. Vui lòng thử lại từ email của bạn.';
  }
});

const handleResetPassword = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.resetPassword(form.value);
    successMessage.value = 'Mật khẩu của bạn đã được đặt lại thành công!';
  } catch (err) {
    error.value = err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.';
  } finally {
    loading.value = false;
  }
};
</script>