import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuei18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuei18n({ include: fileURLToPath(new URL('./src/locales/**', import.meta.url)) })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-i18n': fileURLToPath(new URL('./node_modules/vue-i18n/dist/vue-i18n.esm-bundler.js', import.meta.url))
    }
  }
})
