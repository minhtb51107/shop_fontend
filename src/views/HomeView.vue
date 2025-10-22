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
           <v-img height="180" :src="product.imageUrl || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'" cover></v-img>
           <v-card-title class="pt-3 pb-1 text-subtitle-2 font-weight-medium">
             {{ product.name }}
           </v-card-title>
           <v-card-subtitle class="pb-2 text-caption">
               {{ product.brand?.name || 'N/A' }}
           </v-card-subtitle>
           <v-card-text class="flex-grow-1 py-0">
              <p class="text-body-2 font-weight-bold text-red">{{ formatCurrency(product.price) }}</p>
           </v-card-text>
            <v-divider></v-divider>
           <v-card-actions class="pa-1 justify-end">
              <v-btn 
                icon 
                color="grey-lighten-1" 
                size="x-small" 
                @click.prevent="toggleWishlist(product)"
                title="Thêm vào yêu thích"
              > 
                <v-icon>mdi-heart-outline</v-icon> 
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
import productService from '@/services/productService';

const cartStore = useCartStore();
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

// ==================================================
// ===         HÀM MỚI ĐỂ LẤY BANNERS            ===
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
        // bannerItems.value = [
        //   { src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg', title: 'Banner 1' },
        //   { src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg', title: 'Banner 2' },
        // ];
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
    } catch (error) {
        console.error("Error fetching newest products:", error);
        newestProducts.value = [];
    } finally {
        loadingNewest.value = false;
    }
};

// --- CÁC HÀM TIỆN ÍCH ---
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'Liên hệ'; // Giữ nguyên, đã cho phép giá 0
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
       const itemToAdd = {
             id: product.variants?.[0]?.id || product.id, 
             name: product.name,
             price: product.price, 
             imageUrl: product.imageUrl 
         };
    cartStore.addItem(itemToAdd, 1);
    showSnackbar(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success', true);
  } else {
     showSnackbar('Không thể thêm sản phẩm.', 'error');
  }
};

// ==================================================
// ===       HÀM MỚI CHO NÚT YÊU THÍCH          ===
// ==================================================
/**
 * Xử lý khi nhấn nút yêu thích (Hiện tại chỉ thông báo)
 * @param {object} product Sản phẩm
 */
const toggleWishlist = (product) => {
  if (product) {
    // TODO: Triển khai logic thêm/xóa khỏi wishlist (cần Pinia store)
    // Hiện tại chỉ hiển thị thông báo
    console.log("Toggle wishlist cho:", product.name);
    showSnackbar(`Đã thêm "${product.name}" vào danh sách yêu thích!`, 'info'); 
    // Bạn có thể thay đổi màu 'info' thành màu khác
  }
};
// ==================================================


// Hàm lấy icon cho category
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

onMounted(() => {
    fetchBanners(); // Cập nhật: Gọi hàm lấy banners
    fetchNewestProducts();
    fetchCategories(); 
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