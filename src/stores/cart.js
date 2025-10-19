// src/stores/cart.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Định nghĩa kiểu dữ liệu cho một item trong giỏ hàng (để rõ ràng hơn)
/**
 * @typedef {object} CartItem
 * @property {number} id - Product ID
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {string} [imageUrl] - Product image URL
 * @property {number} quantity - Quantity in cart
 */

export const useCartStore = defineStore('cart', () => {
  /** @type {import('vue').Ref<CartItem[]>} */
  const items = ref([]); // Mảng chứa các sản phẩm trong giỏ

  // --- Getters (Computed Properties) ---

  // Tính tổng số lượng sản phẩm trong giỏ
  const totalItemsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  // Tính tổng giá trị giỏ hàng
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  // Định dạng tổng tiền
  const formattedTotalPrice = computed(() => {
     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice.value);
  });

  // --- Actions ---

  /**
   * Thêm sản phẩm vào giỏ hoặc tăng số lượng nếu đã tồn tại.
   * @param {object} product - Product object to add (cần có id, name, price, imageUrl)
   * @param {number} quantityToAdd - Số lượng muốn thêm
   */
  function addItem(product, quantityToAdd = 1) {
    if (!product || typeof product.id === 'undefined') {
        console.error("Invalid product object passed to addItem:", product);
        return; // Không thêm nếu product không hợp lệ
    }

    const existingItemIndex = items.value.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Sản phẩm đã tồn tại, tăng số lượng
      items.value[existingItemIndex].quantity += quantityToAdd;
    } else {
      // Sản phẩm mới, thêm vào giỏ
      items.value.push({
        id: product.id,
        name: product.name || 'Tên sản phẩm', // Cung cấp giá trị mặc định
        price: product.price || 0, // Cung cấp giá trị mặc định
        imageUrl: product.imageUrl,
        quantity: quantityToAdd,
      });
    }
     // TODO: Lưu giỏ hàng vào localStorage (sẽ làm sau)
  }

  /**
   * Cập nhật số lượng của một sản phẩm trong giỏ.
   * @param {number} productId - ID của sản phẩm cần cập nhật
   * @param {number} newQuantity - Số lượng mới
   */
  function updateItemQuantity(productId, newQuantity) {
    const itemIndex = items.value.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      if (newQuantity > 0) {
        items.value[itemIndex].quantity = newQuantity;
      } else {
        // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ
        removeItem(productId);
      }
       // TODO: Lưu giỏ hàng vào localStorage
    }
  }

  /**
   * Xóa một sản phẩm khỏi giỏ.
   * @param {number} productId - ID của sản phẩm cần xóa
   */
  function removeItem(productId) {
    items.value = items.value.filter(item => item.id !== productId);
     // TODO: Lưu giỏ hàng vào localStorage
  }

  /**
   * Xóa toàn bộ giỏ hàng.
   */
  function clearCart() {
    items.value = [];
     // TODO: Xóa giỏ hàng khỏi localStorage
  }

  /**
   * Lấy giỏ hàng từ localStorage khi khởi tạo store (sẽ làm sau)
   */
  function loadCartFromLocalStorage() {
      // const savedCart = localStorage.getItem('shoppingCart');
      // if (savedCart) {
      //   items.value = JSON.parse(savedCart);
      // }
  }
   // loadCartFromLocalStorage(); // Gọi khi store được khởi tạo

  return {
    items,
    totalItemsCount,
    totalPrice,
    formattedTotalPrice,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
  };
});