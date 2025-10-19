<template>
  <div class="text-center">
    <!-- Loading State -->
    <div v-if="isLoading">
      <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Đang xử lý...</span>
      </div>
      <h3>Đang kích hoạt tài khoản...</h3>
      <p class="text-muted">Vui lòng đợi trong giây lát</p>
    </div>

    <!-- Success State -->
    <div v-else-if="isSuccess">
      <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
      <h3 class="mt-3">Kích hoạt thành công!</h3>
      <p class="text-muted">
        Tài khoản của bạn đã được kích hoạt.<br>
        Bây giờ bạn có thể đăng nhập vào hệ thống.
      </p>
      <RouterLink to="/auth/login" class="btn btn-primary mt-3">
        <i class="bi bi-box-arrow-in-right me-2"></i>
        Đăng nhập ngay
      </RouterLink>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage">
      <i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
      <h3 class="mt-3">Kích hoạt thất bại</h3>
      <div class="alert alert-danger mt-3 text-start" role="alert">
        {{ errorMessage }}
      </div>
      <p class="text-muted">
        Có thể link kích hoạt đã hết hạn hoặc không hợp lệ.
      </p>
      <RouterLink to="/auth/register" class="btn btn-secondary mt-2">
        <i class="bi bi-arrow-left me-2"></i>
        Quay lại đăng ký
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(true);
const isSuccess = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  const token = route.query.token;
  
  if (!token) {
    isLoading.value = false;
    errorMessage.value = 'Token kích hoạt không hợp lệ.';
    return;
  }

  try {
    await authStore.activateAccount(token);
    isSuccess.value = true;
  } catch (error) {
    console.error('Activation error:', error);
    errorMessage.value = error.response?.data?.message || 'Không thể kích hoạt tài khoản. Vui lòng thử lại hoặc liên hệ hỗ trợ.';
  } finally {
    isLoading.value = false;
  }
});
</script>


