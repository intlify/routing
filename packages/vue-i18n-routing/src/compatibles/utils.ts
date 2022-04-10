import { getGlobalOptions } from '../extends/router'
import {
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_LOCALE,
  DEFAULT_DETECTION_DIRECTION,
  DEFAULT_TRAILING_SLASH,
  DEFAULT_STRATEGY
} from '../constants'

import type { I18nRoutingGlobalOptions } from '../extends/router'
import type { VueRouter, Router } from '@intlify/vue-router-bridge'
import type { RoutingProxy } from './types'

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
    localeCodes = []
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
    localeCodes: proxy.localeCodes || options.localeCodes || localeCodes
  }
}
