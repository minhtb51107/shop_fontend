<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-6 rounded-lg">
          <v-img
                src="/src/assets/logo.svg"
                max-height="60"
                contain
                class="mb-6 mx-auto cursor-pointer"
                 @click="$router.push('/')"
            ></v-img>
          <v-card-title class="text-center text-h5 font-weight-bold mb-4 text-primary">
            Đặt Lại Mật khẩu
          </v-card-title>
          <v-card-text>
            <v-alert v-if="invalidToken" type="error" density="compact" variant="tonal" class="mb-4">
              Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng <router-link to="/forgot-password">yêu cầu lại</router-link>.
            </v-alert>

            <v-form @submit.prevent="handleResetPassword" ref="resetPasswordForm" v-else>
               <v-alert
                v-if="successMessage"
                type="success"
                density="compact"
                variant="tonal"
                class="mb-4"
              >
                {{ successMessage }} Bạn có thể <router-link to="/login" class="font-weight-bold">đăng nhập</router-link> ngay bây giờ.
              </v-alert>

               <v-alert
                v-if="errorMessage"
                type="error"
                density="compact"
                variant="tonal"
                closable
                class="mb-4"
                 @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>


              <v-text-field
                v-model="newPassword"
                label="Mật khẩu mới"
                :type="showNewPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-plus-outline"
                :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showNewPassword = !showNewPassword"
                variant="outlined"
                :rules="passwordRules"
                required
                class="mb-3"
                density="comfortable"
                 :disabled="loading || !!successMessage"
                 hint="Ít nhất 8 ký tự"
                 persistent-hint
              ></v-text-field>

              <v-text-field
                v-model="confirmNewPassword"
                label="Xác nhận mật khẩu mới"
                :type="showConfirmPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check-outline"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                variant="outlined"
                :rules="confirmPasswordRules"
                required
                 density="comfortable"
                 :disabled="loading || !!successMessage"
              ></v-text-field>

              <v-btn
                :loading="loading"
                :disabled="loading || !!successMessage"
                type="submit"
                color="primary"
                block
                size="large"
                class="mt-4"
              >
                Đặt Lại Mật khẩu
              </v-btn>
            </v-form>
          </v-card-text>
           <v-card-actions class="justify-center mt-4" v-if="successMessage || invalidToken">
             <router-link to="/login" class="text-primary text-decoration-none font-weight-medium d-flex align-center">
                <v-icon start>mdi-arrow-left</v-icon>
                 Quay lại Đăng nhập
             </router-link>
          </v-card-actions>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import authService from '@/services/authService';

const route = useRoute();
const router = useRouter();

const newPassword = ref('');
const confirmNewPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const invalidToken = ref(false); // Cờ kiểm tra token ban đầu
const resetPasswordForm = ref(null); // Ref for the form
const snackbar = ref({ show: false, text: '', color: 'error', timeout: 3000 });


// Lấy token từ route query parameter (hoặc param tùy backend gửi link)
// Ví dụ link: http://localhost:5173/reset-password?token=xxxxxxx
const token = ref(route.query.token || null);

// Validation Rules
const passwordRules = [
  v => !!v || 'Mật khẩu mới là bắt buộc',
  v => (v && v.length >= 8) || 'Mật khẩu phải có ít nhất 8 ký tự',
];
const confirmPasswordRules = computed(() => [
  (v) => !!v || 'Vui lòng xác nhận mật khẩu mới',
  (v) => v === newPassword.value || 'Mật khẩu xác nhận không khớp',
]);

// Hàm hiển thị snackbar
const showSnackbar = (text, color = 'error') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};


// Kiểm tra token khi component được mount
onMounted(() => {
  if (!token.value) {
    invalidToken.value = true;
     errorMessage.value = 'Thiếu token đặt lại mật khẩu.';
  }
  // Optional: Có thể gọi API để kiểm tra tính hợp lệ của token ngay khi load trang
  // async function checkTokenValidity() { ... }
  // checkTokenValidity();
});

const handleResetPassword = async () => {
   if (invalidToken.value) return; // Không submit nếu token đã biết là không hợp lệ

  const { valid } = await resetPasswordForm.value.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authService.resetPassword(token.value, newPassword.value);
    successMessage.value = 'Mật khẩu của bạn đã được đặt lại thành công!';
    resetPasswordForm.value.reset(); // Reset form sau thành công
  } catch (error) {
    errorMessage.value = error.message || 'Đặt lại mật khẩu thất bại. Token có thể không hợp lệ hoặc đã hết hạn.';
     if (error.message && (error.message.includes('Token') || error.message.includes('token'))) {
         invalidToken.value = true; // Đánh dấu token không hợp lệ nếu lỗi liên quan đến token
     }
    showSnackbar(errorMessage.value, 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}
.cursor-pointer {
    cursor: pointer;
}
.v-img :deep(img) {
    object-fit: contain;
}
</style>