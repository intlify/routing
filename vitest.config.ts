import { resolve } from 'path'
import { defineConfig } from 'vite'

import type { AliasOptions } from 'vite'

const r = (p: string) => resolve(__dirname, p)
const alias: AliasOptions = {}

export default defineConfig({
  define: {
    __VERSION__: '__VERSION__'
  },
  resolve: {
    alias
  },
  test: {
    testTimeout: 5000
  }
})
