<template>
  <div class="infinite-scroll" @scroll="handleScroll">
    <slot :items="items" :loading="loading" :hasMore="hasMore">
      <div v-for="item in items" :key="item.id" class="infinite-scroll-item">
        {{ item }}
      </div>
    </slot>
    
    <div v-if="loading" class="infinite-scroll-loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span>Đang tải thêm...</span>
      </div>
    </div>
    
    <div v-if="!hasMore && items.length > 0" class="infinite-scroll-end">
      <i class="bi bi-check-circle"></i>
      <span>Đã tải hết dữ liệu</span>
    </div>
    
    <div v-if="error" class="infinite-scroll-error">
      <i class="bi bi-exclamation-triangle"></i>
      <span>{{ error }}</span>
      <button @click="retry" class="btn btn-sm btn-outline-primary">
        Thử lại
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  hasMore: {
    type: Boolean,
    default: true
  },
  threshold: {
    type: Number,
    default: 100
  },
  pageSize: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['loadMore', 'retry'])

const loading = ref(false)
const error = ref('')
const scrollContainer = ref(null)

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  
  if (scrollHeight - scrollTop - clientHeight < props.threshold && 
      props.hasMore && 
      !loading.value) {
    loadMore()
  }
}

const loadMore = async () => {
  if (loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    await emit('loadMore')
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra khi tải dữ liệu'
  } finally {
    loading.value = false
  }
}

const retry = () => {
  error.value = ''
  emit('retry')
}

onMounted(() => {
  scrollContainer.value = document.querySelector('.infinite-scroll')
})
</script>

<style scoped>
.infinite-scroll {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--scroll-thumb) var(--scroll-track);
}

.infinite-scroll::-webkit-scrollbar {
  width: 8px;
}

.infinite-scroll::-webkit-scrollbar-track {
  background: var(--scroll-track);
}

.infinite-scroll::-webkit-scrollbar-thumb {
  background-color: var(--scroll-thumb);
  border-radius: 10px;
  border: 2px solid var(--scroll-track);
}

.infinite-scroll-item {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.infinite-scroll-loading,
.infinite-scroll-end,
.infinite-scroll-error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.infinite-scroll-end {
  color: var(--success-color);
}

.infinite-scroll-error {
  color: var(--danger-color);
  flex-direction: column;
  gap: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
