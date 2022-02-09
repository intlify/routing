/// <reference types="vitest" />
import { defineConfig } from 'vite'

import type { AliasOptions } from 'vite'

const alias: AliasOptions = {}

const TARGET = process.env.TEST_TARGET || 'vue3'
const include =
  TARGET === 'vue3'
    ? ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
    : ['**/*.{test,spec}.vue2.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']

export default defineConfig({
  define: {
    __VERSION__: '__VERSION__'
  },
  resolve: {
    alias
  },
  test: {
    global: true,
    include,
    environment: 'happy-dom',
    testTimeout: 5000
  }
})
