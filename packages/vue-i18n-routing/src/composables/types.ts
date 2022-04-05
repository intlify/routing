/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { Composer } from '@intlify/vue-i18n-bridge'

import type { I18nRoutingOptions } from '../types'

export type ComposableOptions = {
  route?: ReturnType<typeof useRoute>
  router?: ReturnType<typeof useRouter>
  i18n?: Composer
}

/**
 * Options for vue-i18n-routing common
 */
export type I18nCommonRoutingOptions = Pick<
  I18nRoutingOptions,
  'defaultLocale' | 'strategy' | 'defaultLocaleRouteNameSuffix' | 'trailingSlash' | 'locales' | 'routesNameSeparator'
> &
  ComposableOptions
