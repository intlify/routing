# @intlify/vue-i18n-bridge

The vue-i18n bridging for Vue 2 & Vue 3

> This library is inspired by [vue-demi](https://github.com/vueuse/vue-demi)

## 🌟 Features
- Vue I18n composable APIs available on Vue 2 & Vue 3 (e.g `createI18n`, `useI18n`)
- Auto detect Vue Router version on bundling
- Manual switch versions
## 💿 Installation

```sh
# npm
npm install @intlify/vue-i18n-bridge

# yarn
yarn add @intlify/vue-i18n-bridge

# pnpm
pnpm add @intlify/vue-i18n-bridge
```

## ⛓️ Dependencies

You need to add `vue-i18n` and `@vue/composition-api` to your plugin's peer dependencies to specify what versions you support.

```js
{
  "dependencies": {
    "@intlify/vue-i18n-bridge": "latest"
  },
  "peerDependencies": {
    "@vue/composition-api": "^1.0.0-rc.1",
    "vue-i18n": "^8.26.1" // or "^9.2.0-beta.25" or later base on your preferred working environment
    "vue-i18n-bridge": "^9.2.0-beta.25" // if you use `vue-i18n@v8.26.1` or later, you need to configure deps
  },
  "peerDependenciesMeta": {
    "@vue/composition-api": {
      "optional": true
    }
  },
  "devDependencies": {
    "vue-i18n": "^8.26.1", // or "^9.2.0-beta.25" or later base on your preferred working environment
    "vue-i18n-bridge": "^9.2.0-beta.25" // if you use `vue-i18n@v8.26.1` or later, you need to configure deps
  },
}
```

Import everything related to Vue Router from it, it will redirect to `vue-i18n@8.26` + `@vue/composition-api` or `vue-i18n@9.2` based on users' environments.

```js
import { createI18n, useI18n } from '@intlify/vue-i18n-bridge'
```

When using with [Vite](https://vitejs.dev), you will need to opt-out the pre-bundling to get `@intlify/vue-i18n-bridge` work properly by

```js
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    exclude: ['@intlify/vue-i18n-bridge']
 }
})
```

## 🤝 Extra APIs

`@intlify/vue-i18n-bridge` provides extra APIs to help distinguish users' environments and to do some version-specific logic.

### `isVueI18n8` / `isVueI18n9`

```js
import { isVueI18n8, isVueI18n9 } from '@intlify/vue-i18n-bridge'

if (isVueI18n8) {
  // Vue I18n 8 only
} else {
  // Vue I18n 9 only
}
```

## 📺 CLI

To explicitly switch the redirecting version, you can use these commands in your project's root:
### 🤏 Manually Switch Versions

```sh
npx vue-i18n-switch 2
# or
npx vue-i18n-switch 3
```

### 📦 Package Aliasing

If you would like to import `vue-i18n` under an alias, you can use the following command:

```sh
npx vue-i18n-switch 2 vue2
# or
npx vue-i18n-switch 3 vue3
```
### 🩹 Auto Fix

If the postinstall hook doesn't get triggered or you have updated the Vue Router version, try to run the following command to resolve the redirecting:

```sh
npx vue-i18n-fix
```
### ✳️ Isomorphic Testings

You can support testing for both versions by adding npm alias in your dev dependencies. For example:

```js
{
  "scripts": {
    "test:8": "vue-i18n-switch 8 vue-i18n-8 && jest",
    "test:9": "vue-i18n-switch 9 && jest",
  },
  "devDependencies": {
    "vue-i18n-8": "^8.26.1",
    "vue-i18n-bridge": "^9.2.0-beta.25",
    "vue-i18n": "npm:vue-i18n@9.2.0-beta.25"
  },
}
```

or

```js
{
  "scripts": {
    "test:8": "vue-i18n-switch 8 && jest",
    "test:9": "vue-i18n-switch 9 vue-i18n-9 && jest",
  },
  "devDependencies": {
    "vue-i18n": "^8.26.1",
    "vue-i18n-9": "npm:vue-i18n@9.2.0-beta.25"
  },
}
```

## 💖 Thanks
This package idea was inspired from [vue-demi](https://github.com/vueuse/vue-demi), [@antfu](https://github.com/antfu)s great work!

## ©️ License

[MIT](http://opensource.org/licenses/MIT)
