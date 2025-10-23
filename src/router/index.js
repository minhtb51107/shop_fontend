import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import auth store
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CartView from '../views/CartView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import OrderConfirmationView from '../views/OrderConfirmationView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import TermsView from '../views/TermsView.vue';
import OrderHistoryView from '../views/OrderHistoryView.vue';
import OrderDetailView from '../views/OrderDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
       path: '/orders',
       name: 'orders',
       component: OrderHistoryView,
       meta: { title: 'Lịch Sử Đơn Hàng', requiresAuth: true }
     },
     {
       path: '/orders/:id',
       name: 'orderDetail',
       component: OrderDetailView,
       props: true,
       meta: { title: 'Chi Tiết Đơn Hàng', requiresAuth: true }
     },
    {
    path: '/terms',
    name: 'terms',
    component: TermsView,
    meta: { title: 'Điều Khoản Dịch Vụ' }
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPasswordView,
      meta: { title: 'Quên Mật khẩu', guestOnly: true }
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPasswordView,
      meta: { title: 'Đặt Lại Mật khẩu', guestOnly: true }
    },
    {
       path: '/checkout',
       name: 'Checkout', // Tên route
       component: CheckoutView,
       meta: { title: 'Thanh Toán', requiresAuth: true } // Yêu cầu đăng nhập
     },
     {
       path: '/order-confirmation/:orderId',
       name: 'orderConfirmation',
       component: OrderConfirmationView,
       props: true,
       meta: { title: 'Xác Nhận Đơn Hàng', requiresAuth: true }
     },
    {
       path: '/profile',
       name: 'profile',
       component: ProfileView,
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
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Đăng Nhập', guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Đăng Ký', guestOnly: true }
    },
  ]
});

// --- NAVIGATION GUARD ---
router.beforeEach(async (to, from, next) => {
  console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`); // <-- LOG 1: Bắt đầu guard

  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);

  // <-- LOG 2: Trạng thái trước khi check auth -->
  console.log(`Route meta: requiresAuth=${requiresAuth}, guestOnly=${guestOnly}`);
  console.log(`Auth state before check: isAuthenticated=${authStore.isAuthenticated}, hasToken=${!!authStore.accessToken}, user=${JSON.stringify(authStore.user)}`);

  // Cố gắng fetch thông tin user nếu có token nhưng chưa có user data
  if (authStore.accessToken && !authStore.user) {
    console.log('Token exists but no user data, attempting checkAuthStatus...'); // <-- LOG 3: Gọi checkAuthStatus
    try {
        await authStore.checkAuthStatus();
        console.log(`Auth state after checkAuthStatus: isAuthenticated=${authStore.isAuthenticated}, user=${JSON.stringify(authStore.user)}`); // <-- LOG 4: Kết quả checkAuthStatus
    } catch (error) {
        console.error('Error during checkAuthStatus:', error); // <-- LOG 5: Lỗi checkAuthStatus
        // Có thể quyết định next('/login') ở đây nếu checkAuthStatus thất bại nghiêm trọng
    }
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    // Nếu route yêu cầu đăng nhập và user chưa đăng nhập
    console.warn(`Access DENIED to ${to.fullPath}. User not authenticated. Redirecting to login.`); // <-- LOG 6: Chặn vì chưa đăng nhập
    authStore.returnUrl = to.fullPath;
    next({ name: 'login' });
  } else if (guestOnly && authStore.isAuthenticated) {
    // Nếu route chỉ dành cho khách và user đã đăng nhập
    console.warn(`Access DENIED to ${to.fullPath}. Route is guest-only. Redirecting to home.`); // <-- LOG 7: Chặn vì đã đăng nhập
    next({ name: 'home' });
  } else {
    // Cho phép truy cập bình thường
    console.log(`Access GRANTED to ${to.fullPath}. Calling next().`); // <-- LOG 8: Cho phép truy cập
    next();
  }

  // Cập nhật tiêu đề trang
  let pageTitle = 'Shop Điện Tử';
  if (to.meta.title) {
      pageTitle = `${to.meta.title} - Shop Điện Tử`;
  }
  document.title = pageTitle;
});


export default router;