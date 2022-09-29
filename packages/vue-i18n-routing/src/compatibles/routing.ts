import { isString, assign } from '@intlify/shared'
import { withTrailingSlash, withoutTrailingSlash } from 'ufo'
import { isVue3, isRef, unref, isVue2 } from 'vue-demi'

import { getLocale, getLocaleRouteName, getRouteName } from '../utils'

import { getI18nRoutingOptions } from './utils'

import type { Strategies } from '../types'
import type { RoutingProxy, PrefixableOptions } from './types'
import type { Locale } from '@intlify/vue-i18n-bridge'
import type {
  Route,
  RawLocation,
  RouteLocation,
  RouteLocationRaw,
  RouteLocationNormalizedLoaded,
  Router
} from '@intlify/vue-router-bridge'

const RESOLVED_PREFIXED = new Set<Strategies>(['prefix_and_default', 'prefix_except_default'])

function prefixable(optons: PrefixableOptions): boolean {
  const { currentLocale, defaultLocale, strategy } = optons
  const isDefaultLocale = currentLocale === defaultLocale
  // don't prefix default locale
  return (
    !(isDefaultLocale && RESOLVED_PREFIXED.has(strategy)) &&
    // no prefix for any language
    !(strategy === 'no_prefix')
  )
}

export const DefaultPrefixable = prefixable

export function getRouteBaseName(
  this: RoutingProxy,
  givenRoute?: Route | RouteLocationNormalizedLoaded
): string | undefined {
  const router = this.router
  const { routesNameSeparator } = getI18nRoutingOptions(router, this)
  // prettier-ignore
  const route = givenRoute != null
    ? isRef(givenRoute)
      ? unref<Route | RouteLocationNormalizedLoaded>(givenRoute)
      : givenRoute
    : this.route
  if (route == null || !route.name) {
    return
  }
  const name = getRouteName(route.name)
  return name.split(routesNameSeparator)[0]
}

export function localePath(
  this: RoutingProxy,
  route: RawLocation | RouteLocationRaw,
  locale?: Locale // TODO: locale should be more type inference (completion)
): string {
  const localizedRoute = resolveRoute.call(this, route, locale)
  // prettier-ignore
  return localizedRoute == null
    ? ''
    : isVue3
      ? localizedRoute.redirectedFrom || localizedRoute.fullPath
      : localizedRoute.route.redirectedFrom || localizedRoute.route.fullPath
}

export function localeRoute(
  this: RoutingProxy,
  route: RawLocation | RouteLocationRaw,
  locale?: Locale // TODO: locale should be more type inference (completion)
): Route | ReturnType<Router['resolve']> | undefined {
  const resolved = resolveRoute.call(this, route, locale)
  // prettier-ignore
  return resolved == null
    ? undefined
    : isVue3
      ? resolved as ReturnType<Router['resolve']> 
      : resolved.route as Route
}

export function localeLocation(
  this: RoutingProxy,
  route: RawLocation | RouteLocationRaw,
  locale?: Locale // TODO: locale should be more type inference (completion)
): Location | RouteLocation | undefined {
  const resolved = resolveRoute.call(this, route, locale)
  // prettier-ignore
  return resolved == null
    ? undefined
      : isVue3
        ? resolved
        : resolved.location
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function resolveRoute(this: RoutingProxy, route: any, locale?: Locale): any {
  const router = this.router
  const i18n = this.i18n
  // console.log('resolveRoute', i18n.locale, Object.keys(i18n))
  const _locale = locale || getLocale(i18n)
  const { routesNameSeparator, defaultLocale, defaultLocaleRouteNameSuffix, strategy, trailingSlash, prefixable } =
    getI18nRoutingOptions(router, this)

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
    let _resolvedRoute = null
    try {
      _resolvedRoute = router.resolve(localizedRoute) as any
    } catch {}
    // prettier-ignore
    const resolvedRoute = isVue3
      ? _resolvedRoute // for vue-router v4
      : _resolvedRoute.route // for vue-router v3
    const resolvedRouteName = getRouteBaseName.call(this, resolvedRoute)
    if (isString(resolvedRouteName)) {
      localizedRoute = {
        name: getLocaleRouteName(resolvedRouteName, _locale, {
          defaultLocale,
          strategy,
          routesNameSeparator,
          defaultLocaleRouteNameSuffix
        }),
        params: resolvedRoute.params,
        query: resolvedRoute.query,
        hash: resolvedRoute.hash
      }
      if (isVue3) {
        localizedRoute.state = resolvedRoute.state
      }
    } else {
      // if route has a path defined but no name, resolve full route using the path
      if (prefixable({ currentLocale: _locale, defaultLocale, strategy })) {
        localizedRoute.path = `/${_locale}${localizedRoute.path}`
      }
      localizedRoute.path = trailingSlash
        ? withTrailingSlash(localizedRoute.path, true)
        : withoutTrailingSlash(localizedRoute.path, true)
    }
  } else {
    if (!localizedRoute.name && !localizedRoute.path) {
      localizedRoute.name = getRouteBaseName.call(this, this.route)
    }

    localizedRoute.name = getLocaleRouteName(localizedRoute.name, _locale, {
      defaultLocale,
      strategy,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix
    })

    if (isVue2) {
      const { params } = localizedRoute
      if (params && params['0'] === undefined && params.pathMatch) {
        params['0'] = params.pathMatch
      }
    }
  }

  try {
    const resolvedRoute = router.resolve(localizedRoute) as any
    // prettier-ignore
    if (isVue3
      ? resolvedRoute.name // for vue-router v4
      : resolvedRoute.route.name // for vue-router v3
    ) {
      return resolvedRoute
    }
    // if didn't resolve to an existing route then just return resolved route based on original input.
    return (router as Router).resolve(route)
  } catch (e: any) {
    if (isVue3 && e.type === 1) {
      // `1` is No match
      return null
    } else if (isVue2) {
      return null
    }
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function switchLocalePath(this: RoutingProxy, locale: Locale): string {
  const route = this.route
  const name = getRouteBaseName.call(this, route)
  if (!name) {
    return ''
  }

  // prettier-ignore
  const { params, ...routeCopy } = !isVue3 && isRef<Route>(route)
	  ? route.value // for vue-router v3
	  : (route as RouteLocationNormalizedLoaded) // for vue-router v4
  const langSwitchParams = {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _baseRoute: any = {
    name,
    params: {
      ...params,
      ...langSwitchParams
    }
  }
  if (isVue2) {
    _baseRoute.params[0] = params.pathMatch
  }

  const baseRoute = assign({}, routeCopy, _baseRoute)
  const path = localePath.call(this, baseRoute, locale)

  // TODO: for domainDifference here

  return path
}
