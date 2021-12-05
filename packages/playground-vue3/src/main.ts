import { createApp } from 'vue'
import { VueI18nRoutingPlugin } from 'vue-i18n-routing'
import App from './App.vue'

const app = createApp(App)
app.use(VueI18nRoutingPlugin)
app.mount('#app')
