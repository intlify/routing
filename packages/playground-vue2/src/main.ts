import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { VueI18nRoutingPlugin } from 'vue-i18n-routing'

import App from './App.vue'
import router from './router'

Vue.use(VueCompositionAPI)
Vue.use(VueI18nRoutingPlugin)

const app = new Vue({
  router,
  render: h => h(App)
})

app.$mount('#app')
