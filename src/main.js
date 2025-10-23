// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import GAuth from 'vue3-google-oauth2' // Tạm thời tắt

import App from './App.vue'
import router from './router'
import i18n from './i18n' // Import i18n
import permissionDirective from './directives/permission'
import { useThemeStore } from './stores/theme'
import { useI18nStore } from './stores/i18n' // Import i18n store

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Global Styles
import './assets/styles/global.css'

const app = createApp(App)

// Cấu hình Google Auth (tạm thời tắt để test)
// const gAuthOptions = {
//     clientId: '758520677856-j98pg9k2fju9545q0ffffmsnr9b1qtk9.apps.googleusercontent.com',
//     scope: 'profile email',
//     prompt: 'consent'
// }
// app.use(GAuth, gAuthOptions)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n) // Use i18n

// Initialize theme after Pinia is set up
const themeStore = useThemeStore()
themeStore.initializeTheme()

// Initialize i18n after Pinia is set up
const i18nStore = useI18nStore()
i18nStore.initializeLocale()

// Sync i18n locale with store
i18n.global.locale.value = i18nStore.locale

// Register global directives
app.directive('permission', permissionDirective)

app.mount('#app')