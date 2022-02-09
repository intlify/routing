// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { VueRouter, Router } from '@intlify/vue-router-bridge'
import type { Strategies, Directions } from '../types'

declare module '@intlify/vue-router-bridge' {
  interface VueRouter {
    __defaultLocale?: string
    __localeCodes?: string[]
    __strategy?: Strategies
    __trailingSlash?: boolean
    __routesNameSeparator?: string
    __defaultLocaleRouteNameSuffix?: string
    __defaultDirection?: Directions
  }
  interface Router {
    __defaultLocale?: string
    __localeCodes?: string[]
    __strategy?: Strategies
    __trailingSlash?: boolean
    __routesNameSeparator?: string
    __defaultLocaleRouteNameSuffix?: string
    __defaultDirection?: Directions
  }
}
