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
                <v-icon size="48" class="mb-2">mdi-receipt-text-clock-outline</v-icon>
                <p>Tính năng đang được phát triển.</p>
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
import { useAuthStore } from '@/stores/auth';
import userService from '@/services/userService'; // Import userService
import defaultAvatar from '@/assets/default-avatar.png'; // Tạo ảnh avatar mặc định

// --- Stores and Refs ---
const authStore = useAuthStore();
const user = computed(() => authStore.user); // Lấy user từ store

const activeTab = ref('info'); // Tab đang active
const profileForm = ref(null); // Ref cho form profile
const passwordForm = ref(null); // Ref cho form password

// Data for profile form
const profileData = ref({
  fullname: '',
  phoneNumber: '',
  // photo: null, // Sẽ xử lý riêng
});

// Data for password form
const passwordData = ref({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

// Loading and message states
const profileLoading = ref(false);
const passwordLoading = ref(false);
const profileMessage = ref({ type: 'success', text: '' });
const passwordMessage = ref({ type: 'success', text: '' });
const snackbar = ref({ show: false, text: '', color: 'success', timeout: 3000 });

// Avatar preview
const avatarPreview = ref(null);
const avatarInput = ref(null); // Ref cho input file
let avatarFile = null; // Biến lưu file ảnh đã chọn

// Password visibility toggles
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// --- Computed Properties ---
// Kiểm tra xem thông tin profile có thay đổi không
const isProfileChanged = computed(() => {
    if (!user.value) return false;
    // Kiểm tra cả avatarFile
    return profileData.value.fullname !== user.value.fullname ||
           profileData.value.phoneNumber !== (user.value.phoneNumber || '') || // Xử lý null
           !!avatarFile; // True nếu có file avatar mới
});

// --- Validation Rules ---
const rules = {
  required: value => !!value || 'Thông tin bắt buộc.',
  min8: value => (value && value.length >= 8) || 'Ít nhất 8 ký tự.',
  phone: value => !value || /^(0[3|5|7|8|9])+([0-9]{8})\b/.test(value) || 'Số điện thoại không hợp lệ.', // Cho phép rỗng
};
const confirmPasswordRule = computed(() =>
    passwordData.value.newPassword === passwordData.value.confirmNewPassword || 'Mật khẩu xác nhận không khớp.'
);

// --- Methods ---
// Hiển thị snackbar
const showSnackbar = (text, color = 'success') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Cập nhật profileData khi user từ store thay đổi
const syncProfileData = () => {
  if (user.value) {
    profileData.value.fullname = user.value.fullname || '';
    profileData.value.phoneNumber = user.value.phoneNumber || '';
    avatarPreview.value = user.value.photo || defaultAvatar; // Cập nhật preview
    avatarFile = null; // Reset file đã chọn
  }
};

// Trigger click input file avatar
const triggerAvatarUpload = () => {
    avatarInput.value?.click();
}

// Xử lý khi chọn file avatar mới
const previewAvatar = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        avatarFile = file; // Lưu file lại
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.value = e.target.result; // Hiển thị preview
        };
        reader.readAsDataURL(file);
    } else {
        avatarFile = null;
        showSnackbar('Vui lòng chọn một file ảnh hợp lệ.', 'error');
    }
}

// Cập nhật thông tin profile
const updateProfile = async () => {
  const { valid } = await profileForm.value.validate();
  if (!valid || !isProfileChanged.value) return;

  profileLoading.value = true;
  profileMessage.value.text = '';

  try {
      // TODO: Xử lý upload avatarFile lên server nếu có
      // 1. Upload avatarFile -> Nhận URL mới
      // 2. Gửi URL mới này cùng profileData
      let photoUrl = user.value?.photo; // Giữ ảnh cũ nếu không đổi
      // if (avatarFile) {
      //     photoUrl = await uploadAvatarToServer(avatarFile); // Hàm upload giả định
      // }

    const updatedUserData = await userService.updateMyProfile({
      fullname: profileData.value.fullname,
      phoneNumber: profileData.value.phoneNumber,
      photo: photoUrl, // Gửi URL ảnh (nếu có thay đổi)
    });
    // Cập nhật lại user trong store (quan trọng)
    authStore.user = { ...authStore.user, ...updatedUserData };
    profileMessage.value = { type: 'success', text: 'Cập nhật hồ sơ thành công!' };
    avatarFile = null; // Reset file sau khi cập nhật thành công
    // syncProfileData(); // Đồng bộ lại form (không cần thiết vì user store đã cập nhật)

  } catch (error) {
    profileMessage.value = { type: 'error', text: error.message || 'Lỗi cập nhật hồ sơ.' };
  } finally {
    profileLoading.value = false;
  }
};

// Đổi mật khẩu
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
    // Reset form
    passwordForm.value.reset();
  } catch (error) {
    passwordMessage.value = { type: 'error', text: error.message || 'Lỗi đổi mật khẩu.' };
  } finally {
    passwordLoading.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  if (authStore.user) {
    syncProfileData();
  }
});

// Theo dõi nếu user trong store thay đổi (ví dụ sau khi fetchUser hoàn tất)
watch(() => authStore.user, (newUser) => {
    if (newUser) {
        syncProfileData();
    }
}, { immediate: true }); // immediate: true để chạy lần đầu

// Menu items cho profile page
const profileMenuItems = ref([
    { text: 'Thông tin tài khoản', icon: 'mdi-account-details-outline', value: 'info' },
    { text: 'Đổi mật khẩu', icon: 'mdi-lock-reset', value: 'password' },
    { text: 'Lịch sử đơn hàng', icon: 'mdi-receipt-text-clock-outline', value: 'orders' },
    // Thêm các mục khác nếu cần (ví dụ: địa chỉ, thông báo,...)
]);

</script>

<style scoped>
/* Có thể thêm style nếu cần */
</style>