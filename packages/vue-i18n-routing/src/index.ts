/**
 * Vue I18n Routing Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 */
export const VERSION = __VERSION__

export * from './constants'
export * from './compatibles'
export * from './composables'
export * from './resolve'
export * from './types'
export {
  getLocale,
  getLocales,
  getLocaleCodes,
  setLocale,
  resolveBaseUrl,
  findBrowserLocale,
  isComposer,
  getComposer,
  isExportedGlobalComposer,
  isI18nInstance,
  isLegacyVueI18n,
  isVueI18n
} from './utils'
export type {
  I18nCommonRoutingOptions,
  I18nCommonRoutingOptionsWithComposable,
  ComposableOptions,
  FindBrowserLocaleOptions,
  BrowserLocale,
  TargetLocale,
  BrowserLocaleMatcher
} from './utils'
export {
  createRouter,
  createLocaleFromRouteGetter,
  registerGlobalOptions,
  getGlobalOptions,
  extendI18n,
  getLocalesRegex,
  proxyVueInstance
} from './extends'
export type {
  I18nRoutingGlobalOptions,
  VueI18nRoutingPluginOptions,
  VueI18nExtendOptions,
  ExtendComposerHook,
  ExtendExportedGlobalHook,
  ExtendVueI18nHook,
  ExtendProperyDescripters,
  ExtendHooks
} from './extends'
