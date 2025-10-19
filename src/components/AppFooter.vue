<template>
  <footer class="client-footer">
    <div class="container footer-content">
      <div class="footer-section about">
        <h5>Về chúng tôi</h5>
        <p>
          [Tên Shop] chuyên cung cấp các sản phẩm [Loại sản phẩm] chất lượng cao
          với giá cả hợp lý. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt
          nhất cho khách hàng.
        </p>
      </div>

      <div class="footer-section links">
        <h5>Liên kết hữu ích</h5>
        <ul>
          <li><router-link to="/about-us">Giới thiệu</router-link></li> 
          <li><router-link to="/faq">Câu hỏi thường gặp</router-link></li> 
          <li><router-link to="/privacy-policy">Chính sách bảo mật</router-link></li> 
          <li><router-link to="/terms-of-service">Điều khoản dịch vụ</router-link></li> 
          <li><router-link to="/contact">Liên hệ</router-link></li>
        </ul>
      </div>

      <div class="footer-section contact">
        <h5>Thông tin liên hệ</h5>
        <p><i class="fas fa-map-marker-alt"></i> [Địa chỉ cửa hàng]</p>
        <p><i class="fas fa-phone"></i> [Số điện thoại]</p>
        <p><i class="fas fa-envelope"></i> [Địa chỉ email]</p>
      </div>

      <div class="footer-section social">
        <h5>Kết nối với chúng tôi</h5>
        <div class="social-icons">
          <a href="#" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        </div>

      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} [Tên Shop]. Đã đăng ký Bản quyền.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.client-footer {
  background-color: #f8f9fa; /* Màu nền nhẹ cho footer */
  color: #555;
  padding-top: 3rem;
  border-top: 1px solid #e7e7e7;
  margin-top: auto; /* Đẩy footer xuống cuối nếu nội dung trang ngắn */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive grid */
  gap: 2rem; /* Khoảng cách giữa các cột */
  margin-bottom: 2rem;
}

.footer-section h5 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
}

.footer-section p,
.footer-section li {
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section a {
  text-decoration: none;
  color: #555;
  transition: color 0.2s;
}

.footer-section a:hover {
  color: var(--primary-color, #007bff);
}

.footer-section i {
  margin-right: 0.5rem;
  width: 15px; /* Đảm bảo icon căn lề đều */
  text-align: center;
  color: var(--primary-color, #007bff); /* Màu cho icon */
}

.social-icons a {
  display: inline-block;
  margin-right: 1rem;
  font-size: 1.4rem;
  color: #555;
}
.social-icons a:hover {
    color: var(--primary-color, #007bff);
}

.footer-bottom {
  text-align: center;
  padding: 1rem 0;
  border-top: 1px solid #e7e7e7;
  font-size: 0.85rem;
  margin-top: 2rem;
  background-color: #e9ecef; /* Màu nền hơi khác cho phần bottom */
}
</style>