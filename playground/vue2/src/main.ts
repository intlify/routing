import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { setupRouting } from 'vue-i18n-routing'
import App from './App.vue'
import router from './router'

Vue.use(VueCompositionAPI)
// Vue.use(VueI18nRoutingPlugin, { router, localeCodes: ['en'] })

const _router = setupRouting<typeof router>({ router, localeCodes: ['en'] })

const app = new Vue({
  // @ts-ignore TODO:
  router: _router,
  render: h => h(App)
})

app.$mount('#app')
