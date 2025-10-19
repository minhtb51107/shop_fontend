<template>
  <transition name="loading-fade">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <!-- Logo -->
        <div class="loading-logo">
          <div class="logo-icon">
            <i class="bi bi-shop"></i>
          </div>
          <h2 class="logo-text">SHOP ERP</h2>
        </div>

        <!-- Spinner -->
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>

        <!-- Loading Text -->
        <p class="loading-text">{{ loadingText }}</p>

        <!-- Progress Bar -->
        <div class="loading-progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  }
});

const loadingText = ref('Đang tải...');
const progress = ref(0);

const loadingTexts = [
  'Đang khởi động hệ thống...',
  'Đang kết nối...',
  'Đang tải giao diện...',
  'Sắp hoàn tất...'
];

onMounted(() => {
  let textIndex = 0;
  const textInterval = setInterval(() => {
    if (textIndex < loadingTexts.length) {
      loadingText.value = loadingTexts[textIndex];
      textIndex++;
    }
  }, 500);

  // Simulate progress
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10;
    }
  }, 200);

  // Cleanup
  setTimeout(() => {
    clearInterval(textInterval);
    clearInterval(progressInterval);
    progress.value = 100;
  }, 2000);
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logo */
.loading-logo {
  margin-bottom: 3rem;
}

.logo-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: white;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #667eea;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 15px 60px rgba(0, 0, 0, 0.4);
  }
}

.logo-text {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 3px;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Spinner */
.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: 0s;
  opacity: 1;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.5s;
  opacity: 0.7;
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
}

.spinner-ring:nth-child(3) {
  animation-delay: -1s;
  opacity: 0.4;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Loading Text */
.loading-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 2rem 0;
  opacity: 0.9;
  animation: textFade 1.5s ease-in-out infinite;
}

@keyframes textFade {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Progress Bar */
.loading-progress {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-bar {
  height: 100%;
  background: white;
  border-radius: 10px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Fade Transition */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 576px) {
  .logo-icon {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .loading-progress {
    width: 250px;
  }
}
</style>

