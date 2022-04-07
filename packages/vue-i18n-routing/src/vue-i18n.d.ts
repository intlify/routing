import type { LocaleObject } from 'vue-i18n-routing'

interface RoutingExportedGlobalComposer {
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
  readonly __baseUrl: string
}

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ExportedGlobalComposer extends RoutingExportedGlobalComposer {}
}
