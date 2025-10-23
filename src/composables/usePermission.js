// src/composables/usePermission.js
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

/**
 * Composable để kiểm tra permissions trong components
 * 
 * @example
 * import { usePermission } from '@/composables/usePermission';
 * 
 * const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions } = usePermission();
 * 
 * if (hasPermission('PRODUCT_WRITE')) {
 *   // Show edit button
 * }
 */
export function usePermission() {
  const authStore = useAuthStore();

  /**
   * Kiểm tra user có permission cụ thể không
   * @param {string} permission - Tên permission cần check (VD: 'PRODUCT_WRITE')
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!permission) return true; // Nếu không yêu cầu permission thì cho phép
    return authStore.hasPermission(permission);
  };

  /**
   * Kiểm tra user có role cụ thể không
   * @param {string} role - Tên role cần check (VD: 'ADMIN')
   * @returns {boolean}
   */
  const hasRole = (role) => {
    if (!role) return true;
    return authStore.hasRole(role);
  };

  /**
   * Kiểm tra user có ít nhất 1 trong các permissions
   * @param {string[]} permissions - Array các permissions
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.some(permission => hasPermission(permission));
  };

  /**
   * Kiểm tra user có tất cả các permissions
   * @param {string[]} permissions - Array các permissions
   * @returns {boolean}
   */
  const hasAllPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.every(permission => hasPermission(permission));
  };

  /**
   * Kiểm tra user có ít nhất 1 trong các roles
   * @param {string[]} roles - Array các roles
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    if (!roles || roles.length === 0) return true;
    return roles.some(role => hasRole(role));
  };

  /**
   * Computed properties để reactive với auth store
   */
  const isAdmin = computed(() => authStore.isAdmin);
  const userRoles = computed(() => authStore.userRoles);
  const userPermissions = computed(() => authStore.userPermissions || []);
  const currentUser = computed(() => authStore.currentUser);

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    isAdmin,
    userRoles,
    userPermissions,
    currentUser
  };
}

