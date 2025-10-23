// src/directives/permission.js
import { useAuthStore } from '@/stores/auth';

/**
 * Directive v-permission để ẩn/hiện elements dựa trên quyền
 * 
 * Cách sử dụng:
 * 
 * 1. Kiểm tra 1 permission:
 *    <button v-permission="'PRODUCT_WRITE'">Thêm sản phẩm</button>
 * 
 * 2. Kiểm tra nhiều permissions (có 1 trong số đó):
 *    <button v-permission="['PRODUCT_WRITE', 'PRODUCT_DELETE']">Quản lý</button>
 * 
 * 3. Kiểm tra tất cả permissions (phải có đủ):
 *    <button v-permission.all="['PRODUCT_WRITE', 'PRODUCT_DELETE']">Xóa</button>
 * 
 * 4. Kiểm tra role:
 *    <div v-permission.role="'ADMIN'">Admin Panel</div>
 */

function checkPermission(el, binding) {
  const authStore = useAuthStore();
  const { value, modifiers } = binding;

  // Nếu không có value, mặc định cho phép
  if (!value) {
    return true;
  }

  let hasPermission = false;

  // Kiểm tra role
  if (modifiers.role) {
    if (typeof value === 'string') {
      hasPermission = authStore.hasRole(value);
    } else if (Array.isArray(value)) {
      hasPermission = value.some(role => authStore.hasRole(role));
    }
  } 
  // Kiểm tra permission
  else {
    if (typeof value === 'string') {
      // Single permission
      hasPermission = authStore.hasPermission(value);
    } else if (Array.isArray(value)) {
      // Multiple permissions
      if (modifiers.all) {
        // Phải có tất cả permissions
        hasPermission = value.every(permission => authStore.hasPermission(permission));
      } else {
        // Có ít nhất 1 permission
        hasPermission = value.some(permission => authStore.hasPermission(permission));
      }
    }
  }

  // Nếu không có quyền, ẩn element
  if (!hasPermission) {
    // Lưu display style ban đầu
    if (!el._originalDisplay) {
      el._originalDisplay = el.style.display;
    }
    el.style.display = 'none';
    
    // Thêm attribute để debug
    el.setAttribute('data-permission-hidden', 'true');
  } else {
    // Có quyền, hiển thị lại
    if (el._originalDisplay !== undefined) {
      el.style.display = el._originalDisplay;
    }
    el.removeAttribute('data-permission-hidden');
  }

  return hasPermission;
}

export default {
  // Khi directive được bind lần đầu
  mounted(el, binding) {
    checkPermission(el, binding);
  },
  
  // Khi component được update
  updated(el, binding) {
    checkPermission(el, binding);
  }
};

