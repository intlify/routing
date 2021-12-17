import { useI18n as _useI18n } from 'vue-i18n'

export function useI18n() {
  return _useI18n()
  // if (!__NUXT__) {
  //   // TODO: should be implemented with stub for nuxt
  //   // const nuxt = useNuxtApp()
  //   return _useI18n()
  // } else {
  //   return _useI18n()
  // }
}
