import { createApp } from 'vue'
import { setupRouting } from 'vue-i18n-routing'
import App from './App.vue'
import router from './router'

import type { Router } from 'vue-router'

const app = createApp(App)
const _router = setupRouting<Router>({ router, localeCodes: ['en'] })

app.use(_router)
app.mount('#app')
