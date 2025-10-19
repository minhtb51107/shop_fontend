<template>
  <div 
    :class="cardClasses" 
    :style="cardStyles"
    @click="handleClick"
  >
    <!-- Header -->
    <div v-if="showHeader" class="card-header">
      <div class="header-content">
        <div class="header-left">
          <div v-if="icon" class="card-icon">
            <i :class="icon"></i>
          </div>
          <div class="card-title-section">
            <h3 v-if="title" class="card-title">{{ title }}</h3>
            <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
          </div>
        </div>
        <div class="header-right">
          <slot name="header-actions"></slot>
        </div>
      </div>
    </div>

    <!-- Image -->
    <div v-if="image" class="card-image">
      <img :src="image" :alt="imageAlt" />
      <div v-if="imageOverlay" class="image-overlay">
        <slot name="image-overlay"></slot>
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <slot>
        <p v-if="content" class="card-content">{{ content }}</p>
      </slot>
    </div>

    <!-- Footer -->
    <div v-if="showFooter" class="card-footer">
      <slot name="footer">
        <div class="footer-actions">
          <slot name="actions"></slot>
        </div>
      </slot>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="card-loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  // Content
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  imageAlt: {
    type: String,
    default: ''
  },
  
  // Appearance
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  shadow: {
    type: String,
    default: 'medium',
    validator: (value) => ['none', 'small', 'medium', 'large'].includes(value)
  },
  
  // Behavior
  clickable: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  
  // Layout
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  imageOverlay: {
    type: Boolean,
    default: false
  },
  
  // Style
  gradient: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: true
  },
  rounded: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['click'])

// Computed
const cardClasses = computed(() => ({
  'card': true,
  [`card-${props.variant}`]: true,
  [`card-${props.size}`]: true,
  [`card-shadow-${props.shadow}`]: true,
  'card-clickable': props.clickable,
  'card-loading': props.loading,
  'card-gradient': props.gradient,
  'card-bordered': props.bordered,
  'card-rounded': props.rounded,
  'card-with-image': !!props.image,
  'card-with-icon': !!props.icon
}))

const cardStyles = computed(() => {
  const styles = {}
  
  if (props.gradient) {
    switch (props.variant) {
      case 'primary':
        styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        styles.color = 'white'
        break
      case 'success':
        styles.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
        styles.color = 'white'
        break
      case 'warning':
        styles.background = 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
        styles.color = '#212529'
        break
      case 'danger':
        styles.background = 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'
        styles.color = 'white'
        break
      case 'info':
        styles.background = 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)'
        styles.color = 'white'
        break
    }
  }
  
  return styles
})

// Methods
const handleClick = () => {
  if (props.clickable && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.card {
  position: relative;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Sizes */
.card-small {
  min-height: 200px;
}

.card-medium {
  min-height: 300px;
}

.card-large {
  min-height: 400px;
}

/* Shadows */
.card-shadow-none {
  box-shadow: none;
}

.card-shadow-small {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-shadow-medium {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-shadow-large {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* Borders */
.card-bordered {
  border: 1px solid #e9ecef;
}

.card-rounded {
  border-radius: 12px;
}

/* Clickable */
.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  transform: translateY(-4px);
}

.card-clickable:hover.card-shadow-small {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.card-clickable:hover.card-shadow-medium {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.card-clickable:hover.card-shadow-large {
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

/* Header */
.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.card-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
}

/* Image */
.card-image {
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-clickable:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-clickable:hover .image-overlay {
  opacity: 1;
}

/* Body */
.card-body {
  padding: 1.5rem;
  flex: 1;
}

.card-content {
  margin: 0;
  color: #495057;
  line-height: 1.6;
}

/* Footer */
.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Loading */
.card-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
}

.spinner {
  width: 100%;
  height: 100%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Variants */
.card-primary .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.card-primary .card-title {
  color: white;
}

.card-primary .card-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.card-success .card-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.card-success .card-title {
  color: white;
}

.card-success .card-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.card-warning .card-header {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: #212529;
  border-bottom-color: rgba(0, 0, 0, 0.1);
}

.card-danger .card-header {
  background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.card-danger .card-title {
  color: white;
}

.card-danger .card-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.card-info .card-header {
  background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.card-info .card-title {
  color: white;
}

.card-info .card-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .card {
    background: #2c3e50;
    color: white;
  }
  
  .card-bordered {
    border-color: #495057;
  }
  
  .card-header {
    background: #495057;
    border-bottom-color: #6c757d;
  }
  
  .card-title {
    color: white;
  }
  
  .card-subtitle {
    color: #adb5bd;
  }
  
  .card-content {
    color: #e9ecef;
  }
  
  .card-footer {
    background: #495057;
    border-top-color: #6c757d;
  }
  
  .card-loading {
    background: rgba(44, 62, 80, 0.9);
  }
  
  .spinner {
    border-color: #495057;
    border-top-color: #667eea;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .card-header,
  .card-body,
  .card-footer {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-image img {
    height: 150px;
  }
  
  .footer-actions {
    flex-direction: column;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .card-bordered {
    border-width: 2px;
  }
  
  .card-header,
  .card-footer {
    border-width: 2px;
  }
}
</style>
