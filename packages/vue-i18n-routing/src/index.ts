import { isVue2 } from 'vue-demi'
import { VUE_I18N_ROUTING_DEFAULTS } from './constants'
import { localizeRoutes } from './resolve'

import type { VueI18nRoute, VueI18nRoutingOptions } from './types'
import type { Router, RouteRecordRaw } from 'vue-router'

export { localizeRoutes, VueI18nRoutingOptions, VueI18nRoute }

export const VueI18nRoutingPlugin = function (
  vueApp: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  {
    router,
    i18n,
    defaultLocale = VUE_I18N_ROUTING_DEFAULTS.defaultLocale,
    trailingSlash = VUE_I18N_ROUTING_DEFAULTS.trailingSlash,
    routesNameSeparator = VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator,
    defaultLocaleRouteNameSuffix = VUE_I18N_ROUTING_DEFAULTS.defaultLocaleRouteNameSuffix,
    localeCodes = []
  }: VueI18nRoutingOptions = {}
) {
  if (router == null) {
    throw new Error('TODO')
  }

  if (isVue2) {
    const _router = router as any // eslint-disable-line @typescript-eslint/no-explicit-any
    const VueRouter = _router.constructor
    const routes = _router.options.routes || []
    const localizedRoutes = localizeRoutes(routes as VueI18nRoute[], {
      localeCodes,
      defaultLocale,
      trailingSlash,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix
    })
    const newRouter = new VueRouter({ mode: 'history', routes: [] })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(_router as any).matcher = (newRouter as any).matcher
    localizedRoutes.forEach(route => {
      _router.addRoute(route)
    })
  } else {
    const _router = router as Router
    const routes = _router.options.routes || []
    const localizedRoutes = localizeRoutes(routes as VueI18nRoute[], {
      localeCodes,
      defaultLocale,
      trailingSlash,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix
    })
    console.log('vue3 routes', routes, localizedRoutes)
    routes.forEach(r => _router.removeRoute(r.name!))
    localizedRoutes.forEach(route => _router.addRoute(route as RouteRecordRaw))
  }

  // TODO:
  console.log(
    'install vue-i18n-rouging!',
    router,
    i18n,
    defaultLocale,
    trailingSlash,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    localeCodes
  )
}

/**
 * Vue I18n Routing Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 */
export const VERSION = __VERSION__
