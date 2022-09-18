import { fileURLToPath, URL } from 'url'

import vuei18n from '@intlify/vite-plugin-vue-i18n'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vuei18n({ include: fileURLToPath(new URL('./src/locales/**', import.meta.url)) })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
