import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import rimraf from 'rimraf'

import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VERSION__: `'${pkg.version}'`
  },
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'VueI18nRouting',
      formats: ['es', 'cjs', 'iife']
    },
    rollupOptions: {
      external: ['vue-demi']
    }
  },
  plugins: [
    dts({
      afterBuild: () => {
        const extractorConfigPath = resolve(__dirname, `api-extractor.json`)
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

        rimraf.sync(resolve(__dirname, './dist/src'))
      }
    })
  ]
})
