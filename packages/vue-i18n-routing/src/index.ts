import type { Plugin } from 'vue-demi'

export interface VueI18nRoutingOptions {
  routes: []
}

export const VueI18nRoutingPlugin = function (
  VueOrApp: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any
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
