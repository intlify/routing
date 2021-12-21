export const STRATEGIES = {
  PREFIX: 'prefix',
  PREFIX_EXCEPT_DEFAULT: 'prefix_except_default',
  PREFIX_AND_DEFAULT: 'prefix_and_default',
  NO_PREFIX: 'no_prefix'
} as const

// NOTE:
//  we avoid SSR issue with the temp variables
//  (I think it seem to not be able to handle the MemberExpression case)
// - https://github.com/vitejs/vite/pull/6171
// - https://github.com/vitejs/vite/pull/3848
/*
export const VUE_I18N_ROUTING_DEFAULTS = {
  defaultLocale: '',
  strategy: 'prefix_except_default',
  trailingSlash: false,
  routesNameSeparator: '___',
  defaultLocaleRouteNameSuffix: 'default'
}
*/
export const DEFAULT_LOCALE = ''
export const DEFAULT_STRATEGY = STRATEGIES.PREFIX_EXCEPT_DEFAULT
export const DEFAULT_TRAILING_SLASH = false
export const DEFAULT_ROUTES_NAME_SEPARATOR = '___'
export const DEFAULT_LOCALE_ROUTE_NAME_SUFFIX = 'default'
