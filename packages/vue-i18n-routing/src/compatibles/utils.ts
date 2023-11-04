import { assign } from '@intlify/shared'
import { isVue3 } from 'vue-demi'

import {
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_LOCALE,
  DEFAULT_DETECTION_DIRECTION,
  DEFAULT_TRAILING_SLASH,
  DEFAULT_STRATEGY,
  DEFAULT_DYNAMIC_PARAMS_KEY
} from '../constants'
import { getGlobalOptions } from '../extends/router'

import { DefaultPrefixable, DefaultSwitchLocalePathIntercepter } from './routing'

import type { RoutingProxy } from './types'
import type { I18nRoutingGlobalOptions } from '../extends/router'
import type { Strategies } from '../types'
import type { Locale } from '@intlify/vue-i18n-bridge'
import type {
  VueRouter,
  Router,
  Route,
  RouteLocationNormalizedLoaded,
  RouteLocationPathRaw
} from '@intlify/vue-router-bridge'

export function getI18nRoutingOptions(
  router: Router | VueRouter,
  proxy: RoutingProxy,
  {
    defaultLocale = DEFAULT_LOCALE,
    defaultDirection = DEFAULT_DETECTION_DIRECTION,
    defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
    routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
    strategy = DEFAULT_STRATEGY,
    trailingSlash = DEFAULT_TRAILING_SLASH,
    localeCodes = [],
    prefixable = DefaultPrefixable,
    switchLocalePathIntercepter = DefaultSwitchLocalePathIntercepter,
    dynamicRouteParamsKey = DEFAULT_DYNAMIC_PARAMS_KEY
  }: I18nRoutingGlobalOptions = {}
): Required<I18nRoutingGlobalOptions> {
  const options = getGlobalOptions(router)
  return {
    defaultLocale: proxy.defaultLocale || options.defaultLocale || defaultLocale,
    defaultDirection: proxy.defaultDirection || options.defaultDirection || defaultDirection,
    defaultLocaleRouteNameSuffix:
      proxy.defaultLocaleRouteNameSuffix || options.defaultLocaleRouteNameSuffix || defaultLocaleRouteNameSuffix,
    routesNameSeparator: proxy.routesNameSeparator || options.routesNameSeparator || routesNameSeparator,
    strategy: proxy.strategy || options.strategy || strategy,
    trailingSlash: proxy.trailingSlash || options.trailingSlash || trailingSlash,
    localeCodes: proxy.localeCodes || options.localeCodes || localeCodes,
    prefixable: proxy.prefixable || options.prefixable || prefixable,
    switchLocalePathIntercepter:
      proxy.switchLocalePathIntercepter || options.switchLocalePathIntercepter || switchLocalePathIntercepter,
    dynamicRouteParamsKey: proxy.dynamicRouteParamsKey || options.dynamicRouteParamsKey || dynamicRouteParamsKey
  }
}

function split(str: string, index: number) {
  const result = [str.slice(0, index), str.slice(index)]
  return result
}

/**
 * NOTE:
 * Nuxt route uses a proxy with getters for performance reasons (https://github.com/nuxt/nuxt/pull/21957).
 * Spreading will result in an empty object, so we make a copy of the route by accessing each getter property by name.
 */
export function routeToObject(route: Route | RouteLocationNormalizedLoaded) {
  const { fullPath, query, hash, name, path, params, meta, redirectedFrom, matched } = route
  return {
    fullPath,
    params,
    query,
    hash,
    name,
    path,
    meta,
    matched,
    redirectedFrom
  }
}

export type ResolveV3 = ReturnType<VueRouter['resolve']>
export type ResolveV4 = ReturnType<Router['resolve']>
type ResolvedRoute = ResolveV3 | ResolveV4

export function isV4Route(val: ResolvedRoute): val is ReturnType<Router['resolve']> {
  return isVue3
}

export function isV4Router(val: Router | VueRouter): val is Router {
  return isVue3
}

/**
 * NOTE:
 * vue-router v4.x `router.resolve` for a non exists path will output a warning.
 * `router.hasRoute`, which checks for the route can only be a named route.
 * When using the `prefix` strategy, the path specified by `localePath` is specified as a path not prefixed with a locale.
 * This will cause vue-router to issue a warning, so we can work-around by using `router.options.routes`.
 */
export function resolve(router: Router | VueRouter, route: RouteLocationPathRaw, strategy: Strategies, locale: Locale) {
  if (isV4Router(router)) {
    return router.resolve(route)
  }

  if (strategy !== 'prefix') {
    return router.resolve(route)
  }

  // if (isArray(route.matched) && route.matched.length > 0) {
  //   return route.matched[0]
  // }

  const [rootSlash, restPath] = split(route.path, 1)
  const targetPath = `${rootSlash}${locale}${restPath === '' ? restPath : `/${restPath}`}`
  const _route = router.options?.routes?.find(r => r.path === targetPath)

  if (_route == null) {
    return router.resolve(route)
  }

  const _resolvableRoute = assign({}, route, _route)
  _resolvableRoute.path = targetPath
  return router.resolve(_resolvableRoute)
}
