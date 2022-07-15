import { defineConfig } from 'vitest/config'

const TARGET = process.env.TEST_TARGET || 'vue3'
const include =
  TARGET === 'vue3'
    ? ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
    : ['**/*.{test,spec}.vue2.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify('__VERSION__')
  },
  test: {
    globals: true,
    include,
    environment: 'happy-dom',
    testTimeout: 5000
  }
})
