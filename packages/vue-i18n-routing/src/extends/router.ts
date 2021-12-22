import VueRouter from 'vue-router3'
import { isVue2 } from 'vue-demi'
import { extendI18n } from './i18n'
import { localizeRoutes } from '../resolve'
import { getNormalizedLocales } from '../utils'
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_STRATEGY,
  DEFAULT_TRAILING_SLASH
} from '../constants'

import type { Router, RouteRecordRaw } from 'vue-router'
import type { I18n } from 'vue-i18n'
import type { Strategies, VueI18nRoute, VueI18nRoutingOptions } from '../types'

declare module 'vue-router3' {
  export default class VueRouter {
    __defaultLocale?: string
    __strategy?: Strategies
    __trailingSlash?: boolean
    __routesNameSeparator?: string
    __defaultLocaleRouteNameSuffix?: string
  }
}

declare module 'vue-router' {
  interface Router {
    __defaultLocale?: string
    __strategy?: Strategies
    __trailingSlash?: boolean
    __routesNameSeparator?: string
    __defaultLocaleRouteNameSuffix?: string
  }
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
  if (router == null) {
    throw new Error('TODO')
  }

  extendI18n(i18n as I18n, { localeCodes: getNormalizedLocales(localeCodes) })

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
    const newRouter = new _VueRouter({ mode: 'history', base: _router.options.base, routes: localizedRoutes })
    newRouter.__defaultLocale = defaultLocale
    newRouter.__strategy = strategy
    newRouter.__trailingSlash = trailingSlash
    newRouter.__routesNameSeparator = routesNameSeparator
    newRouter.__defaultLocaleRouteNameSuffix = defaultLocaleRouteNameSuffix
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
    return _router as TRouter
  }
}
