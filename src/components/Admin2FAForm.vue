<template>
  <div class="admin-2fa-form">
    <div class="card shadow">
      <div class="card-header bg-warning text-dark text-center">
        <i class="bi bi-shield-lock fs-3 mb-2"></i>
        <h5 class="mb-0">Xác thực Admin</h5>
      </div>
      <div class="card-body">
        <div class="text-center mb-4">
          <p class="text-muted">
            Để truy cập vào Admin Panel, bạn cần xác thực qua email
          </p>
          <small class="text-muted">
            Mã xác thực đã được gửi đến email của bạn
          </small>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="message" class="alert alert-success" role="alert">
          <i class="bi bi-check-circle me-2"></i>{{ message }}
        </div>

        <!-- Verification Code Form -->
        <form @submit.prevent="handleVerify" v-if="!codeSent">
          <div class="mb-3">
            <label class="form-label">
              <i class="bi bi-key me-1"></i>Mã xác thực
            </label>
            <input
              type="text"
              class="form-control form-control-lg text-center"
              placeholder="Nhập mã 6 chữ số"
              v-model="verificationCode"
              maxlength="6"
              :disabled="verifying"
              autocomplete="off"
            />
          </div>

          <div class="d-grid gap-2">
            <button 
              type="submit" 
              class="btn btn-primary btn-lg"
              :disabled="verifying || verificationCode.length !== 6"
            >
              <span v-if="verifying" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-shield-check me-2"></i>
              {{ verifying ? 'Đang xác thực...' : 'Xác thực' }}
            </button>
            
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              @click="sendCodeAgain"
              :disabled="sendingCode"
            >
              <span v-if="sendingCode" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-arrow-clockwise me-2"></i>
              Gửi lại mã
            </button>
          </div>
        </form>

        <!-- Code Sent Message -->
        <div v-if="codeSent" class="text-center">
          <i class="bi bi-envelope-check text-success fs-1 mb-3"></i>
          <h6>Mã đã được gửi!</h6>
          <p class="text-muted small">
            Vui lòng kiểm tra email và nhập mã xác thực vào form trên.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const verificationCode = ref('');
const verifying = ref(false);
const sendingCode = ref(false);
const error = ref('');
const message = ref('');
const codeSent = ref(false);

// Auto send code when component mounts
onMounted(async () => {
  await sendVerificationCode();
});

const sendVerificationCode = async () => {
  sendingCode.value = true;
  error.value = '';
  message.value = '';
  
  try {
    await authStore.sendAdminVerificationCode();
    codeSent.value = true;
    message.value = 'Mã xác thực đã được gửi đến email của bạn';
  } catch (err) {
    console.error('Failed to send verification code:', err);
    error.value = err.response?.data?.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.';
  } finally {
    sendingCode.value = false;
  }
};

const sendCodeAgain = async () => {
  codeSent.value = false;
  await sendVerificationCode();
};

const handleVerify = async () => {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    error.value = 'Vui lòng nhập mã xác thực 6 chữ số';
    return;
  }

  verifying.value = true;
  error.value = '';
  
  try {
    await authStore.verifyAdminCode(verificationCode.value);
    message.value = 'Xác thực thành công! Đang chuyển hướng...';
  } catch (err) {
    console.error('Verification failed:', err);
    error.value = err.response?.data?.message || 'Mã xác thực không đúng. Vui lòng thử lại.';
    verificationCode.value = '';
  } finally {
    verifying.value = false;
  }
};

// Auto format code input
const formatCode = () => {
  // Remove non-numeric characters
  verificationCode.value = verificationCode.value.replace(/\D/g, '');
};
</script>

<style scoped>
.admin-2fa-form {
  max-width: 400px;
  margin: 2rem auto;
}

.card-header {
  border-bottom: none;
}

.form-control-lg {
  font-size: 1.5rem;
  letter-spacing: 0.2em;
}

.form-control::placeholder {
  color: #adb5bd;
  font-weight: 300;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}

.alert {
  border-radius: 0.5rem;
}

/* Loading spinner */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
