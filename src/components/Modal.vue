<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
        <div 
          class="modal-container" 
          :class="modalClasses"
          :style="modalStyles"
          @click.stop
        >
          <!-- Header -->
          <div v-if="showHeader" class="modal-header">
            <div class="modal-title">
              <slot name="header">
                <h3>{{ title }}</h3>
              </slot>
            </div>
            <button 
              v-if="closable" 
              class="modal-close" 
              @click="close"
              :aria-label="closeLabel"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot>
              {{ content }}
            </slot>
          </div>

          <!-- Footer -->
          <div v-if="showFooter" class="modal-footer">
            <slot name="footer">
              <div class="modal-actions">
                <button 
                  v-if="showCancelButton"
                  class="btn btn-secondary" 
                  @click="cancel"
                >
                  {{ cancelText }}
                </button>
                <button 
                  v-if="showConfirmButton"
                  class="btn btn-primary" 
                  @click="confirm"
                  :disabled="confirmDisabled"
                >
                  {{ confirmText }}
                </button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'fullscreen'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Hủy'
  },
  confirmText: {
    type: String,
    default: 'Xác nhận'
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  closeLabel: {
    type: String,
    default: 'Đóng'
  },
  persistent: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  centered: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'cancel', 'confirm', 'opened', 'closed'])

// Reactive data
const isVisible = ref(false)
const isAnimating = ref(false)

// Computed
const modalClasses = computed(() => ({
  [`modal-${props.size}`]: true,
  'modal-scrollable': props.scrollable,
  'modal-centered': props.centered,
  'modal-persistent': props.persistent
}))

const modalStyles = computed(() => {
  const styles = {}
  
  if (props.size === 'fullscreen') {
    styles.width = '100vw'
    styles.height = '100vh'
    styles.maxWidth = 'none'
    styles.maxHeight = 'none'
  }
  
  return styles
})

// Methods
const open = () => {
  if (isVisible.value) return
  
  isVisible.value = true
  isAnimating.value = true
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden'
  
  nextTick(() => {
    isAnimating.value = false
    emit('opened')
  })
}

const close = () => {
  if (!isVisible.value || isAnimating.value) return
  
  isAnimating.value = true
  
  // Restore body scroll
  document.body.style.overflow = ''
  
  setTimeout(() => {
    isVisible.value = false
    isAnimating.value = false
    emit('update:modelValue', false)
    emit('closed')
  }, 300) // Match transition duration
}

const cancel = () => {
  emit('cancel')
  close()
}

const confirm = () => {
  emit('confirm')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.persistent) {
    close()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && props.closeOnEscape && !props.persistent) {
    close()
  }
}

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    open()
  } else {
    close()
  }
})

// Lifecycle
onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleEscape)
  }
  
  if (props.modelValue) {
    open()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})

// Expose methods
defineExpose({
  open,
  close,
  cancel,
  confirm
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-container.modal-centered {
  align-self: center;
}

.modal-container.modal-scrollable {
  overflow-y: auto;
}

.modal-container.modal-persistent {
  pointer-events: auto;
}

/* Sizes */
.modal-small {
  width: 100%;
  max-width: 400px;
}

.modal-medium {
  width: 100%;
  max-width: 600px;
}

.modal-large {
  width: 100%;
  max-width: 800px;
}

.modal-fullscreen {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  border-radius: 0;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 16px 16px 0 0;
}

.modal-title {
  flex: 1;
}

.modal-title h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.modal-close {
  width: 35px;
  height: 35px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #6c757d;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #495057;
}

/* Body */
.modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

/* Footer */
.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
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

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

.modal-enter-to .modal-container,
.modal-leave-from .modal-container {
  transform: scale(1) translateY(0);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: #2c3e50;
    color: white;
  }
  
  .modal-header {
    background: #495057;
    border-bottom-color: #6c757d;
  }
  
  .modal-title h3 {
    color: white;
  }
  
  .modal-close {
    background: rgba(255, 255, 255, 0.1);
    color: #adb5bd;
  }
  
  .modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .modal-footer {
    background: #495057;
    border-top-color: #6c757d;
  }
  
  .btn-secondary {
    background: #495057;
    color: white;
    border-color: #6c757d;
  }
  
  .btn-secondary:hover {
    background: #6c757d;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-title h3 {
    font-size: 1.1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0;
  }
  
  .modal-container {
    border-radius: 0;
    max-height: 100vh;
  }
  
  .modal-header {
    border-radius: 0;
  }
  
  .modal-footer {
    border-radius: 0;
  }
}
</style>

