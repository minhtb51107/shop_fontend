<template>
  <div class="dashboard-container">
    <!-- Welcome Header -->
    <div class="welcome-header">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1 class="welcome-title">
            <i class="bi bi-sunrise me-3"></i>
            Chào mừng trở lại!
          </h1>
          <p class="welcome-subtitle">
            Chúc bạn một ngày làm việc hiệu quả, {{ userName }}!
          </p>
        </div>
        <div class="welcome-actions">
          <button class="btn-refresh" @click="refreshData">
            <i class="bi bi-arrow-clockwise"></i>
            Làm mới
          </button>
          <div class="current-time">
            <i class="bi bi-clock me-2"></i>
            {{ currentTime }}
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in stats" :key="stat.id" :class="stat.class">
          <div class="stat-header">
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-trend" :class="stat.trendClass">
              <i :class="stat.trendIcon"></i>
              {{ stat.trend }}
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-description">{{ stat.description }}</div>
          </div>
          <div class="stat-chart">
            <div class="mini-chart" :style="{ height: stat.chartHeight + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="dashboard-content">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Recent Orders -->
        <div class="widget-card">
          <div class="widget-header">
            <div class="widget-title">
              <i class="bi bi-cart-check me-2"></i>
              Đơn hàng gần đây
            </div>
            <router-link :to="{ name: 'orders-list' }" class="widget-link">
              Xem tất cả
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
          <div class="widget-body">
            <div class="orders-list">
              <div class="order-item" v-for="order in recentOrders" :key="order.id">
                <div class="order-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <div class="order-details">
                  <div class="order-customer">{{ order.customer }}</div>
                  <div class="order-id">#{{ order.id }}</div>
                </div>
                <div class="order-info">
                  <div class="order-amount">{{ formatCurrency(order.amount) }}</div>
                  <div class="order-status" :class="order.statusClass">
                    <span class="status-dot"></span>
                    {{ order.status }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="widget-card">
          <div class="widget-header">
            <div class="widget-title">
              <i class="bi bi-trophy me-2"></i>
              Sản phẩm bán chạy
            </div>
            <router-link :to="{ name: 'products-list' }" class="widget-link">
              Xem tất cả
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
          <div class="widget-body">
            <div class="products-list">
              <div class="product-item" v-for="product in topProducts" :key="product.id">
                <div class="product-rank" :class="product.rankClass">
                  {{ product.rank }}
                </div>
                <div class="product-image">
                  <i class="bi bi-phone"></i>
                </div>
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-sales">{{ product.sales }} đã bán</div>
                </div>
                <div class="product-growth">
                  <i class="bi bi-arrow-up text-success"></i>
                  +{{ product.growth }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Revenue Chart -->
        <div class="widget-card chart-widget">
          <div class="widget-header">
            <div class="widget-title">
              <i class="bi bi-graph-up me-2"></i>
              Doanh thu 7 ngày qua
            </div>
            <div class="chart-controls">
              <button class="chart-btn" :class="{ active: selectedPeriod === '7d' }" @click="selectedPeriod = '7d'">7D</button>
              <button class="chart-btn" :class="{ active: selectedPeriod === '30d' }" @click="selectedPeriod = '30d'">30D</button>
              <button class="chart-btn" :class="{ active: selectedPeriod === '90d' }" @click="selectedPeriod = '90d'">90D</button>
            </div>
          </div>
          <div class="widget-body">
            <div class="chart-container">
              <div class="chart-bars">
                <div class="chart-bar" v-for="(bar, index) in revenueChart" :key="index" 
                     :style="{ height: bar.height + '%' }" :class="bar.class">
                  <div class="bar-value">{{ bar.value }}</div>
                </div>
              </div>
              <div class="chart-labels">
                <span v-for="label in chartLabels" :key="label">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="widget-card">
          <div class="widget-header">
            <div class="widget-title">
              <i class="bi bi-lightning me-2"></i>
              Thao tác nhanh
            </div>
          </div>
          <div class="widget-body">
            <div class="quick-actions">
              <router-link :to="{ name: 'product-create' }" class="action-btn">
                <div class="action-icon">
                  <i class="bi bi-plus-circle"></i>
                </div>
                <div class="action-text">
                  <div class="action-title">Thêm sản phẩm</div>
                  <div class="action-desc">Tạo sản phẩm mới</div>
                </div>
              </router-link>
              <router-link :to="{ name: 'purchase-order-create' }" class="action-btn">
                <div class="action-icon">
                  <i class="bi bi-cart-plus"></i>
                </div>
                <div class="action-text">
                  <div class="action-title">Tạo đơn hàng</div>
                  <div class="action-desc">Đặt hàng mới</div>
                </div>
              </router-link>
              <router-link :to="{ name: 'suppliers' }" class="action-btn">
                <div class="action-icon">
                  <i class="bi bi-building"></i>
                </div>
                <div class="action-text">
                  <div class="action-title">Quản lý NCC</div>
                  <div class="action-desc">Nhà cung cấp</div>
                </div>
              </router-link>
              <router-link :to="{ name: 'warehouses' }" class="action-btn">
                <div class="action-icon">
                  <i class="bi bi-box"></i>
                </div>
                <div class="action-text">
                  <div class="action-title">Quản lý kho</div>
                  <div class="action-desc">Kho hàng</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="widget-card">
          <div class="widget-header">
            <div class="widget-title">
              <i class="bi bi-activity me-2"></i>
              Trạng thái hệ thống
            </div>
          </div>
          <div class="widget-body">
            <div class="status-list">
              <div class="status-item" v-for="status in systemStatus" :key="status.id">
                <div class="status-indicator" :class="status.statusClass">
                  <i :class="status.icon"></i>
                </div>
                <div class="status-info">
                  <div class="status-name">{{ status.name }}</div>
                  <div class="status-desc">{{ status.description }}</div>
                </div>
                <div class="status-value" :class="status.valueClass">{{ status.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-section">
      <!-- Recent Activities -->
      <div class="widget-card full-width">
        <div class="widget-header">
          <div class="widget-title">
            <i class="bi bi-clock-history me-2"></i>
            Hoạt động gần đây
          </div>
          <router-link :to="{ name: 'activity-logs' }" class="widget-link">
            Xem tất cả
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
        <div class="widget-body">
          <div class="activities-timeline">
            <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
              <div class="activity-icon" :class="activity.typeClass">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
              <div class="activity-status" :class="activity.statusClass">
                {{ activity.status }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Reactive data
const currentTime = ref('')
const selectedPeriod = ref('7d')
const refreshInterval = ref(null)

// Computed properties
const userName = computed(() => authStore.user?.fullname || 'Administrator')

// Stats data
const stats = ref([
  {
    id: 1,
    icon: 'bi bi-cart-check',
    label: 'Tổng đơn hàng',
    value: '1,247',
    description: 'Tăng 12.5% so với tháng trước',
    trend: '+12.5%',
    trendIcon: 'bi bi-arrow-up',
    trendClass: 'trend-up',
    chartHeight: 75,
    class: 'stat-primary'
  },
  {
    id: 2,
    icon: 'bi bi-currency-dollar',
    label: 'Doanh thu',
    value: '₫2.4M',
    description: 'Tăng 8.2% so với tháng trước',
    trend: '+8.2%',
    trendIcon: 'bi bi-arrow-up',
    trendClass: 'trend-up',
    chartHeight: 65,
    class: 'stat-success'
  },
  {
    id: 3,
    icon: 'bi bi-people',
    label: 'Khách hàng',
    value: '3,891',
    description: 'Tăng 15.3% so với tháng trước',
    trend: '+15.3%',
    trendIcon: 'bi bi-arrow-up',
    trendClass: 'trend-up',
    chartHeight: 85,
    class: 'stat-info'
  },
  {
    id: 4,
    icon: 'bi bi-box-seam',
    label: 'Sản phẩm',
    value: '1,156',
    description: 'Tăng 5.7% so với tháng trước',
    trend: '+5.7%',
    trendIcon: 'bi bi-arrow-up',
    trendClass: 'trend-up',
    chartHeight: 55,
    class: 'stat-warning'
  }
])

// Recent orders
const recentOrders = ref([
  { id: 'ORD-001', customer: 'Nguyễn Văn A', amount: 2500000, status: 'Đã giao', statusClass: 'status-delivered' },
  { id: 'ORD-002', customer: 'Trần Thị B', amount: 1800000, status: 'Đang giao', statusClass: 'status-shipping' },
  { id: 'ORD-003', customer: 'Lê Văn C', amount: 3200000, status: 'Chờ xử lý', statusClass: 'status-pending' },
  { id: 'ORD-004', customer: 'Phạm Thị D', amount: 1500000, status: 'Đã giao', statusClass: 'status-delivered' },
  { id: 'ORD-005', customer: 'Hoàng Văn E', amount: 2800000, status: 'Đang giao', statusClass: 'status-shipping' }
])

// Top products
const topProducts = ref([
  { id: 1, name: 'iPhone 15 Pro Max', sales: 156, rank: 1, rankClass: 'rank-gold', growth: 12 },
  { id: 2, name: 'Samsung Galaxy S24', sales: 142, rank: 2, rankClass: 'rank-silver', growth: 8 },
  { id: 3, name: 'MacBook Air M3', sales: 98, rank: 3, rankClass: 'rank-bronze', growth: 15 },
  { id: 4, name: 'iPad Pro 12.9"', sales: 87, rank: 4, rankClass: 'rank-normal', growth: 6 },
  { id: 5, name: 'AirPods Pro 2', sales: 76, rank: 5, rankClass: 'rank-normal', growth: 9 }
])

// Revenue chart data
const revenueChart = ref([
  { height: 45, value: '₫1.2M', class: 'bar-primary' },
  { height: 62, value: '₫1.8M', class: 'bar-success' },
  { height: 38, value: '₫1.1M', class: 'bar-info' },
  { height: 71, value: '₫2.1M', class: 'bar-warning' },
  { height: 55, value: '₫1.6M', class: 'bar-primary' },
  { height: 68, value: '₫2.0M', class: 'bar-success' },
  { height: 49, value: '₫1.4M', class: 'bar-info' }
])

const chartLabels = ref(['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'])

// System status
const systemStatus = ref([
  { id: 1, name: 'Server', description: 'Trạng thái máy chủ', value: 'Online', statusClass: 'status-online', valueClass: 'value-success', icon: 'bi bi-server' },
  { id: 2, name: 'Database', description: 'Kết nối cơ sở dữ liệu', value: 'Connected', statusClass: 'status-online', valueClass: 'value-success', icon: 'bi bi-database' },
  { id: 3, name: 'API', description: 'Dịch vụ API', value: 'Active', statusClass: 'status-online', valueClass: 'value-success', icon: 'bi bi-cloud-check' },
  { id: 4, name: 'Storage', description: 'Dung lượng lưu trữ', value: '78%', statusClass: 'status-warning', valueClass: 'value-warning', icon: 'bi bi-hdd' }
])

// Recent activities
const recentActivities = ref([
  { id: 1, text: 'Đơn hàng #ORD-001 đã được giao thành công', time: '2 phút trước', icon: 'bi bi-check-circle', typeClass: 'activity-success', status: 'Hoàn thành', statusClass: 'status-completed' },
  { id: 2, text: 'Sản phẩm iPhone 15 Pro Max đã được thêm vào kho', time: '15 phút trước', icon: 'bi bi-plus-circle', typeClass: 'activity-info', status: 'Đang xử lý', statusClass: 'status-processing' },
  { id: 3, text: 'Khách hàng Nguyễn Văn A đã đăng ký tài khoản', time: '1 giờ trước', icon: 'bi bi-person-plus', typeClass: 'activity-primary', status: 'Mới', statusClass: 'status-new' },
  { id: 4, text: 'Báo cáo doanh thu tháng 10 đã được tạo', time: '2 giờ trước', icon: 'bi bi-file-earmark-text', typeClass: 'activity-warning', status: 'Hoàn thành', statusClass: 'status-completed' },
  { id: 5, text: 'Cập nhật giá sản phẩm Samsung Galaxy S24', time: '3 giờ trước', icon: 'bi bi-currency-dollar', typeClass: 'activity-success', status: 'Hoàn thành', statusClass: 'status-completed' }
])

// Methods
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const refreshData = () => {
  updateTime()
  // Add loading animation or API call here
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  updateTime()
  refreshInterval.value = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
/* Dashboard Container */
.dashboard-container {
  padding: 0;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Welcome Header */
.welcome-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 0 0 20px 20px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.welcome-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.current-time {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1.1rem;
}

/* Stats Overview */
.stats-overview {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-primary::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-success::before { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
.stat-info::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-warning::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
}

.stat-primary .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-success .stat-icon { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
.stat-info .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-warning .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.trend-up {
  background: #d4edda;
  color: #155724;
}

.stat-content {
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-description {
  color: #6c757d;
  font-size: 0.9rem;
}

.stat-chart {
  width: 100%;
  height: 40px;
  position: relative;
}

.mini-chart {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: height 0.3s ease;
}

/* Dashboard Content */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Widget Cards */
.widget-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.widget-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.widget-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.widget-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
}

.widget-title i {
  color: #667eea;
}

.widget-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.3s ease;
}

.widget-link:hover {
  color: #764ba2;
}

.widget-body {
  padding: 1.5rem;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.order-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.order-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.order-details {
  flex: 1;
}

.order-customer {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.order-id {
  color: #6c757d;
  font-size: 0.9rem;
}

.order-info {
  text-align: right;
}

.order-amount {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.order-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-delivered { 
  background: #d4edda; 
  color: #155724; 
}

.status-delivered .status-dot {
  background: #28a745;
}

.status-shipping { 
  background: #fff3cd; 
  color: #856404; 
}

.status-shipping .status-dot {
  background: #ffc107;
}

.status-pending { 
  background: #f8d7da; 
  color: #721c24; 
}

.status-pending .status-dot {
  background: #dc3545;
}

/* Products List */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.product-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.product-rank {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.rank-gold { background: #ffd700; color: #b8860b; }
.rank-silver { background: #c0c0c0; color: #696969; }
.rank-bronze { background: #cd7f32; color: #8b4513; }
.rank-normal { background: #e9ecef; color: #6c757d; }

.product-image {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.product-sales {
  color: #6c757d;
  font-size: 0.9rem;
}

.product-growth {
  color: #28a745;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Chart */
.chart-widget {
  grid-column: span 1;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
}

.chart-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chart-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.chart-container {
  height: 200px;
  padding: 1rem 0;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 80%;
  gap: 0.5rem;
}

.chart-bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  animation: growUp 1s ease-out;
  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
}

.bar-value {
  position: absolute;
  top: -25px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #6c757d;
}

@keyframes growUp {
  from { height: 0; }
  to { height: var(--height); }
}

.bar-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.bar-success { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
.bar-info { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.bar-warning { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 1rem;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  color: #495057;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.action-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.action-btn:hover .action-icon {
  background: rgba(255, 255, 255, 0.2);
}

.action-text {
  flex: 1;
}

.action-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.action-desc {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* System Status */
.status-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.status-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.status-online { background: #28a745; }
.status-warning { background: #ffc107; }

.status-info {
  flex: 1;
}

.status-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.status-desc {
  color: #6c757d;
  font-size: 0.9rem;
}

.status-value {
  font-weight: 600;
}

.value-success { color: #28a745; }
.value-warning { color: #ffc107; }

/* Activities Timeline */
.full-width {
  grid-column: span 2;
}

.activities-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.activity-success { background: #28a745; }
.activity-info { background: #17a2b8; }
.activity-primary { background: #667eea; }
.activity-warning { background: #ffc107; }

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.activity-time {
  color: #6c757d;
  font-size: 0.9rem;
}

.activity-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-completed { background: #d4edda; color: #155724; }
.status-processing { background: #fff3cd; color: #856404; }
.status-new { background: #d1ecf1; color: #0c5460; }

/* Bottom Section */
.bottom-section {
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
}
</style>