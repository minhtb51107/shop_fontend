<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-4">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-row v-if="loading">
      <v-col cols="12" md="6">
        <v-skeleton-loader type="image, article"></v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="article, actions"></v-skeleton-loader>
        <v-skeleton-loader type="table-heading, list-item-two-line@3"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="left" closable @click:close="error = false">
          <v-alert-title>Không thể tải thông tin sản phẩm</v-alert-title>
          Đã có lỗi xảy ra khi lấy dữ liệu chi tiết. Vui lòng thử lại.
          <br><small>{{ errorMessage }}</small>
        </v-alert>
        <v-btn @click="$router.back()" color="primary" class="mt-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Quay lại
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else-if="product">
      <v-col cols="12" md="6">
        <v-card flat border>
           <v-img
              :src="product.imageUrl || 'https://cdn.vuetifyjs.com/images/cards/foster.jpg'"
              height="400px"
              cover
              class="rounded"
            ></v-img>
            </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card flat>
          <v-chip color="primary" label small class="mb-2">
            {{ product.category?.name || 'Danh mục' }}
          </v-chip>
          <h1 class="text-h4 font-weight-bold mb-2">{{ product.name }}</h1>
          <div class="d-flex align-center mb-4">
             <v-rating
               :model-value="4.5" color="amber" density="compact" half-increments readonly size="small"
             ></v-rating>
             <div class="text-grey ms-2"> (15 Đánh giá)</div>
             <v-spacer></v-spacer>
             <span class="text-body-2">Thương hiệu: <strong class="text-primary">{{ product.brand?.name || 'N/A' }}</strong></span>
          </div>

          <p class="text-h5 font-weight-bold text-red mb-5">{{ formatCurrency(product.price) }}</p>

          <p class="text-body-1 mb-6">{{ product.description || 'Sản phẩm hiện chưa có mô tả chi tiết.' }}</p>

          <div class="d-flex align-center mb-6">
            <span class="text-subtitle-1 me-4">Số lượng:</span>
            <v-btn icon="mdi-minus" variant="outlined" size="small" @click="decrementQuantity" :disabled="quantity <= 1"></v-btn>
            <span class="mx-4 text-h6">{{ quantity }}</span>
            <v-btn icon="mdi-plus" variant="outlined" size="small" @click="incrementQuantity"></v-btn>
             </div>

          <v-row>
            <v-col cols="12" sm="6">
              <v-btn color="primary" block size="large" prepend-icon="mdi-cart-plus" @click="addToCart">
                Thêm vào giỏ
              </v-btn>
            </v-col>
             <v-col cols="12" sm="6">
               <v-btn color="red" variant="outlined" block size="large" prepend-icon="mdi-credit-card-outline">
                Mua ngay
              </v-btn>
            </v-col>
          </v-row>

          <div class="mt-5 text-center">
             <v-btn variant="text" prepend-icon="mdi-heart-outline" color="grey-darken-1">Thêm vào yêu thích</v-btn>
             <v-btn variant="text" prepend-icon="mdi-share-variant-outline" color="grey-darken-1">Chia sẻ</v-btn>
           </div>

        </v-card>
      </v-col>

      <v-col cols="12" class="mt-8">
          <v-card flat border>
             <v-tabs v-model="tab" bg-color="primary" dark grow>
              <v-tab value="description">Mô Tả Chi Tiết</v-tab>
              <v-tab value="specs">Thông Số Kỹ Thuật</v-tab>
              <v-tab value="reviews">Đánh Giá (15)</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="tab">
                <v-window-item value="description">
                  <div class="pa-4 text-body-1">
                     <p>Đây là phần mô tả chi tiết về sản phẩm {{ product.name }}. Nó sẽ bao gồm các tính năng nổi bật, công dụng, và những thông tin hữu ích khác giúp khách hàng hiểu rõ hơn về sản phẩm.</p>
                    <p class="mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  </div>
                </v-window-item>

                <v-window-item value="specs">
                  <v-table density="compact" class="ma-4">
                    <thead>
                      <tr>
                        <th class="text-left font-weight-bold">Thông số</th>
                        <th class="text-left font-weight-bold">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(value, key) in product.specs" :key="key">
                        <td class="text-capitalize">{{ formatSpecKey(key) }}</td>
                        <td>{{ value }}</td>
                      </tr>
                       <tr v-if="!product.specs || Object.keys(product.specs).length === 0">
                         <td colspan="2" class="text-center text-grey">Chưa có thông số kỹ thuật chi tiết.</td>
                       </tr>
                    </tbody>
                  </v-table>
                </v-window-item>

                <v-window-item value="reviews">
                   <div class="pa-4">
                     <p>Phần đánh giá sản phẩm sẽ được hiển thị ở đây.</p>
                   </div>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
      </v-col>

       <v-col cols="12" class="mt-10">
        <h2 class="text-h5 font-weight-medium mb-4">Sản Phẩm Tương Tự</h2>
         <v-row>
            <v-col v-for="n in 4" :key="`rel-${n}`" cols="12" sm="6" md="3">
              <v-skeleton-loader type="card-avatar, list-item-two-line"></v-skeleton-loader>
            </v-col>
          </v-row>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
      variant="elevated"
      multi-line
    >
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
import { useRoute, useRouter } from 'vue-router';
import productService from '@/services/productService';
// import { VSkeletonLoader } from 'vuetify/labs/components';
import { useCartStore } from '@/stores/cart'; // Import cart store

const route = useRoute();
const router = useRouter();
const product = ref(null);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const quantity = ref(1); // Số lượng chọn mua
const tab = ref('description'); // Tab mặc định hiển thị
const cartStore = useCartStore(); // Sử dụng cart store

// Lấy ID sản phẩm từ route params
const productId = computed(() => route.params.id);

// Breadcrumbs data
const breadcrumbs = computed(() => [
  { title: 'Trang Chủ', disabled: false, to: '/' },
  { title: 'Sản Phẩm', disabled: false, to: '/products' },
  { title: product.value ? product.value.name : 'Chi Tiết', disabled: true },
]);

// State cho Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 4000,
  showCartButton: false,
});

// Hàm hiển thị Snackbar
const showSnackbar = (text, color = 'success', showCartButton = false) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.showCartButton = showCartButton;
  snackbar.value.show = true;
};

// Hàm fetch chi tiết sản phẩm
const fetchProductDetail = async (id) => {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  product.value = null;
  quantity.value = 1;
  try {
    const data = await productService.getProductById(id);
    product.value = {
        ...data,
        price: data.price || Math.floor(Math.random() * (50000000 - 5000000 + 1)) + 5000000,
        imageUrl: data.imageUrl || `https://picsum.photos/400/300?random=${data.id}`
    };
    if (product.value) {
        document.title = `${product.value.name} - Shop Điện Tử`;
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = err.response?.data?.message || err.message || 'Lỗi không xác định.';
    console.error("Error fetching product detail:", err);
    document.title = `Lỗi Sản Phẩm - Shop Điện Tử`;
  } finally {
    loading.value = false;
  }
};

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hàm định dạng key của specs
const formatSpecKey = (key) => {
  if (!key) return '';
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
};

// Hàm tăng/giảm số lượng
const incrementQuantity = () => quantity.value++;
const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// Hàm xử lý thêm vào giỏ hàng
const addToCart = () => {
  if (product.value) {
    cartStore.addItem(product.value, quantity.value);
    console.log(`Đã thêm ${quantity.value} sp ${product.value.name} vào store.`);
    showSnackbar(`Đã thêm ${quantity.value} "${product.value.name}" vào giỏ hàng!`, 'success', true);
  } else {
     showSnackbar('Không thể thêm sản phẩm vào giỏ hàng.', 'error');
  }
};

// Gọi API khi component mount hoặc ID thay đổi
onMounted(() => {
  fetchProductDetail(productId.value);
});

watch(productId, (newId) => {
  if (newId) {
    fetchProductDetail(newId);
  }
});

</script>

<style scoped>
.v-card-title.bg-primary {
    background-color: rgba(var(--v-theme-primary), 0.8) !important;
    color: white;
    padding: 4px 8px;
    font-size: 0.8rem;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
.v-img {
    position: relative;
}
/* Style cho tab và table (tùy chọn) */
.v-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
.v-table th {
  background-color: #eeeeee;
}
</style>