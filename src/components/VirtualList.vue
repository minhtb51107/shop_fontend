<template>
  <div 
    class="virtual-list" 
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div
        v-for="item in visibleItems"
        :key="item.index"
        :style="{ 
          position: 'absolute', 
          top: item.top + 'px', 
          width: '100%',
          height: itemHeight + 'px'
        }"
      >
        <slot :item="item" :index="item.index">
          {{ item }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    default: 50
  },
  containerHeight: {
    type: Number,
    default: 400
  },
  overscan: {
    type: Number,
    default: 5
  }
})

const scrollTop = ref(0)

const totalHeight = computed(() => props.items.length * props.itemHeight)

const visibleItems = computed(() => {
  const start = Math.floor(scrollTop.value / props.itemHeight)
  const end = Math.min(
    start + Math.ceil(props.containerHeight / props.itemHeight) + props.overscan,
    props.items.length
  )
  
  return props.items.slice(start, end).map((item, index) => ({
    ...item,
    index: start + index,
    top: (start + index) * props.itemHeight
  }))
})

const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop
}
</script>

<style scoped>
.virtual-list {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--scroll-thumb) var(--scroll-track);
}

.virtual-list::-webkit-scrollbar {
  width: 8px;
}

.virtual-list::-webkit-scrollbar-track {
  background: var(--scroll-track);
}

.virtual-list::-webkit-scrollbar-thumb {
  background-color: var(--scroll-thumb);
  border-radius: 10px;
  border: 2px solid var(--scroll-track);
}

.virtual-list::-webkit-scrollbar-thumb:hover {
  background-color: var(--scroll-thumb-hover);
}
</style>
