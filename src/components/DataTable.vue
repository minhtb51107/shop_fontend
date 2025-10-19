<template>
  <div class="data-table-container">
    <!-- Table Header -->
    <div v-if="showHeader" class="table-header">
      <div class="header-left">
        <h3 v-if="title" class="table-title">{{ title }}</h3>
        <p v-if="subtitle" class="table-subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-right">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- Search and Filters -->
    <div v-if="searchable || filterable" class="table-filters">
      <div class="filters-left">
        <div v-if="searchable" class="search-box">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            :placeholder="searchPlaceholder" 
            v-model="searchQuery"
            class="search-input"
          >
        </div>
        <slot name="filters"></slot>
      </div>
      <div class="filters-right">
        <slot name="filter-actions"></slot>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-if="selectable" class="select-column">
              <input 
                type="checkbox" 
                :checked="allSelected"
                @change="toggleSelectAll"
                class="select-checkbox"
              >
            </th>
            <th 
              v-for="column in visibleColumns" 
              :key="column.key"
              :class="getColumnClasses(column)"
              @click="handleSort(column)"
            >
              <div class="column-header">
                <span class="column-title">{{ column.title }}</span>
                <div v-if="column.sortable" class="sort-indicators">
                  <i 
                    class="bi bi-chevron-up" 
                    :class="{ active: sortBy === column.key && sortOrder === 'asc' }"
                  ></i>
                  <i 
                    class="bi bi-chevron-down" 
                    :class="{ active: sortBy === column.key && sortOrder === 'desc' }"
                  ></i>
                </div>
              </div>
            </th>
            <th v-if="hasActions" class="actions-column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(row, index) in paginatedData" 
            :key="getRowKey(row, index)"
            :class="getRowClasses(row, index)"
            @click="handleRowClick(row, index)"
          >
            <td v-if="selectable" class="select-column">
              <input 
                type="checkbox" 
                :checked="isRowSelected(row)"
                @change="toggleRowSelection(row)"
                class="select-checkbox"
                @click.stop
              >
            </td>
            <td 
              v-for="column in visibleColumns" 
              :key="column.key"
              :class="getCellClasses(column, row)"
            >
              <slot 
                :name="`cell-${column.key}`" 
                :row="row" 
                :value="getCellValue(row, column.key)"
                :column="column"
                :index="index"
              >
                <span v-if="column.formatter">
                  {{ column.formatter(getCellValue(row, column.key), row, column) }}
                </span>
                <span v-else>{{ getCellValue(row, column.key) }}</span>
              </slot>
            </td>
            <td v-if="hasActions" class="actions-column">
              <slot name="actions" :row="row" :index="index">
                <div class="action-buttons">
                  <button class="btn-action btn-view" @click.stop="handleAction('view', row)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn-action btn-edit" @click.stop="handleAction('edit', row)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn-action btn-delete" @click.stop="handleAction('delete', row)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <h3 class="empty-title">{{ emptyTitle }}</h3>
        <p class="empty-message">{{ emptyMessage }}</p>
        <slot name="empty-actions"></slot>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="paginated && totalPages > 1" class="table-pagination">
      <div class="pagination-info">
        Hiển thị {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredData.length) }} 
        trong tổng số {{ filteredData.length }} {{ itemLabel }}
      </div>
      <div class="pagination-controls">
        <button 
          class="btn-pagination" 
          :disabled="currentPage === 1"
          @click="goToPage(1)"
        >
          <i class="bi bi-chevron-double-left"></i>
        </button>
        <button 
          class="btn-pagination" 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="btn-page"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="btn-pagination" 
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
        <button 
          class="btn-pagination" 
          :disabled="currentPage === totalPages"
          @click="goToPage(totalPages)"
        >
          <i class="bi bi-chevron-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  searchable: {
    type: Boolean,
    default: true
  },
  filterable: {
    type: Boolean,
    default: false
  },
  selectable: {
    type: Boolean,
    default: false
  },
  sortable: {
    type: Boolean,
    default: true
  },
  paginated: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  searchPlaceholder: {
    type: String,
    default: 'Tìm kiếm...'
  },
  emptyTitle: {
    type: String,
    default: 'Không có dữ liệu'
  },
  emptyMessage: {
    type: String,
    default: 'Không tìm thấy dữ liệu phù hợp'
  },
  itemLabel: {
    type: String,
    default: 'mục'
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  striped: {
    type: Boolean,
    default: true
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  bordered: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'row-click', 
  'row-select', 
  'row-deselect', 
  'select-all', 
  'deselect-all',
  'sort',
  'search',
  'page-change',
  'action'
])

// Reactive data
const searchQuery = ref('')
const sortBy = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)
const selectedRows = ref(new Set())

// Computed
const visibleColumns = computed(() => {
  return props.columns.filter(column => column.visible !== false)
})

const hasActions = computed(() => {
  return !!$slots.actions
})

const filteredData = computed(() => {
  let filtered = [...props.data]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(row => {
      return props.columns.some(column => {
        const value = getCellValue(row, column.key)
        return String(value).toLowerCase().includes(query)
      })
    })
  }

  // Sort
  if (sortBy.value) {
    filtered.sort((a, b) => {
      const aValue = getCellValue(a, sortBy.value)
      const bValue = getCellValue(b, sortBy.value)
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const paginatedData = computed(() => {
  if (!props.paginated) {
    return filteredData.value
  }

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredData.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.pageSize)
})

const allSelected = computed(() => {
  return paginatedData.value.length > 0 && 
         paginatedData.value.every(row => isRowSelected(row))
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Methods
const getCellValue = (row, key) => {
  return key.split('.').reduce((obj, k) => obj?.[k], row)
}

const getRowKey = (row, index) => {
  return row[props.rowKey] || index
}

const getColumnClasses = (column) => {
  return {
    'sortable': column.sortable !== false,
    'text-center': column.align === 'center',
    'text-right': column.align === 'right',
    'text-left': column.align === 'left'
  }
}

const getRowClasses = (row, index) => {
  return {
    'striped': props.striped && index % 2 === 1,
    'hoverable': props.hoverable,
    'selected': isRowSelected(row)
  }
}

const getCellClasses = (column, row) => {
  return {
    'text-center': column.align === 'center',
    'text-right': column.align === 'right',
    'text-left': column.align === 'left'
  }
}

const isRowSelected = (row) => {
  const key = getRowKey(row)
  return selectedRows.value.has(key)
}

const toggleRowSelection = (row) => {
  const key = getRowKey(row)
  
  if (selectedRows.value.has(key)) {
    selectedRows.value.delete(key)
    emit('row-deselect', row)
  } else {
    selectedRows.value.add(key)
    emit('row-select', row)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    paginatedData.value.forEach(row => {
      const key = getRowKey(row)
      selectedRows.value.delete(key)
    })
    emit('deselect-all')
  } else {
    paginatedData.value.forEach(row => {
      const key = getRowKey(row)
      selectedRows.value.add(key)
    })
    emit('select-all', paginatedData.value)
  }
}

const handleSort = (column) => {
  if (column.sortable === false) return
  
  if (sortBy.value === column.key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column.key
    sortOrder.value = 'asc'
  }
  
  emit('sort', { column: column.key, order: sortOrder.value })
}

const handleRowClick = (row, index) => {
  emit('row-click', row, index)
}

const handleAction = (action, row) => {
  emit('action', action, row)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emit('page-change', page)
  }
}

// Watch for data changes
watch(() => props.data, () => {
  currentPage.value = 1
  selectedRows.value.clear()
})

watch(searchQuery, () => {
  currentPage.value = 1
  emit('search', searchQuery.value)
})
</script>

<style scoped>
.data-table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.table-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.table-subtitle {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.table-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: white;
}

.filters-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 0.75rem;
  color: #6c757d;
  z-index: 2;
}

.search-input {
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 250px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: #e9ecef;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.sort-indicators {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.sort-indicators i {
  font-size: 0.75rem;
  color: #adb5bd;
  transition: color 0.3s ease;
}

.sort-indicators i.active {
  color: #667eea;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f8f9fa;
  color: #495057;
}

.data-table tr.striped td {
  background: #f8f9fa;
}

.data-table tr.hoverable:hover td {
  background: #e3f2fd;
}

.data-table tr.selected td {
  background: #e8f5e8;
}

.select-column {
  width: 50px;
  text-align: center;
}

.select-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.actions-column {
  width: 120px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.btn-view {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-view:hover {
  background: #1976d2;
  color: white;
}

.btn-edit {
  background: #fff3e0;
  color: #f57c00;
}

.btn-edit:hover {
  background: #f57c00;
  color: white;
}

.btn-delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-delete:hover {
  background: #d32f2f;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #adb5bd;
}

.empty-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #495057;
}

.empty-message {
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.pagination-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-pagination {
  width: 35px;
  height: 35px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.btn-pagination:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.btn-page {
  width: 35px;
  height: 35px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-page:hover {
  background: #f8f9fa;
}

.btn-page.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .data-table-container {
    background: #2c3e50;
  }
  
  .table-header {
    background: #495057;
    border-bottom-color: #6c757d;
  }
  
  .table-title {
    color: white;
  }
  
  .table-subtitle {
    color: #adb5bd;
  }
  
  .table-filters {
    background: #2c3e50;
    border-bottom-color: #6c757d;
  }
  
  .search-input {
    background: #495057;
    border-color: #6c757d;
    color: white;
  }
  
  .search-input:focus {
    border-color: #667eea;
  }
  
  .data-table th {
    background: #495057;
    color: white;
    border-bottom-color: #6c757d;
  }
  
  .data-table th.sortable:hover {
    background: #6c757d;
  }
  
  .data-table td {
    color: #e9ecef;
    border-bottom-color: #495057;
  }
  
  .data-table tr.striped td {
    background: #495057;
  }
  
  .data-table tr.hoverable:hover td {
    background: #3d4f63;
  }
  
  .data-table tr.selected td {
    background: #2d5a2d;
  }
  
  .empty-state {
    color: #adb5bd;
  }
  
  .empty-title {
    color: #e9ecef;
  }
  
  .table-pagination {
    background: #495057;
    border-top-color: #6c757d;
  }
  
  .pagination-info {
    color: #adb5bd;
  }
  
  .btn-pagination,
  .btn-page {
    background: #495057;
    border-color: #6c757d;
    color: white;
  }
  
  .btn-pagination:hover:not(:disabled),
  .btn-page:hover {
    background: #667eea;
    border-color: #667eea;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .table-filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filters-left {
    flex-direction: column;
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .table-pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
