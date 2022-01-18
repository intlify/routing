import { isVue3 } from 'vue-demi'
import { useRouter } from '@intlify/vue-router-bridge'
import { useI18n } from '@intlify/vue-i18n-bridge'
import { isString, assign } from '@intlify/shared'
import { withTrailingSlash, withoutTrailingSlash } from 'ufo'
import { getLocale, getLocaleRouteName } from '../utils'
import { getRouteBaseName } from './utils'
import {
  STRATEGIES,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_LOCALE,
  DEFAULT_STRATEGY
} from '../constants'

import type { Route, RawLocation, RouteLocationRaw, Router, VueRouter } from '@intlify/vue-router-bridge'
import type { Locale } from '@intlify/vue-i18n-bridge'
import type { I18nRoutingOptions } from './types'
import type { Strategies } from '../types'

const RESOLVED_PREFIXED = new Set<Strategies>([STRATEGIES.PREFIX_AND_DEFAULT, STRATEGIES.PREFIX_EXCEPT_DEFAULT])

/**
 * Resolve locale path
 *
 * @param route - A route location. The path or name of the route or an object for more complex routes
 * @param locale - A locale code, if not specified, uses the current locale
 * @param options - An options, see about details {@link I18nRoutingOptions}
 *
 * @returns Return localized path
 */
export function localePath(
  route: RawLocation | RouteLocationRaw,
  locale?: Locale, // TODO: locale should be more type inference (completion)
  options?: I18nRoutingOptions
): string {
  const localizedRoute = resolveRoute(route, locale, options)
  // prettier-ignore
  return localizedRoute == null
    ? ''
    : isVue3
      ? localizedRoute.redirectedFrom || localizedRoute.fullPath
      : localizedRoute.route.redirectedFrom || localizedRoute.route.fullPath
}

/**
 * Resolve locale route
 *
 * @param route - A route location. The path or name of the route or an object for more complex routes
 * @param locale - A locale code, if not specified, uses the current locale
 * @param options - An options, see about details {@link I18nRoutingOptions}
 *
 * @returns Return localized route resolved by vue-router
 */
export function localeRoute(
  route: RawLocation | RouteLocationRaw,
  locale?: Locale,
  options?: I18nRoutingOptions
): Route | ReturnType<Router['resolve']> | undefined {
  const resolved = resolveRoute(route, locale, options)
  // prettier-ignore
  return resolved == null
    ? undefined
    : isVue3
      ? resolved as ReturnType<Router['resolve']> 
      : resolved.route as Route
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function resolveRoute(
  route: any,
  locale?: Locale,
  {
    router = useRouter(),
    i18n = useI18n(),
    defaultLocale = DEFAULT_LOCALE,
    defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
    routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
    strategy = DEFAULT_STRATEGY,
    trailingSlash = false
  }: I18nRoutingOptions = {}
): any {
  // if option values is undefined, initialize with default value at here
  type R = Router | VueRouter
  const _defaultLocaleRouteNameSuffix = (router as R).__defaultLocaleRouteNameSuffix || defaultLocaleRouteNameSuffix
  const _defaultLocale = (router as R).__defaultLocale || defaultLocale
  const _routesNameSeparator = (router as R).__routesNameSeparator || routesNameSeparator
  const _strategy = (router as R).__strategy || strategy
  const _locale = locale || getLocale(i18n)

  // if route parameter is a string, check if it's a path or name of route.
  let _route = route
  if (isString(route)) {
    if (_route[0] === '/') {
      // if route parameter is a path, create route object with path.
      _route = { path: route }
    } else {
      // else use it as route name.
      _route = { name: route }
    }
  }

  let localizedRoute = assign({}, _route)

  if (localizedRoute.path && !localizedRoute.name) {
    const _resolvedRoute = (router as R).resolve(localizedRoute) as any
    // prettier-ignore
    const resolvedRoute = isVue3
      ? _resolvedRoute // for vue-router v4
      : _resolvedRoute.route // for vue-router v3
    const resolvedRouteName = getRouteBaseName(resolvedRoute)
    if (isString(resolvedRouteName)) {
      localizedRoute = {
        name: getLocaleRouteName(resolvedRouteName, _locale, {
          defaultLocale: _defaultLocale,
          strategy: _strategy,
          routesNameSeparator: _routesNameSeparator,
          defaultLocaleRouteNameSuffix: _defaultLocaleRouteNameSuffix
        }),
        params: resolvedRoute.params,
        query: resolvedRoute.query,
        hash: resolvedRoute.hash
      }
    } else {
      const isDefaultLocale = _locale === defaultLocale
      const isPrefixed =
        // don't prefix default locale
        !(isDefaultLocale && RESOLVED_PREFIXED.has(_strategy)) &&
        // no prefix for any language
        !(_strategy === STRATEGIES.NO_PREFIX)
      // if route has a path defined but no name, resolve full route using the path
      if (isPrefixed) {
        localizedRoute.path = `/${_locale}${localizedRoute.path}`
      }
      localizedRoute.path = trailingSlash
        ? withTrailingSlash(localizedRoute.path, true)
        : withoutTrailingSlash(localizedRoute.path, true)
    }
  } else {
    localizedRoute.name = getLocaleRouteName(localizedRoute.name, _locale, {
      defaultLocale: _defaultLocale,
      strategy: _strategy,
      routesNameSeparator: _routesNameSeparator,
      defaultLocaleRouteNameSuffix: _defaultLocaleRouteNameSuffix
    })

    const { params } = localizedRoute
    if (params && params['0'] === undefined && params.pathMatch) {
      params['0'] = params.pathMatch
    }
  }

  const resolvedRoute = (router as R).resolve(localizedRoute) as any
  // prettier-ignore
  if (isVue3
    ? resolvedRoute.name // for vue-router v4
    : resolvedRoute.route.name // for vue-router v3
  ) {
    return resolvedRoute
  }

  // if didn't resolve to an existing route then just return resolved route based on original input.
  return (router as Router).resolve(route)
}
/* eslint-enable @typescript-eslint/no-explicit-any */
