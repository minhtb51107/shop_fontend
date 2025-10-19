<template>
  <div v-if="hasError" class="error-handler">
    <div class="error-overlay" @click="closeError">
      <div class="error-content" @click.stop>
        <div class="error-header">
          <div class="error-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <h3 class="error-title">{{ errorTitle }}</h3>
          <button class="btn-close" @click="closeError">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="error-body">
          <p class="error-message">{{ errorMessage }}</p>
          
          <div v-if="errorDetails" class="error-details">
            <details>
              <summary>Chi tiết lỗi</summary>
              <pre class="error-stack">{{ errorDetails }}</pre>
            </details>
          </div>
          
          <div class="error-actions">
            <button class="btn-retry" @click="retry" v-if="canRetry">
              <i class="bi bi-arrow-clockwise me-2"></i>
              Thử lại
            </button>
            <button class="btn-report" @click="reportError" v-if="canReport">
              <i class="bi bi-bug me-2"></i>
              Báo cáo lỗi
            </button>
            <button class="btn-home" @click="goHome">
              <i class="bi bi-house me-2"></i>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props
const props = defineProps({
  error: {
    type: Object,
    default: null
  },
  canRetry: {
    type: Boolean,
    default: true
  },
  canReport: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['retry', 'close', 'report'])

// Reactive data
const hasError = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')
const errorDetails = ref('')

// Computed
const showError = computed(() => props.error !== null)

// Methods
const processError = (error) => {
  hasError.value = true
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const data = error.response.data
    
    switch (status) {
      case 400:
        errorTitle.value = 'Lỗi dữ liệu'
        errorMessage.value = data.message || 'Dữ liệu không hợp lệ'
        break
      case 401:
        errorTitle.value = 'Không có quyền truy cập'
        errorMessage.value = 'Bạn cần đăng nhập để tiếp tục'
        break
      case 403:
        errorTitle.value = 'Từ chối truy cập'
        errorMessage.value = 'Bạn không có quyền thực hiện hành động này'
        break
      case 404:
        errorTitle.value = 'Không tìm thấy'
        errorMessage.value = 'Tài nguyên bạn tìm kiếm không tồn tại'
        break
      case 422:
        errorTitle.value = 'Lỗi xác thực'
        errorMessage.value = data.message || 'Dữ liệu không đúng định dạng'
        break
      case 500:
        errorTitle.value = 'Lỗi máy chủ'
        errorMessage.value = 'Có lỗi xảy ra trên máy chủ, vui lòng thử lại sau'
        break
      case 503:
        errorTitle.value = 'Dịch vụ không khả dụng'
        errorMessage.value = 'Hệ thống đang bảo trì, vui lòng thử lại sau'
        break
      default:
        errorTitle.value = 'Lỗi không xác định'
        errorMessage.value = data.message || 'Có lỗi xảy ra, vui lòng thử lại'
    }
    
    errorDetails.value = JSON.stringify(data, null, 2)
  } else if (error.request) {
    // Network error
    errorTitle.value = 'Lỗi kết nối'
    errorMessage.value = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.'
    errorDetails.value = 'Network Error: ' + error.message
  } else {
    // Other error
    errorTitle.value = 'Lỗi ứng dụng'
    errorMessage.value = error.message || 'Có lỗi không xác định xảy ra'
    errorDetails.value = error.stack || error.toString()
  }
}

const closeError = () => {
  hasError.value = false
  errorTitle.value = ''
  errorMessage.value = ''
  errorDetails.value = ''
  emit('close')
}

const retry = () => {
  closeError()
  emit('retry')
}

const reportError = () => {
  const errorReport = {
    title: errorTitle.value,
    message: errorMessage.value,
    details: errorDetails.value,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  }
  
  emit('report', errorReport)
  
  // Copy to clipboard
  navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
    .then(() => {
      alert('Thông tin lỗi đã được sao chép vào clipboard')
    })
    .catch(() => {
      console.log('Error report:', errorReport)
    })
}

const goHome = () => {
  closeError()
  router.push('/')
}

// Watch for error changes
watch(() => props.error, (newError) => {
  if (newError) {
    processError(newError)
  }
}, { immediate: true })
</script>

<style scoped>
.error-handler {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  animation: errorSlideIn 0.3s ease-out;
}

@keyframes errorSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.error-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.error-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.error-title {
  flex: 1;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-close {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.error-body {
  padding: 1.5rem;
}

.error-message {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.error-details {
  margin-bottom: 1.5rem;
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

.error-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-retry,
.btn-report,
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

.btn-report {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.btn-report:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
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

/* Responsive */
@media (max-width: 768px) {
  .error-overlay {
    padding: 1rem;
  }
  
  .error-content {
    max-height: 90vh;
  }
  
  .error-header {
    padding: 1rem;
  }
  
  .error-title {
    font-size: 1.2rem;
  }
  
  .error-body {
    padding: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .btn-retry,
  .btn-report,
  .btn-home {
    width: 100%;
  }
}
</style>

