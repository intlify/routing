import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'

const i18n = createI18n<false>({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    ja
  }
})

export default i18n
