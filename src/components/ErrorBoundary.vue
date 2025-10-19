<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <h2 class="error-title">Đã xảy ra lỗi</h2>
      <p class="error-message">{{ errorMessage }}</p>
      
      <div class="error-actions">
        <button class="btn-retry" @click="retry">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Thử lại
        </button>
        <button class="btn-home" @click="goHome">
          <i class="bi bi-house me-2"></i>
          Về trang chủ
        </button>
      </div>
      
      <details v-if="showDetails" class="error-details">
        <summary>Chi tiết lỗi</summary>
        <pre class="error-stack">{{ errorStack }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props
const props = defineProps({
  fallback: {
    type: Function,
    default: null
  },
  onError: {
    type: Function,
    default: null
  }
})

// Reactive data
const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const showDetails = ref(false)

// Methods
const handleError = (error, errorInfo) => {
  console.error('ErrorBoundary caught an error:', error, errorInfo)
  
  hasError.value = true
  errorMessage.value = error.message || 'Có lỗi không xác định xảy ra'
  errorStack.value = error.stack || error.toString()
  
  // Call custom error handler
  if (props.onError) {
    props.onError(error, errorInfo)
  }
  
  // Report to error tracking service
  reportError(error, errorInfo)
}

const reportError = (error, errorInfo) => {
  const errorReport = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  }
  
  // Send to error tracking service
  console.log('Error report:', errorReport)
  
  // You can integrate with services like Sentry, LogRocket, etc.
  // Example: Sentry.captureException(error, { extra: errorInfo })
}

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  showDetails.value = false
  
  // Force re-render
  nextTick(() => {
    // Component will re-render and try again
  })
}

const goHome = () => {
  hasError.value = false
  router.push('/')
}

// Vue error handling
const originalErrorHandler = window.console.error

onMounted(() => {
  // Override console.error to catch Vue errors
  window.console.error = (...args) => {
    const error = args.find(arg => arg instanceof Error)
    if (error) {
      handleError(error, { source: 'console.error' })
    }
    originalErrorHandler.apply(console, args)
  }
  
  // Global error handler
  window.addEventListener('error', (event) => {
    handleError(event.error, { source: 'global' })
  })
  
  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    handleError(new Error(event.reason), { source: 'unhandledrejection' })
  })
})

onUnmounted(() => {
  // Restore original console.error
  window.console.error = originalErrorHandler
  
  // Remove event listeners
  window.removeEventListener('error', handleError)
  window.removeEventListener('unhandledrejection', handleError)
})

// Expose error handling method
defineExpose({
  handleError,
  retry,
  goHome
})
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 16px;
  border: 2px dashed #dee2e6;
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.error-message {
  font-size: 1rem;
  color: #6c757d;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-retry,
.btn-home {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-retry {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-home {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
}

.btn-home:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.error-details {
  text-align: left;
  margin-top: 2rem;
}

.error-details details {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.error-details summary {
  padding: 1rem;
  background: #f8f9fa;
  cursor: pointer;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
}

.error-details summary:hover {
  background: #e9ecef;
}

.error-stack {
  padding: 1rem;
  background: #f8f9fa;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #495057;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .error-boundary {
    background: #2c3e50;
    border-color: #495057;
  }
  
  .error-title {
    color: white;
  }
  
  .error-message {
    color: #adb5bd;
  }
  
  .btn-home {
    background: #495057;
    color: white;
    border-color: #6c757d;
  }
  
  .btn-home:hover {
    background: #6c757d;
  }
  
  .error-details details {
    border-color: #495057;
  }
  
  .error-details summary {
    background: #495057;
    color: white;
  }
  
  .error-details summary:hover {
    background: #6c757d;
  }
  
  .error-stack {
    background: #495057;
    color: #adb5bd;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .error-boundary {
    padding: 1rem;
    min-height: 300px;
  }
  
  .error-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .error-title {
    font-size: 1.2rem;
  }
  
  .error-message {
    font-size: 0.9rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-retry,
  .btn-home {
    width: 100%;
    max-width: 200px;
  }
}
</style>

