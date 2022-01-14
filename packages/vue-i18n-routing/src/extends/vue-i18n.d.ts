import type { ComputedRef } from 'vue-demi'
import type { LocaleObject } from '../types'

declare module 'vue-i18n' {
  export interface ComposerCustom {
    locales: ComputedRef<LocaleObject[]>
  }
}
declare module 'vue-i18n-bridge' {
  export interface ComposerCustom {
    locales: ComputedRef<LocaleObject[]>
  }
}
