import { unref } from 'vue-demi'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { getRouteName } from '../utils'
import { DEFAULT_ROUTES_NAME_SEPARATOR } from '../constants'

import type { I18nRoutingOptions } from './types'
import type { RouteLocationNormalizedLoaded, Route, Router, VueRouter } from '@intlify/vue-router-bridge'

/**
 * Get route base name
 *
 * @param givenRoute - A route object, if not provided, the route is returned with `useRoute` will be used
 * @param options - An options, see about details {@link I18nRoutingOptions}
 *
 * @returns The route base name, if route name is not defined, return null
 */
export function getRouteBaseName(
  givenRoute: Route | RouteLocationNormalizedLoaded = useRoute(),
  { router = useRouter(), routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR }: I18nRoutingOptions = {}
) {
  type R = Router | VueRouter
  const _routesNameSeparator = routesNameSeparator || (router as R).__routesNameSeparator
  const _route = unref<Route | RouteLocationNormalizedLoaded>(givenRoute)
  if (!_route.name) {
    return null
  }
  const name = getRouteName(_route.name)
  return name.split(_routesNameSeparator!)[0]
}
