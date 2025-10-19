// src/main.js
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { useAuthStore } from './stores/auth';


const app = createApp(App)
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);


const authStore = useAuthStore(pinia);

authStore.checkAuthStatus().then(() => {
    app.mount('#app');
}).catch(error => {
    console.error("Failed initial auth check:", error);
    app.mount('#app');
});