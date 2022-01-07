import { isString } from '@intlify/shared'
import { adjustRoutePathForTrailingSlash } from './utils'
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_STRATEGY,
  DEFAULT_TRAILING_SLASH
} from './constants'

import type { Strategies, VueI18nRoute, VueI18nRoutingOptions } from './types'

// type RouteOptions = {
//   locales: string[]
//   paths: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
// }

export function localizeRoutes(
  routes: VueI18nRoute[],
  {
    defaultLocale = DEFAULT_LOCALE,
    strategy = DEFAULT_STRATEGY as Strategies,
    trailingSlash = DEFAULT_TRAILING_SLASH,
    routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
    defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
    includeUprefixedFallback = false,
    locales = []
  }: Pick<
    VueI18nRoutingOptions,
    'defaultLocale' | 'strategy' | 'locales' | 'routesNameSeparator' | 'trailingSlash' | 'defaultLocaleRouteNameSuffix'
  > & { includeUprefixedFallback?: boolean } = {}
): VueI18nRoute[] {
  if (strategy === 'no_prefix') {
    return routes
  }

  // normalize localeCodes
  const _localeCodes = locales.map(locale => (isString(locale) ? locale : locale.code))

  function makeLocalizedRoutes(
    route: VueI18nRoute,
    allowedLocaleCodes: string[],
    isChild = false,
    isExtraPageTree = false
  ): VueI18nRoute[] {
    // skip route localization
    if (route.redirect && (!route.component || !route.file)) {
      return [route]
    }

    // TODO: route from options

    const targetLocales = allowedLocaleCodes

    // TODO: component options

    return targetLocales.reduce((_routes, locale) => {
      const { name } = route
      let { path } = route
      const localizedRoute = { ...route }

      // make localized page name
      if (name) {
        localizedRoute.name = `${name}${routesNameSeparator}${locale}`
      }

      // generate localized children routes
      if (route.children) {
        localizedRoute.children = route.children.reduce(
          (children, child) => [...children, ...makeLocalizedRoutes(child, [locale], true, isExtraPageTree)],
          [] as NonNullable<VueI18nRoute['children']>
        )
      }

      // TODO: custom paths

      // For 'prefix_and_default' strategy and default locale:
      // - if it's a parent page, add it with default locale suffix added (no suffix if page has children)
      // - if it's a child page of that extra parent page, append default suffix to it
      const isDefaultLocale = locale === defaultLocale
      if (isDefaultLocale && strategy === 'prefix_and_default') {
        if (!isChild) {
          const defaultRoute = { ...localizedRoute, path }

          if (name) {
            defaultRoute.name = `${localizedRoute.name}${routesNameSeparator}${defaultLocaleRouteNameSuffix}`
          }

          if (route.children) {
            // recreate child routes with default suffix added
            defaultRoute.children = []
            for (const childRoute of route.children) {
              // isExtraRouteTree argument is true to indicate that this is extra route added for 'prefix_and_default' strategy
              defaultRoute.children = defaultRoute.children.concat(
                makeLocalizedRoutes(childRoute as VueI18nRoute, [locale], true, true)
              )
            }
          }

          _routes.push(defaultRoute)
        } else if (isChild && isExtraPageTree && name) {
          localizedRoute.name += `${routesNameSeparator}${defaultLocaleRouteNameSuffix}`
        }
      }

      const isChildWithRelativePath = isChild && !path.startsWith('/')

      // add route prefix
      const shouldAddPrefix =
        // no need to add prefix if child's path is relative
        !isChildWithRelativePath &&
        // skip default locale if strategy is 'prefix_except_default'
        !(isDefaultLocale && strategy === 'prefix_except_default')

      if (shouldAddPrefix) {
        path = `/${locale}${path}`
      }

      if (path) {
        path = adjustRoutePathForTrailingSlash(path, trailingSlash, isChildWithRelativePath)
      }

      if (shouldAddPrefix && isDefaultLocale && strategy === 'prefix' && includeUprefixedFallback) {
        _routes.push({ ...route })
      }

      localizedRoute.path = path
      _routes.push(localizedRoute)

      return _routes
    }, [] as VueI18nRoute[])
  }

  return routes.reduce(
    (localized, route) => [...localized, ...makeLocalizedRoutes(route, _localeCodes || [])],
    [] as VueI18nRoute[]
  )
}
