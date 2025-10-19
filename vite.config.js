import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify' // Import plugin Vuetify

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Kích hoạt plugin Vuetify
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: { // Cấu hình proxy để gọi API backend (chạy ở port 8080)
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Địa chỉ backend của bạn
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Bỏ rewrite nếu backend có prefix /api
      }
    }
  }
})