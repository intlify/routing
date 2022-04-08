import type { Strategies, Directions } from '../types'

interface VueRouterCustomProperties {
  __defaultLocale?: string
  __localeCodes?: string[]
  __strategy?: Strategies
  __trailingSlash?: boolean
  __routesNameSeparator?: string
  __defaultLocaleRouteNameSuffix?: string
  __defaultDirection?: Directions
}
declare module '@intlify/vue-router-bridge' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface VueRouter extends VueRouterCustomProperties {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Router extends VueRouterCustomProperties {}
}
