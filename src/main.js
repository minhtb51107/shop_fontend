// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import GAuth from 'vue3-google-oauth2' // Import thư viện

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

// Cấu hình Google Auth
const gAuthOptions = {
    clientId: '758520677856-j98pg9k2fju9545q0ffffmsnr9b1qtk9.apps.googleusercontent.com', // << THAY BẰNG CLIENT ID CỦA BẠN
    scope: 'profile email',
    prompt: 'consent'
}
app.use(GAuth, gAuthOptions)

app.use(createPinia())
app.use(router)

app.mount('#app')