import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCompositionAPI from '@vue/composition-api'
import { extendRouting } from 'vue-i18n-routing'
import App from './App.vue'
import router from './router'

Vue.use(VueCompositionAPI)

const _router = extendRouting<VueRouter>({ router, localeCodes: ['en'] })

const app = new Vue({
  // @ts-ignore TODO:
  router: _router,
  render: h => h(App)
})

app.$mount('#app')
