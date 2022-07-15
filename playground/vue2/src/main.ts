import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import i18n from './i18n'
import { createRouter } from './router'
import { castToVueI18n } from '@intlify/vue-i18n-bridge'

import './assets/main.css'

Vue.use(VueCompositionAPI)

const router = createRouter(i18n)

Vue.use(castToVueI18n(i18n))

const app = new Vue({
  // @ts-ignore TODO:
  router,
  i18n,
  render: h => h(App)
})

app.$mount('#app')
