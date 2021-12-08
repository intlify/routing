import { VUE_I18N_ROUTING_DEFAULTS } from './constants'
import { localizeRoutes } from './resolve'

import type { Plugin } from 'vue-demi'
import type { VueI18nRoute, VueI18nRoutingOptions } from './types'

export { localizeRoutes, VueI18nRoutingOptions, VueI18nRoute }

export const VueI18nRoutingPlugin = function (
  VueOrApp: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: VueI18nRoutingOptions = {
    trailingSlash: VUE_I18N_ROUTING_DEFAULTS.trailingSlash,
    routesNameSeparator: VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator
  }
) {
  // TODO:
  console.log('install vue-i18n-rouging!')
}

/**
 * Vue I18n Routing Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 */
export const VERSION = __VERSION__
