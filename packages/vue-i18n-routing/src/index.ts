/**
 * Vue I18n Routing Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 */
export const VERSION = __VERSION__

export * from './composables'
export * from './resolve'
export * from './types'
export { getLocale, setLocale, resolveBaseUrl, findBrowserLocale } from './utils'
export type { FindBrowserLocaleOptions, BrowserLocale, TargetLocale, BrowserLocaleMatcher } from './utils'
export { createRouter, createLocaleFromRouteGetter } from './extends'
