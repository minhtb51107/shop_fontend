<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-6 rounded-lg">
           <v-img src="/src/assets/logo.svg" max-height="60" contain class="mb-6 mx-auto"></v-img>
          <v-card-title class="text-center text-h5 font-weight-bold mb-4 text-primary">
            Đăng Nhập Tài Khoản
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <v-alert v-if="errorMessage" type="error" density="compact" variant="tonal" closable class="mb-4" @click:close="errorMessage = ''">
                {{ errorMessage }}
              </v-alert>

              <v-text-field
                v-model="email" label="Email" prepend-inner-icon="mdi-email-outline" variant="outlined"
                :rules="emailRules" required class="mb-3" density="comfortable"
              ></v-text-field>

              <v-text-field
                v-model="password" label="Mật khẩu" :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword" variant="outlined" :rules="passwordRules"
                required density="comfortable"
              ></v-text-field>

               <div class="d-flex justify-space-between align-center mb-4">
                 <v-checkbox label="Ghi nhớ đăng nhập" density="compact" hide-details></v-checkbox>
                 <router-link :to="{ name: 'forgotPassword' }" class="text-caption text-primary text-decoration-none">Quên mật khẩu?</router-link>
              </div>

              <v-btn :loading="loading" :disabled="loading" type="submit" color="primary" block size="large">
                Đăng Nhập
              </v-btn>

              <v-divider class="my-4">Hoặc đăng nhập với</v-divider>
               <v-row dense>
                 <v-col>
                   <GoogleSignInButton
                        @success="handleGoogleSignInSuccess"
                        @error="handleGoogleSignInError"
                        :theme="'outline'"
                        :size="'large'"
                        :text="'signin_with'"
                        :shape="'rectangular'"
                        :logo-alignment="'left'"
                        :width="'100%'"
                    ></GoogleSignInButton>
                    </v-col>
                  </v-row>
               </v-form>
          </v-card-text>
           <v-card-actions class="justify-center mt-4">
             <span class="text-body-2">Chưa có tài khoản?</span>
             <router-link to="/register" class="ms-1 text-primary text-decoration-none font-weight-medium">Đăng ký ngay</router-link>
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
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
// --- GOOGLE LOGIN IMPORTS ---
import { GoogleSignInButton, decodeCredential } from "vue3-google-signin"; // , googleOneTap // Nếu muốn dùng One Tap
// --- END GOOGLE LOGIN IMPORTS ---

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false); // Loading cho đăng nhập thường
const googleLoading = ref(false); // Loading cho đăng nhập Google
const errorMessage = ref('');
const loginForm = ref(null);
const snackbar = ref({ show: false, text: '', color: 'error', timeout: 3000 });

const authStore = useAuthStore();
const router = useRouter();

// Validation Rules
const emailRules = [
  v => !!v || 'Email là bắt buộc',
  v => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
];
const passwordRules = [ v => !!v || 'Mật khẩu là bắt buộc' ];

// Hàm hiển thị snackbar
const showSnackbar = (text, color = 'error') => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// Hàm xử lý đăng nhập thường
const handleLogin = async () => {
  const { valid } = await loginForm.value.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (error) {
    errorMessage.value = error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
  } finally {
    loading.value = false;
  }
};

// --- GOOGLE LOGIN HANDLERS ---
// Xử lý callback khi đăng nhập Google thành công
const handleGoogleSignInSuccess = async (response) => {
  googleLoading.value = true;
  errorMessage.value = ''; // Reset lỗi cũ
  console.log("Google Sign-In Success:", response);
  const { credential } = response; // credential chính là ID Token (JWT)
   if (!credential) {
       handleGoogleSignInError("Không nhận được credential từ Google.");
       return;
   }

  // Optional: Giải mã credential để xem thông tin (chỉ để debug)
  // try {
  //    const userData = decodeCredential(credential);
  //    console.log("Decoded Google User Data:", userData);
  // } catch (decodeError) {
  //    console.error("Error decoding Google credential:", decodeError);
  // }


  try {
    // Gọi action trong store để gửi idToken về backend
    await authStore.loginWithGoogle(credential);
    // Đăng nhập thành công, store sẽ tự động điều hướng
  } catch (error) {
    errorMessage.value = error.message || 'Đăng nhập bằng Google thất bại.';
    showSnackbar(errorMessage.value, 'error');
  } finally {
     googleLoading.value = false;
  }
};

// Xử lý callback khi đăng nhập Google thất bại
const handleGoogleSignInError = (error) => {
   googleLoading.value = false; // Dừng loading nếu có
  console.error("Google Sign-In Error:", error);
   let message = 'Đăng nhập bằng Google không thành công.';
    if (typeof error === 'object' && error !== null && error.error === 'popup_closed_by_user') {
        message = 'Bạn đã đóng cửa sổ đăng nhập Google.';
    } else if (typeof error === 'string') {
        message = error; // Sử dụng thông báo lỗi được truyền vào
    }
   errorMessage.value = message;
   showSnackbar(errorMessage.value, 'error');
};

// Optional: Hàm để kích hoạt Google Sign In từ nút tùy chỉnh (nếu không dùng GoogleSignInButton)
// Cần import { googleTokenLogin } from "vue3-google-signin"
// const triggerGoogleSignIn = () => {
//    googleLoading.value = true;
//    errorMessage.value = '';
//   googleTokenLogin().then(handleGoogleSignInSuccess).catch(handleGoogleSignInError);
// }

// Optional: Google One Tap login (hiển thị popup tự động)
// import { googleOneTap } from "vue3-google-signin";
// onMounted(() => {
//   googleOneTap({autoLogin: false}) // autoLogin: false để chỉ hiện popup khi click
//     .then(handleGoogleSignInSuccess)
//     .catch(handleGoogleSignInError);
// });

// --- END GOOGLE LOGIN HANDLERS ---
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