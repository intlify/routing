import { isRef } from 'vue-demi'
import { isString, isSymbol, isFunction } from '@intlify/shared'

import type { I18n, Composer, I18nMode, Locale } from '@intlify/vue-i18n-bridge'
import type { LocaleObject, Strategies, BaseUrlResolveHandler } from './types'

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

export function getLocale(i18n: I18n | Composer): Locale {
  // prettier-ignore
  return isI18nInstance(i18n)
    ? isComposer(i18n.global, i18n.mode)
      ? i18n.global.locale.value
      : i18n.global.locale
    : i18n.locale.value
}

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
