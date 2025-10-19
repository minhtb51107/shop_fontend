<template>
  <component 
    :is="tag"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :style="buttonStyles"
    @click="handleClick"
    v-bind="$attrs"
  >
    <div class="button-content">
      <!-- Loading Spinner -->
      <div v-if="loading" class="button-spinner">
        <div class="spinner"></div>
      </div>
      
      <!-- Icon -->
      <i v-if="icon && !loading" :class="icon" class="button-icon"></i>
      
      <!-- Text -->
      <span v-if="text || $slots.default" class="button-text">
        <slot>{{ text }}</slot>
      </span>
      
      <!-- Right Icon -->
      <i v-if="rightIcon && !loading" :class="rightIcon" class="button-icon button-icon-right"></i>
    </div>
    
    <!-- Tooltip -->
    <div v-if="tooltip" class="button-tooltip">
      {{ tooltip }}
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  // Content
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: String,
    default: ''
  },
  
  // Appearance
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  shape: {
    type: String,
    default: 'rounded',
    validator: (value) => ['rounded', 'pill', 'square'].includes(value)
  },
  
  // State
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  
  // Behavior
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  tag: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'a', 'router-link', 'div'].includes(value)
  },
  
  // Additional
  tooltip: {
    type: String,
    default: ''
  },
  block: {
    type: Boolean,
    default: false
  },
  gradient: {
    type: Boolean,
    default: false
  },
  shadow: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['click'])

// Computed
const buttonClasses = computed(() => ({
  'btn': true,
  [`btn-${props.variant}`]: true,
  [`btn-${props.size}`]: true,
  [`btn-${props.shape}`]: true,
  'btn-block': props.block,
  'btn-gradient': props.gradient,
  'btn-shadow': props.shadow,
  'btn-animated': props.animated,
  'btn-loading': props.loading,
  'btn-disabled': props.disabled
}))

const buttonStyles = computed(() => {
  const styles = {}
  
  if (props.gradient && props.variant === 'primary') {
    styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  } else if (props.gradient && props.variant === 'success') {
    styles.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
  } else if (props.gradient && props.variant === 'danger') {
    styles.background = 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'
  }
  
  return styles
})

// Methods
const handleClick = (event) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  
  emit('click', event)
}
</script>

<style scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  outline: none;
  font-family: inherit;
  line-height: 1.5;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
}

.btn:disabled,
.btn.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn.btn-loading {
  cursor: wait;
}

/* Sizes */
.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 36px;
}

.btn-medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-height: 44px;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  min-height: 52px;
}

/* Shapes */
.btn-rounded {
  border-radius: 8px;
}

.btn-pill {
  border-radius: 50px;
}

.btn-square {
  border-radius: 0;
}

/* Variants */
.btn-primary {
  background: #667eea;
  color: white;
  border: 1px solid #667eea;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
  border-color: #5a6fd8;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: 1px solid #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  border-color: #5a6268;
}

.btn-success {
  background: #28a745;
  color: white;
  border: 1px solid #28a745;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
  border-color: #218838;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: 1px solid #dc3545;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  border-color: #c82333;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
  border: 1px solid #ffc107;
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
  border-color: #e0a800;
}

.btn-info {
  background: #17a2b8;
  color: white;
  border: 1px solid #17a2b8;
}

.btn-info:hover:not(:disabled) {
  background: #138496;
  border-color: #138496;
}

.btn-light {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
}

.btn-light:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #dee2e6;
}

.btn-dark {
  background: #343a40;
  color: white;
  border: 1px solid #343a40;
}

.btn-dark:hover:not(:disabled) {
  background: #23272b;
  border-color: #1d2124;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

/* Block */
.btn-block {
  width: 100%;
}

/* Shadow */
.btn-shadow {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-shadow:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Animated */
.btn-animated:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-animated:active:not(:disabled) {
  transform: translateY(0);
}

/* Content */
.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
}

.button-icon {
  font-size: 1em;
  line-height: 1;
}

.button-icon-right {
  margin-left: 0.25rem;
}

.button-text {
  line-height: 1;
}

/* Loading Spinner */
.button-spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-loading .button-text,
.btn-loading .button-icon {
  opacity: 0;
}

/* Tooltip */
.button-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  margin-bottom: 0.5rem;
}

.button-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #2c3e50;
}

.btn:hover .button-tooltip {
  opacity: 1;
  visibility: visible;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .btn-outline {
    color: #667eea;
    border-color: #667eea;
  }
  
  .btn-outline:hover:not(:disabled) {
    background: #667eea;
    color: white;
  }
  
  .button-tooltip {
    background: #495057;
  }
  
  .button-tooltip::after {
    border-top-color: #495057;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .btn-medium {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }
  
  .btn-large {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
  
  .button-tooltip {
    display: none; /* Hide tooltips on mobile */
  }
}

/* Focus visible for accessibility */
.btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .btn {
    border-width: 2px;
  }
  
  .btn-outline {
    border-width: 3px;
  }
}
</style>
