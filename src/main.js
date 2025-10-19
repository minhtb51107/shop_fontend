// src/main.js
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { useAuthStore } from './stores/auth';

// --- GOOGLE SIGN IN ---
import GoogleSignInPlugin from "vue3-google-signin"

const app = createApp(App)
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

// --- SỬ DỤNG PLUGIN GOOGLE SIGN IN ---
console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Lấy Client ID từ biến môi trường
});
// --- KẾT THÚC ---


const authStore = useAuthStore(pinia);

authStore.checkAuthStatus().then(() => {
    app.mount('#app');
}).catch(error => {
    console.error("Failed initial auth check:", error);
    app.mount('#app');
});