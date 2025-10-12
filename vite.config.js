// vite.config.js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // *** THÊM CẤU HÌNH PROXY DƯỚI ĐÂY ***
  server: {
    proxy: {
      // Khi frontend gọi '/api', Vite sẽ chuyển tiếp đến http://localhost:8080/api
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, // Cần thiết cho virtual hosted sites
        secure: false,      // Tắt kiểm tra SSL
      }
    }
  }
})