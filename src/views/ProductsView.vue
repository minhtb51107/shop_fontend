<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">📱 Danh Sách Sản Phẩm</h1>
      </v-col>
    </v-row>

    <v-row class="mb-5">
       <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Tìm kiếm sản phẩm..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        ></v-text-field>
      </v-col>
       <v-col cols="12" md="4">
         <v-select
           v-model="selectedCategory"
           label="Lọc theo danh mục"
           :items="categories"
           item-title="name"
           item-value="id"
           variant="outlined"
           density="compact"
           hide-details
           clearable
         ></v-select>
       </v-col>
       <v-col cols="12" md="4">
         <v-select
           v-model="selectedBrand"
           label="Lọc theo thương hiệu"
           :items="brands"
            item-title="name"
           item-value="id"
           variant="outlined"
           density="compact"
           hide-details
           clearable
         ></v-select>
       </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col v-for="n in 6" :key="`sk-${n}`" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card-avatar, article, actions"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="left">
          <v-alert-title>Lỗi Tải Dữ Liệu</v-alert-title>
          Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau. <br>
          <small>{{ errorMessage }}</small>
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="filteredProducts.length > 0">
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto my-2 fill-height d-flex flex-column" hover @click="viewProductDetail(product.id)">
          <v-img
            height="200"
            :src="product.imageUrl || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'"
            cover
            class="align-end text-white"
          >
           <v-card-title class="text-caption bg-primary" style="opacity: 0.8;">{{ product.category?.name }}</v-card-title>
          </v-img>

          <v-card-title class="pt-4 pb-1 text-subtitle-1 font-weight-medium">
            {{ product.name }}
          </v-card-title>

          <v-card-subtitle class="pb-2">
            Thương hiệu: {{ product.brand?.name || 'N/A' }}
          </v-card-subtitle>

          <v-card-text class="flex-grow-1">
            <p class="text-body-2 mb-2">{{ product.description || 'Chưa có mô tả.' }}</p>
             <p class="text-h6 font-weight-bold text-red">{{ formatCurrency(product.price) }}</p>
          </v-card-text>


          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="primary" variant="tonal" prepend-icon="mdi-cart-plus">
              Thêm vào giỏ
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon color="grey-lighten-1">
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
            <v-btn icon color="grey-lighten-1">
              <v-icon>mdi-share-variant-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
       <v-col cols="12" class="text-center mt-10">
         <v-icon size="64" color="grey">mdi-store-remove-outline</v-icon>
         <p class="text-h6 mt-4">Không tìm thấy sản phẩm nào.</p>
         <p class="text-body-1">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
       </v-col>
     </v-row>

     <v-row v-if="!loading && !error && filteredProducts.length > 0" class="mt-8">
       <v-col cols="12">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            rounded="circle"
          ></v-pagination>
       </v-col>
     </v-row>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // Để điều hướng
import productService from '@/services/productService';
//import { VSkeletonLoader } from 'vuetify/labs/components';

const products = ref([]); // Mảng chứa danh sách sản phẩm
const loading = ref(true); // Trạng thái loading
const error = ref(false); // Trạng thái lỗi
const errorMessage = ref(''); // Thông báo lỗi chi tiết
const router = useRouter(); // Instance của router

// Dữ liệu giả cho bộ lọc (sẽ thay bằng API call sau)
const categories = ref([ { id: 1, name: 'Laptop' }, { id: 2, name: 'Điện thoại' }, { id: 3, name: 'Phụ kiện' } ]);
const brands = ref([ { id: 1, name: 'Brand A' }, { id: 2, name: 'Brand B' }, { id: 3, name: 'Brand C' } ]);

// State cho bộ lọc
const searchQuery = ref('');
const selectedCategory = ref(null);
const selectedBrand = ref(null);

// State cho phân trang (sẽ hoàn thiện sau)
const currentPage = ref(1);
const totalPages = ref(1); // Giả sử ban đầu có 1 trang

// Hàm fetch sản phẩm
const fetchProducts = async () => {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  try {
    const data = await productService.getAllProducts();
    // Gán dữ liệu mock nếu API trả về rỗng (để test giao diện)
    if (data && data.length > 0) {
        products.value = data.map(p => ({ // Giả lập thêm giá và ảnh nếu backend chưa có
            ...p,
            price: p.price || Math.floor(Math.random() * (50000000 - 5000000 + 1)) + 5000000, // Giá ngẫu nhiên từ 5tr - 50tr
            imageUrl: p.imageUrl || `https://picsum.photos/300/200?random=${p.id}` // Ảnh ngẫu nhiên
        }));
    } else {
        // Xử lý khi API không trả về dữ liệu
         products.value = []; // Đảm bảo products là mảng rỗng
        console.warn("API returned empty product list.");
         // Nếu muốn hiển thị lỗi, bạn có thể set error.value = true
         // error.value = true;
         // errorMessage.value = "Không có sản phẩm nào được tìm thấy từ API.";
    }
     // Cập nhật tổng số trang (ví dụ đơn giản, sẽ cần logic phân trang thực tế)
     totalPages.value = Math.ceil(products.value.length / 12); // Giả sử 12 sp/trang
  } catch (err) {
    error.value = true;
    errorMessage.value = err.message || 'Lỗi không xác định.';
    products.value = []; // Đặt lại mảng sản phẩm khi có lỗi
  } finally {
    loading.value = false;
  }
};

// Computed property để lọc sản phẩm dựa trên các bộ lọc
const filteredProducts = computed(() => {
  let result = products.value;

  // Lọc theo tìm kiếm
  if (searchQuery.value) {
    const queryLower = searchQuery.value.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(queryLower) ||
      (p.brand?.name && p.brand.name.toLowerCase().includes(queryLower)) ||
      (p.category?.name && p.category.name.toLowerCase().includes(queryLower))
    );
  }

  // Lọc theo danh mục
  if (selectedCategory.value) {
    result = result.filter(p => p.category?.id === selectedCategory.value);
  }

  // Lọc theo thương hiệu
  if (selectedBrand.value) {
    result = result.filter(p => p.brand?.id === selectedBrand.value);
  }

  // Logic phân trang (ví dụ đơn giản, chỉ hiển thị trang hiện tại)
  // Trong thực tế, bạn sẽ cần gọi API với tham số page và size
  const itemsPerPage = 12;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
 // return result.slice(startIndex, endIndex); // Tạm thời bỏ slice để xem tất cả sp lọc được
  return result; // Tạm thời trả về tất cả kết quả lọc để kiểm tra
});


// Gọi API khi component được mount
onMounted(fetchProducts);

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hàm xử lý khi click vào card sản phẩm (điều hướng tới trang chi tiết)
const viewProductDetail = (productId) => {
  // Thay đổi route đến trang chi tiết sản phẩm, ví dụ: /product/123
  router.push({ name: 'productDetail', params: { id: productId } }); // Cần định nghĩa route 'productDetail' sau
  console.log('Xem chi tiết sản phẩm ID:', productId); // Tạm thời log ra console
};

</script>

<style scoped>
.fill-height {
  height: 100%;
}
.v-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
}
.bg-primary {
    background-color: rgba(var(--v-theme-primary), 1) !important;
    color: white;
}
</style>