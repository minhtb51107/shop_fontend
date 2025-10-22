// src/stores/wishlistStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import wishlistService from '@/services/wishlistService';
import { useAuthStore } from './auth'; // Import authStore để biết user đã đăng nhập chưa

export const useWishlistStore = defineStore('wishlist', () => {
  // State: Mảng chứa ID của các variant đã được yêu thích
  const favoriteVariantIds = ref([]);
  const isLoading = ref(false); // Cờ báo đang tải dữ liệu
  const authStore = useAuthStore(); // Lấy auth store

  // Getter: Kiểm tra xem một variantId có trong danh sách yêu thích không
  const isFavorite = computed(() => {
    // Trả về một hàm nhận variantId làm tham số
    return (variantId) => favoriteVariantIds.value.includes(variantId);
  });

  // Action: Fetch danh sách ID yêu thích từ backend
  async function fetchWishlistIds() {
    // Chỉ fetch khi đã đăng nhập và chưa đang loading
    if (authStore.isAuthenticated && !isLoading.value) {
      isLoading.value = true;
      try {
        favoriteVariantIds.value = await wishlistService.getMyWishlistVariantIds();
        console.log('Fetched favorite variant IDs:', favoriteVariantIds.value);
      } catch (error) {
        // Lỗi đã được log trong service, ở đây chỉ reset state
        favoriteVariantIds.value = [];
      } finally {
        isLoading.value = false;
      }
    } else {
        // Nếu logout thì xóa danh sách
        favoriteVariantIds.value = [];
    }
  }

  // Action: Thêm một variantId vào danh sách (cả local và gọi API)
  async function addFavorite(variantId) {
    if (!authStore.isAuthenticated) {
        // Có thể redirect đến trang login hoặc báo lỗi
        throw new Error("Bạn cần đăng nhập để thêm vào yêu thích.");
    }
    // Thêm ngay vào local để UI cập nhật nhanh
    if (!favoriteVariantIds.value.includes(variantId)) {
      favoriteVariantIds.value.push(variantId);
    }
    // Gọi API backend
    try {
      await wishlistService.addToWishlist(variantId);
    } catch (error) {
      // Nếu API lỗi, xóa khỏi local và báo lỗi
      favoriteVariantIds.value = favoriteVariantIds.value.filter(id => id !== variantId);
      console.error("Add favorite API failed:", error);
      throw error; // Ném lỗi ra để component hiển thị snackbar
    }
  }

  // Action: Xóa một variantId khỏi danh sách (cả local và gọi API)
  async function removeFavorite(variantId) {
     if (!authStore.isAuthenticated) {
        throw new Error("Lỗi không xác định."); // Không nên xảy ra nếu UI đúng
     }
    // Xóa ngay khỏi local
    const initialLength = favoriteVariantIds.value.length;
    favoriteVariantIds.value = favoriteVariantIds.value.filter(id => id !== variantId);

    // Gọi API backend
    try {
      await wishlistService.removeFromWishlist(variantId);
    } catch (error) {
      // Nếu API lỗi, thêm lại vào local và báo lỗi
       if (favoriteVariantIds.value.length < initialLength && !favoriteVariantIds.value.includes(variantId)) {
            favoriteVariantIds.value.push(variantId); // Thêm lại nếu đã bị xóa ở local
       }
      console.error("Remove favorite API failed:", error);
      throw error; // Ném lỗi ra để component hiển thị snackbar
    }
  }

   // Action: Xóa sạch wishlist khi logout
   function clearWishlist() {
       favoriteVariantIds.value = [];
   }


  return {
    favoriteVariantIds,
    isLoading,
    isFavorite, // Getter để kiểm tra
    fetchWishlistIds, // Action để tải lần đầu
    addFavorite,    // Action để thêm
    removeFavorite, // Action để xóa
    clearWishlist, // Action để xóa khi logout
  };
});