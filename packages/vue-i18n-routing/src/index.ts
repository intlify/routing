import VueRouter from 'vue-router3'
import { VUE_I18N_ROUTING_DEFAULTS } from './constants'
import { extendRouter } from './extends'

import type { VueI18nRoutingOptions } from './types'
import type { Router } from 'vue-router'

export function extendRouting<TRouter extends VueRouter | Router>({
  router,
  i18n,
  defaultLocale = VUE_I18N_ROUTING_DEFAULTS.defaultLocale,
  trailingSlash = VUE_I18N_ROUTING_DEFAULTS.trailingSlash,
  routesNameSeparator = VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator,
  defaultLocaleRouteNameSuffix = VUE_I18N_ROUTING_DEFAULTS.defaultLocaleRouteNameSuffix,
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
export const VERSION = __VERSION__

export * from './composables'
