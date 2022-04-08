import type { LocaleObject } from '../types'
import type { ComputedRef } from 'vue-demi'

declare module '@intlify/vue-i18n-bridge' {
  export interface ComposerCustom {
    locales: ComputedRef<string[] | LocaleObject[]>
    localeCodes: ComputedRef<string[]>
    __baseUrl: string
  }
}
