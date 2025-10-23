<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Logo & Brand -->
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">
            <i class="bi bi-shop"></i>
          </div>
          <transition name="fade">
            <div v-if="!sidebarCollapsed" class="logo-text">
              <h5 class="mb-0">SHOP ERP</h5>
              <small class="text-muted">Admin Panel</small>
            </div>
          </transition>
        </div>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <i class="bi bi-chevron-left" v-if="!sidebarCollapsed"></i>
          <i class="bi bi-chevron-right" v-else></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <!-- Dashboard -->
        <div class="nav-section">
          <router-link to="/" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path === '/' }">
            <div class="nav-icon">
              <i class="bi bi-speedometer2"></i>
            </div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Dashboard</span>
            </transition>
          </router-link>
        </div>

        <!-- Sales Section -->
        <div class="nav-section">
          <div class="nav-section-title" v-if="!sidebarCollapsed">
            <i class="bi bi-receipt me-2"></i>Bán Hàng
          </div>
          <router-link to="/orders" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/orders') }">
            <div class="nav-icon"><i class="bi bi-cart-check"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Đơn hàng</span>
            </transition>
          </router-link>
          <router-link to="/promotions" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/promotions') }">
            <div class="nav-icon"><i class="bi bi-tag"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Khuyến mãi</span>
            </transition>
          </router-link>
        </div>

        <!-- Products Section -->
        <div class="nav-section">
          <div class="nav-section-title" v-if="!sidebarCollapsed">
            <i class="bi bi-box-seam me-2"></i>Sản Phẩm
          </div>
          <router-link to="/products" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/products') }">
            <div class="nav-icon"><i class="bi bi-grid"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Sản phẩm</span>
            </transition>
          </router-link>
          <router-link to="/categories" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/categories') }">
            <div class="nav-icon"><i class="bi bi-folder"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Danh mục</span>
            </transition>
          </router-link>
          <router-link to="/brands" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/brands') }">
            <div class="nav-icon"><i class="bi bi-award"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Thương hiệu</span>
            </transition>
          </router-link>
        </div>

        <!-- Supply Chain Section -->
        <div class="nav-section">
          <div class="nav-section-title" v-if="!sidebarCollapsed">
            <i class="bi bi-truck me-2"></i>Chuỗi Cung Ứng
          </div>
          <router-link to="/purchase-orders" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/purchase-orders') }">
            <div class="nav-icon"><i class="bi bi-clipboard-check"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Đơn mua hàng</span>
            </transition>
          </router-link>
          <router-link to="/suppliers" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/suppliers') }">
            <div class="nav-icon"><i class="bi bi-building"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Nhà cung cấp</span>
            </transition>
          </router-link>
          <router-link to="/warehouses" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/warehouses') }">
            <div class="nav-icon"><i class="bi bi-box"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Kho hàng</span>
            </transition>
          </router-link>
        </div>

        <!-- Finance Section -->
        <div class="nav-section">
          <div class="nav-section-title" v-if="!sidebarCollapsed">
            <i class="bi bi-calculator me-2"></i>Tài Chính
          </div>
          <router-link to="/accounts" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/accounts') }">
            <div class="nav-icon"><i class="bi bi-bank"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Tài khoản</span>
            </transition>
          </router-link>
          <router-link to="/reports/revenue" class="nav-item" :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/reports') }">
            <div class="nav-icon"><i class="bi bi-graph-up"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Báo cáo</span>
            </transition>
          </router-link>
        </div>

        <!-- User Management Section - ẨN ĐI -->
        <!-- 
        <div class="nav-section">
          <div class="nav-section-title" v-if="!sidebarCollapsed">
            <i class="bi bi-people me-2"></i>Người Dùng
          </div>
          <router-link 
            to="/customers" 
            class="nav-item" 
            :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/customers') }"
          >
            <div class="nav-icon"><i class="bi bi-person-check"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Khách hàng</span>
            </transition>
          </router-link>
          <router-link 
            to="/employees" 
            class="nav-item" 
            :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/employees') }"
          >
            <div class="nav-icon"><i class="bi bi-person-badge"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Nhân viên</span>
            </transition>
          </router-link>
          <router-link 
            to="/roles" 
            class="nav-item" 
            :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/roles') }"
          >
            <div class="nav-icon"><i class="bi bi-shield-check"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Vai trò</span>
            </transition>
          </router-link>
          <router-link 
            to="/permissions" 
            class="nav-item" 
            :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/permissions') }"
          >
            <div class="nav-icon"><i class="bi bi-key"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Quyền</span>
            </transition>
          </router-link>
          <router-link 
            to="/activity-logs" 
            class="nav-item" 
            :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/activity-logs') }"
          >
            <div class="nav-icon"><i class="bi bi-clock-history"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Nhật ký</span>
            </transition>
          </router-link>
          <router-link 
            to="/change-password" 
            class="nav-item" 
            :class="{ 'collapsed': sidebarCollapsed, 'active': $route.path.startsWith('/change-password') }"
          >
            <div class="nav-icon"><i class="bi bi-lock"></i></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">Đổi mật khẩu</span>
            </transition>
          </router-link>
        </div>
        -->
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="nav-item logout-item" @click="logout">
          <div class="nav-icon">
            <i class="bi bi-box-arrow-right"></i>
          </div>
          <transition name="fade">
            <span v-if="!sidebarCollapsed" class="nav-text">Đăng xuất</span>
          </transition>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <button class="mobile-menu-btn" @click="toggleSidebar" v-if="isMobile">
            <i class="bi bi-list"></i>
          </button>
          <div class="breadcrumb">
            <span class="breadcrumb-item">{{ currentPageTitle }}</span>
          </div>
        </div>
        
        <div class="header-right">
          <!-- User Menu -->
          <div class="user-menu">
            <div class="user-avatar">
              <img 
                v-if="userAvatar" 
                :src="userAvatar" 
                :alt="userName"
                @error="handleAvatarError"
              />
              <div v-else class="avatar-placeholder">
                {{ userName?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
            </div>
            <div class="user-info">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
            <i class="bi bi-chevron-down"></i>
            </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      </div>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" v-if="!sidebarCollapsed && isMobile" @click="toggleSidebar"></div>

    <!-- Theme Toggle -->
    <ThemeToggle />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Reactive data
const sidebarCollapsed = ref(false)
const isMobile = ref(false)

// Computed properties
const userName = computed(() => authStore.user?.fullname || 'Administrator')
const userRole = computed(() => authStore.user?.roles?.[0] || 'ADMIN')
const userAvatar = computed(() => {
  if (authStore.user?.avatar && authStore.user.avatar.trim() !== '') {
    return authStore.user.avatar;
  }
  // Return null instead of placeholder URL to avoid network error
  return null;
})

const currentPageTitle = computed(() => {
  const routeNames = {
    'dashboard': 'Dashboard',
    'orders-list': 'Đơn hàng',
    'promotions-list': 'Khuyến mãi',
    'products-list': 'Sản phẩm',
    'categories': 'Danh mục',
    'brands': 'Thương hiệu',
    'purchase-orders-list': 'Đơn mua hàng',
    'suppliers': 'Nhà cung cấp',
    'warehouses': 'Kho hàng',
    'accounts-list': 'Tài khoản',
    'report-revenue': 'Báo cáo',
    'customers-list': 'Khách hàng',
    'employees': 'Nhân viên',
    'roles': 'Vai trò',
    'permissions': 'Quyền',
    'activity-logs': 'Nhật ký hoạt động',
    'change-password': 'Đổi mật khẩu'
  }
  return routeNames[route.name] || 'Trang chủ'
})

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  
  if (isMobile.value) {
    document.body.style.overflow = sidebarCollapsed.value ? 'auto' : 'hidden'
  }
}

const logout = () => {
  authStore.logout()
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  
  if (!isMobile.value) {
    sidebarCollapsed.value = false
    document.body.style.overflow = 'auto'
  } else {
    sidebarCollapsed.value = true
  }
}

const handleAvatarError = (event) => {
  console.log('Avatar image failed to load, using placeholder instead');
  // Hide the broken image and show placeholder
  event.target.style.display = 'none';
  const placeholder = event.target.nextElementSibling || event.target.parentElement.querySelector('.avatar-placeholder');
  if (placeholder) {
    placeholder.style.display = 'flex';
  }
}

// Lifecycle
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
/* Layout */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.logo-text h5 {
  color: white;
  font-weight: 700;
  margin: 0;
}

.logo-text small {
  color: rgba(255, 255, 255, 0.7);
}

.sidebar-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Navigation */
.sidebar-nav {
  padding: 1rem 0;
  flex: 1;
}

.nav-section {
  margin-bottom: 1rem;
}

.nav-section-title {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  margin: 0.25rem 0.5rem;
  border-radius: 8px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: white;
  border-radius: 0 2px 2px 0;
}

.nav-item.collapsed {
  justify-content: center;
  padding: 0.75rem;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.nav-text {
  font-weight: 500;
}

.logout-item {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.main-content.sidebar-collapsed {
  margin-left: 70px;
}

/* Top Header */
.top-header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
}

.breadcrumb {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}


.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-menu:hover {
  background: #f8f9fa;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.page-enter-active, .page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  
  .user-info {
    display: none;
  }
  
  .page-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .top-header {
    padding: 1rem;
  }
}
</style>