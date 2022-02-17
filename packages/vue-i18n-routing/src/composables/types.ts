/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { Composer } from '@intlify/vue-i18n-bridge'

import type { VueI18nRoutingOptions } from '../types'

export type ComposableOptions = {
  route?: ReturnType<typeof useRoute>
  router?: ReturnType<typeof useRouter>
  i18n?: Composer
}

/**
 * Options for vue-i18n-routing common
 */
export type I18nRoutingOptions = Pick<
  VueI18nRoutingOptions,
  'defaultLocale' | 'strategy' | 'defaultLocaleRouteNameSuffix' | 'trailingSlash' | 'locales' | 'routesNameSeparator'
> &
  ComposableOptions

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
 * Options for {@link useI18nHead} function
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
  // TODO: nuxt `useMeta` compatible interface
  // htmlAttrs?: AttributeProperty
  // meta?: (MetaPropertyCharset | MetaPropertyEquiv | MetaPropertyName | MetaPropertyMicrodata | MetaPropertyProperty)[]
  // link?: (LinkPropertyBase | LinkPropertyHref) /* | LinkPropertyHrefCallback*/[]
  htmlAttrs?: MetaAttrs
  meta?: MetaAttrs[]
  link?: MetaAttrs[]
}

/* eslint-enable @typescript-eslint/no-explicit-any */
