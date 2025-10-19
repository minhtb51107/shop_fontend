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
    },
    dedupe: ['vue', 'vue-router', 'pinia']
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
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  // Performance optimization
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['bootstrap', 'bootstrap-icons'],
          utils: ['axios', 'vue3-google-oauth2']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'bootstrap'
    ],
    exclude: ['bootstrap-icons']
  },
  // CSS optimization
  css: {
    devSourcemap: true,
  }
})