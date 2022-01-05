import { extendRouter } from './extends'
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_TRAILING_SLASH
} from './constants'

import type { Router, VueRouter } from '@intlify/vue-router-bridge'
import type { VueI18nRoutingOptions } from './types'

export function extendRouting<TRouter extends VueRouter | Router>({
  router,
  i18n,
  defaultLocale = DEFAULT_LOCALE,
  trailingSlash = DEFAULT_TRAILING_SLASH,
  routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
  defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  localeCodes = []
}: VueI18nRoutingOptions = {}): TRouter {
  if (router == null) {
    throw new Error('TODO')
  }

  return extendRouter({
    router,
    i18n,
    defaultLocale,
    trailingSlash,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    localeCodes
  })
}

/**
 * Vue I18n Routing Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 */
export const VERSION = '' // TODO: we want to avoid with vite (rollup) option ... __VERSION__

export * from './composables'
export * from './resolve'
export * from './types'
