import { adjustRoutePathForTrailingSlash } from './utils'
import { VUE_I18N_ROUTING_DEFAULTS } from './constants'

import type { VueI18nRoute, VueI18nRoutingOptions } from './types'

// type RouteOptions = {
//   locales: string[]
//   paths: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
// }

export function localizeRoutes(
  routes: VueI18nRoute[],
  {
    defaultLocale = VUE_I18N_ROUTING_DEFAULTS.defaultLocale,
    trailingSlash = VUE_I18N_ROUTING_DEFAULTS.trailingSlash,
    routesNameSeparator = VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator,
    defaultLocaleRouteNameSuffix = VUE_I18N_ROUTING_DEFAULTS.defaultLocaleRouteNameSuffix,
    localeCodes = []
  }: Pick<
    VueI18nRoutingOptions,
    'defaultLocale' | 'localeCodes' | 'routesNameSeparator' | 'trailingSlash' | 'defaultLocaleRouteNameSuffix'
  > = {}
): VueI18nRoute[] {
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

      const isDefaultLocale = locale === defaultLocale
      if (isDefaultLocale) {
        if (!isChild) {
          const defaultRoute = { ...localizedRoute, path }

          if (name) {
            defaultRoute.name = `${localizedRoute.name}${routesNameSeparator}${defaultLocaleRouteNameSuffix}`
          }

          if (route.children) {
            // recreate child routes with default suffix added
            defaultRoute.children = []
            for (const childRoute of route.children) {
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
      const shouldAddPrefix = !isChildWithRelativePath && !isDefaultLocale
      if (shouldAddPrefix) {
        path = `/${locale}${path}`
      }

      if (path) {
        path = adjustRoutePathForTrailingSlash(path, trailingSlash, isChildWithRelativePath)
      }

      localizedRoute.path = path
      _routes.push(localizedRoute)

      return _routes
    }, [] as VueI18nRoute[])
  }

  return routes.reduce(
    (localized, route) => [...localized, ...makeLocalizedRoutes(route, localeCodes || [])],
    [] as VueI18nRoute[]
  )
}
