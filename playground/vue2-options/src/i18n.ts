import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import VueI18n from 'vue-i18n'
import { createI18n } from '@intlify/vue-i18n-bridge'
import en from './locales/en.json'
import ja from './locales/ja.json'

import type { I18n } from '@intlify/vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true })

const i18n = createI18n(
  {
    legacy: true,
    locale: 'en',
    messages: {
      en,
      ja
    }
  },
  VueI18n
)

export default i18n as I18n
