import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { createI18n, castToVueI18n } from 'vue-i18n-bridge'
import en from './locales/en.json'
import ja from './locales/ja.json'

Vue.use(VueI18n, { bridge: true })

const i18n = createI18n(
  {
    legacy: false,
    locale: 'en',
    messages: {
      en,
      ja
    }
  },
  VueI18n
)

Vue.use(castToVueI18n(i18n))

export default i18n
