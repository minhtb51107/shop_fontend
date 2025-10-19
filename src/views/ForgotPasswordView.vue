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
          <v-card-title class="text-center text-h5 font-weight-bold mb-2 text-primary">
            Quên Mật khẩu?
          </v-card-title>
           <v-card-subtitle class="text-center mb-5">
               Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
           </v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="handleForgotPassword" ref="forgotPasswordForm">
               <v-alert
                v-if="message"
                type="success"
                density="compact"
                variant="tonal"
                class="mb-4"
              >
                {{ message }}
              </v-alert>

              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                :rules="emailRules"
                required
                class="mb-3"
                density="comfortable"
                 :disabled="loading || !!message" ></v-text-field>

              <v-btn
                :loading="loading"
                :disabled="loading || !!message"
                type="submit"
                color="primary"
                block
                size="large"
                class="mt-4"
              >
                Gửi Hướng Dẫn
              </v-btn>

            </v-form>
          </v-card-text>
           <v-card-actions class="justify-center mt-4">
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
import { ref } from 'vue';
import authService from '@/services/authService';

const email = ref('');
const loading = ref(false);
const message = ref(''); // Hiển thị thông báo chung (thành công hoặc lỗi đã được xử lý)
const forgotPasswordForm = ref(null); // Ref for the form
const snackbar = ref({ show: false, text: '', color: 'error', timeout: 3000 });

// Validation Rules
const emailRules = [
  v => !!v || 'Email là bắt buộc',
  v => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
];

// Hàm hiển thị snackbar (chủ yếu cho lỗi chưa xử lý)
const showSnackbar = (text, color = 'error') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

const handleForgotPassword = async () => {
  const { valid } = await forgotPasswordForm.value.validate();
  if (!valid) return;

  loading.value = true;
  message.value = ''; // Reset message

  try {
    // Không cần chờ kết quả cụ thể, chỉ cần biết API đã được gọi
    await authService.forgotPassword(email.value);
    // Luôn hiển thị thông báo chung để bảo mật
    message.value = 'Nếu địa chỉ email của bạn tồn tại trong hệ thống, bạn sẽ nhận được một liên kết để đặt lại mật khẩu.';
  } catch (error) {
     // Lỗi này không nên xảy ra vì service đã xử lý
     console.error("Unexpected error in handleForgotPassword:", error);
     showSnackbar('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.', 'error');
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