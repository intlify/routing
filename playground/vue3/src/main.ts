import { createApp } from 'vue'
import { extendRouting } from 'vue-i18n-routing'
import App from './App.vue'
import _router from './router'
import i18n from './i18n'

import type { Router } from 'vue-router'

const app = createApp(App)
const router = extendRouting<Router>({
  i18n,
  router: _router,
  defaultLocale: 'en',
  localeCodes: [
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'ja',
      name: '日本語'
    }
  ]
})
app.use(router)
app.use(i18n)
app.mount('#app')
