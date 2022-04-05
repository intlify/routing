import { createI18n } from '@intlify/vue-i18n-bridge'
import en from './locales/en.json'
import ja from './locales/ja.json'

const i18n = createI18n<true>({
  locale: 'en',
  messages: {
    en,
    ja
  }
})

export default i18n
