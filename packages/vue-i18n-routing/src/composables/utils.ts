import { unref } from 'vue-demi'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { getRouteName } from '../utils'
import { DEFAULT_ROUTES_NAME_SEPARATOR } from '../constants'

import type { RouteLocationNormalizedLoaded, Route } from '@intlify/vue-router-bridge'

/**
 * Get route base name
 *
 * @param givenRoute - A route object, if not provided, the route is returned with `useRoute` will be used
 * @param routesNameSeparator - A route name separator, if not provided, default separator is `routesNameSeparator` option of {@link VueI18nRoutingOptions} will be used
 *
 * @returns The route base name, if route name is not defined, return null
 */
export function getRouteBaseName(
  givenRoute: Route | RouteLocationNormalizedLoaded = useRoute(),
  routesNameSeparator = useRouter().__routesNameSeparator || DEFAULT_ROUTES_NAME_SEPARATOR
) {
  const _route = unref<Route | RouteLocationNormalizedLoaded>(givenRoute)
  if (!_route.name) {
    return null
  }
  const name = getRouteName(_route.name)
  return name.split(routesNameSeparator)[0]
}
