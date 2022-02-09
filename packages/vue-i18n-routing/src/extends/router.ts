import VueRouter3 from '@intlify/vue-router-bridge'
import { createRouter as _createRouter } from '@intlify/vue-router-bridge'
import { isString } from '@intlify/shared'
import { isVue2, isVue3 } from 'vue-demi'
import { extendI18n } from './i18n'
import { localizeRoutes } from '../resolve'
import { getLocale, setLocale, getNormalizedLocales } from '../utils'
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_STRATEGY,
  DEFAULT_TRAILING_SLASH,
  DEFAULT_DETECTION_DIRECTION,
  DEFAULT_BASE_URL
} from '../constants'

import type {
  Route,
  Router,
  VueRouter,
  RouteLocationNormalizedLoaded,
  RouteLocationNormalized
} from '@intlify/vue-router-bridge'
import type { I18n } from '@intlify/vue-i18n-bridge'
import type { VueI18nRoute, VueI18nRoutingOptions } from '../types'

function getLocalesRegex(localeCodes: string[]) {
  return new RegExp(`^/(${localeCodes.join('|')})(?:/|$)`, 'i')
}

function createLocaleFromRouteGetter(
  localeCodes: string[],
  routesNameSeparator: string,
  defaultLocaleRouteNameSuffix: string
) {
  const localesPattern = `(${localeCodes.join('|')})`
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`
  const regexpName = new RegExp(`${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`, 'i')
  const regexpPath = getLocalesRegex(localeCodes)

  /**
   * extract locale code from given route:
   * - if route has a name, try to extract locale from it
   * - otherwise, fall back to using the routes'path
   */
  const getLocaleFromRoute = (route: Route | RouteLocationNormalizedLoaded | RouteLocationNormalized): string => {
    // extract from route name
    if (route.name) {
      const name = isString(route.name) ? route.name : route.name.toString()
      const matches = name.match(regexpName)
      if (matches && matches.length > 1) {
        return matches[1]
      }
    } else if (route.path) {
      // Extract from path
      const matches = route.path.match(regexpPath)
      if (matches && matches.length > 1) {
        return matches[1]
      }
    }

    return ''
  }

  return getLocaleFromRoute
}

function asDefaultVueI18nRouterOptions(options: VueI18nRoutingOptions): Required<VueI18nRoutingOptions> {
  options.version = options.version ?? 4
  options.defaultLocale = options.defaultLocale ?? DEFAULT_LOCALE
  options.strategy = options.strategy ?? DEFAULT_STRATEGY
  options.trailingSlash = options.trailingSlash ?? DEFAULT_TRAILING_SLASH
  options.routesNameSeparator = options.routesNameSeparator ?? DEFAULT_ROUTES_NAME_SEPARATOR
  options.defaultLocaleRouteNameSuffix = options.defaultLocaleRouteNameSuffix ?? DEFAULT_LOCALE_ROUTE_NAME_SUFFIX
  options.locales = options.locales ?? []
  options.defaultDirection = options.defaultDirection ?? DEFAULT_DETECTION_DIRECTION
  options.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
  options.routes = options.routes ?? []
  return options as Required<VueI18nRoutingOptions>
}

/**
 * Create a Vue Router instance
 *
 * @param i18n - A Vue I18n instance, see [Vue I18n API docs](https://vue-i18n.intlify.dev/api/general.html#i18n)
 * @param options - An options, see {@link VueI18nRoutingOptions}
 *
 * @returns A Vue Router instance
 *
 * @remakrs
 * You can create a vue router instance to be used by the Vue app.
 *
 * The routes of the created router instance are handled with i18n routing.
 *
 * At the Vue 2 will return a [Vue Router v3 instance](https://router.vuejs.org/api/#router-construction-options), and at the Vue 3 will return a [Vue Router v4 instance](https://next.router.vuejs.org/api/#createrouter).
 *
 * @public
 */
export function createRouter<Options extends VueI18nRoutingOptions = VueI18nRoutingOptions>(
  i18n: I18n,
  options?: Options
): Options['version'] extends 4 ? Router : VueRouter

export function createRouter(i18n: I18n, options = {} as VueI18nRoutingOptions) {
  const {
    version,
    defaultLocale,
    locales,
    strategy,
    trailingSlash,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    defaultDirection,
    baseUrl,
    routes,
    routeOptionsResolver: optionsResolver
  } = asDefaultVueI18nRouterOptions(options)

  const normalizedLocaleCodes = getNormalizedLocales(locales)
  const localeCodes = normalizedLocaleCodes.map(l => l.code)
  const getLocaleFromRoute = createLocaleFromRouteGetter(localeCodes, routesNameSeparator, defaultLocaleRouteNameSuffix)

  extendI18n(i18n, { locales: normalizedLocaleCodes, baseUrl })

  const localizedRoutes = localizeRoutes(routes as VueI18nRoute[], {
    locales,
    defaultLocale,
    strategy,
    trailingSlash,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    optionsResolver
  })
  options.routes = localizedRoutes as any // eslint-disable-line @typescript-eslint/no-explicit-any

  let router: VueRouter | Router | null = null
  if (isVue3 && version === 4) {
    router = _createRouter(options)
  } else if (isVue2 && version === 3) {
    router = new VueRouter3(options as any) as VueRouter // eslint-disable-line @typescript-eslint/no-explicit-any
  } else {
    // TODO:
    throw new Error('TODO:')
  }

  router.__defaultLocale = defaultLocale
  router.__localeCodes = localeCodes
  router.__strategy = strategy
  router.__trailingSlash = trailingSlash
  router.__routesNameSeparator = routesNameSeparator
  router.__defaultLocaleRouteNameSuffix = defaultLocaleRouteNameSuffix
  router.__defaultDirection = defaultDirection

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removableGuardListener = router.beforeEach((to, from, next) => {
    // console.log('beforeEach', to, from)
    const currentLocale = getLocale(i18n)
    const finalLocale = getLocaleFromRoute(to) || currentLocale || defaultLocale || ''
    // console.log('currentLocale', currentLocale, 'finalLocale', finalLocale)
    if (currentLocale !== finalLocale) {
      setLocale(i18n, finalLocale)
    }
    next()
  })

  // console.log('create router', router)
  return router
}
