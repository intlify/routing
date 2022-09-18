import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    deps: {
      inline: [/vite-test-utils/]
    }
  }
})
