import type { LocaleObject } from '../types'
import type { ComputedRef } from 'vue-demi'

declare module 'vue-i18n' {
  export interface ComposerCustom {
    locales: ComputedRef<string[] | LocaleObject[]>
  }
}
