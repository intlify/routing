import { isString, assign } from '@intlify/shared'
import {
  type Route,
  type RawLocation,
  type RouteLocationRaw,
  type RouteLocationNormalizedLoaded,
  type Router,
  type RouteMeta,
  type RouteLocationNamedRaw,
  type RouteLocationPathRaw,
  type RouteLocation,
  type Location
} from '@intlify/vue-router-bridge'
import { parsePath, parseQuery, withTrailingSlash, withoutTrailingSlash } from 'ufo'
import { isVue3, isRef, unref, isVue2 } from 'vue-demi'

import { DEFAULT_DYNAMIC_PARAMS_KEY } from '../constants'
import { getLocale, getLocaleRouteName, getRouteName } from '../utils'

import { getI18nRoutingOptions, isV4Route, resolve, routeToObject } from './utils'

import type { RoutingProxy, PrefixableOptions, SwitchLocalePathIntercepter } from './types'
import type { ResolveV3, ResolveV4 } from './utils'
import type { Strategies, I18nRoutingOptions } from '../types'
import type { Locale } from '@intlify/vue-i18n-bridge'

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

/**
 * Returns base name of current (if argument not provided) or passed in route.
 * 
 * @remarks
 * Base name is name of the route without locale suffix and other metadata added by nuxt i18n module

 * @param this - A {@link RoutingProxy} instance.
 * @param givenRoute - A route.
 * 
 * @returns The route base name. if cannot get, `undefined` is returned.
 * 
 * @public
 */
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

/**
 * Returns localized path for passed in route.
 *
 * @remarks
 * If locale is not specified, uses current locale.
 *
 * @param this - A {@link RoutingProxy} instance.
 * @param route - A route.
 * @param locale - A locale, optional.
 *
 * @returns A path of the current route.
 *
 * @public
 */
export function localePath(
  this: RoutingProxy,
  route: RawLocation | RouteLocationRaw,
  locale?: Locale // TODO: locale should be more type inference (completion)
): string {
  const localizedRoute = resolveRoute.call(this, route, locale)
  // prettier-ignore
  return localizedRoute == null
    ? ''
    : isV4Route(localizedRoute)
      ? localizedRoute.redirectedFrom?.fullPath || localizedRoute.fullPath
      : localizedRoute.route.redirectedFrom || localizedRoute.route.fullPath
}

/**
 * Returns localized route for passed in `route` parameters.
 *
 * @remarks
 * If `locale` is not specified, uses current locale.
 *
 * @param this - A {@link RoutingProxy} instance.
 * @param route - A route.
 * @param locale - A locale, optional.
 *
 * @returns A route. if cannot resolve, `undefined` is returned.
 *
 * @public
 */
export function localeRoute(
  this: RoutingProxy,
  route: RawLocation | RouteLocationRaw,
  locale?: Locale // TODO: locale should be more type inference (completion)
): Route | ReturnType<Router['resolve']> | undefined {
  const resolved = resolveRoute.call(this, route, locale)
  // prettier-ignore
  return resolved == null
    ? undefined
    : isV4Route(resolved)
      ? resolved
      : resolved.route
}

/**
 * Returns localized location for passed in route parameters.
 *
 * @remarks
 * If `locale` is not specified, uses current locale.
 *
 * @param this - A {@link RoutingProxy} instance.
 * @param route - A route.
 * @param locale - A locale, optional.
 *
 * @returns A route location. if cannot resolve, `undefined` is returned.
 *
 * @public
 */
export function localeLocation(
  this: RoutingProxy,
  route: RawLocation | RouteLocationRaw,
  locale?: Locale // TODO: locale should be more type inference (completion)
): Location | (RouteLocation & { href: string }) | undefined {
  const resolved = resolveRoute.call(this, route, locale)
  // prettier-ignore
  return resolved == null
    ? undefined
      : isV4Route(resolved)
        ? resolved
        : resolved.location
}

export function resolveRoute(this: RoutingProxy, route: RawLocation | RouteLocationRaw, locale?: Locale) {
  const router = this.router
  const i18n = this.i18n
  const _locale = locale || getLocale(i18n)
  const { routesNameSeparator, defaultLocale, defaultLocaleRouteNameSuffix, strategy, trailingSlash, prefixable } =
    getI18nRoutingOptions(router, this)

  // if route parameter is a string, check if it's a path or name of route.
  let _route: RouteLocationPathRaw | RouteLocationNamedRaw
  if (isString(route)) {
    if (route[0] === '/') {
      // if route parameter is a path, create route object with path.
      const { pathname: path, search, hash } = parsePath(route)
      const query = parseQuery(search)
      _route = { path, query, hash }
    } else {
      // else use it as route name.
      _route = { name: route }
    }
  } else {
    _route = route
  }

  let localizedRoute = assign({} as RouteLocationPathRaw | RouteLocationNamedRaw, _route)

  const isRouteLocationPathRaw = (val: RouteLocationPathRaw | RouteLocationNamedRaw): val is RouteLocationPathRaw =>
    'path' in val && !!val.path && !('name' in val)

  if (isRouteLocationPathRaw(localizedRoute)) {
    let _resolvedRoute = null
    try {
      _resolvedRoute = resolve(router, localizedRoute, strategy, _locale)
    } catch {}

    // prettier-ignore
    const resolvedRoute = isVue3
      ? _resolvedRoute as ResolveV4 // for vue-router v4
      : (_resolvedRoute as ResolveV3).route // for vue-router v3

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
      } as RouteLocationNamedRaw

      if (isVue3) {
        // @ts-expect-error
        localizedRoute.state = (resolvedRoute as ResolveV4).state
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
    if (!localizedRoute.name && !('path' in localizedRoute)) {
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
    const resolvedRoute = router.resolve(localizedRoute)
    if (
      isV4Route(resolvedRoute)
        ? resolvedRoute.name // for vue-router v4
        : resolvedRoute.route.name // for vue-router v3
    ) {
      return resolvedRoute
    }

    // if didn't resolve to an existing route then just return resolved route based on original input.
    return router.resolve(route)
  } catch (e: unknown) {
    if (isVue2) {
      return null
    }

    if (isVue3 && typeof e === 'object' && 'type' in e! && e.type === 1) {
      // `1` is No match
      return null
    }
  }
}

export const DefaultSwitchLocalePathIntercepter: SwitchLocalePathIntercepter = (path: string) => path

function getLocalizableMetaFromDynamicParams(
  route: Route | RouteLocationNormalizedLoaded,
  key: Required<I18nRoutingOptions>['dynamicRouteParamsKey']
): Record<Locale, unknown> {
  const metaDefault = {}
  if (key === DEFAULT_DYNAMIC_PARAMS_KEY) {
    return metaDefault
  }

  // prettier-ignore
  const meta = isVue3
    ? (route as RouteLocationNormalizedLoaded).meta // for vue-router v4
    : isRef<Route>(route) // for vue-router v3
      ? route.value.meta || metaDefault
      : route.meta || metaDefault

  if (isRef<RouteMeta>(meta)) {
    return (meta.value[key] || metaDefault) as Record<Locale, unknown>
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((meta as any)[key] || metaDefault) as Record<Locale, unknown>
  }
}

export type MetaDynamicParamsInterceptor = (
  route: Route | RouteLocationNormalizedLoaded,
  key: Required<I18nRoutingOptions>['dynamicRouteParamsKey']
) => Record<Locale, unknown>

/**
 * Returns path of the current route for specified locale.
 *
 * @param this - A {@link RoutingProxy} instance.
 * @param locale - A locale
 *
 * @returns A path of the current route.
 *
 * @public
 */
export function switchLocalePath(this: RoutingProxy, locale: Locale): string {
  const route = this.route
  const name = getRouteBaseName.call(this, route)
  if (!name) {
    return ''
  }

  const { switchLocalePathIntercepter, dynamicRouteParamsKey, dynamicParamsInterceptor } = getI18nRoutingOptions(
    this.router,
    this
  )

  // prettier-ignore
  const routeValue = isVue3
    ? (route as RouteLocationNormalizedLoaded) // for vue-router v4
    : isRef<Route>(route) // for vue-router v3
      ? route.value
      : route
  const routeCopy = routeToObject(routeValue)
  const langSwitchParamsIntercepted = dynamicParamsInterceptor?.()?.value?.[locale]
  const langSwitchParams = getLocalizableMetaFromDynamicParams(route, dynamicRouteParamsKey)[locale] || {}

  const resolvedParams = langSwitchParamsIntercepted ?? langSwitchParams ?? {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _baseRoute: any = {
    name,
    params: {
      ...routeCopy.params,
      ...resolvedParams
    }
  }
  if (isVue2) {
    _baseRoute.params[0] = routeCopy.params.pathMatch
  }

  const baseRoute = assign({}, routeCopy, _baseRoute)
  let path = localePath.call(this, baseRoute, locale)

  // custom locale path with interceptor
  path = switchLocalePathIntercepter(path, locale)

  return path
}
