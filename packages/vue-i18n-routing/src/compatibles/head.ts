import { isArray, isObject } from '@intlify/shared'
import { getRouteBaseName, switchLocalePath, localeRoute } from './routing'
import { getLocale, getLocales, getNormalizedLocales, warn } from '../utils'
import { STRATEGIES } from '../constants'

import type { I18nHeadOptions, I18nHeadMetaInfo, MetaAttrs } from './types'
import type { LocaleObject } from '../types'
import type { RoutingProxy } from './types'

export function localeHead(
  this: RoutingProxy,
  { addDirAttribute = false, addSeoAttributes = false }: I18nHeadOptions = {}
): I18nHeadMetaInfo {
  const router = this.router
  const i18n = this.i18n

  const metaObject: Required<I18nHeadMetaInfo> = {
    htmlAttrs: {},
    link: [],
    meta: []
  }

  if (i18n.locales == null || i18n.__baseUrl == null) {
    return metaObject
  }

  const locale = getLocale(i18n)
  const locales = getLocales(i18n)
  const currentLocale = getNormalizedLocales(locales).find(l => l.code === locale) || {
    code: locale
  }
  const currentLocaleIso = currentLocale.iso
  const currentLocaleDir = currentLocale.dir || router.__defaultDirection

  // Adding Direction Attribute
  if (addDirAttribute) {
    metaObject.htmlAttrs.dir = currentLocaleDir
  }

  // Adding SEO Meta
  if (addSeoAttributes && locale && i18n.locales) {
    if (currentLocaleIso) {
      metaObject.htmlAttrs.lang = currentLocaleIso
    }

    addHreflangLinks.call(this, locales as LocaleObject[], i18n.__baseUrl, metaObject.link)
    addCanonicalLinks.call(this, i18n.__baseUrl, metaObject.link, addSeoAttributes)
    addCurrentOgLocale(currentLocale, currentLocaleIso, metaObject.meta)
    addAlternateOgLocales(locales as LocaleObject[], currentLocaleIso, metaObject.meta)
  }

  return metaObject
}

function addHreflangLinks(this: RoutingProxy, locales: LocaleObject[], baseUrl: string, link: MetaAttrs) {
  const router = this.router
  const defaultLocale = router.__defaultLocale || this.__defaultLocale
  const strategy = router.__strategy || this.__strategy

  if (strategy === STRATEGIES.NO_PREFIX) {
    return
  }

  const localeMap = new Map<string, LocaleObject>()
  for (const locale of locales) {
    const localeIso = locale.iso

    if (!localeIso) {
      warn('Locale ISO code is required to generate alternate link')
      continue
    }

    const [language, region] = localeIso.split('-')

    if (language && region && (locale.isCatchallLocale || !localeMap.has(language))) {
      localeMap.set(language, locale)
    }

    localeMap.set(localeIso, locale)
  }

  for (const [iso, mapLocale] of localeMap.entries()) {
    const localePath = switchLocalePath.call(this, mapLocale.code)
    if (localePath) {
      link.push({
        hid: `i18n-alt-${iso}`,
        rel: 'alternate',
        href: toAbsoluteUrl(localePath, baseUrl),
        hreflang: iso
      })
    }
  }

  if (defaultLocale) {
    const localePath = switchLocalePath.call(this, defaultLocale)
    if (localePath) {
      link.push({
        hid: 'i18n-xd',
        rel: 'alternate',
        href: toAbsoluteUrl(localePath, baseUrl),
        hreflang: 'x-default'
      })
    }
  }
}

function addCanonicalLinks(
  this: RoutingProxy,
  baseUrl: string,
  link: MetaAttrs,
  seoAttributesOptions: I18nHeadOptions['addSeoAttributes']
) {
  const route = this.route
  const currentRoute = localeRoute.call(this, {
    ...(route as any), // eslint-disable-line @typescript-eslint/no-explicit-any
    name: getRouteBaseName.call(this, route)
  })

  if (currentRoute) {
    let href = toAbsoluteUrl(currentRoute.path, baseUrl)

    const canonicalQueries = (isObject(seoAttributesOptions) && seoAttributesOptions.canonicalQueries) || []

    if (canonicalQueries.length) {
      const currentRouteQueryParams = currentRoute.query
      const params = new URLSearchParams()
      for (const queryParamName of canonicalQueries) {
        if (queryParamName in currentRouteQueryParams) {
          const queryParamValue = currentRouteQueryParams[queryParamName]

          if (isArray(queryParamValue)) {
            queryParamValue.forEach(v => params.append(queryParamName, v || ''))
          } else {
            params.append(queryParamName, queryParamValue || '')
          }
        }
      }

      const queryString = params.toString()

      if (queryString) {
        href = `${href}?${queryString}`
      }
    }

    link.push({
      hid: 'i18n-can',
      rel: 'canonical',
      href
    })
  }
}

function addCurrentOgLocale(currentLocale: LocaleObject, currentLocaleIso: string | undefined, meta: MetaAttrs) {
  const hasCurrentLocaleAndIso = currentLocale && currentLocaleIso

  if (!hasCurrentLocaleAndIso) {
    return
  }

  meta.push({
    hid: 'i18n-og',
    property: 'og:locale',
    // Replace dash with underscore as defined in spec: language_TERRITORY
    content: hypenToUnderscore(currentLocaleIso)
  })
}

function addAlternateOgLocales(locales: LocaleObject[], currentLocaleIso: string | undefined, meta: MetaAttrs) {
  const localesWithoutCurrent = locales.filter(locale => {
    const localeIso = locale.iso
    return localeIso && localeIso !== currentLocaleIso
  })

  if (localesWithoutCurrent.length) {
    const alternateLocales = localesWithoutCurrent.map(locale => ({
      hid: `i18n-og-alt-${locale.iso}`,
      property: 'og:locale:alternate',
      content: hypenToUnderscore(locale.iso!)
    }))

    meta.push(...alternateLocales)
  }
}

function hypenToUnderscore(str: string) {
  return (str || '').replace(/-/g, '_')
}

function toAbsoluteUrl(urlOrPath: string, baseUrl: string) {
  if (urlOrPath.match(/^https?:\/\//)) {
    return urlOrPath
  }
  return baseUrl + urlOrPath
}
