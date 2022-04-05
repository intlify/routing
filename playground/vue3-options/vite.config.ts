import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuei18n from '@intlify/vite-plugin-vue-i18n'

// TODO: vue-i18n must be resolved with bundler or bundler plugin
let modulePath = './node_modules/vue-i18n/dist/vue-i18n.esm-bundler.js'
if (process.env.NODE_ENV === 'production') {
  modulePath = './node_modules/vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuei18n({
      compositionOnly: false,
      include: fileURLToPath(new URL('./src/locales/**', import.meta.url))
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-i18n': fileURLToPath(new URL(modulePath, import.meta.url))
    },
    dedupe: ['vue-i18n'] // TODO: should be resolved with none vite setting
  }
})
