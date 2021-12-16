export const STRATEGIES = {
  PREFIX: 'prefix',
  PREFIX_EXCEPT_DEFAULT: 'prefix_except_default',
  PREFIX_AND_DEFAULT: 'prefix_and_default',
  NO_PREFIX: 'no_prefix'
} as const

export const VUE_I18N_ROUTING_DEFAULTS = {
  defaultLocale: '',
  strategy: 'prefix_except_default',
  trailingSlash: false,
  routesNameSeparator: '___',
  defaultLocaleRouteNameSuffix: 'default'
}
