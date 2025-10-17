// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        // Routes đã có...
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'customers', name: 'customers-list', component: () => import('../modules/user/views/CustomerList.vue') },
        { path: 'employees', name: 'employees', component: () => import('../modules/user/views/EmployeeList.vue') },
        { path: 'roles', name: 'roles', component: () => import('../modules/user/views/RoleList.vue') },
        { path: 'permissions', name: 'permissions', component: () => import('../modules/user/views/PermissionList.vue') },
        { path: 'activity-logs', name: 'activity-logs', component: () => import('../modules/user/views/ActivityLogList.vue') },
        
        // START: Bán hàng (Sale)
        { path: 'orders', name: 'orders-list', component: () => import('../modules/sale/views/OrderList.vue') },
        { path: 'orders/:id', name: 'order-details', component: () => import('../modules/sale/views/OrderDetail.vue'), props: true },
        { path: 'promotions', name: 'promotions-list', component: () => import('../modules/sale/views/PromotionList.vue') },
        // THÊM: Quản lý Đổi/Trả hàng
        { path: 'returns', name: 'returns-list', component: () => import('../modules/sale/views/ReturnList.vue') },
        { path: 'returns/:id', name: 'return-details', component: () => import('../modules/sale/views/ReturnDetail.vue'), props: true }, // Giả định có trang chi tiết ReturnDetail.vue
        // THÊM: Quản lý Bảo hành
        { path: 'warranty', name: 'warranty-list', component: () => import('../modules/sale/views/WarrantyList.vue') },
        { path: 'warranty/:id', name: 'warranty-details', component: () => import('../modules/sale/views/WarrantyDetail.vue'), props: true }, // Giả định có trang chi tiết WarrantyDetail.vue
        // END: Bán hàng (Sale)

        { path: 'purchase-orders', name: 'purchase-orders-list', component: () => import('../modules/supplychain/views/PurchaseOrderList.vue') },
        { path: 'purchase-orders/create', name: 'purchase-order-create', component: () => import('../modules/supplychain/views/PurchaseOrderDetail.vue') },
        { path: 'purchase-orders/:id', name: 'purchase-order-detail', component: () => import('../modules/supplychain/views/PurchaseOrderDetail.vue'), props: true },
        { path: 'suppliers', name: 'suppliers', component: () => import('../modules/supplychain/views/SupplierList.vue') },
        { path: 'warehouses', name: 'warehouses', component: () => import('../modules/supplychain/views/WarehouseList.vue') },
        { path: 'products', name: 'products-list', component: () => import('../modules/product/views/ProductList.vue') },
        { path: 'products/create', name: 'product-create', component: () => import('../modules/product/views/ProductEdit.vue') },
        { path: 'products/edit/:id', name: 'product-edit', component: () => import('../modules/product/views/ProductEdit.vue'), props: true },
        { path: 'categories', name: 'categories', component: () => import('../modules/product/views/CategoryList.vue') },
        { path: 'brands', name: 'brands', component: () => import('../modules/product/views/BrandList.vue') },
        { path: 'accounts', name: 'accounts-list', component: () => import('../modules/finance/views/AccountList.vue') },
        { path: 'reports/revenue', name: 'report-revenue', component: () => import('../modules/finance/views/RevenueReport.vue') },
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') },
        { path: 'register', name: 'register', component: () => import('../views/RegisterView.vue') },
        { path: 'forgot-password', name: 'forgot-password', component: () => import('../views/ForgotPasswordView.vue') },
        { path: 'reset-password', name: 'reset-password', component: () => import('../views/ResetPasswordView.vue') },
      ]
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router