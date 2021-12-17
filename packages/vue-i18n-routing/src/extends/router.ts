import VueRouter from 'vue-router3'
import { isVue2 } from 'vue-demi'
import { VUE_I18N_ROUTING_DEFAULTS } from '../constants'
import { localizeRoutes } from '../resolve'

import type { Router, RouteRecordRaw } from 'vue-router'
import type { Strategies, VueI18nRoute, VueI18nRoutingOptions } from '../types'

declare module 'vue-router3' {
  export default class VueRouter {
    __defaultLocale?: string
    __strategy?: Strategies
    __localeCodes?: string[]
    __trailingSlash?: boolean
    __routesNameSeparator?: string
    __defaultLocaleRouteNameSuffix?: string
  }
}

declare module 'vue-router' {
  interface Router {
    __defaultLocale?: string
    __strategy?: Strategies
    __localeCodes?: string[]
    __trailingSlash?: boolean
    __routesNameSeparator?: string
    __defaultLocaleRouteNameSuffix?: string
  }
}

export function extendRouter<TRouter extends VueRouter | Router>({
  router,
  i18n,
  defaultLocale = VUE_I18N_ROUTING_DEFAULTS.defaultLocale,
  strategy = VUE_I18N_ROUTING_DEFAULTS.strategy as Strategies,
  trailingSlash = VUE_I18N_ROUTING_DEFAULTS.trailingSlash,
  routesNameSeparator = VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator,
  defaultLocaleRouteNameSuffix = VUE_I18N_ROUTING_DEFAULTS.defaultLocaleRouteNameSuffix,
  localeCodes = []
}: VueI18nRoutingOptions = {}): TRouter {
  if (router == null) {
    throw new Error('TODO')
  }

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
    newRouter.__localeCodes = localeCodes
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
    _router.__localeCodes = localeCodes
    _router.__trailingSlash = trailingSlash
    _router.__routesNameSeparator = routesNameSeparator
    _router.__defaultLocaleRouteNameSuffix = defaultLocaleRouteNameSuffix
    return _router as TRouter
  }
}

/**
 * Vue I18n Routing Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 */
export const VERSION = __VERSION__
