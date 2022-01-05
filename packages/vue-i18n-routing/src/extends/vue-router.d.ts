// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { VueRouter, Router } from '@intlify/vue-router-bridge'
import type { Strategies } from '../types'

declare module '@intlify/vue-router-bridge' {
  interface VueRouter {
    __defaultLocale?: string
    __strategy?: Strategies
    __trailingSlash?: boolean
    __routesNameSeparator?: string
    __defaultLocaleRouteNameSuffix?: string
  }
  interface Router {
    __defaultLocale?: string
    __strategy?: Strategies
    __trailingSlash?: boolean
    __routesNameSeparator?: string
    __defaultLocaleRouteNameSuffix?: string
  }
}
