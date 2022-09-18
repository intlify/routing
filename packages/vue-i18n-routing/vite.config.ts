import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import rimraf from 'rimraf'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

// like `__dirname` of Node.js
const currentDir = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // https://github.com/vitejs/vite/pull/9130/files#diff-4a49b457ff0fce41061261711fc1d5e95385af670880cebae5fca2d4807103f0R193
    'process.env.NODE_ENV': JSON.stringify('production'),
    __VERSION__: JSON.stringify(pkg.version)
  },
  build: {
    minify: false,
    lib: {
      entry: resolve(currentDir, './src/index.ts'),
      name: 'VueI18nRouting',
      formats: ['es', 'cjs', 'iife']
    },
    rollupOptions: {
      external: ['vue-demi', '@intlify/vue-router-bridge', '@intlify/vue-i18n-bridge'],
      output: {
        globals: {
          'vue-demi': 'VueDemi',
          '@intlify/vue-i18n-bridge': 'VueI18n',
          '@intlify/vue-router-bridge': 'VueRouter'
        }
      }
    }
  },
  plugins: [
    dts({
      // NOTE:
      //  if vite-plugin-dts will fix the hoisting for multiple files, we should switch to it.
      //  we're facing the broken file when some d.ts .files is hosted.
      // rollupTypes: true,
      afterBuild: () => {
        const extractorConfigPath = resolve(currentDir, `api-extractor.json`)
        const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
        const extractorResult = Extractor.invoke(extractorConfig, {
          localBuild: true,
          showVerboseMessages: true
        })

        if (extractorResult.succeeded) {
          console.log(`API Extractor completed successfully.`)
        } else {
          console.error(
            `API Extractor completed with ${extractorResult.errorCount} errors` +
              ` and ${extractorResult.warningCount} warnings`
          )
        }

        rimraf.sync(resolve(currentDir, './dist/src'))
      }
    })
  ]
})
