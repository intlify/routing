import type { LocaleObject } from '../types'
import type { ComputedRef } from 'vue-demi'

export interface ComposerCustomProperties {
  /**
   * List of locales
   *
   * @remarks
   * Can either be an array of string codes (e.g. `['en', 'fr']`) or an array of {@link LocaleObject} for more complex configurations
   */
  locales: ComputedRef<string[] | LocaleObject[]>
  /**
   * List of locale codes
   */
  localeCodes: ComputedRef<string[]>
  /**
   * Base URL that is used in generating canonical links
   */
  baseUrl: ComputedRef<string>
}
declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ComposerCustom extends ComposerCustomProperties {}
}

declare module 'vue-i18n-bridge' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ComposerCustom extends ComposerCustomProperties {}
}
declare module '@intlify/vue-i18n-bridge' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ComposerCustom extends ComposerCustomProperties {}
}
