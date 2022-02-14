import { isBoolean, isArray } from '@intlify/shared'
import { ref, watchEffect, isVue3, onUnmounted } from 'vue-demi'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { useI18n } from '@intlify/vue-i18n-bridge'
import { getRouteBaseName, switchLocalePath, localeRoute } from './routing'
import { getLocale, getNormalizedLocales, warn, inBrowser, toRawRoute } from '../utils'
import { DEFAULT_LOCALE, DEFAULT_STRATEGY, STRATEGIES } from '../constants'

import type { Ref } from 'vue-demi'
import type {
  Router,
  VueRouter,
  RouteLocationNormalizedLoaded,
  RouteLocationNormalized,
  Route
} from '@intlify/vue-router-bridge'
import type { I18nHeadOptions, I18nHeadMetaInfo, I18nRoutingOptions, ComposableOptions, MetaAttrs } from './types'
import type { LocaleObject } from '../types'

/**
 * Generate SEO head meta information
 *
 * @param options - An options, see about details {@link I18nHeadOptions}
 *
 * @returns Genereated SEO head meta information
 */
export function useI18nHead({
  addDirAttribute = false,
  addSeoAttributes = false,
  strategy = DEFAULT_STRATEGY,
  defaultLocale = DEFAULT_LOCALE,
  route = useRoute(),
  router = useRouter(),
  i18n = useI18n()
}: Pick<I18nRoutingOptions, 'strategy' | 'defaultLocale'> &
  ComposableOptions &
  I18nHeadOptions = {}): Ref<I18nHeadMetaInfo> {
  type R = Router | VueRouter
  const _router = router as R

  const _defaultLocale = defaultLocale || _router.__defaultLocale
  const _strategy = strategy || _router.__strategy

  const metaObject: Ref<I18nHeadMetaInfo> = ref({
    htmlAttrs: {},
    link: [],
    meta: []
  })

  function cleanMeta() {
    metaObject.value = {
      htmlAttrs: {},
      link: [],
      meta: []
    }
  }

  function updateMeta(_route: RouteLocationNormalizedLoaded | Route) {
    if (i18n.locales == null || i18n.__baseUrl == null) {
      return
    }
    const locale = getLocale(i18n)
    const currentLocale = getNormalizedLocales(i18n.locales.value).find(l => l.code === locale) || {
      code: locale
    }
    const currentLocaleIso = currentLocale.iso
    const currentLocaleDir = currentLocale.dir || (router as R).__defaultDirection

    // Adding Direction Attribute
    if (addDirAttribute) {
      metaObject.value.htmlAttrs!.dir = currentLocaleDir
    }

    // Adding SEO Meta
    if (addSeoAttributes && locale && i18n.locales) {
      if (currentLocaleIso) {
        metaObject.value.htmlAttrs!.lang = currentLocaleIso
      }

      const locales = i18n.locales.value as LocaleObject[]
      addHreflangLinks(locales, i18n.__baseUrl, metaObject.value.link!, {
        defaultLocale: _defaultLocale,
        strategy: _strategy,
        route,
        router,
        i18n
      })
      addCanonicalLinks(i18n.__baseUrl, metaObject.value.link!, addSeoAttributes, { route: _route, router, i18n })
      addCurrentOgLocale(currentLocale, currentLocaleIso, metaObject.value.meta!)
      addAlternateOgLocales(locales, currentLocaleIso, metaObject.value.meta!)
    }
  }

  if (inBrowser) {
    if (isVue3) {
      const stop = watchEffect(() => {
        cleanMeta()
        updateMeta(toRawRoute(_router.currentRoute))
      })
      onUnmounted(() => stop())
    } else {
      /**
       * NOTE:
       * In vue 2 + `@vue/compoistion-api`, useRoute (`$route`) cannot be watched.
       * For this reason, use `afterEach` to work around it.
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handler = _router.afterEach(
        (to: Route | RouteLocationNormalized, from: Route | RouteLocationNormalized) => {
          cleanMeta()
          updateMeta(to)
        }
      )
      onUnmounted(() => handler())
      updateMeta(route as Route)
    }
  } else {
    updateMeta(toRawRoute(_router.currentRoute))
  }

  return metaObject
}

function addHreflangLinks(
  locales: LocaleObject[],
  baseUrl: string,
  link: MetaAttrs,
  options: Pick<I18nRoutingOptions, 'strategy' | 'defaultLocale'> & ComposableOptions
) {
  if (options.strategy === STRATEGIES.NO_PREFIX) {
    return
  }

  const localeMap = new Map()
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
    const localePath = switchLocalePath(mapLocale.code, options)
    if (localePath) {
      link.push({
        hid: `i18n-alt-${iso}`,
        rel: 'alternate',
        href: toAbsoluteUrl(localePath, baseUrl),
        hreflang: iso
      })
    }
  }

  if (options.defaultLocale) {
    const localePath = switchLocalePath(options.defaultLocale, options)
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
  baseUrl: string,
  link: MetaAttrs,
  seoAttributesOptions: I18nHeadOptions['addSeoAttributes'],
  options: ComposableOptions
) {
  const { route } = options
  const currentRoute = localeRoute(
    {
      ...(route as any), // eslint-disable-line @typescript-eslint/no-explicit-any
      name: getRouteBaseName(route as any, options) // eslint-disable-line @typescript-eslint/no-explicit-any
    },
    undefined,
    options
  )

  if (currentRoute) {
    let href = toAbsoluteUrl(currentRoute.path, baseUrl)

    const canonicalQueries = (!isBoolean(seoAttributesOptions) && seoAttributesOptions!.canonicalQueries) || []

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
