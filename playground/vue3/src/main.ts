import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import i18n from './i18n'
import { createRouter } from './router'

import './assets/main.css'

const app = createApp(App)
const router = createRouter(i18n)
const head = createHead()
app.use(router)
app.use(i18n, { inject: true })
app.use(head)
app.mount('#app')
