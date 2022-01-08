import { isString, isSymbol } from '@intlify/shared'

import type { Locale } from '@intlify/vue-i18n-bridge'
import type { Strategies } from '../types'

export function getRouteName(routeName?: string | symbol | null) {
  // prettier-ignore
  return isString(routeName)
    ? routeName
    : isSymbol(routeName)
      ? routeName.toString()
      : '(null)'
}

export function getLocaleRouteName(
  routeName: string | null,
  locale: Locale,
  {
    defaultLocale,
    strategy,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix
  }: { defaultLocale: string; strategy: Strategies; routesNameSeparator: string; defaultLocaleRouteNameSuffix: string }
) {
  let name = getRouteName(routeName) + (strategy === 'no_prefix' ? '' : routesNameSeparator + locale)
  if (locale === defaultLocale && strategy === 'prefix_and_default') {
    name += routesNameSeparator + defaultLocaleRouteNameSuffix
  }
  return name
}
