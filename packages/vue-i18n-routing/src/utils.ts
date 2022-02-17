import { isRef } from 'vue-demi'
import { isVueRouter4 } from '@intlify/vue-router-bridge'
import { isString, isSymbol, isFunction } from '@intlify/shared'

import type { I18n, Composer, I18nMode, Locale } from '@intlify/vue-i18n-bridge'
import type { LocaleObject, Strategies, BaseUrlResolveHandler } from './types'
import type { Ref } from 'vue-demi'
import type { RouteLocationNormalizedLoaded, Route } from '@intlify/vue-router-bridge'

export const inBrowser = typeof window !== 'undefined'

export function warn(msg: string, err?: Error): void {
  if (typeof console !== 'undefined') {
    console.warn(`[vue-i18n-routing] ` + msg)
    /* istanbul ignore if */
    if (err) {
      console.warn(err.stack)
    }
  }
}

export function getNormalizedLocales(locales: string[] | LocaleObject[]): LocaleObject[] {
  locales = locales || []
  const normalized: LocaleObject[] = []
  for (const locale of locales) {
    if (isString(locale)) {
      normalized.push({ code: locale })
    } else {
      normalized.push(locale)
    }
  }
  return normalized
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isComposer(target: any, mode: I18nMode): target is Composer {
  return isRef(target.locale) && mode === 'composition'
}

function isI18nInstance(i18n: I18n | Composer): i18n is I18n {
  return 'global' in i18n && 'mode' in i18n
}

/**
 * Get a locale
 *
 * @param i18n - An [I18n](https://vue-i18n.intlify.dev/api/general.html#i18n) instance or a [Composer](https://vue-i18n.intlify.dev/api/composition.html#composer) instance
 *
 * @returns A locale
 */
export function getLocale(i18n: I18n | Composer): Locale {
  // prettier-ignore
  return isI18nInstance(i18n)
    ? isComposer(i18n.global, i18n.mode)
      ? i18n.global.locale.value
      : i18n.global.locale
    : i18n.locale.value
}

/**
 * Set a locale
 *
 * @param i18n - An [I18n](https://vue-i18n.intlify.dev/api/general.html#i18n) instance or a [Composer](https://vue-i18n.intlify.dev/api/composition.html#composer) instance
 * @param locale - A target locale
 */
export function setLocale(i18n: I18n | Composer, locale: Locale): void {
  // prettier-ignore
  if (isI18nInstance(i18n)) {
   if (isComposer(i18n.global, i18n.mode)) {
     i18n.global.locale.value = locale
   } else {
     i18n.global.locale = locale
   }
  } else if (isRef(i18n.locale)) {
    i18n.locale.value = locale
  }
}

// Language: typescript
export function adjustRoutePathForTrailingSlash(
  pagePath: string,
  trailingSlash: boolean,
  isChildWithRelativePath: boolean
) {
  return pagePath.replace(/\/+$/, '') + (trailingSlash ? '/' : '') || (isChildWithRelativePath ? '' : '/')
}

export function toRawRoute(
  maybeRoute: Ref<RouteLocationNormalizedLoaded> | Route
): RouteLocationNormalizedLoaded | Route {
  return isVueRouter4
    ? isRef(maybeRoute)
      ? maybeRoute.value
      : maybeRoute
    : isRef(maybeRoute)
    ? maybeRoute.value
    : maybeRoute
}

export function getRouteName(routeName?: string | symbol | null) {
  // prettier-ignore
  return isString(routeName)
    ? routeName
    : isSymbol(routeName)
      ? routeName.toString()
      : '(null)'
}

export function getLocaleRouteName(
  routeName: string | null,
  locale: Locale,
  {
    defaultLocale,
    strategy,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix
  }: { defaultLocale: string; strategy: Strategies; routesNameSeparator: string; defaultLocaleRouteNameSuffix: string }
) {
  let name = getRouteName(routeName) + (strategy === 'no_prefix' ? '' : routesNameSeparator + locale)
  if (locale === defaultLocale && strategy === 'prefix_and_default') {
    name += routesNameSeparator + defaultLocaleRouteNameSuffix
  }
  return name
}

/**
 * Resolve base url
 *
 * @param baseUrl - A base url to resolve on SEO and domain. if you want to resolve with dynamically, you can spacify {@link BaseUrlResolveHandler}
 * @param context - A context to resolve base url, if you want to resolve base url with {@link BaseUrlResolveHandler}
 *
 * @returns A resolved base url
 */
export function resolveBaseUrl(
  baseUrl: string | BaseUrlResolveHandler,
  context: unknown
  /*
  localeCode: string
  / { differentDomains, normalizedLocales } */
) {
  if (isFunction(baseUrl)) {
    return baseUrl(context)
  }

  // TODO: SSR
  // if (differentDomains && localeCode) {
  //   // Lookup the `differentDomain` origin associated with given locale.
  //   const domain = getDomainFromLocale(localeCode, context.req, { normalizedLocales })
  //   if (domain) {
  //     return domain
  //   }
  // }

  return baseUrl
}

/**
 * The browser locale info
 *
 * @remarks
 * This type is used by {@link FindBrowserLocaleOptions#sorter | sorter} in {@link findBrowserLocale} function
 */
export type BrowserLocale = {
  /**
   * The locale code, such as BCP 47 (e.g `en-US`), or `ja`
   */
  code: string
  /**
   * The score number
   *
   * @remarks
   * The score number that is used by `sorter` of {@link FindBrowserLocaleOptions}
   */
  score: number
}

/**
 * The target locale info
 *
 * @remarks
 * This type is used by {@link BrowserLocaleMatcher} first argument
 */
export type TargetLocale = Required<Pick<LocaleObject, 'code' | 'iso'>>

/**
 * The browser locale matcher
 *
 * @remarks
 * This matcher is used by {@link findBrowserLocale} function
 *
 * @param locales - The target {@link LocaleObject | locale} list
 * @param browserLocales - The locale code list that is used in browser
 *
 * @returns The matched {@link BrowserLocale | locale info}
 */
export type BrowserLocaleMatcher = (locales: TargetLocale[], browserLocales: string[]) => BrowserLocale[]

/**
 * The options for {@link findBrowserLocale} function
 */
export type FindBrowserLocaleOptions = {
  matcher?: BrowserLocaleMatcher
  comparer?: (a: BrowserLocale, b: BrowserLocale) => number
}

function matchBrowserLocale(locales: TargetLocale[], browserLocales: string[]): BrowserLocale[] {
  const matchedLocales = [] as BrowserLocale[]

  // first pass: match exact locale.
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find(l => l.iso.toLowerCase() === browserCode.toLowerCase())
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length })
      break
    }
  }

  // second pass: match only locale code part of the browser locale (not including country).
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split('-')[0].toLowerCase()
    const matchedLocale = locales.find(l => l.iso.split('-')[0].toLowerCase() === languageCode)
    if (matchedLocale) {
      // deduct a thousandth for being non-exact match.
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length })
      break
    }
  }

  return matchedLocales
}

/**
 * The default browser locale matcher
 */
export const DefaultBrowserLocaleMatcher = matchBrowserLocale

function compareBrowserLocale(a: BrowserLocale, b: BrowserLocale): number {
  if (a.score === b.score) {
    // if scores are equal then pick more specific (longer) code.
    return b.code.length - a.code.length
  }
  return b.score - a.score
}

/**
 * The default browser locale comparer
 */
export const DefaultBrowerLocaleComparer = compareBrowserLocale

/**
 * Find the browser locale
 *
 * @param locales - The target {@link LocaleObject | locale} list
 * @param browserLocales - The locale code list that is used in browser
 * @param options - The options for {@link findBrowserLocale} function
 *
 * @returns The matched the locale code
 */
export function findBrowserLocale(
  locales: LocaleObject[],
  browserLocales: string[],
  { matcher = DefaultBrowserLocaleMatcher, comparer = DefaultBrowerLocaleComparer }: FindBrowserLocaleOptions = {}
): string | '' {
  const normalizedLocales = []
  for (const l of locales) {
    const { code } = l
    const iso = l.iso || code
    normalizedLocales.push({ code, iso })
  }

  // finding!
  const matchedLocales = matcher(normalizedLocales, browserLocales)

  // sort!
  if (matchedLocales.length > 1) {
    matchedLocales.sort(comparer)
  }

  return matchedLocales.length ? matchedLocales[0].code : ''
}
