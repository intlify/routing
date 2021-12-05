import { createApp } from 'vue'
import { VueI18nRoutingPlugin } from 'vue-i18n-routing'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(VueI18nRoutingPlugin, { router })

app.mount('#app')
