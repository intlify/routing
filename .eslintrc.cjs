'use strict'

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    /**
     * NOTE: https://typescript-eslint.io/rules/
     */
    '@typescript-eslint/consistent-type-assertions': 'warn',
    '@typescript-eslint/consistent-type-definitions': 'warn',
    '@typescript-eslint/consistent-generic-constructors': 'warn',
    // '@typescript-eslint/consistent-type-exports': 'warn',
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports', disallowTypeAnnotations: false }],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    /**
     * NOTE: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#importorder-enforce-a-convention-in-module-import-order
     */
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
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc'
        },
        'newlines-between': 'always'
      }
    ],
    'tsdoc/syntax': 'warn',
  },
  settings: {
    'import/resolver': {
      /**
       * NOTE: https://github.com/import-js/eslint-import-resolver-typescript#configuration
       */
      typescript: {
        // project: ['tsconfig.json', 'packages/**/tsconfig.json', 'playground/**/tsconfig.json']
        project: ['tsconfig.json', 'packages/**/tsconfig.json']
      }
    }
  }
}
