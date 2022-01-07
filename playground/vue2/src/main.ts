import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import i18n from './i18n'
import { createRouter } from './router'

Vue.use(VueCompositionAPI)

const router = createRouter(i18n)

const app = new Vue({
  // @ts-ignore TODO:
  router,
  i18n,
  render: h => h(App)
})

app.$mount('#app')
