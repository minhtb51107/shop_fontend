<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">📱 Danh Sách Sản Phẩm</h1>
      </v-col>
    </v-row>

    <v-row class="mb-5 align-center" dense>
       <v-col cols="12" md="4">
        <v-text-field v-model="filters.search" label="Tìm kiếm..." prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable @input="debouncedFetchProducts" @click:clear="clearSearchAndFetch"></v-text-field>
      </v-col>
       <v-col cols="12" md="2">
         <v-select v-model="filters.categoryId" label="Danh mục" :items="categories" :loading="loadingCategories" item-title="name" item-value="id" variant="outlined" density="compact" hide-details clearable @update:modelValue="applyFiltersAndFetch"></v-select>
       </v-col>
       <v-col cols="12" md="2">
         <v-select v-model="filters.brandId" label="Thương hiệu" :items="brands" :loading="loadingBrands" item-title="name" item-value="id" variant="outlined" density="compact" hide-details clearable @update:modelValue="applyFiltersAndFetch"></v-select>
       </v-col>
        <v-col cols="12" md="2">
           <v-select v-model="sortOption" label="Sắp xếp" :items="sortOptions" item-title="text" item-value="value" variant="outlined" density="compact" hide-details @update:modelValue="applySortAndFetch"></v-select>
        </v-col>
        <v-col cols="12" md="1" class="text-right">
           <v-btn icon="mdi-filter-remove-outline" variant="text" @click="resetFiltersAndFetch" title="Xóa bộ lọc"></v-btn>
        </v-col>
    </v-row>

    <v-row v-if="loading"><v-col v-for="n in itemsPerPage" :key="`sk-${n}`" cols="12" sm="6" md="4" lg="3"><v-skeleton-loader type="card-avatar, article, actions"></v-skeleton-loader></v-col></v-row>
    <v-row v-else-if="error"><v-col cols="12"><v-alert type="error" prominent border="start"> <v-alert-title>Lỗi Tải Dữ Liệu</v-alert-title>Đã xảy ra lỗi...<br><small>{{ errorMessage }}</small></v-alert></v-col></v-row>

    <v-row v-else-if="products.length > 0">
      <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4" lg="3">
         <v-card class="mx-auto my-2 fill-height d-flex flex-column" hover @click="viewProductDetail(product.id)">
             <v-img height="200" :src="getDefaultImage(product.images)" cover class="align-end text-white"><v-card-title class="text-caption bg-primary pa-1" style="opacity: 0.8;">{{ product.category?.name }}</v-card-title></v-img>
             <v-card-title class="pt-4 pb-1 text-subtitle-1 font-weight-medium">{{ product.name }}</v-card-title>
             <v-card-subtitle class="pb-2">{{ product.brand?.name || 'N/A' }}</v-card-subtitle>
             <v-card-text class="flex-grow-1 py-0"><p class="text-body-2 mb-2 text-truncate">{{ product.description || 'Chưa có mô tả.' }}</p><p class="text-h6 font-weight-bold text-red">{{ formatCurrency(getDefaultPrice(product.variants)) }}</p></v-card-text>
             <v-divider></v-divider>
             <v-card-actions>
               <v-btn color="primary" variant="tonal" prepend-icon="mdi-cart-plus" @click.stop="addToCart(product)">Thêm vào giỏ</v-btn>
               <v-spacer></v-spacer>
               <v-btn icon :color="wishlistStore.isFavorite(getDefaultVariantId(product.variants)) ? 'red' : 'grey-lighten-1'" size="small" @click.stop="toggleFavorite(product)" :loading="isTogglingFavorite[getDefaultVariantId(product.variants)]" :disabled="!getDefaultVariantId(product.variants)">
                 <v-icon>{{ wishlistStore.isFavorite(getDefaultVariantId(product.variants)) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
               </v-btn>
             </v-card-actions>
         </v-card>
      </v-col>
    </v-row>

    <v-row v-else><v-col cols="12" class="text-center mt-10"><v-icon size="64" color="grey">mdi-store-search-outline</v-icon><p class="text-h6 mt-4">Không tìm thấy sản phẩm nào.</p><p class="text-body-1">...</p><v-btn variant="text" @click="resetFiltersAndFetch" class="mt-2">Xóa bộ lọc</v-btn></v-col></v-row>

    <v-row v-if="!loading && !error && totalPages > 1" class="mt-8"><v-col cols="12"><v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" rounded="circle" @update:modelValue="handlePageChange"></v-pagination></v-col></v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top right" variant="elevated" multi-line>...</v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import productService from '@/services/productService';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useAuthStore } from '@/stores/auth';
import _ from 'lodash';

// --- Khai báo biến và store ---
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();

const products = ref([]);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 3000, showCartButton: false });
const defaultProductImage = 'https://cdn.vuetifyjs.com/images/cards/halcyon.png';
const isTogglingFavorite = ref({});

// --- State cho Pagination, Filter, Sort ---
const currentPage = ref(1);
const itemsPerPage = ref(12);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const filters = ref({ search: '', categoryId: null, brandId: null });
const sortOptions = ref([
  { text: 'Mặc định', value: 'id,desc' },
  { text: 'Tên A-Z', value: 'name,asc' },
  { text: 'Tên Z-A', value: 'name,desc' },
  // Thêm các lựa chọn sắp xếp khác nếu cần (ví dụ: giá)
]);
const sortOption = ref(sortOptions.value[0].value); // Giá trị mặc định
const categories = ref([]);
const loadingCategories = ref(true);
const brands = ref([]);
const loadingBrands = ref(true);

// --- Hàm Fetch Products ---
const fetchProducts = async () => {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  try {
    const params = {
      page: currentPage.value - 1, // API thường bắt đầu từ page 0
      size: itemsPerPage.value,
      sort: sortOption.value,
      search: filters.value.search || null, // Gửi null nếu rỗng
      categoryId: filters.value.categoryId,
      brandId: filters.value.brandId
    };
    // Loại bỏ các key có giá trị null, undefined hoặc chuỗi rỗng trước khi gửi
    const cleanedParams = _.omitBy(params, (v) => v === null || v === undefined || v === '');
    console.log('Fetching products with params:', cleanedParams);
    const pageData = await productService.getAllProducts(cleanedParams);
    products.value = pageData.content;

    // Log sản phẩm đầu tiên để kiểm tra dữ liệu
    console.log('Products List Data (first item):', JSON.stringify(products.value[0], null, 2));

    totalItems.value = pageData.totalElements;
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = true;
    errorMessage.value = err.response?.data?.message || err.message || 'Lỗi tải danh sách sản phẩm.';
    products.value = []; // Reset danh sách khi lỗi
    totalItems.value = 0; // Reset tổng số item
    showSnackbar(errorMessage.value, 'error');
  } finally {
    loading.value = false;
  }
};

// --- Hàm Fetch Categories ---
const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    categories.value = await productService.getAllCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories.value = []; // Reset khi lỗi
    showSnackbar("Lỗi tải danh mục.", "error");
  } finally {
    loadingCategories.value = false;
  }
};

// --- Hàm Fetch Brands ---
const fetchBrands = async () => {
  loadingBrands.value = true;
  try {
    brands.value = await productService.getAllBrands();
  } catch (error) {
    console.error("Error fetching brands:", error);
    brands.value = []; // Reset khi lỗi
    showSnackbar("Lỗi tải thương hiệu.", "error");
  } finally {
    loadingBrands.value = false;
  }
};

// --- Debounce và Handlers ---
const debouncedFetchProducts = _.debounce(fetchProducts, 500); // Chờ 500ms sau khi ngừng gõ mới tìm kiếm

const applyFiltersAndFetch = () => {
  currentPage.value = 1; // Reset về trang đầu khi lọc
  fetchProducts();
  // Cập nhật URL query params (tùy chọn)
  // router.push({ query: { ...route.query, categoryId: filters.value.categoryId, brandId: filters.value.brandId } });
};

const applySortAndFetch = () => {
  currentPage.value = 1; // Reset về trang đầu khi sắp xếp
  fetchProducts();
};

const clearSearchAndFetch = () => {
  filters.value.search = ''; // Xóa nội dung tìm kiếm
  applyFiltersAndFetch(); // Fetch lại
}

const resetFiltersAndFetch = () => {
  filters.value = { search: '', categoryId: null, brandId: null }; // Reset bộ lọc
  sortOption.value = sortOptions.value[0].value; // Reset sắp xếp
  router.push({ query: {} }); // Xóa query params trên URL
  applyFiltersAndFetch(); // Fetch lại
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang khi chuyển trang
};

// --- Watch Route Query Changes ---
watch(
  () => ({
      catId: route.query.categoryId,
      brId: route.query.brandId
  }),
  (newQuery, oldQuery) => {
    // Chuyển đổi query params sang số (hoặc null nếu không có)
    const newCatId = newQuery.catId ? parseInt(newQuery.catId, 10) : null;
    const newBrandId = newQuery.brId ? parseInt(newQuery.brId, 10) : null;
    const oldCatId = oldQuery?.catId ? parseInt(oldQuery.catId, 10) : null;
    const oldBrandId = oldQuery?.brId ? parseInt(oldQuery.brId, 10) : null;

    // Chỉ fetch lại nếu giá trị ID thực sự thay đổi và component không đang loading ban đầu
    if ((newCatId !== oldCatId || newBrandId !== oldBrandId) && !loading.value) {
      console.log('Route query changed, updating filters:', newQuery);
      filters.value.categoryId = newCatId;
      filters.value.brandId = newBrandId;
      applyFiltersAndFetch(); // Reset page và fetch lại
    }
  },
  { immediate: false } // Không chạy ngay khi component mount, chờ onMounted xử lý query ban đầu
);

// --- onMounted Hook ---
onMounted(() => {
    // Đọc query params từ URL khi component được mount
    const queryCategoryId = route.query.categoryId;
    const queryBrandId = route.query.brandId;

    // Cập nhật state filters dựa trên query params ban đầu
    if (queryCategoryId) {
        filters.value.categoryId = parseInt(queryCategoryId, 10);
    }
    if (queryBrandId) {
        filters.value.brandId = parseInt(queryBrandId, 10);
    }

    // Gọi các hàm fetch lần đầu
    fetchProducts();
    fetchCategories(); // Gọi hàm đã được khai báo ở ngoài
    fetchBrands();     // Gọi hàm đã được khai báo ở ngoài
});

// --- Utility Functions ---
const getDefaultPrice = (variants) => {
  if (Array.isArray(variants) && variants.length > 0) {
    // Có thể thêm logic tìm variant mặc định hoặc giá thấp nhất ở đây nếu cần
    return variants[0].price;
  }
  console.log('No price found for product variants:', variants); // Log chi tiết hơn
  return undefined; // Trả về undefined nếu không có variant
};

const getDefaultImage = (images) => {
  if (Array.isArray(images) && images.length > 0) {
    // Ưu tiên ảnh có isMain = true
    const mainImage = images.find(img => img.isMain);
    if (mainImage && mainImage.imageUrl) {
      return mainImage.imageUrl;
    }
    // Nếu không có ảnh main, lấy ảnh đầu tiên có imageUrl hợp lệ
    const firstValidImage = images.find(img => img.imageUrl);
    if(firstValidImage) {
        return firstValidImage.imageUrl;
    }
  }
  return defaultProductImage; // Trả về ảnh mặc định nếu không có ảnh nào
};

const getDefaultVariantId = (variants) => {
  if (Array.isArray(variants) && variants.length > 0) {
    // Có thể thêm logic tìm variant mặc định ở đây nếu cần
    return variants[0].id;
  }
  return null; // Trả về null nếu không có variant
};

const formatCurrency = (value) => {
  // Kiểm tra chặt chẽ hơn, bao gồm cả giá trị 0
  if (value === null || value === undefined) return 'Liên hệ';
  // Nếu muốn hiển thị 0đ thay vì "Liên hệ" khi giá là 0
  // if (value === null || value === undefined) return 'Liên hệ';
  // if (value < 0) return 'Liên hệ'; // Xử lý giá âm nếu cần

  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const showSnackbar = (text, color = 'success', showCartButton = false, timeout = 3000) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.showCartButton = showCartButton;
  snackbar.value.timeout = timeout;
  snackbar.value.show = true;
};

const viewProductDetail = (productId) => {
  router.push({ name: 'productDetail', params: { id: productId } });
};

// --- Thêm vào giỏ hàng ---
const addToCart = (product) => {
  // Lấy variant mặc định (hoặc đầu tiên)
  const defaultVariantId = getDefaultVariantId(product.variants);
  const defaultPrice = getDefaultPrice(product.variants);
  const defaultImage = getDefaultImage(product.images);

  // Kiểm tra xem có đủ thông tin không
  if (defaultVariantId && defaultPrice !== undefined) {
    const item = {
      id: defaultVariantId, // Sử dụng ID của variant
      productId: product.id, // Lưu thêm ID sản phẩm gốc (tùy chọn)
      name: product.name,
      price: defaultPrice,
      imageUrl: defaultImage,
      // Thêm các thuộc tính khác của variant nếu cần (màu sắc, kích thước...)
    };
    cartStore.addItem(item, 1); // Thêm 1 sản phẩm
    showSnackbar(`Đã thêm "${product.name}" vào giỏ hàng`, 'success', true, 4000);
  } else {
    console.error("Cannot add to cart, product variant data is incomplete:", product);
    showSnackbar('Lỗi: Không tìm thấy thông tin phiên bản sản phẩm.', 'error');
  }
};

// --- Thêm/Xóa khỏi danh sách yêu thích ---
const toggleFavorite = async (product) => {
  // 1. Kiểm tra đăng nhập
  if (!authStore.isAuthenticated) {
    showSnackbar('Vui lòng đăng nhập để sử dụng chức năng này.', 'info');
    // Chuyển hướng đến trang đăng nhập, lưu lại trang hiện tại để quay lại
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }

  // 2. Lấy ID variant mặc định (hoặc đầu tiên)
  const variantId = getDefaultVariantId(product.variants);

  // 3. Kiểm tra xem có ID variant không
  if (!variantId) {
    showSnackbar('Lỗi: Không tìm thấy thông tin phiên bản sản phẩm.', 'error');
    return;
  }

  // 4. Bắt đầu xử lý (hiển thị loading)
  isTogglingFavorite.value[variantId] = true;
  try {
    // 5. Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
    if (wishlistStore.isFavorite(variantId)) {
      // Nếu có -> Xóa khỏi danh sách
      await wishlistStore.removeFavorite(variantId);
      showSnackbar(`Đã xóa "${product.name}" khỏi danh sách yêu thích`, 'info');
    } else {
      // Nếu chưa -> Thêm vào danh sách
      await wishlistStore.addFavorite(variantId);
      showSnackbar(`Đã thêm "${product.name}" vào danh sách yêu thích`, 'pink'); // Màu hồng cho yêu thích
    }
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error toggling favorite:", error);
    showSnackbar(error.message || 'Thao tác thất bại. Vui lòng thử lại.', 'error');
  } finally {
    // 6. Kết thúc xử lý (ẩn loading)
    isTogglingFavorite.value[variantId] = false;
  }
};
</script>

<style scoped>
/* Giữ nguyên style */
.fill-height { height: 100%; } .v-card { transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; } .v-card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important; } .bg-primary { background-color: rgba(var(--v-theme-primary), 1) !important; color: white; } .v-card .v-img { aspect-ratio: 4/3; object-fit: cover; } .text-truncate { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.4em; max-height: 2.8em; }
</style>