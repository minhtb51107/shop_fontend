<template>
  <div class="lazy-image-container" :style="containerStyle">
    <img
      v-if="loaded"
      :src="src"
      :alt="alt"
      :class="imageClass"
      :style="imageStyle"
      @load="onLoad"
      @error="onError"
    />
    <div 
      v-else
      class="lazy-image-placeholder"
      :style="placeholderStyle"
    >
      <div class="loading-spinner" v-if="loading">
        <div class="spinner"></div>
      </div>
      <div class="error-icon" v-else-if="error">
        <i class="bi bi-image"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  placeholder: {
    type: String,
    default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
  },
  lazy: {
    type: Boolean,
    default: true
  },
  threshold: {
    type: Number,
    default: 0.1
  },
  rootMargin: {
    type: String,
    default: '50px'
  }
})

const emit = defineEmits(['load', 'error'])

const loaded = ref(false)
const loading = ref(false)
const error = ref(false)
const observer = ref(null)

const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  position: 'relative',
  overflow: 'hidden'
}))

const imageStyle = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'opacity 0.3s ease'
}))

const placeholderStyle = computed(() => ({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${props.placeholder})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5'
}))

const loadImage = () => {
  if (loaded.value) return
  
  loading.value = true
  error.value = false
  
  const img = new Image()
  img.onload = () => {
    loaded.value = true
    loading.value = false
    emit('load')
  }
  img.onerror = () => {
    error.value = true
    loading.value = false
    emit('error')
  }
  img.src = props.src
}

const onLoad = () => {
  emit('load')
}

const onError = () => {
  emit('error')
}

onMounted(() => {
  if (!props.lazy) {
    loadImage()
    return
  }

  // Create Intersection Observer for lazy loading
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage()
          observer.value?.unobserve(entry.target)
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin
    }
  )

  // Start observing the container
  const container = document.querySelector('.lazy-image-container')
  if (container) {
    observer.value.observe(container)
  }
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-icon {
  color: #999;
  font-size: 24px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
