<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">📱 Danh Sách Sản Phẩm</h1>
      </v-col>
    </v-row>

    <v-row class="mb-5 align-center" dense>
       <v-col cols="12" md="4">
        <v-text-field
          v-model="filters.search"
          label="Tìm kiếm sản phẩm..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          @input="debouncedFetchProducts" @click:clear="clearSearchAndFetch"
        ></v-text-field>
      </v-col>
       <v-col cols="12" md="2">
         <v-select
           v-model="filters.categoryId"
           label="Danh mục"
           :items="categories"
           :loading="loadingCategories" item-title="name"
           item-value="id"
           variant="outlined" density="compact" hide-details clearable
           @update:modelValue="applyFiltersAndFetch"
         ></v-select>
       </v-col>
       <v-col cols="12" md="2">
         <v-select
           v-model="filters.brandId"
           label="Thương hiệu"
           :items="brands"
           :loading="loadingBrands" item-title="name"
           item-value="id"
           variant="outlined" density="compact" hide-details clearable
           @update:modelValue="applyFiltersAndFetch"
         ></v-select>
       </v-col>
        <v-col cols="12" md="2">
           <v-select
               v-model="sortOption"
               label="Sắp xếp"
               :items="sortOptions"
               item-title="text"
               item-value="value"
               variant="outlined"
               density="compact"
               hide-details
               @update:modelValue="applySortAndFetch"
           ></v-select>
        </v-col>
        <v-col cols="12" md="1" class="text-right">
           <v-btn icon="mdi-filter-remove-outline" variant="text" @click="resetFiltersAndFetch" title="Xóa bộ lọc"></v-btn>
        </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col v-for="n in itemsPerPage" :key="`sk-${n}`" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card-avatar, article, actions"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="start"> <v-alert-title>Lỗi Tải Dữ Liệu</v-alert-title>
          Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau. <br>
          <small>{{ errorMessage }}</small>
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="products.length > 0">
      <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4" lg="3">
         <v-card class="mx-auto my-2 fill-height d-flex flex-column" hover @click="viewProductDetail(product.id)">
             <v-img height="200" :src="product.imageUrl || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'" cover class="align-end text-white">
              <v-card-title class="text-caption bg-primary pa-1" style="opacity: 0.8;">{{ product.category?.name }}</v-card-title>
           </v-img>
          <v-card-title class="pt-4 pb-1 text-subtitle-1 font-weight-medium">
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle class="pb-2">
            {{ product.brand?.name || 'N/A' }}
          </v-card-subtitle>
          <v-card-text class="flex-grow-1 py-0">
             <p class="text-body-2 mb-2 text-truncate">{{ product.description || 'Chưa có mô tả.' }}</p>
             <p class="text-h6 font-weight-bold text-red">{{ formatCurrency(product.price) }}</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" variant="tonal" prepend-icon="mdi-cart-plus" @click.stop="addToCart(product)">
              Thêm vào giỏ
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon color="grey-lighten-1" size="small">
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

     <v-row v-else>
       <v-col cols="12" class="text-center mt-10">
         <v-icon size="64" color="grey">mdi-store-search-outline</v-icon>
         <p class="text-h6 mt-4">Không tìm thấy sản phẩm nào.</p>
         <p class="text-body-1">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
         <v-btn variant="text" @click="resetFiltersAndFetch" class="mt-2">Xóa bộ lọc</v-btn>
       </v-col>
     </v-row>

     <v-row v-if="!loading && !error && totalPages > 1" class="mt-8">
       <v-col cols="12">
         <v-pagination
           v-model="currentPage"
           :length="totalPages"
           :total-visible="7"
           rounded="circle"
            @update:modelValue="handlePageChange"
         ></v-pagination>
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import productService from '@/services/productService';
import { useCartStore } from '@/stores/cart';
import _ from 'lodash';

const router = useRouter();
const cartStore = useCartStore();
const products = ref([]);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 4000, showCartButton: false });

// --- State cho Phân trang, Lọc, Sắp xếp ---
const currentPage = ref(1);
const itemsPerPage = ref(12);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

const filters = ref({
    search: '',
    categoryId: null,
    brandId: null,
});

const sortOptions = ref([
    { text: 'Mặc định', value: 'id,desc' },
    { text: 'Tên A-Z', value: 'name,asc' },
    { text: 'Tên Z-A', value: 'name,desc' },
    // Cần backend hỗ trợ sắp xếp theo giá
    // { text: 'Giá tăng dần', value: 'price,asc' },
    // { text: 'Giá giảm dần', value: 'price,desc' },
]);
const sortOption = ref(sortOptions.value[0].value);

// --- State cho Categories và Brands ---
const categories = ref([]);
const loadingCategories = ref(true); // Thêm loading state
const brands = ref([]);
const loadingBrands = ref(true); // Thêm loading state

// --- HÀM FETCH DỮ LIỆU ---
const fetchProducts = async () => {
   loading.value = true;
   error.value = false;
   errorMessage.value = '';
   try {
       const params = {
           page: currentPage.value - 1,
           size: itemsPerPage.value,
           sort: sortOption.value,
           search: filters.value.search || null,
           categoryId: filters.value.categoryId,
           brandId: filters.value.brandId,
       };
       const cleanedParams = _.omitBy(params, _.isNil);

     const pageData = await productService.getAllProducts(cleanedParams);

     // **Cập nhật mapping:** Ưu tiên lấy giá và ảnh từ API.
     // Thay thế đoạn map cũ bằng:
products.value = pageData.content; // Gán trực tiếp
     totalItems.value = pageData.totalElements;
   } catch (err) {
     error.value = true;
     errorMessage.value = err.response?.data?.message || err.message || 'Lỗi không xác định.';
     products.value = [];
     totalItems.value = 0;
     showSnackbar(errorMessage.value, 'error');
   } finally {
     loading.value = false;
   }
};

// --- HÀM FETCH CATEGORIES TỪ API ---
const fetchCategories = async () => {
    loadingCategories.value = true;
    try {
        // Giả sử productService có hàm getAllCategories trả về [{id: 1, name: 'Laptop'}, ...]
        categories.value = await productService.getAllCategories();
    } catch (error) {
        console.error("Error fetching categories:", error);
        categories.value = []; // Đặt mảng rỗng nếu lỗi
        showSnackbar("Không thể tải danh mục.", "error");
    } finally {
        loadingCategories.value = false;
    }
};

// --- HÀM FETCH BRANDS TỪ API ---
const fetchBrands = async () => {
    loadingBrands.value = true;
    try {
        // Giả sử productService có hàm getAllBrands trả về [{id: 1, name: 'Brand A'}, ...]
        brands.value = await productService.getAllBrands();
    } catch (error) {
        console.error("Error fetching brands:", error);
        brands.value = []; // Đặt mảng rỗng nếu lỗi
        showSnackbar("Không thể tải thương hiệu.", "error");
    } finally {
        loadingBrands.value = false;
    }
};

// --- Debounce cho ô tìm kiếm ---
const debouncedFetchProducts = _.debounce(fetchProducts, 500);

// --- Các hàm xử lý filter, sort, page change (giữ nguyên logic) ---
const applyFiltersAndFetch = () => {
    currentPage.value = 1;
    fetchProducts();
};
const applySortAndFetch = () => {
    currentPage.value = 1;
    fetchProducts();
};
const clearSearchAndFetch = () => {
    filters.value.search = '';
    applyFiltersAndFetch();
}
const resetFiltersAndFetch = () => {
    filters.value = { search: '', categoryId: null, brandId: null };
    sortOption.value = sortOptions.value[0].value;
    currentPage.value = 1;
    fetchProducts();
};
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    fetchProducts();
};

// --- GỌI API KHI MOUNT ---
onMounted(() => {
    fetchProducts();
    fetchCategories(); // Gọi lấy categories thật
    fetchBrands(); // Gọi lấy brands thật
});

// --- CÁC HÀM TIỆN ÍCH KHÁC ---
const formatCurrency = (value) => {
  if (value === null || value === undefined || value === 0) return 'Liên hệ'; // Cập nhật điều kiện
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const showSnackbar = (text, color = 'success', showCartButton = false) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.showCartButton = showCartButton;
  snackbar.value.show = true;
};

const viewProductDetail = (productId) => { router.push({ name: 'productDetail', params: { id: productId } }); };

const addToCart = (product) => {
    if (product) {
       const itemToAdd = {
           id: product.variants?.[0]?.id || product.id,
           name: product.name,
           price: product.price, // Giá đã được xác định ở fetchProducts
           imageUrl: product.imageUrl // Ảnh đã được xác định
       };
       cartStore.addItem(itemToAdd, 1);
       showSnackbar(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success', true);
    } else {
       showSnackbar('Không thể thêm sản phẩm.', 'error');
    }
};

</script>

<style scoped>
.fill-height { height: 100%; }
.v-card { transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
.v-card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important; }
.bg-primary { background-color: rgba(var(--v-theme-primary), 1) !important; color: white; }
.v-card .v-img {
    aspect-ratio: 4/3;
    object-fit: cover;
}
/* Thêm style để giới hạn chiều cao mô tả */
.text-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Số dòng muốn hiển thị */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4em; /* Điều chỉnh cho phù hợp font-size */
  max-height: 2.8em; /* line-height * số dòng */
}
</style>