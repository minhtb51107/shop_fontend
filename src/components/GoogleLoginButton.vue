<template>
  <div class="google-login-container">
    <div id="google-btn" class="google-btn-wrapper"></div>
    <div v-if="error" class="alert alert-danger mt-2 small text-center" role="alert">
      <i class="bi bi-exclamation-triangle me-1"></i>{{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const error = ref('');
let isInitialized = false;

// Google callback function
const handleGoogleLogin = async (response) => {
  if (!response || !response.credential) {
    error.value = 'Không nhận được thông tin từ Google.';
    return;
  }

  error.value = '';
  
  try {
    console.log('Đang xử lý Google login...');
    await authStore.handleGoogleLogin(response.credential);
    // Success - redirect will be handled by auth store
  } catch (err) {
    console.error('Google login error:', err);
    
    // Improved error handling based on error type
    if (err.response?.status === 500) {
      // Backend internal server error - likely network/Google API issue
      error.value = 'Lỗi máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.';
    } else if (err.response?.status === 403) {
      error.value = 'Không có quyền truy cập. Vui lòng liên hệ quản trị viên.';
    } else if (err.response?.status === 400) {
      error.value = 'Thông tin đăng nhập không hợp lệ.';
    } else if (err.code === 'ERR_NETWORK' || !err.response) {
      // Network error - can't reach backend
      error.value = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else {
      // Other errors
      const serverMessage = err.response?.data?.message;
      if (serverMessage && serverMessage.includes('UnknownHostException')) {
        error.value = 'Không thể kết nối đến Google. Vui lòng kiểm tra kết nối mạng.';
      } else {
        error.value = serverMessage || 'Đăng nhập không thành công. Vui lòng thử lại.';
      }
    }
  }
};

// Initialize Google Sign-In
const initGoogleSignIn = () => {
  if (typeof google === 'undefined' || isInitialized) {
    return;
  }

  try {
    google.accounts.id.initialize({
      client_id: '739076687715-vb198kp2kvr6vfp3mmales9ufn292ckg.apps.googleusercontent.com',
      callback: handleGoogleLogin
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      {
        theme: 'outline',
        size: 'large',
        width: 300,
        text: 'signin_with',
        shape: 'rectangular'
      }
    );

    isInitialized = true;
    console.log('Google Sign-In initialized successfully');
  } catch (err) {
    console.error('Failed to initialize Google Sign-In:', err);
    error.value = 'Không thể khởi tạo Google Sign-In.';
  }
};

// Wait for Google script to load
const waitForGoogle = () => {
  const maxAttempts = 30;
  let attempts = 0;

  const checkGoogle = () => {
    attempts++;
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      initGoogleSignIn();
    } else if (attempts < maxAttempts) {
      setTimeout(checkGoogle, 100);
    } else {
      error.value = 'Không thể tải Google Sign-In. Vui lòng refresh trang.';
    }
  };

  checkGoogle();
};

onMounted(() => {
  // Try immediate initialization
  if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
    initGoogleSignIn();
  } else {
    // Wait for script to load
    waitForGoogle();
  }
});

onUnmounted(() => {
  isInitialized = false;
});
</script>

<style scoped>
.google-login-container {
  width: 100%;
}

.google-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.google-btn-wrapper > div {
  width: 100% !important;
  max-width: 330px;
}

.alert {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

.alert i {
  font-size: 0.8rem;
}
</style>