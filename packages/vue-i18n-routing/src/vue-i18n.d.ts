import type { LocaleObject } from 'vue-i18n-routing'

export interface I18nRoutingCustomProperties {
  /**
   * List of locales
   *
   * @remarks
   * Can either be an array of string codes (e.g. `['en', 'fr']`) or an array of {@link LocaleObject} for more complex configurations
   */
  readonly locales: string[] | LocaleObject[]
  /**
   * List of locale codes
   */
  readonly localeCodes: string[]
  /**
   * Base URL that is used in generating canonical links
   */
  baseUrl: string
}

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ExportedGlobalComposer extends I18nRoutingCustomProperties {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface VueI18n extends I18nRoutingCustomProperties {}
}

declare module 'vue-i18n-bridge' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ExportedGlobalComposer extends I18nRoutingCustomProperties {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface VueI18n extends I18nRoutingCustomProperties {}
}

declare module '@intlify/vue-i18n-bridge' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ExportedGlobalComposer extends I18nRoutingCustomProperties {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface VueI18n extends I18nRoutingCustomProperties {}
}
