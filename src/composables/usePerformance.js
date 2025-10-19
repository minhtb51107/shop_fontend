import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for performance optimization utilities
 */
export function usePerformance() {
  const isOnline = ref(navigator.onLine)
  const connectionSpeed = ref('unknown')
  const memoryUsage = ref(null)

  // Monitor network status
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  // Get connection speed
  const getConnectionSpeed = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      connectionSpeed.value = connection.effectiveType || 'unknown'
    }
  }

  // Get memory usage (if available)
  const getMemoryUsage = () => {
    if ('memory' in performance) {
      memoryUsage.value = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
  }

  // Debounce function for performance
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Throttle function for performance
  const throttle = (func, limit) => {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Lazy load images
  const lazyLoadImage = (imgElement, src) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.src = src
          observer.unobserve(entry.target)
        }
      })
    })
    observer.observe(imgElement)
  }

  // Preload critical resources
  const preloadResource = (href, as = 'script') => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }

  // Monitor performance
  const measurePerformance = (name, fn) => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
    return result
  }

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    getConnectionSpeed()
    getMemoryUsage()
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return {
    isOnline,
    connectionSpeed,
    memoryUsage,
    debounce,
    throttle,
    lazyLoadImage,
    preloadResource,
    measurePerformance,
    getMemoryUsage
  }
}

/**
 * Composable for virtual scrolling
 */
export function useVirtualScroll(items, itemHeight, containerHeight) {
  const scrollTop = ref(0)
  const visibleItems = ref([])
  const totalHeight = computed(() => items.value.length * itemHeight)

  const updateVisibleItems = () => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 1,
      items.value.length
    )
    
    visibleItems.value = items.value.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index,
      top: (start + index) * itemHeight
    }))
  }

  const handleScroll = (event) => {
    scrollTop.value = event.target.scrollTop
    updateVisibleItems()
  }

  watch(scrollTop, updateVisibleItems, { immediate: true })

  return {
    scrollTop,
    visibleItems,
    totalHeight,
    handleScroll
  }
}

/**
 * Composable for image optimization
 */
export function useImageOptimization() {
  const optimizeImage = (src, options = {}) => {
    const {
      width = 800,
      height = 600,
      quality = 0.8,
      format = 'webp'
    } = options

    // Create canvas for image optimization
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = width
        canvas.height = height
        
        ctx.drawImage(img, 0, 0, width, height)
        
        const optimizedDataUrl = canvas.toDataURL(`image/${format}`, quality)
        resolve(optimizedDataUrl)
      }
      
      img.src = src
    })
  }

  const generateResponsiveImages = (src, sizes = [320, 640, 1024, 1920]) => {
    return sizes.map(size => ({
      src: `${src}?w=${size}`,
      width: size,
      media: `(max-width: ${size}px)`
    }))
  }

  return {
    optimizeImage,
    generateResponsiveImages
  }
}
