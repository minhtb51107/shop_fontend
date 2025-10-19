import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import auth store
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CartView from '../views/CartView.vue';
import LoginView from '../views/LoginView.vue'; // <-- Import LoginView
import RegisterView from '../views/RegisterView.vue'; // <-- Import RegisterView
import ProfileView from '../views/ProfileView.vue'; // <-- Import ProfileView
import CheckoutView from '../views/CheckoutView.vue'; // <-- Import CheckoutView
import OrderConfirmationView from '../views/OrderConfirmationView.vue'; // <-- Import trang xác nhận (sẽ tạo)
import ForgotPasswordView from '../views/ForgotPasswordView.vue'; // <-- Import
import ResetPasswordView from '../views/ResetPasswordView.vue';   // <-- Import

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Đăng Ký', guestOnly: true }
    },
    // --- THÊM ROUTES FORGOT/RESET PASSWORD ---
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPasswordView,
      meta: { title: 'Quên Mật khẩu', guestOnly: true }
    },
    {
      // Sử dụng query param (?token=...) thay vì route param (/reset-password/token)
      // Dễ dàng hơn khi backend gửi link qua email
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPasswordView,
      meta: { title: 'Đặt Lại Mật khẩu', guestOnly: true } // Chỉ cho phép truy cập khi chưa đăng nhập
    },
    {
       path: '/checkout',
       name: 'checkout',
       component: CheckoutView, // <-- Trỏ đến component CheckoutView
       meta: { title: 'Thanh Toán', requiresAuth: true }
     },
     // --- THÊM ROUTE XÁC NHẬN ĐƠN HÀNG ---
     {
         path: '/order-confirmation/:orderId', // Route động với orderId
         name: 'orderConfirmation',
         component: OrderConfirmationView,
         props: true, // Truyền orderId vào làm prop
         meta: { title: 'Xác Nhận Đơn Hàng', requiresAuth: true }
     },
    {
       path: '/profile',
       name: 'profile',
       component: ProfileView, // <-- Trỏ đến component ProfileView
       meta: { title: 'Hồ Sơ Của Tôi', requiresAuth: true }
     },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Trang Chủ' }
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
      meta: { title: 'Sản Phẩm' }
    },
    {
      path: '/product/:id',
      name: 'productDetail',
      component: ProductDetailView,
      props: true,
      meta: { title: 'Chi Tiết Sản Phẩm' }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { title: 'Giỏ Hàng' }
    },
    // --- THÊM ROUTES ĐĂNG NHẬP / ĐĂNG KÝ ---
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Đăng Nhập', guestOnly: true } // guestOnly: chỉ truy cập khi chưa đăng nhập
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Đăng Ký', guestOnly: true } // guestOnly: chỉ truy cập khi chưa đăng nhập
    },
     // --- VÍ DỤ ROUTE CẦN ĐĂNG NHẬP ---
     {
       path: '/profile',
       name: 'profile',
       // component: () => import('../views/ProfileView.vue'), // Lazy load nếu muốn
       component: HomeView, // Tạm thời dùng HomeView để test
       meta: { title: 'Hồ Sơ Của Tôi', requiresAuth: true } // requiresAuth: cần đăng nhập
     },
     {
       path: '/checkout',
       name: 'checkout',
       // component: () => import('../views/CheckoutView.vue'),
       component: CartView, // Tạm thời dùng CartView để test
       meta: { title: 'Thanh Toán', requiresAuth: true } // requiresAuth: cần đăng nhập
     },
  ]
});

// --- NAVIGATION GUARD ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);

  // Cố gắng fetch thông tin user nếu có token nhưng chưa có user data (ví dụ khi refresh trang)
  if (authStore.accessToken && !authStore.user) {
    await authStore.checkAuthStatus(); // checkAuthStatus đã bao gồm fetchUser và refresh token nếu cần
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    // Nếu route yêu cầu đăng nhập và user chưa đăng nhập
    console.log(`Redirecting to login. Attempted to access: ${to.fullPath}`);
    authStore.returnUrl = to.fullPath; // Lưu lại URL muốn truy cập
    next({ name: 'login' });
  } else if (guestOnly && authStore.isAuthenticated) {
    // Nếu route chỉ dành cho khách (chưa đăng nhập) và user đã đăng nhập
    console.log(`Already logged in. Redirecting from guest-only route: ${to.name}`);
    next({ name: 'home' }); // Chuyển về trang chủ
  } else {
    // Cho phép truy cập bình thường
    next();
  }

  // Cập nhật tiêu đề trang (đã có ở Giai đoạn 3)
   if (to.name === 'productDetail' && to.params.id) {
       // Cập nhật title sau khi fetch product (logic này nên ở trong ProductDetailView)
       document.title = `Sản phẩm ${to.params.id} - Shop Điện Tử`;
   } else {
       document.title = to.meta.title ? `${to.meta.title} - Shop Điện Tử` : 'Shop Điện Tử';
   }

});


export default router;