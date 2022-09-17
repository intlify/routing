import { fileURLToPath } from 'url'

import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
import vue2Jsx from '@vitejs/plugin-vue2-jsx'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    vue2Jsx(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // TODO: why? when we try to call `getCurrentInstance` in `@intlify/vue-i18n-bridge`, it return `null` ...
      '@intlify/vue-i18n-bridge': fileURLToPath(
        new URL('./node_modules/vue-i18n-bridge/dist/vue-i18n-bridge.esm-bundler.js', import.meta.url)
      )
    },
    dedupe: ['vue']
  }
})
