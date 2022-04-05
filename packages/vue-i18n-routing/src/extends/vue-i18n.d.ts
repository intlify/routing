import type { LocaleObject } from '../types'
import type { ComputedRef } from 'vue-demi'

// declare module 'vue-i18n' {
//   export interface ComposerCustom {
//     /**
//      * List of locales
//      *
//      * @defaultValue `undefined`
//      */
//     locales?: ComputedRef<string[] | LocaleObject[]>
//     /**
//      * List of locale codes
//      *
//      * @defaultValue `undefined`
//      */
//     localeCodes?: ComputedRef<string[]>
//     __baseUrl?: string
//   }
// }
declare module 'vue-i18n-bridge' {
  export interface VueI18n {
    locales: string[] | LocaleObject[]
    localeCodes: string[]
    __baseUrl: string
  }
  export interface ComposerCustom {
    /**
     * List of locales
     *
     * @defaultValue `undefined`
     */
    locales?: ComputedRef<string[] | LocaleObject[]>
    /**
     * List of locale codes
     *
     * @defaultValue `undefined`
     */
    localeCodes?: ComputedRef<string[]>
    __baseUrl?: string
  }
}

declare module '@intlify/vue-i18n-bridge' {
  export interface VueI18n {
    locales: string[] | LocaleObject[]
    localeCodes: string[]
    __baseUrl: string
  }

  export interface ComposerCustom {
    /**
     * List of locales
     *
     * @defaultValue `[]`
     */
    locales: ComputedRef<string[] | LocaleObject[]>
    /**
     * List of locale codes
     *
     * @defaultValue `[]`
     */
    localeCodes: ComputedRef<string[]>
    __baseUrl: string
  }
}
