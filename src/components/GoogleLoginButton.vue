<template>
  <div class="google-login-container">
    <div id="google-btn" class="google-btn-wrapper"></div>
    <div v-if="error" class="alert alert-danger mt-2 small text-center" role="alert">
      <i class="bi bi-exclamation-triangle me-1"></i>{{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const error = ref('');

// Hàm này sẽ được Google gọi sau khi người dùng đăng nhập thành công
const handleGoogleLogin = async (response) => {
  // response.credential chính là idToken mà backend cần
  const idToken = response.credential;
  try {
    await authStore.handleGoogleLogin(idToken);
    // Chuyển hướng đã được xử lý trong store
  } catch (err) {
    console.error("Lỗi xử lý token Google:", err);
    error.value = 'Xác thực với máy chủ thất bại. Vui lòng thử lại.';
  }
};

// Sử dụng onMounted để đảm bảo mã chỉ chạy sau khi component đã được gắn vào DOM
onMounted(() => {
  // Đợi một chút để đảm bảo Google script đã load
  const initializeGoogle = () => {
    // Kiểm tra xem đối tượng 'google' đã tồn tại chưa (được tải từ script trong index.html)
    if (typeof google === 'undefined') {
      error.value = "Không thể tải thư viện Google. Vui lòng kiểm tra kết nối mạng.";
      return;
    }

    try {
      // Khởi tạo Google Identity Services
      google.accounts.id.initialize({
        client_id: '739076687715-vb198kp2kvr6vfp3mmales9ufn292ckg.apps.googleusercontent.com', // Client ID của bạn
        callback: handleGoogleLogin, // Hàm sẽ được gọi khi đăng nhập thành công
      });

      // Render nút đăng nhập của Google vào thẻ div có id="google-btn"
      google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { 
          theme: 'outline', 
          size: 'large', 
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular'
        }
      );
    } catch (err) {
      console.error('Error initializing Google Sign-In:', err);
      error.value = "Lỗi khởi tạo Google Sign-In. Vui lòng thử lại.";
    }
  };

  // Thử khởi tạo ngay, nếu không được thì đợi thêm
  if (typeof google !== 'undefined') {
    initializeGoogle();
  } else {
    // Đợi tối đa 5 giây cho Google script load
    let attempts = 0;
    const checkGoogle = setInterval(() => {
      attempts++;
      if (typeof google !== 'undefined') {
        clearInterval(checkGoogle);
        initializeGoogle();
      } else if (attempts >= 50) { // 5 giây với mỗi 100ms
        clearInterval(checkGoogle);
        error.value = "Không thể tải thư viện Google. Vui lòng kiểm tra kết nối mạng.";
      }
    }, 100);
  }
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

/* Đảm bảo Google button responsive */
.google-btn-wrapper > div {
  width: 100% !important;
  max-width: 330px;
}

/* Style cho error message */
.alert {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

.alert i {
  font-size: 0.8rem;
}
</style>

