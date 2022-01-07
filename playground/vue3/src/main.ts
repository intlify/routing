import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createRouter } from './router'

const app = createApp(App)
const router = createRouter(i18n)
app.use(router)
app.use(i18n)
app.mount('#app')
