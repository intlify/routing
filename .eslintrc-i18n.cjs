'use strict'

const localeDir =
  process.env.LINT_I18N === 'vue2' ? './playground/vue2/src/locales/*.json' : './playground/vue3/src/locales/*.json'

const messageSyntaxVersion = process.env.LINT_I18N === 'vue2' ? '^8.0.0' : '^9.0.0'
console.log(`lint i18n target: ${process.env.LINT_I18N}`)
console.log(`localeDir: ${localeDir}`)
console.log(`messageSyntaxVersion: ${messageSyntaxVersion}`)

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:@intlify/vue-i18n/recommended', 'plugin:import/recommended', 'plugin:import/typescript'],
  plugins: ['@typescript-eslint'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    '@intlify/vue-i18n/no-raw-text': 'error',
    '@intlify/vue-i18n/no-dynamic-keys': 'warn',
    '@intlify/vue-i18n/no-missing-keys-in-other-locales': 'error',
    '@intlify/vue-i18n/no-unused-keys': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            pattern: '{vue**}',
            group: 'builtin',
            position: 'before'
          },
          {
            pattern: '{vite**}',
            group: 'builtin',
            position: 'before'
          },
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc'
        },
        'newlines-between': 'always'
      }
    ]
  },
  settings: {
    'vue-i18n': {
      localeDir,
      messageSyntaxVersion
    },
    'import/resolver': {
      /**
       * NOTE: https://github.com/import-js/eslint-import-resolver-typescript#configuration
       */
      typescript: {
        project: ['playground/**/tsconfig.json']
      }
    }
  },
  overrides: [
    {
      files: ['*.json', '*.json5'],
      extends: ['plugin:@intlify/vue-i18n/base']
    },
    {
      files: ['*.yaml', '*.yml'],
      extends: ['plugin:@intlify/vue-i18n/base']
    }
  ]
}
