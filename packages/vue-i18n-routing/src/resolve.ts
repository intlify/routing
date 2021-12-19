import { isString } from '@intlify/shared'
import { adjustRoutePathForTrailingSlash } from './utils'
import { VUE_I18N_ROUTING_DEFAULTS } from './constants'

import type { Strategies, VueI18nRoute, VueI18nRoutingOptions } from './types'

// type RouteOptions = {
//   locales: string[]
//   paths: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
// }

export function localizeRoutes(
  routes: VueI18nRoute[],
  {
    defaultLocale = VUE_I18N_ROUTING_DEFAULTS.defaultLocale,
    strategy = VUE_I18N_ROUTING_DEFAULTS.strategy as Strategies,
    trailingSlash = VUE_I18N_ROUTING_DEFAULTS.trailingSlash,
    routesNameSeparator = VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator,
    defaultLocaleRouteNameSuffix = VUE_I18N_ROUTING_DEFAULTS.defaultLocaleRouteNameSuffix,
    includeUprefixedFallback = false,
    localeCodes = []
  }: Pick<
    VueI18nRoutingOptions,
    | 'defaultLocale'
    | 'strategy'
    | 'localeCodes'
    | 'routesNameSeparator'
    | 'trailingSlash'
    | 'defaultLocaleRouteNameSuffix'
  > & { includeUprefixedFallback?: boolean } = {}
): VueI18nRoute[] {
  if (strategy === 'no_prefix') {
    return routes
  }

  // normalize localeCodes
  const _localeCodes = localeCodes.map(locale => (isString(locale) ? locale : locale.code))

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
