// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load layouts
const AdminLayout = () => import('../layouts/AdminLayout.vue')
const AuthLayout = () => import('../layouts/AuthLayout.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        // Dashboard
        { 
          path: '', 
          name: 'dashboard', 
          component: () => import('../views/DashboardView.vue'),
          meta: { title: 'Dashboard' }
        },
        
        // User Management Routes
        { 
          path: 'customers', 
          name: 'customers-list', 
          component: () => import('../modules/user/views/CustomerList.vue'),
          meta: { title: 'Quản lý khách hàng' }
        },
        { 
          path: 'employees', 
          name: 'employees', 
          component: () => import('../modules/user/views/EmployeeList.vue'),
          meta: { title: 'Quản lý nhân viên' }
        },
        { 
          path: 'roles', 
          name: 'roles', 
          component: () => import('../modules/user/views/RoleList.vue'),
          meta: { title: 'Quản lý vai trò' }
        },
        { 
          path: 'permissions', 
          name: 'permissions', 
          component: () => import('../modules/user/views/PermissionList.vue'),
          meta: { title: 'Quản lý quyền' }
        },
        { 
          path: 'activity-logs', 
          name: 'activity-logs', 
          component: () => import('../modules/user/views/ActivityLogList.vue'),
          meta: { title: 'Nhật ký hoạt động' }
        },
        
        // Sales Routes
        { 
          path: 'orders', 
          name: 'orders-list', 
          component: () => import('../modules/sale/views/OrderList.vue'),
          meta: { title: 'Quản lý đơn hàng' }
        },
        { 
          path: 'orders/:id', 
          name: 'order-details', 
          component: () => import('../modules/sale/views/OrderDetail.vue'), 
          props: true,
          meta: { title: 'Chi tiết đơn hàng' }
        },
        { 
          path: 'promotions', 
          name: 'promotions-list', 
          component: () => import('../modules/sale/views/PromotionList.vue'),
          meta: { title: 'Quản lý khuyến mãi' }
        },
        
        // Supply Chain Routes
        { 
          path: 'suppliers', 
          name: 'suppliers', 
          component: () => import('../modules/supplychain/views/SupplierList.vue'),
          meta: { title: 'Quản lý nhà cung cấp' }
        },
        { 
          path: 'warehouses', 
          name: 'warehouses', 
          component: () => import('../modules/supplychain/views/WarehouseList.vue'),
          meta: { title: 'Quản lý kho hàng' }
        },
        { 
          path: 'purchase-orders', 
          name: 'purchase-orders-list', 
          component: () => import('../modules/supplychain/views/PurchaseOrderList.vue'),
          meta: { title: 'Quản lý đơn mua hàng' }
        },
        { 
          path: 'purchase-orders/create', 
          name: 'purchase-order-create', 
          component: () => import('../modules/supplychain/views/PurchaseOrderDetail.vue'),
          meta: { title: 'Tạo đơn mua hàng' }
        },
        { 
          path: 'purchase-orders/:id', 
          name: 'purchase-order-detail', 
          component: () => import('../modules/supplychain/views/PurchaseOrderDetail.vue'), 
          props: true,
          meta: { title: 'Chi tiết đơn mua hàng' }
        },
        { 
          path: 'goods-receipts', 
          name: 'goods-receipts-list', 
          component: () => import('../modules/supplychain/views/GoodsReceiptList.vue'),
          meta: { title: 'Quản lý phiếu nhập kho' }
        },
        
        // Product Routes
        { 
          path: 'products', 
          name: 'products-list', 
          component: () => import('../modules/product/views/ProductList.vue'),
          meta: { title: 'Quản lý sản phẩm' }
        },
        { 
          path: 'products/create', 
          name: 'product-create', 
          component: () => import('../modules/product/views/ProductEdit.vue'),
          meta: { title: 'Tạo sản phẩm' }
        },
        { 
          path: 'products/edit/:id', 
          name: 'product-edit', 
          component: () => import('../modules/product/views/ProductEdit.vue'), 
          props: true,
          meta: { title: 'Chỉnh sửa sản phẩm' }
        },
        { 
          path: 'categories', 
          name: 'categories', 
          component: () => import('../modules/product/views/CategoryList.vue'),
          meta: { title: 'Quản lý danh mục' }
        },
        { 
          path: 'brands', 
          name: 'brands', 
          component: () => import('../modules/product/views/BrandList.vue'),
          meta: { title: 'Quản lý thương hiệu' }
        },
        
        // Finance Routes
        { 
          path: 'accounts', 
          name: 'accounts-list', 
          component: () => import('../modules/finance/views/AccountList.vue'),
          meta: { title: 'Quản lý tài khoản' }
        },
        { 
          path: 'reports/revenue', 
          name: 'report-revenue', 
          component: () => import('../modules/finance/views/RevenueReport.vue'),
          meta: { title: 'Báo cáo doanh thu' }
        },

        // User Settings Routes
        { 
          path: 'change-password', 
          name: 'change-password', 
          component: () => import('../views/ChangePasswordView.vue'),
          meta: { title: 'Đổi mật khẩu' }
        },
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { 
          path: 'login', 
          name: 'login', 
          component: () => import('../views/LoginView.vue'),
          meta: { title: 'Đăng nhập' }
        },
        { 
          path: 'register', 
          name: 'register', 
          component: () => import('../views/RegisterView.vue'),
          meta: { title: 'Đăng ký' }
        },
        { 
          path: 'forgot-password', 
          name: 'forgot-password', 
          component: () => import('../views/ForgotPasswordView.vue'),
          meta: { title: 'Quên mật khẩu' }
        },
        { 
          path: 'reset-password', 
          name: 'reset-password', 
          component: () => import('../views/ResetPasswordView.vue'),
          meta: { title: 'Đặt lại mật khẩu' }
        },
        { 
          path: 'activate', 
          name: 'activate-account', 
          component: () => import('../views/ActivateAccountView.vue'),
          meta: { title: 'Kích hoạt tài khoản' }
        },
      ]
    }
    ]
  })

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Shop ERP`;
  }
  
  // Check if route requires authentication
  if (requiresAuth) {
    // First check if we have a token
    if (!authStore.accessToken) {
      console.log('No access token, redirecting to login');
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }
    
    // Check if token is still valid by checking if user data exists
    if (!authStore.user) {
      try {
        console.log('No user data, fetching current user...');
        await authStore.fetchCurrentUser();
        if (!authStore.user) {
          console.log('Failed to fetch user, redirecting to login');
          next({ name: 'login', query: { redirect: to.fullPath } });
          return;
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // If we can't fetch user, logout and redirect
        authStore.logout();
        next({ name: 'login', query: { redirect: to.fullPath } });
        return;
      }
    }
  }
  
  next();
});

// Add loading state management
router.beforeEach((to, from, next) => {
  // Show loading indicator
  const loadingElement = document.getElementById('loading-indicator');
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }
  next();
});

router.afterEach((to, from) => {
  // Hide loading indicator
  const loadingElement = document.getElementById('loading-indicator');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
});

export default router