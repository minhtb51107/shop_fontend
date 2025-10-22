<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-4">
      <template v-slot:divider><v-icon icon="mdi-chevron-right"></v-icon></template>
    </v-breadcrumbs>

    <v-row v-if="loading">
      <v-col cols="12" md="6"><v-skeleton-loader type="image, article"></v-skeleton-loader></v-col>
      <v-col cols="12" md="6"><v-skeleton-loader type="article, actions, table-heading, list-item-two-line@3"></v-skeleton-loader></v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="left" closable @click:close="error = false">
          <v-alert-title>Không thể tải thông tin sản phẩm</v-alert-title> {{ errorMessage }}
        </v-alert>
        <v-btn @click="$router.back()" color="primary" class="mt-4"><v-icon left>mdi-arrow-left</v-icon> Quay lại</v-btn>
      </v-col>
    </v-row>

    <v-row v-else-if="product">
      <v-col cols="12" md="6">
        <v-card flat border>
           <v-carousel v-if="product.images && product.images.length > 1" show-arrows="hover" cycle hide-delimiters height="400" v-model="currentImageIndex">
             <v-carousel-item v-for="(image, i) in product.images" :key="i" :src="image.imageUrl || defaultProductImage" cover></v-carousel-item>
           </v-carousel>
           <v-img v-else :src="getDefaultImage(product.images)" height="400px" cover class="rounded"></v-img>
        </v-card>
        <v-row v-if="product.images && product.images.length > 1" dense class="mt-2">
           <v-col v-for="(image, i) in product.images" :key="`thumb-${i}`" cols="3" md="2">
             <v-card flat border :class="{ 'border-primary elevation-2': i === currentImageIndex }" @click="currentImageIndex = i" class="cursor-pointer">
               <v-img :src="image.imageUrl || defaultProductImage" height="60" cover></v-img>
             </v-card>
           </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <v-card flat>
          <v-chip color="primary" label small class="mb-2">{{ product.category?.name || 'Danh mục' }}</v-chip>
          <h1 class="text-h4 font-weight-bold mb-2">{{ product.name }}</h1>
          <div class="d-flex align-center mb-4">
             <v-rating :model-value="averageRating" color="amber" density="compact" half-increments readonly size="small"></v-rating>
             <a href="#reviews-section" @click.prevent="scrollToReviews" class="text-grey ms-2 text-body-2"> ({{ reviewTotalElements }} Đánh giá)</a>
             <v-spacer></v-spacer>
             <span class="text-body-2">Thương hiệu: <strong class="text-primary">{{ product.brand?.name || 'N/A' }}</strong></span>
          </div>
          <p class="text-h5 font-weight-bold text-red mb-5">{{ formatCurrency(getDefaultPrice(product.variants)) }}</p>
          <p class="text-body-1 mb-6">{{ product.description || 'Sản phẩm hiện chưa có mô tả chi tiết.' }}</p>

          <div class="d-flex align-center mb-6">
            <span class="text-subtitle-1 me-4">Số lượng:</span>
            <v-btn icon="mdi-minus" variant="outlined" size="small" @click="decrementQuantity" :disabled="quantity <= 1"></v-btn>
            <span class="mx-4 text-h6">{{ quantity }}</span>
            <v-btn icon="mdi-plus" variant="outlined" size="small" @click="incrementQuantity"></v-btn>
          </div>

          <v-row>
            <v-col cols="12" sm="6">
              <v-btn color="primary" block size="large" prepend-icon="mdi-cart-plus" @click="addToCart(product, quantity)">Thêm vào giỏ</v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn color="red" variant="outlined" block size="large" prepend-icon="mdi-credit-card-outline">Mua ngay</v-btn>
            </v-col>
          </v-row>

          <div class="mt-5 text-center">
            <v-btn
              variant="text"
              :prepend-icon="wishlistStore.isFavorite(getDefaultVariantId(product.variants)) ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="wishlistStore.isFavorite(getDefaultVariantId(product.variants)) ? 'red' : 'grey-darken-1'"
              @click="toggleFavorite(product)"
              :loading="isTogglingFavorite[getDefaultVariantId(product.variants)]"
              :disabled="!getDefaultVariantId(product.variants)"
              class="me-2" >
              {{ wishlistStore.isFavorite(getDefaultVariantId(product.variants)) ? 'Đã yêu thích' : 'Thêm vào yêu thích' }}
            </v-btn>

            <v-btn variant="text" prepend-icon="mdi-share-variant-outline" color="grey-darken-1">
              Chia sẻ
              <v-menu
                v-model="shareMenu"
                :close-on-content-click="false"
                activator="parent"
                location="top center"
              >
                <v-list density="compact" min-width="200">
                  <v-list-item @click="copyLink">
                    <template v-slot:prepend><v-icon icon="mdi-link-variant"></v-icon></template>
                    <v-list-item-title>Copy đường dẫn</v-list-item-title>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item :href="facebookShareUrl" target="_blank" rel="noopener noreferrer">
                    <template v-slot:prepend><v-icon icon="mdi-facebook" color="#1877F2"></v-icon></template>
                    <v-list-item-title>Facebook</v-list-item-title>
                  </v-list-item>
                  <v-list-item :href="messengerShareUrl" target="_blank" rel="noopener noreferrer">
                    <template v-slot:prepend><v-icon icon="mdi-facebook-messenger" color="#00B2FF"></v-icon></template>
                    <v-list-item-title>Messenger</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" class="mt-8" id="reviews-section"> <v-card flat border>
          <v-tabs v-model="tab" bg-color="primary" dark grow>
            <v-tab value="description">Mô Tả Chi Tiết</v-tab>
            <v-tab value="specs">Thông Số Kỹ Thuật</v-tab>
            <v-tab value="reviews">
              Đánh Giá ({{ reviewTotalElements }}) </v-tab>
          </v-tabs>
          <v-card-text class="pa-0">
            <v-window v-model="tab">
              <v-window-item value="description">
                <div class="pa-4 text-body-1">
                  <p>{{ product.description || 'Sản phẩm chưa có mô tả chi tiết.' }}</p>
                  <div v-if="product.specs && Object.keys(product.specs).length > 0" class="mt-4">
                     <h4 class="text-subtitle-1 font-weight-medium mb-2">Thông số nổi bật:</h4>
                     <ul>
                       <li v-for="(value, key) in product.specs" :key="`desc-${key}`" class="mb-1">
                         <strong class="text-capitalize">{{ formatSpecKey(key) }}:</strong> {{ value }}
                       </li>
                     </ul>
                  </div>
                </div>
              </v-window-item>
              <v-window-item value="specs">
                <v-table density="compact" class="ma-4">
                  <thead><tr><th class="text-left font-weight-bold">Thông số</th><th class="text-left font-weight-bold">Giá trị</th></tr></thead>
                  <tbody>
                    <tr v-if="product.specs && Object.keys(product.specs).length > 0" v-for="(value, key) in product.specs" :key="key">
                      <td class="text-capitalize">{{ formatSpecKey(key) }}</td><td>{{ value }}</td>
                    </tr>
                    <tr v-if="!product.specs || Object.keys(product.specs).length === 0">
                      <td colspan="2" class="text-center text-grey">Chưa có thông số kỹ thuật chi tiết.</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-window-item>

              <v-window-item value="reviews">
                <div class="pa-4">
                  <div v-if="authStore.isAuthenticated" class="mb-8">
                    <h3 class="text-h6 mb-3">Viết đánh giá của bạn</h3>
                    <v-form ref="newReviewForm" @submit.prevent="submitReview">
                      <v-rating
                        v-model="newReviewRating"
                        hover
                        clearable
                        color="amber"
                        size="large"
                        class="mb-3"
                        label="Chọn số sao *"
                      ></v-rating>
                      <v-textarea
                        v-model="newReviewComment"
                        label="Nhận xét của bạn (tùy chọn)"
                        variant="outlined"
                        rows="3"
                        counter
                        maxlength="1000"
                        auto-grow
                      ></v-textarea>
                      <v-alert
                        v-if="reviewSubmitMessage.text"
                        :type="reviewSubmitMessage.type"
                        density="compact"
                        variant="tonal"
                        closable
                        class="my-3"
                        @click:close="reviewSubmitMessage.text = ''"
                      >
                        {{ reviewSubmitMessage.text }}
                      </v-alert>
                      <v-btn
                        type="submit"
                        color="primary"
                        :loading="submittingReview"
                        :disabled="submittingReview || !newReviewRating || newReviewRating === 0"
                        class="mt-2"
                        variant="elevated"
                      >
                        Gửi đánh giá
                      </v-btn>
                    </v-form>
                    <v-divider class="my-6"></v-divider>
                  </div>
                  <div v-else class="mb-6 text-center text-body-2 text-grey">
                     Vui lòng <router-link :to="{ name: 'login', query: { redirect: route.fullPath } }">đăng nhập</router-link> để gửi đánh giá.
                  </div>
                  <h3 class="text-h6 mb-4">Tất cả đánh giá ({{ reviewTotalElements }})</h3>

                  <div v-if="reviewsLoading" class="text-center pa-5">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    <p class="mt-3 text-grey">Đang tải đánh giá...</p>
                  </div>
                  <v-alert v-else-if="reviewsError" type="error" variant="tonal" dense class="mb-4">
                    {{ reviewsErrorMessage }}
                  </v-alert>
                  <div v-else-if="!reviews || reviews.length === 0" class="text-center text-grey pa-5">
                    <v-icon size="48" class="mb-2">mdi-comment-off-outline</v-icon><br>
                    Chưa có đánh giá nào cho sản phẩm này.
                  </div>
                  <div v-else>
                    <v-list lines="three" class="pa-0 bg-transparent"> <template v-for="(review, index) in reviews" :key="review.id">
                        <v-list-item class="px-0 py-2"> <template v-slot:prepend>
                            <v-avatar color="grey-lighten-2" size="40" class="me-3">
                              <v-icon icon="mdi-account"></v-icon>
                            </v-avatar>
                          </template>

                          <v-list-item-title class="font-weight-medium d-flex align-center mb-1">
                            <span>{{ review.customerName }}</span>
                            <v-chip
                              v-if="review.verifiedPurchase"
                              color="teal-lighten-4"
                              text-color="teal-darken-2"
                              label
                              size="x-small"
                              class="ms-2 font-weight-medium"
                              prepend-icon="mdi-check-decagram"
                              variant="flat"
                            >
                              Đã mua hàng
                            </v-chip>
                          </v-list-item-title>

                          <v-list-item-subtitle class="d-flex align-center">
                            <v-rating
                              :model-value="review.rating"
                              color="amber"
                              density="compact"
                              readonly
                              size="x-small"
                              half-increments
                              class="me-2"
                            ></v-rating>
                            <span class="text-caption text-medium-emphasis">{{ formatRelativeTime(review.createdAt) }}</span>
                          </v-list-item-subtitle>

                          <p class="text-body-2 mt-2" v-if="review.comment" style="white-space: pre-wrap;">{{ review.comment }}</p>

                        </v-list-item>
                        <v-divider v-if="index < reviews.length - 1" class="my-1"></v-divider>
                      </template>
                    </v-list>

                    <v-pagination
                      v-if="reviewTotalPages > 1"
                      v-model="reviewPage"
                      :length="reviewTotalPages"
                      :total-visible="5"
                      @update:modelValue="fetchReviews"
                      density="compact"
                      rounded="circle"
                      class="mt-6"
                      active-color="primary"
                    ></v-pagination>
                  </div>

                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="mt-10">
        <h2 class="text-h5 font-weight-medium mb-4">Sản Phẩm Tương Tự</h2>
         <v-row v-if="loadingRelated"><v-col v-for="n in 4" :key="`rel-sk-${n}`" cols="12" sm="6" md="3"><v-skeleton-loader type="image, list-item-two-line, actions"></v-skeleton-loader></v-col></v-row>
         <v-row v-else-if="relatedProducts.length > 0">
           <v-col v-for="related in relatedProducts" :key="related.id" cols="12" sm="6" md="3">
             <v-card class="mx-auto my-2 fill-height d-flex flex-column" hover :to="{ name: 'productDetail', params: { id: related.id } }">
               <v-img height="150" :src="getDefaultImage(related.images)" cover></v-img>
               <v-card-title class="pt-3 pb-1 text-subtitle-2 font-weight-medium">{{ related.name }}</v-card-title>
               <v-card-subtitle class="pb-2 text-caption">{{ related.brand?.name || 'N/A' }}</v-card-subtitle>
               <v-card-text class="flex-grow-1 py-0"><p class="text-body-2 font-weight-bold text-red">{{ formatCurrency(getDefaultPrice(related.variants)) }}</p></v-card-text>
               <v-divider></v-divider>
               <v-card-actions class="pa-1 justify-end">
                 <v-btn icon :color="wishlistStore.isFavorite(getDefaultVariantId(related.variants)) ? 'red' : 'grey-lighten-1'" size="x-small" @click.prevent="toggleFavorite(related)" :loading="isTogglingFavorite[getDefaultVariantId(related.variants)]" :disabled="!getDefaultVariantId(related.variants)">
                   <v-icon>{{ wishlistStore.isFavorite(getDefaultVariantId(related.variants)) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                 </v-btn>
                 <v-btn color="primary" variant="tonal" size="small" @click.prevent="addToCart(related, 1)">
                   <v-icon start size="small">mdi-cart-plus</v-icon> Thêm
                 </v-btn>
               </v-card-actions>
             </v-card>
           </v-col>
         </v-row>
         <v-row v-else><v-col class="text-center text-grey">Không tìm thấy sản phẩm tương tự.</v-col></v-row>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top right" variant="elevated" multi-line>
      {{ snackbar.text }}
      <template v-slot:actions>
         <v-btn v-if="snackbar.showCartButton" color="white" variant="text" to="/cart">Xem giỏ hàng</v-btn>
        <v-btn icon="mdi-close" variant="text" @click="snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
// --- Các Import Cần Thiết ---
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import productService from '@/services/productService';
import reviewService from '@/services/reviewService'; // <-- Import service đánh giá
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useAuthStore } from '@/stores/auth';
import { formatDistanceToNowStrict } from 'date-fns'; // <-- Import date-fns
import { vi } from 'date-fns/locale'; // <-- Import tiếng Việt

// --- Khai báo Store, Router, Refs cơ bản ---
const route = useRoute();
const router = useRouter();
const product = ref(null);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const quantity = ref(1);
const tab = ref('description'); // State cho VTabs
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// --- Ảnh mặc định và State cho Ảnh/Loading ---
const defaultProductImage = 'https://cdn.vuetifyjs.com/images/cards/foster.jpg';
const currentImageIndex = ref(0);
const isTogglingFavorite = ref({});

// --- State cho Sản phẩm liên quan ---
const relatedProducts = ref([]);
const loadingRelated = ref(true);

// --- Computed Properties ---
const productId = computed(() => route.params.id ? parseInt(route.params.id, 10) : null);

// Breadcrumbs động
const breadcrumbs = computed(() => [
  { title: 'Trang Chủ', to: '/' },
  { title: 'Sản Phẩm', to: '/products' },
  { title: product.value ? product.value.name : 'Chi Tiết', disabled: true },
]);

// --- Snackbar State ---
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 3000, showCartButton: false });

// --- Code Chia sẻ ---
const shareMenu = ref(false);
const productUrl = computed(() => window.location.href);
const shareTitle = computed(() => product.value?.name || 'Sản phẩm thú vị!');
const shareDescription = computed(() => product.value?.description || 'Xem sản phẩm này nhé!');
const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl.value)}`);
const messengerShareUrl = computed(() => `fb-messenger://share/?link=${encodeURIComponent(productUrl.value)}`);

// ========== STATE CHO ĐÁNH GIÁ ==========
const reviews = ref([]); // Danh sách đánh giá
const reviewsLoading = ref(false);
const reviewsError = ref(false);
const reviewsErrorMessage = ref('');
const reviewPage = ref(1); // Trang hiện tại (1-based)
const reviewTotalPages = ref(0);
const reviewTotalElements = ref(0); // Tổng số đánh giá
const reviewsPerPage = 5; // Số đánh giá mỗi trang
const averageRating = computed(() => { // Tính rating trung bình (tạm thời)
   // TODO: Lấy rating trung bình từ API backend thay vì tính toán ở đây
   if (!reviews.value || reviews.value.length === 0) return 0;
   const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
   return sum / reviews.value.length;
});


// Form gửi đánh giá mới
const newReviewForm = ref(null); // Ref cho v-form
const newReviewRating = ref(null); // Điểm sao (null ban đầu)
const newReviewComment = ref('');
const submittingReview = ref(false);
const reviewSubmitMessage = ref({ type: 'success', text: '' });
// ===========================================


// --- Hàm hiển thị Snackbar ---
const showSnackbar = (text, color = 'success', showCartButton = false, timeout = 3000) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.showCartButton = showCartButton;
  snackbar.value.timeout = timeout;
  snackbar.value.show = true;
};

// --- Hàm Fetch Dữ Liệu ---
// Fetch Sản phẩm liên quan
const fetchRelatedProducts = async (id) => {
  loadingRelated.value = true;
  try {
    relatedProducts.value = await productService.getRelatedProducts(id, 4);
  } catch (err) {
    console.error("Error fetching related products:", err);
    relatedProducts.value = [];
  } finally {
    loadingRelated.value = false;
  }
};

// Fetch Chi tiết sản phẩm
const fetchProductDetail = async (id) => {
  loading.value = true; error.value = false; errorMessage.value = ''; product.value = null; quantity.value = 1; currentImageIndex.value = 0; relatedProducts.value = []; loadingRelated.value = true;
  // Reset reviews state khi fetch sản phẩm mới
  reviews.value = []; reviewsLoading.value = false; reviewsError.value = false; reviewsErrorMessage.value = ''; reviewPage.value = 1; reviewTotalPages.value = 0; reviewTotalElements.value = 0;

  try {
    const data = await productService.getProductById(id);
    product.value = data;
    console.log('Product Detail Data:', JSON.stringify(product.value, null, 2));

    if (product.value) {
      document.title = `${product.value.name} - Shop Điện Tử`;
      fetchRelatedProducts(product.value.id);
      // Fetch trang đầu tiên của reviews nếu tab đang là reviews (hoặc nếu muốn load sẵn)
      if(tab.value === 'reviews') {
        fetchReviews(1);
      }
    } else {
      error.value = true; errorMessage.value = 'Sản phẩm không tồn tại hoặc đã bị xóa.'; document.title = `Không tìm thấy sản phẩm - Shop Điện Tử`;
    }
  } catch (err) {
    error.value = true; errorMessage.value = err.response?.data?.message || err.message || 'Lỗi không xác định khi tải sản phẩm.'; console.error("Error fetching product detail:", err); document.title = `Lỗi Sản Phẩm - Shop Điện Tử`;
  } finally {
    loading.value = false;
    await nextTick();
    // Không scroll ở đây nữa, scroll khi mount và watch productId
  }
};

// ========== HÀM FETCH ĐÁNH GIÁ ==========
const fetchReviews = async (page = 1) => { // Nhận page (1-based)
  if (!productId.value) return;

  reviewsLoading.value = true;
  reviewsError.value = false;
  reviewsErrorMessage.value = '';
  try {
    const pageData = await reviewService.getReviewsByProductId(productId.value, page - 1, reviewsPerPage);
    reviews.value = pageData.content;
    reviewTotalPages.value = pageData.totalPages;
    reviewTotalElements.value = pageData.totalElements;
    reviewPage.value = page; // Cập nhật trang hiện tại (1-based)
    console.log('Fetched reviews page:', page, pageData);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    reviewsError.value = true;
    reviewsErrorMessage.value = error.message || 'Lỗi tải đánh giá.';
    reviews.value = [];
    reviewTotalPages.value = 0;
    reviewTotalElements.value = 0;
  } finally {
    reviewsLoading.value = false;
  }
};
// ===========================================

// ========== HÀM SUBMIT ĐÁNH GIÁ ==========
const submitReview = async () => {
  if (!productId.value || !newReviewRating.value || newReviewRating.value === 0) {
      showSnackbar('Vui lòng chọn số sao đánh giá.', 'warning');
      return;
  }

  // Validate form (Vuetify sẽ tự làm dựa trên rules)
  const { valid } = await newReviewForm.value.validate();
  if (!valid) return;

  submittingReview.value = true;
  reviewSubmitMessage.value.text = '';

  try {
    const reviewData = {
      productId: productId.value,
      rating: newReviewRating.value,
      comment: newReviewComment.value,
    };
    const createdReview = await reviewService.createReview(reviewData);

    // Thêm review mới vào đầu danh sách HOẶC fetch lại trang 1
    // Lựa chọn 1: Thêm vào đầu (nhanh hơn, nhưng có thể không thấy ngay nếu đang ở trang khác 1)
     // reviews.value.unshift(createdReview);
     // reviewTotalElements.value++;
    // Lựa chọn 2: Fetch lại trang 1 (đảm bảo dữ liệu mới nhất)
    await fetchReviews(1); // Fetch lại trang 1 sau khi gửi thành công

    // Reset form
    newReviewRating.value = null; // Reset về null
    newReviewComment.value = '';
    // Vuetify 3: reset validation
    if (newReviewForm.value) {
      newReviewForm.value.resetValidation();
    }


    reviewSubmitMessage.value = { type: 'success', text: 'Gửi đánh giá thành công! Cảm ơn bạn.' };

  } catch (error) {
    console.error("Error submitting review:", error);
    reviewSubmitMessage.value = { type: 'error', text: error.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.' };
  } finally {
    submittingReview.value = false;
  }
};
// ===========================================


// --- Các Hàm Utility ---
// ... (getDefaultPrice, getDefaultImage, formatCurrency, formatSpecKey, getDefaultVariantId giữ nguyên) ...
const getDefaultPrice = (variants) => { if (Array.isArray(variants) && variants.length > 0) { return variants[0].price; } console.log('No price found for variants:', variants); return undefined; };
const getDefaultImage = (images) => { if (Array.isArray(images) && images.length > 0) { const mainImage = images.find(img => img.isMain === true); if (mainImage && mainImage.imageUrl) { return mainImage.imageUrl; } const firstValidImage = images.find(img => img.imageUrl); if(firstValidImage) { return firstValidImage.imageUrl; } } return defaultProductImage; };
const formatCurrency = (value) => { if (value === null || value === undefined || value < 0) return 'Liên hệ'; return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value); };
const formatSpecKey = (key) => { if (!key) return ''; const result = key.replace(/([A-Z])/g, ' $1'); return result.charAt(0).toUpperCase() + result.slice(1); };
const getDefaultVariantId = (variants) => { if (Array.isArray(variants) && variants.length > 0) { return variants[0].id; } return null; };

// ========== HÀM FORMAT THỜI GIAN ==========
const formatRelativeTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  try {
    // Chuyển đổi OffsetDateTime (ISO 8601) thành Date object
    const date = new Date(dateTimeString);
    // Sử dụng date-fns để format
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: vi });
  } catch (e) {
    console.error("Error formatting time:", e, dateTimeString);
    // Trả về phần ngày tháng nếu không parse được
    try { return new Date(dateTimeString).toLocaleDateString('vi-VN'); } catch { return dateTimeString; }
  }
};
// ===========================================

// --- Điều khiển Số lượng ---
const incrementQuantity = () => quantity.value++;
const decrementQuantity = () => { if (quantity.value > 1) quantity.value--; };

// --- Thêm vào Giỏ hàng ---
const addToCart = (productToAdd, quantityToAdd = 1) => { const targetProduct = productToAdd.id === product.value?.id ? product.value : productToAdd; if (targetProduct && Array.isArray(targetProduct.variants) && targetProduct.variants.length > 0) { const v = targetProduct.variants[0]; const i = getDefaultImage(targetProduct.images); const item = { id: v.id, productId: targetProduct.id, name: targetProduct.name, price: v.price, imageUrl: i }; cartStore.addItem(item, quantityToAdd); showSnackbar(`Đã thêm ${quantityToAdd} "${targetProduct.name}" vào giỏ hàng`, 'success', true, 4000); } else { console.error("Không thể thêm vào giỏ, thiếu thông tin variant:", targetProduct); showSnackbar('Lỗi: Không thể thêm sản phẩm (thiếu thông tin).', 'error'); } };

// --- Thêm/Xóa Yêu thích ---
const toggleFavorite = async (productToToggle) => { if (!authStore.isAuthenticated) { showSnackbar('Vui lòng đăng nhập để sử dụng chức năng này.', 'info'); router.push({ name: 'login', query: { redirect: route.fullPath } }); return; } const targetProduct = productToToggle.id === product.value?.id ? product.value : productToToggle; const variantId = getDefaultVariantId(targetProduct?.variants); if (!variantId) { showSnackbar('Lỗi: Không tìm thấy thông tin phiên bản sản phẩm.', 'error'); return; } isTogglingFavorite.value[variantId] = true; try { if (wishlistStore.isFavorite(variantId)) { await wishlistStore.removeFavorite(variantId); showSnackbar(`Đã xóa "${targetProduct.name}" khỏi danh sách yêu thích`, 'info'); } else { await wishlistStore.addFavorite(variantId); showSnackbar(`Đã thêm "${targetProduct.name}" vào danh sách yêu thích`, 'pink'); } } catch (error) { console.error("Error toggling favorite:", error); showSnackbar(error.message || 'Thao tác thất bại. Vui lòng thử lại.', 'error'); } finally { isTogglingFavorite.value[variantId] = false; } };

// --- Hàm scroll tới phần đánh giá ---
const scrollToReviews = () => {
    tab.value = 'reviews'; // Chuyển tab
    nextTick(() => { // Đợi DOM cập nhật
        const element = document.getElementById('reviews-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    });
};

// --- Hàm Copy Link (Đã thêm ở bước trước) ---
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(productUrl.value);
    showSnackbar('Đã sao chép đường dẫn sản phẩm!', 'success');
    shareMenu.value = false; // Đóng menu lại (tùy chọn)
  } catch (err) {
    console.error('Lỗi khi sao chép link:', err);
    showSnackbar('Sao chép thất bại. Vui lòng thử lại.', 'error');
  }
};


// --- Lifecycle Hooks ---
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' });
   if (productId.value) {
     fetchProductDetail(productId.value);
   } else {
     loading.value = false; error.value = true; errorMessage.value = "ID sản phẩm không hợp lệ.";
   }
});

// Watch sự thay đổi của productId
watch(productId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchProductDetail(newId);
    // Reset review state khi đổi sản phẩm
    reviews.value = []; reviewsLoading.value = false; reviewsError.value = false; reviewPage.value = 1; reviewTotalPages.value = 0; reviewTotalElements.value = 0;
    // Chuyển về tab description khi đổi sản phẩm (tùy chọn)
    // tab.value = 'description';
  }
}, { flush: 'pre' });

// ========== WATCH CHO TAB ĐÁNH GIÁ ==========
watch(tab, (newTab) => {
  // Chỉ fetch khi chuyển sang tab 'reviews' VÀ chưa load lần nào HOẶC chưa có data VÀ không bị lỗi
  if (newTab === 'reviews' && !reviewsLoading.value && reviews.value.length === 0 && !reviewsError.value && productId.value) {
    fetchReviews(1); // Fetch trang đầu tiên
  }
});
// ===========================================

</script>

<style scoped>
/* Thêm style nếu cần */
.border-primary { border: 2px solid rgb(var(--v-theme-primary)) !important; }
.cursor-pointer { cursor: pointer; }
/* Style cho chip verified purchase */
.v-chip--label.v-chip--size-x-small {
    font-size: 0.65rem;
    height: 18px;
    padding: 0 6px;
}
.v-list-item-subtitle .v-rating {
    line-height: 1; /* Căn chỉnh rating */
}
/* Style cho comment giữ lại xuống dòng */
.text-body-2 {
    white-space: pre-wrap; /* Giữ lại khoảng trắng và xuống dòng */
    word-break: break-word; /* Ngắt từ nếu quá dài */
}
</style>