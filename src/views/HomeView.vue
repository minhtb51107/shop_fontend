<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader v-if="loadingBanners" type="image" height="400"></v-skeleton-loader>
        <v-carousel v-else-if="bannerItems.length > 0" cycle height="400" hide-delimiter-background show-arrows="hover">
          <v-carousel-item
            v-for="(item, i) in bannerItems"
            :key="i"
            :src="item.src || item.imageUrl"
            cover
          >
            <div class="d-flex fill-height justify-center align-center">
            </div>
          </v-carousel-item>
        </v-carousel>
        <v-alert v-else type="info" variant="tonal" class="text-center">
          Không tải được slideshow.
        </v-alert>
      </v-col>
    </v-row>

    <v-row class="mt-10">
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center fill-height elevation-1" hover>
          <v-icon size="x-large" color="success" class="mb-3">mdi-truck-fast-outline</v-icon>
          <h3 class="text-h6 font-weight-medium">Giao Hàng Nhanh</h3>
          <p class="text-body-2">Miễn phí giao hàng cho đơn hàng trên 1 triệu.</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center fill-height elevation-1" hover>
          <v-icon size="x-large" color="info" class="mb-3">mdi-shield-check-outline</v-icon>
          <h3 class="text-h6 font-weight-medium">Bảo Hành Chính Hãng</h3>
          <p class="text-body-2">Cam kết sản phẩm chất lượng, uy tín.</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center fill-height elevation-1" hover>
          <v-icon size="x-large" color="warning" class="mb-3">mdi-face-agent</v-icon>
          <h3 class="text-h6 font-weight-medium">Hỗ Trợ 24/7</h3>
          <p class="text-body-2">Đội ngũ tư vấn viên sẵn sàng hỗ trợ.</p>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-12">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Danh Mục Nổi Bật</h2>
      </v-col>
      <v-col v-if="loadingCategories" v-for="n in 6" :key="`cat-sk-${n}`" cols="6" sm="4" md="2">
         <v-skeleton-loader type="avatar, text"></v-skeleton-loader>
      </v-col>
      <v-col v-else v-for="category in displayedCategories" :key="category.id" cols="6" sm="4" md="2">
         <v-card hover class="text-center pa-3" :to="`/products?categoryId=${category.id}`">
           <v-avatar size="80" rounded="0" class="mb-2">
               <v-icon size="50" color="primary">{{ getCategoryIcon(category.name) }}</v-icon>
             </v-avatar>
           <v-card-title class="text-subtitle-2 font-weight-medium pa-0">{{ category.name }}</v-card-title>
         </v-card>
      </v-col>
      <v-col v-if="!loadingCategories && allCategories.length === 0" cols="12" class="text-center text-grey">
         Không tải được danh mục.
      </v-col>
    </v-row>

    <v-row class="mt-12">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Sản Phẩm Mới Nhất</h2>
      </v-col>
      <v-col v-if="loadingNewest" v-for="n in 4" :key="`new-${n}`" cols="12" sm="6" md="3">
         <v-skeleton-loader type="image, list-item-two-line, actions"></v-skeleton-loader>
      </v-col>
      <v-col v-else v-for="product in newestProducts" :key="product.id" cols="12" sm="6" md="3">
        <v-card class="mx-auto my-1 fill-height d-flex flex-column" hover :to="{ name: 'productDetail', params: { id: product.id } }">
          <v-img height="180" :src="getDefaultImage(product.images)" cover></v-img> <v-card-title class="pt-3 pb-1 text-subtitle-2 font-weight-medium">
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle class="pb-2 text-caption">
             {{ product.brand?.name || 'N/A' }}
          </v-card-subtitle>
          <v-card-text class="flex-grow-1 py-0">
            <p class="text-body-2 font-weight-bold text-red">{{ formatCurrency(getDefaultPrice(product.variants)) }}</p>
          </v-card-text>
           <v-divider></v-divider>
          <v-card-actions class="pa-1 justify-end">
             <v-btn
               icon
               :color="wishlistStore.isFavorite(getDefaultVariantId(product.variants)) ? 'red' : 'grey-lighten-1'"
               size="x-small"
               @click.prevent="toggleFavorite(product)"
               :loading="isTogglingFavorite[getDefaultVariantId(product.variants)]"
               :disabled="!getDefaultVariantId(product.variants)"
               title="Thêm vào yêu thích"
             >
               <v-icon>{{ wishlistStore.isFavorite(getDefaultVariantId(product.variants)) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
             </v-btn>
             <v-btn color="primary" variant="tonal" size="small" @click.prevent="addToCart(product)">
                 <v-icon start size="small">mdi-cart-plus</v-icon> Thêm
             </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
       <v-col v-if="!loadingNewest && newestProducts.length === 0" cols="12" class="text-center text-grey">
          Chưa có sản phẩm mới.
       </v-col>
       <v-col v-if="!loadingNewest" cols="12" class="text-center mt-4">
          <v-btn variant="outlined" color="primary" to="/products">Xem tất cả sản phẩm</v-btn>
       </v-col>
    </v-row>

     <v-snackbar
       v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout"
       location="top right" variant="elevated" multi-line>
       {{ snackbar.text }}
       <template v-slot:actions>
          <v-btn v-if="snackbar.showCartButton" color="white" variant="text" to="/cart">Xem giỏ hàng</v-btn>
          <v-btn icon="mdi-close" variant="text" @click="snackbar.show = false"></v-btn>
       </template>
       </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlistStore'; // <-- Import wishlist store
import { useAuthStore } from '@/stores/auth'; // <-- Import auth store
import { useRouter } from 'vue-router'; // <-- Import useRouter
import productService from '@/services/productService';

const cartStore = useCartStore();
const wishlistStore = useWishlistStore(); // <-- Khởi tạo wishlist store
const authStore = useAuthStore(); // <-- Khởi tạo auth store
const router = useRouter(); // <-- Khởi tạo router
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 4000, showCartButton: false });

// Cập nhật: State cho Banner
const bannerItems = ref([]);
const loadingBanners = ref(true); // Thêm state loading

// --- State cho Categories ---
const allCategories = ref([]);
const loadingCategories = ref(true);
// Chỉ hiển thị tối đa 6 category trên trang chủ
const displayedCategories = computed(() => allCategories.value.slice(0, 6));

// --- State cho Newest Products ---
const newestProducts = ref([]);
const loadingNewest = ref(true);

// State cho loading nút yêu thích (giống ProductDetailView)
const isTogglingFavorite = ref({});

// Ảnh mặc định (giống ProductDetailView)
const defaultProductImage = 'https://cdn.vuetifyjs.com/images/cards/foster.jpg';

// ==================================================
// ===         HÀM MỚI ĐỂ LẤY BANNERS         ===
// ==================================================
const fetchBanners = async () => {
    loadingBanners.value = true;
    try {
        // Giả sử API trả về mảng banner: [{ id: 1, src: 'url...', title: '...' }]
        bannerItems.value = await productService.getAllBanners();
    } catch (error) {
        console.error("Error fetching banners:", error);
        bannerItems.value = [];
        // Hiển thị dữ liệu mẫu nếu API lỗi (tùy chọn)
        bannerItems.value = [
          { src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg', title: 'Banner 1' },
          { src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg', title: 'Banner 2' },
        ];
    } finally {
        loadingBanners.value = false;
    }
};
// ==================================================


// --- HÀM LẤY CATEGORIES TỪ API ---
const fetchCategories = async () => {
    loadingCategories.value = true;
    try {
        allCategories.value = await productService.getAllCategories();
    } catch (error) {
        console.error("Error fetching categories:", error);
        allCategories.value = [];
    } finally {
        loadingCategories.value = false;
    }
};

// --- HÀM LẤY SẢN PHẨM MỚI NHẤT (ĐÃ CẬP NHẬT) ---
const fetchNewestProducts = async () => {
    loadingNewest.value = true;
    try {
        const params = { page: 0, size: 4, sort: 'id,desc' };
        const pageData = await productService.getAllProducts(params);
        newestProducts.value = pageData.content;
        console.log("Newest Products:", JSON.stringify(newestProducts.value, null, 2)); // Log để kiểm tra cấu trúc
    } catch (error) {
        console.error("Error fetching newest products:", error);
        newestProducts.value = [];
    } finally {
        loadingNewest.value = false;
    }
};

// --- CÁC HÀM TIỆN ÍCH ---

// *** THÊM HÀM getDefaultPrice ***
const getDefaultPrice = (variants) => {
  if (Array.isArray(variants) && variants.length > 0) {
    // Kiểm tra xem price có tồn tại và hợp lệ không trước khi trả về
    if (variants[0].price !== null && variants[0].price !== undefined) {
      return variants[0].price;
    }
  }
  console.warn('Price not available or invalid in first variant:', variants);
  return undefined; // Trả về undefined nếu không tìm thấy giá hợp lệ
};

// *** THÊM HÀM getDefaultImage ***
const getDefaultImage = (images) => {
  if (Array.isArray(images) && images.length > 0) {
    const mainImage = images.find(img => img.isMain === true);
    if (mainImage && mainImage.imageUrl) {
      return mainImage.imageUrl;
    }
    const firstValidImage = images.find(img => img.imageUrl);
    if(firstValidImage) {
      return firstValidImage.imageUrl;
    }
  }
  return defaultProductImage; // Trả về ảnh mặc định nếu không có ảnh nào
};

// *** THÊM HÀM getDefaultVariantId ***
const getDefaultVariantId = (variants) => {
  if (Array.isArray(variants) && variants.length > 0) {
    return variants[0].id;
  }
  return null;
};


const formatCurrency = (value) => {
  // Giữ nguyên logic cũ: null, undefined hoặc < 0 sẽ hiển thị "Liên hệ"
  if (value === null || value === undefined || value < 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const showSnackbar = (text, color = 'success', showCartButton = false) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.showCartButton = showCartButton;
  snackbar.value.show = true;
};

const addToCart = (product) => {
   if (product) {
        // Sử dụng getDefaultPrice và getDefaultImage để lấy thông tin
        const price = getDefaultPrice(product.variants);
        const imageUrl = getDefaultImage(product.images);
        const variantId = getDefaultVariantId(product.variants); // Lấy variantId

        if (variantId === null || price === undefined) {
             console.error('Cannot add to cart, missing variantId or price:', product);
             showSnackbar('Không thể thêm sản phẩm (thiếu thông tin).', 'error');
             return;
        }

       const itemToAdd = {
           id: variantId, // Sử dụng variantId
           productId: product.id, // Thêm productId để tham khảo nếu cần
           name: product.name,
           price: price, // Giá đã lấy
           imageUrl: imageUrl // Ảnh đã lấy
       };
       cartStore.addItem(itemToAdd, 1);
       showSnackbar(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success', true);
   } else {
       showSnackbar('Không thể thêm sản phẩm.', 'error');
   }
};

// ==================================================
// ===     CẬP NHẬT HÀM CHO NÚT YÊU THÍCH       ===
// ==================================================
/**
 * Xử lý khi nhấn nút yêu thích (Giống ProductDetailView)
 * @param {object} product Sản phẩm
 */
const toggleFavorite = async (productToToggle) => {
  if (!authStore.isAuthenticated) {
    showSnackbar('Vui lòng đăng nhập để sử dụng chức năng này.', 'info');
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } }); // Redirect về trang hiện tại
    return;
  }

  const variantId = getDefaultVariantId(productToToggle?.variants);
  if (!variantId) {
    showSnackbar('Lỗi: Không tìm thấy thông tin phiên bản sản phẩm.', 'error');
    return;
  }

  isTogglingFavorite.value[variantId] = true;
  try {
    if (wishlistStore.isFavorite(variantId)) {
      await wishlistStore.removeFavorite(variantId);
      showSnackbar(`Đã xóa "${productToToggle.name}" khỏi danh sách yêu thích`, 'info');
    } else {
      await wishlistStore.addFavorite(variantId);
      showSnackbar(`Đã thêm "${productToToggle.name}" vào danh sách yêu thích`, 'pink');
    }
  } catch (error) {
    console.error("Error toggling favorite on HomeView:", error);
    showSnackbar(error.message || 'Thao tác thất bại. Vui lòng thử lại.', 'error');
  } finally {
    isTogglingFavorite.value[variantId] = false;
  }
};
// ==================================================


// Hàm lấy icon cho category (giữ nguyên)
const getCategoryIcon = (categoryName) => {
    const nameLower = categoryName?.toLowerCase() || '';
    if (nameLower.includes('laptop')) return 'mdi-laptop';
    if (nameLower.includes('phone') || nameLower.includes('điện thoại')) return 'mdi-cellphone';
    if (nameLower.includes('tablet') || nameLower.includes('máy tính bảng')) return 'mdi-tablet-ipad';
    if (nameLower.includes('headphone') || nameLower.includes('tai nghe')) return 'mdi-headphones';
    if (nameLower.includes('watch') || nameLower.includes('đồng hồ')) return 'mdi-watch';
    if (nameLower.includes('accessory') || nameLower.includes('phụ kiện')) return 'mdi-usb-port';
    return 'mdi-shape-outline';
}

onMounted(async () => {
    await fetchBanners(); // Cập nhật: Gọi hàm lấy banners
    await fetchNewestProducts();
    await fetchCategories();
    // Fetch wishlist IDs sau khi đăng nhập (nếu cần cập nhật ngay khi vào trang chủ)
    // await wishlistStore.fetchWishlistIds(); // Bỏ comment nếu muốn load wishlist ngay
});
</script>

<style scoped>
.fill-height { height: 100%; }
.v-card .v-img { aspect-ratio: 16/9; }
/* Style cho card danh mục */
.v-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(var(--v-theme-primary), 0.1); /* Màu nền nhẹ cho avatar */
}
</style>