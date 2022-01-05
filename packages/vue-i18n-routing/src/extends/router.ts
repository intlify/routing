import { isString } from '@intlify/shared'
import { isVue2 } from 'vue-demi'
import { extendI18n } from './i18n'
import { localizeRoutes } from '../resolve'
import { getLocale, setLocale, getNormalizedLocales } from '../utils'
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_STRATEGY,
  DEFAULT_TRAILING_SLASH
} from '../constants'

import type {
  Route,
  Router,
  VueRouter,
  RouteRecordRaw,
  RouteLocationNormalizedLoaded,
  RouteLocationNormalized
} from '@intlify/vue-router-bridge'
import type { I18n } from '@intlify/vue-i18n-bridge'
import type { Strategies, VueI18nRoute, VueI18nRoutingOptions } from '../types'

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

export function extendRouter<TRouter extends VueRouter | Router>({
  router,
  i18n,
  defaultLocale = DEFAULT_LOCALE,
  strategy = DEFAULT_STRATEGY as Strategies,
  trailingSlash = DEFAULT_TRAILING_SLASH,
  routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
  defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  localeCodes = []
}: VueI18nRoutingOptions = {}): TRouter {
  const normalizedLocaleCodes = getNormalizedLocales(localeCodes)
  const getLocaleFromRoute = createLocaleFromRouteGetter(
    normalizedLocaleCodes.map(l => l.code),
    routesNameSeparator,
    defaultLocaleRouteNameSuffix
  )

  extendI18n(i18n as I18n, { localeCodes: normalizedLocaleCodes })

  if (isVue2) {
    const _router = router as VueRouter
    const _VueRouter = _router.constructor as any // eslint-disable-line @typescript-eslint/no-explicit-any
    const routes = _router.options.routes || []
    const localizedRoutes = localizeRoutes(routes as VueI18nRoute[], {
      localeCodes,
      defaultLocale,
      strategy,
      trailingSlash,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix
    })
    console.log('vue2 routes', routes, localizedRoutes)
    // TODO: we need to copy the options from original vue-router
    const newRouter = new _VueRouter({
      mode: 'history',
      base: _router.options.base,
      routes: localizedRoutes
    }) as VueRouter
    newRouter.__defaultLocale = defaultLocale
    newRouter.__strategy = strategy
    newRouter.__trailingSlash = trailingSlash
    newRouter.__routesNameSeparator = routesNameSeparator
    newRouter.__defaultLocaleRouteNameSuffix = defaultLocaleRouteNameSuffix

    const removableGuardListener = newRouter.beforeEach((to: any, from: any, next: any) => {
      console.log('beforeEach', to, from)
      const currentLocale = getLocale(i18n as I18n)
      const finalLocale = getLocaleFromRoute(to) || currentLocale || defaultLocale || ''
      console.log('currentLocale', currentLocale, 'finalLocale', finalLocale)
      if (currentLocale !== finalLocale) {
        setLocale(i18n as I18n, finalLocale)
      }
      next()
    })

    return newRouter as TRouter
  } else {
    const _router = router as Router
    const routes = _router.options.routes || []
    const localizedRoutes = localizeRoutes(routes as VueI18nRoute[], {
      localeCodes,
      defaultLocale,
      strategy,
      trailingSlash,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix
    })
    console.log('vue3 routes', routes, localizedRoutes, _router)
    routes.forEach(r => _router.removeRoute(r.name!))
    localizedRoutes.forEach(route => _router.addRoute(route as RouteRecordRaw))
    _router.__defaultLocale = defaultLocale
    _router.__strategy = strategy
    _router.__trailingSlash = trailingSlash
    _router.__routesNameSeparator = routesNameSeparator
    _router.__defaultLocaleRouteNameSuffix = defaultLocaleRouteNameSuffix

    const removableGuardListener = _router.beforeEach((to, from, next) => {
      console.log('beforeEach', to, from)
      const currentLocale = getLocale(i18n as I18n)
      const finalLocale = getLocaleFromRoute(to) || currentLocale || defaultLocale || ''
      console.log('currentLocale', currentLocale, 'finalLocale', finalLocale)
      if (currentLocale !== finalLocale) {
        setLocale(i18n as I18n, finalLocale)
      }
      next()
    })

    return _router as TRouter
  }
}
