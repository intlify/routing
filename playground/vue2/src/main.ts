import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCompositionAPI from '@vue/composition-api'
import { extendRouting } from 'vue-i18n-routing'
import App from './App.vue'
import _router from './router'
import i18n from './i18n'

Vue.use(VueCompositionAPI)

const router = extendRouting<VueRouter>({
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

const app = new Vue({
  // @ts-ignore TODO:
  router,
  i18n,
  render: h => h(App)
})

app.$mount('#app')
