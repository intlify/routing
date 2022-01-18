import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { Composer } from '@intlify/vue-i18n-bridge'

import type { VueI18nRoutingOptions } from '../types'

export type I18nRoutingOptions = Pick<
  VueI18nRoutingOptions,
  'defaultLocale' | 'strategy' | 'defaultLocaleRouteNameSuffix' | 'trailingSlash' | 'locales' | 'routesNameSeparator'
> & { route?: ReturnType<typeof useRoute>; router?: ReturnType<typeof useRouter>; i18n?: Composer }
