<template>
  <div class="d-flex" style="min-height: 100vh;">
    <aside class="bg-dark text-white p-3" style="width: 280px;">
      <h4 class="text-center mb-4">
        <i class="bi bi-shop me-2"></i>
        <span>SHOP ADMIN</span>
      </h4>
      <hr>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
    <router-link to="/employees" class="nav-link text-white" active-class="active">
      <i class="bi bi-people me-2"></i>Quản lý nhân viên
    </router-link>
  </li>
  <li class="nav-item">
    <router-link to="/roles" class="nav-link text-white" active-class="active">
      <i class="bi bi-person-rolodex me-2"></i>Quản lý Vai trò
    </router-link>
  </li>
  <li class="nav-item">
    <router-link to="/permissions" class="nav-link text-white" active-class="active">
      <i class="bi bi-key me-2"></i>Quản lý Quyền
    </router-link>
  </li>
  <li class="nav-item">
  <a class="nav-link text-white" data-bs-toggle="collapse" href="#supplyChainSubmenu" role="button">
    <i class="bi bi-truck me-2"></i>Chuỗi cung ứng
  </a>
  <div class="collapse" id="supplyChainSubmenu">
    <ul class="nav flex-column ms-4">
      <li class="nav-item">
        <router-link to="/suppliers" class="nav-link text-white" active-class="active">Nhà cung cấp</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/warehouses" class="nav-link text-white" active-class="active">Kho hàng</router-link>
      </li>
      <li class="nav-item">
  <a class="nav-link text-white" data-bs-toggle="collapse" href="#productSubmenu" role="button">
    <i class="bi bi-box-seam me-2"></i>Sản phẩm
  </a>
  <div class="collapse" id="productSubmenu">
    <ul class="nav flex-column ms-4">
      <li class="nav-item">
        <router-link to="/products" class="nav-link text-white" active-class="active">Danh sách sản phẩm</router-link>
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
                    <strong>Admin</strong>
                </a>
                <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><a class="dropdown-item" href="#">Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </div>
        </div>
      </header>

      <div class="p-4">
        <router-view /> </div>
    </main>
  </div>
</template>

<script setup>
// Script cho layout nếu cần
</script>

<style scoped>
.nav-link.active {
  background-color: #0d6efd !important;
}
.nav-link:hover {
    background-color: #343a40;
}
</style>