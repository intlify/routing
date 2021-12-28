import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'
import scriptSetup from 'unplugin-vue2-script-setup/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2({
      jsx: true
    }),
    scriptSetup(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      /*
      'vue-i18n': fileURLToPath(
        new URL('./node_modules/vue-i18n-bridge/dist/vue-i18n-bridge.esm-bundler.js', import.meta.url)
      )
      */
    },
    dedupe: ['vue']
  }
})
