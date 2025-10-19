<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="elevation-12 pa-6 rounded-lg">
          <v-img
                src="/src/assets/logo.svg" max-height="60"
                contain
                class="mb-6 mx-auto"
            ></v-img>
          <v-card-title class="text-center text-h5 font-weight-bold mb-4 text-primary">
            Tạo Tài Khoản Mới
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister" ref="registerForm">
              <v-alert
                v-if="errorMessage"
                type="error"
                density="compact"
                variant="tonal"
                closable
                class="mb-4"
                @click:close="errorMessage = ''"
              >
                 <ul v-if="Array.isArray(errorMessage)" class="pl-4">
                     <li v-for="(msg, index) in errorMessage" :key="index">{{ msg }}</li>
                 </ul>
                 <span v-else>{{ errorMessage }}</span>
              </v-alert>

               <v-alert
                v-if="successMessage"
                type="success"
                density="compact"
                variant="tonal"
                class="mb-4"
              >
                {{ successMessage }} Vui lòng <router-link to="/login" class="font-weight-bold">đăng nhập</router-link>.
              </v-alert>

              <v-text-field
                v-model="fullname"
                label="Họ và tên"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                :rules="fullnameRules"
                required
                class="mb-3"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                :rules="emailRules"
                required
                class="mb-3"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                v-model="phoneNumber"
                label="Số điện thoại"
                prepend-inner-icon="mdi-phone-outline"
                variant="outlined"
                :rules="phoneRules"
                required
                class="mb-3"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Mật khẩu"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :rules="passwordRules"
                required
                class="mb-3"
                 density="comfortable"
              ></v-text-field>

               <v-text-field
                v-model="confirmPassword"
                label="Xác nhận mật khẩu"
                :type="showConfirmPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check-outline"
                 :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                variant="outlined"
                :rules="confirmPasswordRules"
                required
                density="comfortable"
              ></v-text-field>

              <v-checkbox
                v-model="agreeTerms"
                :rules="termsRules"
                density="compact"
                class="mt-0 pt-0 mb-4"
              >
                 <template v-slot:label>
                   <div>
                     Tôi đồng ý với
                     <router-link to="/terms" class="text-primary text-decoration-none">Điều khoản dịch vụ</router-link>
                   </div>
                 </template>
               </v-checkbox>


              <v-btn
                :loading="loading"
                :disabled="loading || !!successMessage" type="submit"
                color="primary"
                block
                size="large"
              >
                Đăng Ký
              </v-btn>

            </v-form>
          </v-card-text>
           <v-card-actions class="justify-center mt-4">
             <span class="text-body-2">Đã có tài khoản?</span>
             <router-link to="/login" class="ms-1 text-primary text-decoration-none font-weight-medium">Đăng nhập ngay</router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const fullname = ref('');
const email = ref('');
const phoneNumber = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref(''); // Có thể là string hoặc array
const successMessage = ref('');
const registerForm = ref(null); // Ref for the form

const authStore = useAuthStore();
const router = useRouter();

// Validation Rules
const fullnameRules = [ v => !!v || 'Họ tên là bắt buộc' ];
const emailRules = [
  v => !!v || 'Email là bắt buộc',
  v => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
];
const phoneRules = [
    v => !!v || 'Số điện thoại là bắt buộc',
    v => /^(0[3|5|7|8|9])+([0-9]{8})\b/.test(v) || 'Số điện thoại không hợp lệ',
];
const passwordRules = [
  v => !!v || 'Mật khẩu là bắt buộc',
  v => (v && v.length >= 8) || 'Mật khẩu phải có ít nhất 8 ký tự',
];
const confirmPasswordRules = computed(() => [
  (v) => !!v || 'Vui lòng xác nhận mật khẩu',
  (v) => v === password.value || 'Mật khẩu xác nhận không khớp',
]);
const termsRules = [ v => !!v || 'Bạn phải đồng ý với Điều khoản dịch vụ' ];


const handleRegister = async () => {
  // Validate form
  const { valid } = await registerForm.value.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authStore.register({
      fullname: fullname.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
    });
    successMessage.value = 'Đăng ký thành công!';
    // Không cần chuyển hướng ngay, để người dùng đọc thông báo
    // setTimeout(() => router.push('/login'), 3000); // Tùy chọn: tự động chuyển sau 3s
  } catch (error) {
     // Xử lý lỗi từ backend (có thể là string hoặc object validation errors)
     if (error && error.message) {
         // Nếu lỗi có cấu trúc từ GlobalExceptionHandler
        errorMessage.value = error.message;
     } else if (typeof error === 'object' && error !== null) {
         // Nếu backend trả về lỗi validation chi tiết (ví dụ từ Spring Validation)
         // Cần điều chỉnh tùy theo cấu trúc lỗi thực tế của bạn
         errorMessage.value = Object.values(error).flat(); // Lấy tất cả thông báo lỗi
     }
     else {
        errorMessage.value = 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.';
     }
    console.error("Register Error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px); /* Adjust based on your app bar height */
}
/* Thêm style để logo không bị kéo giãn */
.v-img :deep(img) {
    object-fit: contain;
}
</style>