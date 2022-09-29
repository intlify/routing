/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Strategies, Directions } from '../types'
import type { Locale } from '@intlify/vue-i18n-bridge'
import type { Route, RouteLocationNormalizedLoaded, Router, VueRouter } from '@intlify/vue-router-bridge'

/**
 * Routing Proxy
 */
export interface RoutingProxy {
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
  defaultLocale?: string
  localeCodes?: string[]
  strategy?: Strategies
  defaultDirection?: Directions
  defaultLocaleRouteNameSuffix?: string
  trailingSlash?: boolean
  routesNameSeparator?: string
  prefixable?: Prefixable
  switchLocalePathIntercepter?: SwitchLocalePathIntercepter
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
  /**
   * Identifier attribute of `<meta>` tag
   *
   * @defaultValue 'hid'
   */
  identifierAttribute?: string
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

/**
 * Route path prefix judgment options used in {@link Prefixable}
 */
export interface PrefixableOptions {
  /**
   * Current locale
   */
  currentLocale: Locale
  /**
   * Default locale
   */
  defaultLocale: Locale
  /**
   * Curernt strategy
   */
  strategy: Strategies
}

/**
 * Route path prefix judgment logic in {@link resolveRoute} function
 */
export type Prefixable = (optons: PrefixableOptions) => boolean

/**
 * The intercept handler which is called in {@link switchLocalePath} function
 */
export type SwitchLocalePathIntercepter = (path: string, locale: Locale) => string

/* eslint-enable @typescript-eslint/no-explicit-any */
