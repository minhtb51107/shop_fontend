// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue' // Import layout mới
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true }, // Đánh dấu nhóm route này cần đăng nhập
      children: [
        // ... các route con của admin layout
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
            path: 'employees',
            name: 'employees',
            component: () => import('../modules/user/views/EmployeeList.vue')
        }
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/LoginView.vue')
        }
      ]
    },
    {
    path: 'roles',
    name: 'roles',
    component: () => import('../modules/user/views/RoleList.vue')
  },
  {
    path: 'permissions',
    name: 'permissions',
    component: () => import('../modules/user/views/PermissionList.vue')
  },
  {
        path: 'suppliers',
        name: 'suppliers',
        component: () => import('../modules/supplychain/views/SupplierList.vue')
      },
      {
        path: 'warehouses',
        name: 'warehouses',
        component: () => import('../modules/supplychain/views/WarehouseList.vue')
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('../modules/product/views/ProductList.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../modules/product/views/CategoryList.vue')
      },
      {
        path: 'brands',
        name: 'brands',
        component: () => import('../modules/product/views/BrandList.vue')
      },
      {
            path: 'products',
            name: 'products-list', // Đổi tên để rõ ràng hơn
            component: () => import('../modules/product/views/ProductList.vue')
        },
        {
            // Route cho trang thêm mới sản phẩm
            path: 'products/create',
            name: 'product-create',
            component: () => import('../modules/product/views/ProductEdit.vue')
        },
        {
            // Route cho trang chỉnh sửa sản phẩm
            path: 'products/edit/:id',
            name: 'product-edit',
            component: () => import('../modules/product/views/ProductEdit.vue'),
            props: true // Tự động truyền :id vào làm prop
        },
    ]
  })

// Navigation Guard: "Người gác cổng"
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Nếu route yêu cầu đăng nhập và người dùng chưa đăng nhập
    next({ name: 'login' }); // Chuyển hướng đến trang login
  } else {
    // Nếu không, cho phép đi tiếp
    next();
  }
});

export default router