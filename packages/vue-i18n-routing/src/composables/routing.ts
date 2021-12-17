/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRef, isVue2 } from 'vue-demi'
import { isString, isSymbol, assign } from '@intlify/shared'
import { useRoute, useRouter } from './router'
import { useI18n } from './i18n'
// import VueRouter from 'vue-router3'

import type { ComputedRef } from 'vue-demi'
import type { VueI18nRoutingOptions, Strategies } from '../types'
import type { Route, RawLocation } from 'vue-router3'
import type { RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from 'vue-router'
import type { Locale, I18n, Composer, I18nMode } from 'vue-i18n'

export type I18nRoutingOptions = Pick<
  VueI18nRoutingOptions,
  'defaultLocale' | 'strategy' | 'defaultLocaleRouteNameSuffix' | 'trailingSlash' | 'localeCodes'
> & {
  routesNameSeparator?: string
}

// TODO: should be implemented useful type API
export interface I18nRoutingReturn {
  getRouteBaseName(givenRoute?: Route | RouteLocationNormalizedLoaded): string
  localePath(route: any, locale?: Locale): string
  localeRoute(route: any, locale?: Locale): any
  localeLocation(route: any, locale?: Locale): any
  switchLocalePath(locale: Locale): void
}

// TODO: should be implemented useful type API
export function useI18nRouting<Legacy extends boolean = false>(options?: I18nRoutingOptions): I18nRoutingReturn

export function useI18nRouting(options: I18nRoutingOptions = {}) {
  const $i18n = useI18n()
  const $router = useRouter()
  const $route = useRoute()

  // if option values is undefined, initialize with default value at here
  const defaultLocaleRouteNameSuffix = options.defaultLocaleRouteNameSuffix || $router.__defaultLocaleRouteNameSuffix!
  const defaultLocale = options.defaultLocale || $router.__defaultLocale!
  const routesNameSeparator = options.routesNameSeparator || $router.__routesNameSeparator!
  const strategy = options.strategy || $router.__strategy

  /**
   * define routing utilities with Composition API
   */

  function getRouteBaseName(givenRoute?: Route | RouteLocationNormalizedLoaded) {
    // prettier-ignore
    const route = givenRoute != null
      ? givenRoute
      : isRef($route)
        ? $route.value
        : $route
    if (!route.name) {
      return
    }
    const name = getRouteName(route.name)
    return name.split(routesNameSeparator)[0]
  }

  function getLocaleRouteName(routeName: string | null, locale: Locale) {
    let name = getRouteName(routeName) + (strategy === 'no_prefix' ? '' : routesNameSeparator + locale)
    if (locale === defaultLocale && strategy === 'prefix_and_default') {
      name += routesNameSeparator + defaultLocaleRouteNameSuffix
    }
    return name
  }

  function resolveRoute(route: any, locale?: Locale): any {
    // TODO:
    const _locale = locale || getLocale($i18n)

    // if route parameter is a string, check if it's a path or name of route.
    let _route = route
    if (isString(route)) {
      if (route[0] === '/') {
        // if route parameter is a path, create route object with path.
        _route = { path: route }
      } else {
        // else use it as route name.
        _route = { name: route }
      }
    }

    let localizedRoute = assign({}, _route)

    if (localizedRoute.path && !localizedRoute.name) {
      const _resolvedRoute = $router.resolve(localizedRoute) as any
      // prettier-ignore
      const resolvedRoute = !isVue2
        ? _resolvedRoute // for vue-router v4
        : _resolvedRoute.route // for vue-router v3
      const resolvedRouteName = getRouteBaseName(resolvedRoute)
      if (isString(resolvedRouteName)) {
        localizedRoute = {
          name: getLocaleRouteName(resolvedRouteName, _locale),
          params: resolvedRoute.params,
          query: resolvedRoute.query,
          hash: resolvedRoute.hash
        }
      } else {
        // TODO
      }
    } else {
      localizedRoute.name = getLocaleRouteName(localizedRoute.name, _locale)

      const { params } = localizedRoute
      if (params && params['0'] === undefined && params.pathMatch) {
        params['0'] = params.pathMatch
      }
    }

    const resolvedRoute = $router.resolve(localizedRoute) as any
    // prettier-ignore
    if (isVue2
      ? resolvedRoute.route.name // for vue-router v3
      : resolvedRoute.name // for vue-router v4
    ) {
      return resolvedRoute
    }

    // if didn't resolve to an existing route then just return resolved route based on original input.
    return $router.resolve(route)
  }

  function localePath(route: any, locale: Locale) {
    const localizedRoute = resolveRoute(route, locale)
    // prettier-ignore
    return localizedRoute == null
      ? ''
      : isVue2
        ? localizedRoute.route.redirectedFrom || localizedRoute.route.fullPath
        : localizedRoute.redirectedFrom || localizedRoute.fullPath
  }

  function localeRoute(route: any, locale: Locale) {
    const resolved = resolveRoute(route, locale)
    // prettier-ignore
    return resolved == null
      ? undefined
        : isVue2
          ? resolved.route
          : resolved
  }

  function localeLocation(route: any, locale: Locale) {
    const resolved = resolveRoute(route, locale)
    // prettier-ignore
    return resolved == null
      ? undefined
        : isVue2
          ? resolved.location
          : resolved.href
  }

  function switchLocalePath(locale: Locale) {
    const name = getRouteBaseName()
    if (!name) {
      return ''
    }

    // prettier-ignore
    const { params, ...routeCopy } = isVue2 && isRef($route)
      ? $route.value // for vue-router v3
      : ($route as RouteLocationNormalizedLoaded) // for vue-router v4
    const langSwitchParams = {}

    const baseRoute = assign({}, routeCopy, {
      name,
      params: {
        ...params,
        ...langSwitchParams,
        0: params.pathMatch
      }
    })
    const path = localePath(baseRoute, locale)

    // TODO: for domainDifference

    return path
  }

  return {
    localePath,
    localeRoute,
    localeLocation,
    switchLocalePath
  }
}

function getRouteName(routeName?: string | symbol | null) {
  // prettier-ignore
  return isString(routeName)
    ? routeName
    : isSymbol(routeName)
      ? routeName.toString()
      : ''
}

function isI18nInstance(i18n: I18n | Composer): i18n is I18n {
  return 'global' in i18n && 'mode' in i18n
}

function isComposer(target: any, mode: I18nMode): target is Composer {
  return isRef(target.locale) && mode === 'composition'
}

function getLocale(i18n: I18n | Composer): Locale {
  // prettier-ignore
  return isI18nInstance(i18n)
    ? isComposer(i18n.global, i18n.mode)
      ? i18n.global.locale.value
      : i18n.global.locale
    : isRef(i18n.locale)
      ? i18n.locale.value
      : i18n.locale
}

/* eslint-enable @typescript-eslint/no-explicit-any */
