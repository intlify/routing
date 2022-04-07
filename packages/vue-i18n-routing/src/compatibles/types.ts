/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Route, RouteLocationNormalizedLoaded, Router, VueRouter } from '@intlify/vue-router-bridge'
import type { Strategies } from '../types'

/**
 * Routing Proxy
 */
export type RoutingProxy = {
  i18n: any
  getRouteBaseName: any
  localePath: any
  localeRoute: any
  localeLocation: any
  resolveRoute: any
  switchLocalePath: any
  localeHead: any
  route: Route | RouteLocationNormalizedLoaded
  router: Router | VueRouter
  __defaultLocale: string
  __strategy: Strategies
  __defaultLocaleRouteNameSuffix: string
  __trailingSlash: boolean
  __routesNameSeparator: string
}

/**
 * SEO Attribute options
 */
export interface SeoAttributesOptions {
  /**
   * An array of strings corresponding to query params you would like to include in your canonical URL.
   *
   * @defaultValue []
   */
  canonicalQueries?: string[]
}

/**
 * Options for {@link localeHead} function
 */
export interface I18nHeadOptions {
  /**
   * Adds a `dir` attribute to the HTML element.
   *
   * @defaultValue false
   */
  addDirAttribute?: boolean
  /**
   * Adds various SEO attributes.
   *
   * @defaultValue false
   */
  addSeoAttributes?: boolean | SeoAttributesOptions
}

export type MetaAttrs = Record<string, any>

/**
 * I18n header meta info
 */
export interface I18nHeadMetaInfo {
  htmlAttrs?: MetaAttrs
  meta?: MetaAttrs[]
  link?: MetaAttrs[]
}

/* eslint-enable @typescript-eslint/no-explicit-any */