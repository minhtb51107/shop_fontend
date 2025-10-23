<template>
  <div class="employee-list-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="bi bi-person-badge me-3"></i>
            Quản lý nhân viên
          </h1>
          <p class="page-subtitle">Quản lý thông tin nhân viên và phân quyền hệ thống</p>
        </div>
        <div class="header-actions">
          <button class="btn-add" @click="showAddModal = true">
            <i class="bi bi-plus-circle me-2"></i>
            Thêm nhân viên
      </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalEmployees }}</div>
            <div class="stat-label">Tổng nhân viên</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-person-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ activeEmployees }}</div>
            <div class="stat-label">Đang hoạt động</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-building"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ departments.length }}</div>
            <div class="stat-label">Phòng ban</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-shield-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ adminCount }}</div>
            <div class="stat-label">Quản trị viên</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="filters-content">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm nhân viên..." 
            v-model="searchQuery"
            class="search-input"
          >
        </div>
        <div class="filter-controls">
          <select v-model="departmentFilter" class="filter-select">
            <option value="">Tất cả phòng ban</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
          <select v-model="statusFilter" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="on_leave">Nghỉ phép</option>
          </select>
          <select v-model="sortBy" class="filter-select">
            <option value="fullname">Sắp xếp theo tên</option>
            <option value="hired_date">Sắp xếp theo ngày vào</option>
            <option value="department">Sắp xếp theo phòng ban</option>
            <option value="position">Sắp xếp theo chức vụ</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Employee List -->
    <div class="employees-section">
      <div class="employees-grid">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Đang tải danh sách nhân viên...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredEmployees.length === 0" class="empty-state">
          <i class="bi bi-person-badge" style="font-size: 3rem; color: #6c757d;"></i>
          <h3>Không có nhân viên nào</h3>
          <p>Hiện tại chưa có nhân viên nào trong hệ thống.</p>
        </div>

        <!-- Employee List -->
        <transition-group v-else name="employee-list" tag="div" class="employees-list">
          <div 
            v-for="employee in filteredEmployees" 
            :key="employee.id" 
            class="employee-card"
            @click="viewEmployee(employee)"
          >
            <div class="employee-header">
              <div class="employee-avatar">
                <img 
                  v-if="getEmployeeAvatar(employee)" 
                  :src="getEmployeeAvatar(employee)" 
                  :alt="employee.fullname" 
                />
                <div v-else class="avatar-default">
                  {{ employee.fullname?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <div class="employee-status" :class="employee.statusClass">
                  <span class="status-dot"></span>
                </div>
              </div>
              <div class="employee-actions">
                <button class="btn-action btn-view" @click.stop="viewEmployee(employee)">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action btn-edit" @click.stop="editEmployee(employee)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action btn-delete" @click.stop="deleteEmployee(employee)">
                  <i class="bi bi-trash"></i>
      </button>
              </div>
            </div>
            
            <div class="employee-info">
              <h3 class="employee-name">{{ employee.fullname }}</h3>
              <p class="employee-code">{{ employee.employeeCode || 'N/A' }}</p>
              <p class="employee-position">{{ employee.position || 'N/A' }}</p>
              <p class="employee-department">{{ employee.department || 'N/A' }}</p>
            </div>
            
            <div class="employee-details">
              <div class="detail-item">
                <i class="bi bi-envelope"></i>
                <span>{{ employee.user?.email || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-calendar-event"></i>
                <span>Vào làm: {{ formatDate(employee.hiredDate) }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-clock-history"></i>
                <span>{{ calculateWorkDays(employee.hiredDate) }} ngày</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-circle-fill" :class="employee.isActive ? 'text-success' : 'text-danger'"></i>
                <span>{{ employee.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</span>
              </div>
            </div>
            
            <div class="employee-roles" v-if="employee.roleNames && employee.roleNames.length > 0">
              <div class="role-badges">
                <span 
                  v-for="roleName in employee.roleNames" 
                  :key="roleName" 
                  class="role-badge"
                  :class="getRoleClass(roleName)"
                >
                  {{ roleName }}
                </span>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-section" v-if="!loading && totalEmployees > 0">
      <div class="pagination-info">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, totalEmployees) }} 
        trong tổng số {{ totalEmployees }} nhân viên
      </div>
      <div class="pagination-controls">
        <button 
          class="btn-pagination" 
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          class="btn-pagination" 
          :disabled="currentPage >= totalPages"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên' }}</h3>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x"></i>
                </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEmployee" class="employee-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Họ và tên *</label>
                <input 
                  type="text" 
                  v-model="employeeForm.fullname" 
                  class="form-input"
                  required
                >
              </div>
              <div class="form-group">
                <label class="form-label">Mã nhân viên *</label>
                <input 
                  type="text" 
                  v-model="employeeForm.employeeCode" 
                  class="form-input"
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input 
                  type="email" 
                  v-model="employeeForm.email" 
                  class="form-input"
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Mật khẩu *</label>
                <input 
                  type="password" 
                  v-model="employeeForm.password" 
                  class="form-input"
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Chức vụ *</label>
                <input 
                  type="text" 
                  v-model="employeeForm.position" 
                  class="form-input"
                  required
                >
              </div>
              <div class="form-group">
                <label class="form-label">Phòng ban *</label>
                <select v-model="employeeForm.department" class="form-select" required>
                  <option value="">Chọn phòng ban</option>
                  <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Ngày vào làm *</label>
                <input 
                  type="date" 
                  v-model="employeeForm.hiredDate" 
                  class="form-input"
                  required
                >
              </div>
              <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select v-model="employeeForm.status" class="form-select">
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="on_leave">Nghỉ phép</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Vai trò</label>
              <div class="role-checkboxes">
                <label v-for="role in availableRoles" :key="role" class="checkbox-label">
                  <input 
                    type="checkbox" 
                    :value="role" 
                    v-model="employeeForm.roleNames"
                  >
                  <span class="checkmark"></span>
                  {{ role }}
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Hủy</button>
          <button class="btn-save" @click="saveEmployee">
            {{ showAddModal ? 'Thêm nhân viên' : 'Cập nhật' }}
                </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { employeeService } from '../services/userService.js'

// Reactive data
const employees = ref([])
const totalEmployees = ref(0)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const departmentFilter = ref('')
const statusFilter = ref('')
const sortBy = ref('fullname')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEmployee = ref(null)
const employeeForm = ref({
  fullname: '',
  employeeCode: '',
  email: '',
  password: '',
  position: '',
  department: '',
  hiredDate: '',
  roleNames: []
})

// API methods
const loadEmployees = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = {
      page: currentPage.value - 1, // Backend uses 0-based indexing
      size: itemsPerPage.value,
      sort: `${sortBy.value === 'fullname' ? 'fullname' : sortBy.value},asc`
    }
    
    console.log('👥 Loading employees from API with params:', params)
    
    // ✅ GỌI API THẬT - KHÔNG MOCK
    const response = await employeeService.getAll(params)
    console.log('👥 API Response:', response.data)
    
    // Handle Spring Boot Page response format
    if (response.data && Array.isArray(response.data.content)) {
      employees.value = response.data.content.map(emp => ({
        ...emp,
        statusClass: emp.isActive ? 'status-active' : 'status-inactive'
      }))
      totalEmployees.value = response.data.totalElements
      console.log(`✅ Loaded ${employees.value.length} employees (total: ${totalEmployees.value})`)
    } else if (Array.isArray(response.data)) {
      // Fallback if not using pagination
      employees.value = response.data.map(emp => ({
        ...emp,
        statusClass: emp.isActive ? 'status-active' : 'status-inactive'
      }))
      totalEmployees.value = response.data.length
      console.log(`✅ Loaded ${employees.value.length} employees (no pagination)`)
    } else {
      // No data case
      employees.value = []
      totalEmployees.value = 0
      console.warn('⚠️ No employee data found')
    }
  } catch (err) {
    console.error('❌ Error loading employees:', err)
    console.error('❌ Error details:', err.response?.data)
    
    // Handle different error types
    if (err.response?.status === 403) {
      error.value = 'Bạn không có quyền truy cập trang quản lý nhân viên. Vui lòng liên hệ quản trị viên.'
    } else if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    } else {
      error.value = 'Không thể tải danh sách nhân viên. Vui lòng thử lại sau.'
    }
    
    employees.value = []
    totalEmployees.value = 0
  } finally {
    loading.value = false
  }
}

// Watch for search and filter changes
watch([searchQuery, currentPage, sortBy], () => {
  loadEmployees()
}, { deep: true })

const departments = ['Ban Giám đốc', 'Phòng Kinh doanh', 'Phòng Kho vận', 'Phòng Kế toán', 'Phòng IT', 'Phòng Nhân sự']
const availableRoles = ['ADMIN', 'MANAGER', 'SALES', 'WAREHOUSE', 'ACCOUNTANT', 'HR']

// Computed properties
const activeEmployees = computed(() => employees.value.filter(e => e.isActive).length)
const adminCount = computed(() => employees.value.filter(e => e.roleNames?.includes('ADMIN')).length)

const filteredEmployees = computed(() => {
  let filtered = employees.value

  // Status filter (client-side filtering for now)
  if (statusFilter.value) {
    const statusMap = {
      'active': true,
      'inactive': false
    }
    filtered = filtered.filter(employee => 
      employee.isActive === statusMap[statusFilter.value]
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(totalEmployees.value / itemsPerPage.value))

// Methods
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

const calculateWorkDays = (hiredDate) => {
  if (!hiredDate) return 0
  const hired = new Date(hiredDate)
  const now = new Date()
  const diffTime = Math.abs(now - hired)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getRoleClass = (role) => {
  const roleClasses = {
    'ADMIN': 'role-admin',
    'MANAGER': 'role-manager',
    'SALES': 'role-sales',
    'WAREHOUSE': 'role-warehouse',
    'ACCOUNTANT': 'role-accountant',
    'HR': 'role-hr'
  }
  return roleClasses[role] || 'role-default'
}

const getEmployeeAvatar = (employee) => {
  if (employee.avatar && employee.avatar.trim() !== '') {
    return employee.avatar
  }
  return null
}

const viewEmployee = (employee) => {
  console.log('View employee:', employee)
  // Navigate to employee detail page
}

const editEmployee = (employee) => {
  employeeForm.value = {
    fullname: employee.fullname,
    employeeCode: employee.employeeCode,
    email: employee.email || '',
    password: '', // Don't include password when editing
    position: employee.position || '',
    department: employee.department || '',
    hiredDate: employee.hiredDate,
    status: employee.isActive ? 'active' : 'inactive', // ✅ Thêm status field
    roleNames: employee.roleNames || []
  }
  selectedEmployee.value = employee
  showEditModal.value = true
  console.log('📝 Editing employee:', employee.id, 'Current status:', employee.isActive ? 'active' : 'inactive')
}

const deleteEmployee = async (employee) => {
  if (!confirm(`Bạn có chắc muốn vô hiệu hóa nhân viên "${employee.fullname}"?\n\n(Sẽ chuyển sang trạng thái "Không hoạt động")`)) {
    return
  }
  
  try {
    console.log('🗑️ Deactivating employee:', employee.id)
    
    // ✅ GỌI API UPDATE với isActive = false
    await employeeService.update(employee.id, { isActive: false })
    console.log('✅ Employee deactivated successfully')
    
    // ✅ RELOAD TỪ BACKEND
    await loadEmployees()
    
    alert('✅ Đã vô hiệu hóa nhân viên thành công!')
  } catch (error) {
    console.error('❌ Error deactivating employee:', error)
    console.error('❌ Error details:', error.response?.data)
    
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Có lỗi xảy ra khi vô hiệu hóa nhân viên'
    alert(`❌ ${errorMsg}`)
  }
}

const saveEmployee = async () => {
  try {
    if (showAddModal.value) {
      // Create new employee
      const createData = {
        fullname: employeeForm.value.fullname,
        employeeCode: employeeForm.value.employeeCode,
        email: employeeForm.value.email,
        password: employeeForm.value.password,
        position: employeeForm.value.position,
        department: employeeForm.value.department,
        hiredDate: employeeForm.value.hiredDate,
        roleNames: employeeForm.value.roleNames
      }
      
      console.log('➕ Creating employee:', createData)
      await employeeService.create(createData)
      console.log('✅ Employee created successfully')
      alert('✅ Đã thêm nhân viên thành công!')
    } else {
      // ✅ Update existing employee với isActive status
      const updateData = {
        fullname: employeeForm.value.fullname,
        employeeCode: employeeForm.value.employeeCode,
        position: employeeForm.value.position,
        department: employeeForm.value.department,
        hiredDate: employeeForm.value.hiredDate,
        isActive: employeeForm.value.status === 'active' // ✅ Thêm isActive
      }
      
      console.log('📝 Updating employee:', selectedEmployee.value.id, updateData)
      
      await employeeService.update(selectedEmployee.value.id, updateData)
      console.log('✅ Employee updated successfully')
      
      // Assign roles separately if roles were changed
      if (employeeForm.value.roleNames.length > 0) {
        await employeeService.assignRoles(selectedEmployee.value.id, {
          roleNames: employeeForm.value.roleNames
        })
      }
      
      alert('✅ Đã cập nhật thông tin nhân viên thành công!')
    }
    
    // ✅ RELOAD DATA FROM BACKEND
    await loadEmployees()
    closeModal()
  } catch (error) {
    console.error('❌ Error saving employee:', error)
    console.error('❌ Error details:', error.response?.data)
    
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Có lỗi xảy ra khi lưu thông tin nhân viên'
    alert(`❌ ${errorMsg}`)
  }
}

const getStatusClass = (status) => {
  const statusClasses = {
    'active': 'status-active',
    'inactive': 'status-inactive',
    'on_leave': 'status-on-leave'
  }
  return statusClasses[status] || 'status-active'
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  employeeForm.value = {
    fullname: '',
    employeeCode: '',
    email: '',
    password: '',
    position: '',
    department: '',
    hiredDate: '',
    roleNames: []
  }
}

// Lifecycle
onMounted(() => {
  loadEmployees()
})
</script>

<style scoped>
/* Container */
.employee-list-container {
  padding: 0;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: white;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.page-title i {
  color: #667eea;
}

.page-subtitle {
  color: #6c757d;
  margin: 0;
  font-size: 1.1rem;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

/* Filters Section */
.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.filters-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Employees Section */
.employees-section {
  margin-bottom: 2rem;
}

.employees-grid {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

.employees-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.employee-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.employee-card:hover {
  background: white;
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.employee-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.employee-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}

.employee-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-default {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.4rem;
}

.employee-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.status-active {
  background: #28a745;
}

.status-inactive {
  background: #6c757d;
}

.status-on-leave {
  background: #ffc107;
}

.employee-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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

.employee-info {
  margin-bottom: 1rem;
}

.employee-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.employee-code {
  color: #667eea;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.employee-position {
  color: #2c3e50;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.employee-department {
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.employee-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.detail-item i {
  width: 16px;
  color: #667eea;
}

.employee-roles {
  margin-top: 1rem;
}

.role-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.role-admin {
  background: #ffebee;
  color: #d32f2f;
}

.role-manager {
  background: #e8f5e8;
  color: #2e7d32;
}

.role-sales {
  background: #e3f2fd;
  color: #1976d2;
}

.role-warehouse {
  background: #fff3e0;
  color: #f57c00;
}

.role-accountant {
  background: #f3e5f5;
  color: #7b1fa2;
}

.role-hr {
  background: #e0f2f1;
  color: #00695c;
}

.role-default {
  background: #f5f5f5;
  color: #616161;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.pagination-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-pagination {
  width: 40px;
  height: 40px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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

.page-info {
  font-weight: 600;
  color: #2c3e50;
}

/* Modal */
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
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  width: 35px;
  height: 35px;
  border: none;
  background: #f8f9fa;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #e9ecef;
}

.modal-body {
  padding: 1.5rem;
}

.employee-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.role-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f8f9fa;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-state p {
  margin-top: 1rem;
  color: #6c757d;
}

.empty-state h3 {
  color: #2c3e50;
  margin: 1rem 0 0.5rem;
}

.empty-state p {
  color: #6c757d;
  margin: 0;
}

/* Transitions */
.employee-list-enter-active,
.employee-list-leave-active {
  transition: all 0.3s ease;
}

.employee-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.employee-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .filters-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .employees-list {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .role-checkboxes {
    grid-template-columns: 1fr;
  }
  
  .pagination-section {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>