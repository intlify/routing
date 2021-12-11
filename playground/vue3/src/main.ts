import { createApp } from 'vue'
import { extendRouting } from 'vue-i18n-routing'
import App from './App.vue'
import router from './router'

import type { Router } from 'vue-router'

const app = createApp(App)
const _router = extendRouting<Router>({ router, localeCodes: ['en'] })

app.use(_router)
app.mount('#app')
