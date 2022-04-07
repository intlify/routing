import type { LocaleObject } from 'vue-i18n-routing'

declare module 'vue-i18n' {
  export declare interface ExportedGlobalComposer {
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
}
