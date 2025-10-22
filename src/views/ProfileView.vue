<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">👤 Hồ Sơ Của Tôi</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3" v-if="!$vuetify.display.mobile">
        <v-card flat border>
          <v-list nav density="compact">
            <v-list-item
              v-for="(item, i) in profileMenuItems"
              :key="i"
              :value="item.value"
              @click="activeTab = item.value"
              :active="activeTab === item.value"
              color="primary"
              rounded="lg"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <v-tabs v-model="activeTab" bg-color="primary" dark grow v-if="$vuetify.display.mobile" class="mb-4 rounded">
          <v-tab v-for="item in profileMenuItems" :key="item.value" :value="item.value">
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.text }}
          </v-tab>
        </v-tabs>

        <v-card flat border>
          <v-window v-model="activeTab">
            <v-window-item value="info">
              <v-card-title class="text-h6 font-weight-medium">Thông tin tài khoản</v-card-title>
              <v-card-subtitle>Xem và chỉnh sửa thông tin cá nhân của bạn.</v-card-subtitle>
              <v-divider class="mt-2 mb-4"></v-divider>
              <v-card-text>
                <v-form ref="profileForm" @submit.prevent="updateProfile">
                  <v-row>
                    <v-col cols="12" class="text-center mb-4">
                      <v-avatar size="120" color="grey-lighten-3">
                        <v-img :src="avatarPreview || user?.photo || defaultAvatar" cover></v-img>
                      </v-avatar>
                      <v-btn
                        variant="text"
                        size="small"
                        class="mt-2 text-caption"
                        @click="triggerAvatarUpload"
                        prepend-icon="mdi-camera-outline"
                      >
                        Thay đổi ảnh
                      </v-btn>
                      <input type="file" ref="avatarInput" @change="previewAvatar" accept="image/*" hidden />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="profileData.fullname"
                        label="Họ và tên"
                        name="fullname"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                        prepend-inner-icon="mdi-account-outline"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        :model-value="user?.email"
                        label="Email"
                        variant="outlined"
                        readonly
                        disabled
                        density="comfortable"
                        prepend-inner-icon="mdi-email-outline"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="profileData.phoneNumber"
                        label="Số điện thoại"
                        variant="outlined"
                        :rules="[rules.phone]"
                        density="comfortable"
                        prepend-inner-icon="mdi-phone-outline"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-alert
                    v-if="profileMessage.text"
                    :type="profileMessage.type"
                    density="compact"
                    variant="tonal"
                    closable
                    class="mt-4"
                    @click:close="profileMessage.text = ''"
                  >
                    {{ profileMessage.text }}
                  </v-alert>
                  <v-card-actions class="mt-4 pa-0">
                    <v-spacer></v-spacer>
                    <v-btn
                      type="submit"
                      color="primary"
                      :loading="profileLoading"
                      :disabled="!isProfileChanged || profileLoading"
                      variant="elevated"
                    >
                      <v-icon left>mdi-content-save-outline</v-icon>
                      Lưu thay đổi
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-window-item>

            <v-window-item value="password">
              <v-card-title class="text-h6 font-weight-medium">Đổi mật khẩu</v-card-title>
              <v-card-subtitle>Thay đổi mật khẩu đăng nhập của bạn.</v-card-subtitle>
              <v-divider class="mt-2 mb-4"></v-divider>
              <v-card-text>
                <v-form ref="passwordForm" @submit.prevent="changePassword">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="passwordData.oldPassword"
                        label="Mật khẩu cũ"
                        :type="showOldPassword ? 'text' : 'password'"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-inner-icon="showOldPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showOldPassword = !showOldPassword"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="passwordData.newPassword"
                        label="Mật khẩu mới"
                        :type="showNewPassword ? 'text' : 'password'"
                        variant="outlined"
                        :rules="[rules.required, rules.min8]"
                        density="comfortable"
                        prepend-inner-icon="mdi-lock-plus-outline"
                        :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showNewPassword = !showNewPassword"
                        hint="Ít nhất 8 ký tự"
                        persistent-hint
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="passwordData.confirmNewPassword"
                        label="Xác nhận mật khẩu mới"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        variant="outlined"
                        :rules="[rules.required, confirmPasswordRule]"
                        density="comfortable"
                        prepend-inner-icon="mdi-lock-check-outline"
                        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showConfirmPassword = !showConfirmPassword"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-alert
                    v-if="passwordMessage.text"
                    :type="passwordMessage.type"
                    density="compact"
                    variant="tonal"
                    closable
                    class="mt-4"
                    @click:close="passwordMessage.text = ''"
                  >
                    {{ passwordMessage.text }}
                  </v-alert>
                  <v-card-actions class="mt-4 pa-0">
                    <v-spacer></v-spacer>
                    <v-btn
                      type="submit"
                      color="primary"
                      :loading="passwordLoading"
                      :disabled="passwordLoading"
                      variant="elevated"
                    >
                      <v-icon left>mdi-lock-reset</v-icon>
                      Đổi mật khẩu
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-window-item>

            <v-window-item value="orders">
              <v-card-title class="text-h6 font-weight-medium">Lịch sử đơn hàng</v-card-title>
              <v-card-subtitle>Xem lại các đơn hàng bạn đã đặt.</v-card-subtitle>
              <v-divider class="mt-2 mb-4"></v-divider>
              <v-card-text class="text-center text-grey">
                 <p>Xem chi tiết tại <router-link :to="{ name: 'orders' }">đây</router-link>.</p>
               </v-card-text>
            </v-window-item>

            <v-window-item value="wishlist">
              <v-card-title class="text-h6 font-weight-medium">Danh sách yêu thích</v-card-title>
              <v-card-subtitle>Các sản phẩm bạn đã lưu lại.</v-card-subtitle>
              <v-divider class="mt-2 mb-4"></v-divider>
              <v-card-text>
                <div v-if="wishlistLoading" class="text-center pa-5">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  <p class="mt-3 text-grey">Đang tải danh sách...</p>
                </div>
                <v-alert v-else-if="wishlistError" type="error" variant="tonal" dense>
                  {{ wishlistErrorMessage || 'Lỗi tải danh sách yêu thích.' }}
                </v-alert>
                <div v-else-if="!wishlistItems || wishlistItems.length === 0" class="text-center text-grey pa-5">
                  <v-icon size="48" class="mb-2">mdi-heart-off-outline</v-icon><br>
                  Danh sách yêu thích của bạn đang trống.
                  <v-btn variant="text" color="primary" to="/products" class="mt-2">Khám phá sản phẩm</v-btn>
                </div>
                <v-list lines="three" v-else>
                  <v-list-item
                    v-for="item in wishlistItems"
                    :key="item.variant.id"
                    :prepend-avatar="item.variant.productImageUrl || defaultAvatar"
                    :title="item.variant.productName"
                    :subtitle="`Màu: ${item.variant.color || 'N/A'} - SKU: ${item.variant.sku}`"
                    class="mb-2 wishlist-item-hover"
                    @click="goToProduct(item.variant.productId)"
                    style="cursor: pointer;"
                  >
                    <template v-slot:append>
                       <div class="d-flex flex-column align-end">
                          <span class="text-red font-weight-medium mb-1">{{ formatCurrency(item.variant.price) }}</span>
                          <v-btn
                            icon="mdi-delete-outline"
                            variant="text"
                            color="grey"
                            size="small"
                            @click.stop="removeFromWishlist(item.variant.id, item.variant.productName)"
                            :loading="removingWishlistItemId === item.variant.id"
                            title="Xóa khỏi yêu thích"
                          ></v-btn>
                       </div>
                    </template>
                     <v-divider v-if="wishlistItems.indexOf(item) < wishlistItems.length - 1" class="mt-1"></v-divider>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-window-item>
            </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
      variant="elevated"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn icon="mdi-close" variant="text" @click="snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import { useAuthStore } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlistStore'; // Import wishlist store
import userService from '@/services/userService';
import wishlistService from '@/services/wishlistService'; // Import wishlist service
import defaultAvatar from '@/assets/default-avatar.png';

// --- Stores and Router ---
const authStore = useAuthStore();
const wishlistStore = useWishlistStore(); // Sử dụng wishlist store
const router = useRouter(); // Sử dụng router
const user = computed(() => authStore.user);

// --- State chung ---
const activeTab = ref('info');
const profileForm = ref(null);
const passwordForm = ref(null);
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 3000 });

// --- State cho Tab Thông tin cá nhân ---
const profileData = ref({ fullname: '', phoneNumber: '' });
const profileLoading = ref(false);
const profileMessage = ref({ type: 'success', text: '' });
const avatarPreview = ref(null);
const avatarInput = ref(null);
let avatarFile = null;
const isProfileChanged = computed(() => {
    if (!user.value) return false;
    return profileData.value.fullname !== (user.value.fullname || '') ||
           profileData.value.phoneNumber !== (user.value.phoneNumber || '') ||
           !!avatarFile;
});

// --- State cho Tab Đổi mật khẩu ---
const passwordData = ref({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
const passwordLoading = ref(false);
const passwordMessage = ref({ type: 'success', text: '' });
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// --- State cho Tab Danh sách yêu thích ---
const wishlistItems = ref([]); // Danh sách sản phẩm yêu thích
const wishlistLoading = ref(false);
const wishlistError = ref(false);
const wishlistErrorMessage = ref('');
const removingWishlistItemId = ref(null); // ID của item đang được xóa (để hiển thị loading)

// --- Validation Rules ---
const rules = {
  required: value => !!value || 'Thông tin bắt buộc.',
  min8: value => (value && value.length >= 8) || 'Ít nhất 8 ký tự.',
  phone: value => !value || /^(0[3|5|7|8|9])+([0-9]{8})\b/.test(value) || 'Số điện thoại không hợp lệ.',
};
const confirmPasswordRule = computed(() =>
    passwordData.value.newPassword === passwordData.value.confirmNewPassword || 'Mật khẩu xác nhận không khớp.'
);

// --- Methods ---
const showSnackbar = (text, color = 'success') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

const syncProfileData = () => {
  if (user.value) {
    profileData.value.fullname = user.value.fullname || '';
    profileData.value.phoneNumber = user.value.phoneNumber || '';
    avatarPreview.value = user.value.photo || defaultAvatar;
    avatarFile = null; // Reset file khi sync
  }
};

// Avatar Methods
const triggerAvatarUpload = () => avatarInput.value?.click();
const previewAvatar = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        avatarFile = file;
        const reader = new FileReader();
        reader.onload = (e) => avatarPreview.value = e.target.result;
        reader.readAsDataURL(file);
    } else {
        avatarFile = null;
        showSnackbar('Vui lòng chọn một file ảnh hợp lệ.', 'error');
    }
}

// Update Profile
const updateProfile = async () => {
  const { valid } = await profileForm.value.validate();
  if (!valid || !isProfileChanged.value) return;
  profileLoading.value = true;
  profileMessage.value.text = '';
  try {
    // TODO: Implement avatar upload if needed
    const updatedUserData = await userService.updateMyProfile({
      fullname: profileData.value.fullname,
      phoneNumber: profileData.value.phoneNumber,
      // photo: photoUrl,
    });
    authStore.user = { ...authStore.user, ...updatedUserData };
    profileMessage.value = { type: 'success', text: 'Cập nhật hồ sơ thành công!' };
    avatarFile = null;
  } catch (error) {
    profileMessage.value = { type: 'error', text: error.message || 'Lỗi cập nhật hồ sơ.' };
  } finally {
    profileLoading.value = false;
  }
};

// Change Password
const changePassword = async () => {
  const { valid } = await passwordForm.value.validate();
  if (!valid) return;
  passwordLoading.value = true;
  passwordMessage.value.text = '';
  try {
    await userService.changeMyPassword({
      oldPassword: passwordData.value.oldPassword,
      newPassword: passwordData.value.newPassword,
    });
    passwordMessage.value = { type: 'success', text: 'Đổi mật khẩu thành công!' };
    passwordForm.value.reset();
    passwordData.value = { oldPassword: '', newPassword: '', confirmNewPassword: ''};
  } catch (error) {
    passwordMessage.value = { type: 'error', text: error.response?.data?.message || error.message || 'Lỗi đổi mật khẩu.' };
  } finally {
    passwordLoading.value = false;
  }
};

// --- Wishlist Methods ---
const fetchWishlist = async () => {
  wishlistLoading.value = true;
  wishlistError.value = false;
  wishlistErrorMessage.value = '';
  try {
    // Gọi API từ wishlistService (đã import ở trên)
    const data = await wishlistService.getMyWishlist();
    wishlistItems.value = data;
    console.log('Fetched wishlist:', data); // Log để kiểm tra
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    wishlistError.value = true;
    wishlistErrorMessage.value = error.response?.data?.message || error.message || 'Lỗi tải danh sách yêu thích.';
    wishlistItems.value = []; // Reset list khi lỗi
  } finally {
    wishlistLoading.value = false;
  }
};

const removeFromWishlist = async (variantId, productName) => {
    if (removingWishlistItemId.value) return; // Tránh click nhiều lần
    removingWishlistItemId.value = variantId;
    try {
        // Gọi store action để xóa (store sẽ gọi API)
        await wishlistStore.removeFavorite(variantId);
        // Cập nhật lại list trên UI (lọc bỏ item vừa xóa)
        wishlistItems.value = wishlistItems.value.filter(item => item.variant.id !== variantId);
        showSnackbar(`Đã xóa "${productName}" khỏi danh sách yêu thích.`, 'info');
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        showSnackbar(error.message || 'Lỗi xóa sản phẩm.', 'error');
    } finally {
        removingWishlistItemId.value = null; // Reset loading state
    }
};

// Helper để đi đến trang chi tiết sản phẩm
const goToProduct = (productId) => {
    if (productId) {
        router.push({ name: 'productDetail', params: { id: productId } });
    }
};

// Helper format tiền tệ (cần thiết cho wishlist)
const formatCurrency = (value) => {
  if (value === null || value === undefined || value < 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};


// --- Lifecycle Hooks ---
onMounted(() => {
  syncProfileData();
  // Không fetch wishlist ngay khi mount, chỉ fetch khi tab được chọn
});

// Watch for changes in user store data
watch(() => authStore.user, (newUser, oldUser) => {
    if (newUser && JSON.stringify(newUser) !== JSON.stringify(oldUser)) {
        syncProfileData();
    }
}, { deep: true });

// --- Watch activeTab để fetch wishlist khi cần ---
watch(activeTab, (newTab) => {
  // Chỉ fetch khi chuyển sang tab 'wishlist' VÀ chưa có dữ liệu HOẶC chưa từng bị lỗi
  if (newTab === 'wishlist' && !wishlistLoading.value && (wishlistItems.value.length === 0 && !wishlistError.value)) {
    fetchWishlist();
  }
});

// --- Menu items ---
const profileMenuItems = ref([
    { text: 'Thông tin tài khoản', icon: 'mdi-account-details-outline', value: 'info' },
    { text: 'Đổi mật khẩu', icon: 'mdi-lock-reset', value: 'password' },
    { text: 'Lịch sử đơn hàng', icon: 'mdi-receipt-text-clock-outline', value: 'orders' },
    { text: 'Danh sách yêu thích', icon: 'mdi-heart-outline', value: 'wishlist' }, // Giữ nguyên
]);

</script>

<style scoped>
/* Thêm style cho wishlist item khi hover (tùy chọn) */
.wishlist-item-hover:hover {
  background-color: rgba(0, 0, 0, 0.03); /* Màu nền nhẹ khi hover */
}
</style>