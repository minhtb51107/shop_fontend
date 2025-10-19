/**
 * Cache service for performance optimization
 */
class CacheService {
  constructor() {
    this.cache = new Map()
    this.maxSize = 100
    this.ttl = 5 * 60 * 1000 // 5 minutes
  }

  set(key, value, ttl = this.ttl) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  has(key) {
    return this.get(key) !== null
  }

  delete(key) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

/**
 * Offline service for handling offline scenarios
 */
class OfflineService {
  constructor() {
    this.isOnline = navigator.onLine
    this.pendingRequests = []
    this.setupEventListeners()
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processPendingRequests()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  async request(url, options = {}) {
    if (this.isOnline) {
      try {
        const response = await fetch(url, options)
        return response
      } catch (error) {
        if (!this.isOnline) {
          this.addPendingRequest(url, options)
        }
        throw error
      }
    } else {
      this.addPendingRequest(url, options)
      throw new Error('Offline - request queued')
    }
  }

  addPendingRequest(url, options) {
    this.pendingRequests.push({ url, options, timestamp: Date.now() })
  }

  async processPendingRequests() {
    const requests = [...this.pendingRequests]
    this.pendingRequests = []

    for (const request of requests) {
      try {
        await fetch(request.url, request.options)
      } catch (error) {
        console.error('Failed to process pending request:', error)
      }
    }
  }

  getPendingRequestsCount() {
    return this.pendingRequests.length
  }
}

/**
 * Performance monitoring service
 */
class PerformanceService {
  constructor() {
    this.metrics = new Map()
    this.observers = []
  }

  startTiming(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    })
  }

  endTiming(name) {
    const metric = this.metrics.get(name)
    if (metric) {
      metric.endTime = performance.now()
      metric.duration = metric.endTime - metric.startTime
      
      // Notify observers
      this.observers.forEach(observer => {
        if (observer.name === name || observer.name === '*') {
          observer.callback(metric)
        }
      })
    }
  }

  getTiming(name) {
    return this.metrics.get(name)
  }

  getAllTimings() {
    return Array.from(this.metrics.entries())
  }

  observeTiming(name, callback) {
    this.observers.push({ name, callback })
  }

  measureAsync(name, asyncFn) {
    this.startTiming(name)
    return asyncFn().finally(() => {
      this.endTiming(name)
    })
  }

  measureSync(name, syncFn) {
    this.startTiming(name)
    const result = syncFn()
    this.endTiming(name)
    return result
  }
}

/**
 * Resource preloader service
 */
class PreloadService {
  constructor() {
    this.preloadedResources = new Set()
  }

  async preloadImage(src) {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.preloadedResources.add(src)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  async preloadImages(srcs) {
    return Promise.all(srcs.map(src => this.preloadImage(src)))
  }

  async preloadScript(src) {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        this.preloadedResources.add(src)
        resolve()
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async preloadCSS(href) {
    if (this.preloadedResources.has(href)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = 'style'
      link.onload = () => {
        this.preloadedResources.add(href)
        resolve()
      }
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  isPreloaded(src) {
    return this.preloadedResources.has(src)
  }
}

// Export services
export const cacheService = new CacheService()
export const offlineService = new OfflineService()
export const performanceService = new PerformanceService()
export const preloadService = new PreloadService()

// Export classes for custom instances
export { CacheService, OfflineService, PerformanceService, PreloadService }
