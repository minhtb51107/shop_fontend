<template>
  <div v-if="isLoading" class="loading-spinner">
    <div class="spinner-overlay" :class="{ 'full-screen': fullScreen }">
      <div class="spinner-content">
        <div class="spinner-container">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        
        <div class="spinner-text">
          <h3 v-if="title" class="spinner-title">{{ title }}</h3>
          <p v-if="message" class="spinner-message">{{ message }}</p>
          <div v-if="showProgress" class="spinner-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ progress }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: 'Đang tải...'
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  }
})
</script>

<style scoped>
.loading-spinner {
  position: relative;
}

.spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: inherit;
}

.spinner-overlay.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 9999;
}

.spinner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 70px;
  height: 70px;
  top: 5px;
  left: 5px;
  border-top-color: #764ba2;
  animation-delay: -0.5s;
}

.spinner-ring:nth-child(3) {
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  border-top-color: #f093fb;
  animation-delay: -1s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spinner-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.spinner-message {
  margin: 0;
  font-size: 1rem;
  color: #6c757d;
}

.spinner-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 200px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .spinner-overlay {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .spinner-overlay.full-screen {
    background: rgba(0, 0, 0, 0.9);
  }
  
  .spinner-title {
    color: #ffffff;
  }
  
  .spinner-message {
    color: #b0b0b0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .spinner-container {
    width: 60px;
    height: 60px;
  }
  
  .spinner-ring:nth-child(2) {
    width: 50px;
    height: 50px;
    top: 5px;
    left: 5px;
  }
  
  .spinner-ring:nth-child(3) {
    width: 40px;
    height: 40px;
    top: 10px;
    left: 10px;
  }
  
  .spinner-title {
    font-size: 1rem;
  }
  
  .spinner-message {
    font-size: 0.9rem;
  }
  
  .spinner-progress {
    width: 150px;
  }
}
</style>

