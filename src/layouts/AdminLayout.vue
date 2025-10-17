<template>
  <div class="d-flex" style="min-height: 100vh;">
    <aside class="bg-dark text-white p-3" style="width: 280px; display: flex; flex-direction: column;">
      <h4 class="text-center mb-4">
        <i class="bi bi-shop me-2"></i>
        <span>SHOP ADMIN</span>
      </h4>
      <hr>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link text-white" active-class="active">
            <i class="bi bi-speedometer2 me-2"></i>Dashboard
          </router-link>
        </li>

        <li class="nav-item">
          <a class="nav-link text-white" data-bs-toggle="collapse" href="#saleSubmenu" role="button">
            <i class="bi bi-receipt me-2"></i>Bán hàng
          </a>
          <div class="collapse" id="saleSubmenu">
            <ul class="nav flex-column ms-4">
              <li class="nav-item">
                <router-link to="/orders" class="nav-link text-white" active-class="active">Đơn hàng</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/returns" class="nav-link text-white" active-class="active">Trả hàng</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/warranty" class="nav-link text-white" active-class="active">Bảo hành</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/promotions" class="nav-link text-white" active-class="active">Khuyến mãi</router-link>
              </li>
            </ul>
          </div>
        </li>

        <li class="nav-item">
          <a class="nav-link text-white" data-bs-toggle="collapse" href="#productSubmenu" role="button">
            <i class="bi bi-box-seam me-2"></i>Sản phẩm
          </a>
          <div class="collapse" id="productSubmenu">
            <ul class="nav flex-column ms-4">
              <li class="nav-item">
                <router-link to="/products" class="nav-link text-white" active-class="active">Sản phẩm</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/categories" class="nav-link text-white" active-class="active">Danh mục</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/brands" class="nav-link text-white" active-class="active">Thương hiệu</router-link>
              </li>
            </ul>
          </div>
        </li>

        <li class="nav-item">
          <a class="nav-link text-white" data-bs-toggle="collapse" href="#supplyChainSubmenu" role="button">
            <i class="bi bi-truck me-2"></i>Chuỗi cung ứng
          </a>
          <div class="collapse" id="supplyChainSubmenu">
            <ul class="nav flex-column ms-4">
               <li class="nav-item">
                <router-link to="/purchase-orders" class="nav-link text-white" active-class="active">Đơn mua hàng</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/suppliers" class="nav-link text-white" active-class="active">Nhà cung cấp</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/warehouses" class="nav-link text-white" active-class="active">Kho hàng</router-link>
              </li>
            </ul>
          </div>
        </li>

        <li class="nav-item">
          <a class="nav-link text-white" data-bs-toggle="collapse" href="#financeSubmenu" role="button">
            <i class="bi bi-cash-coin me-2"></i>Tài chính
          </a>
          <div class="collapse" id="financeSubmenu">
            <ul class="nav flex-column ms-4">
              <li class="nav-item">
                <router-link to="/accounts" class="nav-link text-white" active-class="active">Hệ thống tài khoản</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/reports/revenue" class="nav-link text-white" active-class="active">Báo cáo doanh thu</router-link>
              </li>
            </ul>
          </div>
        </li>

        <li class="nav-item">
          <a class="nav-link text-white" data-bs-toggle="collapse" href="#userSubmenu" role="button">
            <i class="bi bi-person-gear me-2"></i>Người dùng & Phân quyền
          </a>
          <div class="collapse" id="userSubmenu">
            <ul class="nav flex-column ms-4">
              <li class="nav-item">
                <router-link to="/customers" class="nav-link text-white" active-class="active">Khách hàng</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/employees" class="nav-link text-white" active-class="active">Nhân viên</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/roles" class="nav-link text-white" active-class="active">Vai trò</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/permissions" class="nav-link text-white" active-class="active">Quyền</router-link>
              </li>
               <li class="nav-item">
                <router-link to="/activity-logs" class="nav-link text-white" active-class="active">Lịch sử hoạt động</router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </aside>

    <main class="w-100">
      <header class="p-3 mb-3 border-bottom bg-light">
         <div class="d-flex justify-content-end">
            <div class="dropdown">
                <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://via.placeholder.com/32" alt="" width="32" height="32" class="rounded-circle me-2">
                    <strong>{{ authStore.user?.fullname || 'Admin' }}</strong>
                </a>
                <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><a class="dropdown-item" href="#">Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="authStore.logout()">Đăng xuất</a></li>
                </ul>
            </div>
        </div>
      </header>

      <div class="p-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<style scoped>
.nav-link.active {
  background-color: #0d6efd !important;
}
.nav-link:not(.active):hover {
    background-color: rgba(255, 255, 255, 0.1);
}
aside .nav-link {
    border-radius: .25rem;
}
</style>