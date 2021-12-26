/* eslint-disable @typescript-eslint/no-explicit-any */

import VueRouter from 'vue-router3'
import VueI18n from 'vue-i18n-legacy'
import { STRATEGIES } from './constants'

import type { RouteConfig as __Route } from 'vue-router3'
import type { Router } from 'vue-router'
import type { I18n, Locale } from 'vue-i18n'

type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer U) => void ? U : never
type _Route = UnionToIntersection<__Route>

/**
 * Route config for lagacy vue-router v3
 */
export interface RouteLegacy extends Pick<_Route, Exclude<keyof _Route, 'children' | 'component'>> {
  chunkName?: string
  chunkNames?: Record<string, string>
  component?: _Route['component'] | string
  children?: RouteLegacy[]
}

/**
 * Route config for vue-router v4
 */
export interface Route {
  name?: string
  path: string
  file?: string // for nuxt bridge & nuxt 3
  children?: Route[]
}

/**
 * Route config for vue-i18n-routing
 */
export type VueI18nRoute = Route & RouteLegacy & { redirect?: string }

/**
 * Routing strategy
 */
export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES]

/**
 * Direction
 */
export type Directions = 'ltr' | 'rtl' | 'auto'

/**
 * Locale object
 */
export interface LocaleObject extends Record<string, any> {
  code: Locale
  name?: string
  dir?: Directions
  domain?: string
  file?: string
  isCatchallLocale?: boolean
  iso?: string
}

/**
 * Vue I18n routing options
 */
export interface VueI18nRoutingOptions {
  /**
   * Vue Router instance
   */
  router?: VueRouter | Router
  /**
   * Vue I18n instance
   */
  i18n?: VueI18n | I18n
  defaultLocale?: string
  localeCodes?: string[] | LocaleObject[]
  strategy?: Strategies
  trailingSlash?: boolean
  routesNameSeparator?: string
  defaultLocaleRouteNameSuffix?: string
}

/* eslint-enable @typescript-eslint/no-explicit-any */
