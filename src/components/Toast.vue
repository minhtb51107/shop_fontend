<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast"
        :class="[`toast-${toast.type}`, { 'toast-dismissible': toast.dismissible }]"
        @click="dismissToast(toast.id)"
      >
        <div class="toast-icon">
          <i :class="getToastIcon(toast.type)"></i>
        </div>
        <div class="toast-content">
          <h4 v-if="toast.title" class="toast-title">{{ toast.title }}</h4>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button 
          v-if="toast.dismissible" 
          class="toast-close"
          @click.stop="dismissToast(toast.id)"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const toasts = ref([])
let toastIdCounter = 0

// Methods
const getToastIcon = (type) => {
  const icons = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-exclamation-triangle-fill',
    warning: 'bi bi-exclamation-circle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return icons[type] || icons.info
}

const addToast = (toast) => {
  const id = ++toastIdCounter
  const newToast = {
    id,
    type: 'info',
    title: '',
    message: '',
    duration: 5000,
    dismissible: true,
    ...toast
  }
  
  toasts.value.push(newToast)
  
  // Auto dismiss
  if (newToast.duration > 0) {
    setTimeout(() => {
      dismissToast(id)
    }, newToast.duration)
  }
  
  return id
}

const dismissToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAllToasts = () => {
  toasts.value = []
}

// Toast helper methods
const success = (message, title = 'Thành công', options = {}) => {
  return addToast({ type: 'success', message, title, ...options })
}

const error = (message, title = 'Lỗi', options = {}) => {
  return addToast({ type: 'error', message, title, duration: 0, ...options })
}

const warning = (message, title = 'Cảnh báo', options = {}) => {
  return addToast({ type: 'warning', message, title, ...options })
}

const info = (message, title = 'Thông tin', options = {}) => {
  return addToast({ type: 'info', message, title, ...options })
}

// Expose methods
defineExpose({
  addToast,
  dismissToast,
  clearAllToasts,
  success,
  error,
  warning,
  info
})

// Global toast instance
let globalToastInstance = null

// Lifecycle
onMounted(() => {
  globalToastInstance = {
    addToast,
    dismissToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  }
  
  // Make it globally available
  window.$toast = globalToastInstance
})

onUnmounted(() => {
  if (globalToastInstance) {
    window.$toast = null
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  width: 100%;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.toast:hover {
  transform: translateX(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.toast-success {
  border-left-color: #28a745;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
}

.toast-error {
  border-left-color: #dc3545;
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
}

.toast-warning {
  border-left-color: #ffc107;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
}

.toast-info {
  border-left-color: #17a2b8;
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.toast-success .toast-icon {
  color: #28a745;
}

.toast-error .toast-icon {
  color: #dc3545;
}

.toast-warning .toast-icon {
  color: #ffc107;
}

.toast-info .toast-icon {
  color: #17a2b8;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.toast-message {
  margin: 0;
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #495057;
}

/* Animations */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Progress bar animation */
.toast::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  animation: toastProgress 5s linear forwards;
}

@keyframes toastProgress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .toast {
    background: #2c3e50;
    color: white;
  }
  
  .toast-success {
    background: linear-gradient(135deg, #155724 0%, #1e7e34 100%);
  }
  
  .toast-error {
    background: linear-gradient(135deg, #721c24 0%, #c82333 100%);
  }
  
  .toast-warning {
    background: linear-gradient(135deg, #856404 0%, #e0a800 100%);
  }
  
  .toast-info {
    background: linear-gradient(135deg, #0c5460 0%, #138496 100%);
  }
  
  .toast-title {
    color: white;
  }
  
  .toast-message {
    color: #e9ecef;
  }
  
  .toast-close {
    color: #adb5bd;
  }
  
  .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .toast-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
  
  .toast {
    padding: 0.75rem;
  }
  
  .toast-title {
    font-size: 0.9rem;
  }
  
  .toast-message {
    font-size: 0.8rem;
  }
}
</style>

