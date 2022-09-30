import { isString, isObject, makeSymbol } from '@intlify/shared'
import VueRouter3, { createRouter as _createRouter } from '@intlify/vue-router-bridge'
import { isVue2, isVue3 } from 'vue-demi'

import { DefaultPrefixable, DefaultSwitchLocalePathIntercepter } from '../compatibles'
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_STRATEGY,
  DEFAULT_TRAILING_SLASH,
  DEFAULT_DETECTION_DIRECTION,
  DEFAULT_BASE_URL
} from '../constants'
import { localizeRoutes, DefaultLocalizeRoutesPrefixable } from '../resolve'
import { getLocale, setLocale, getNormalizedLocales, warn } from '../utils'

import { extendI18n } from './i18n'

import type { I18nRoute, I18nRoutingOptions } from '../types'
import type { I18n } from '@intlify/vue-i18n-bridge'
import type {
  Route,
  Router,
  VueRouter,
  RouteLocationNormalizedLoaded,
  RouteLocationNormalized
} from '@intlify/vue-router-bridge'

/**
 * Global options for i18n routing
 */
export type I18nRoutingGlobalOptions<Context = unknown> = Pick<
  I18nRoutingOptions<Context>,
  | 'defaultLocale'
  | 'defaultDirection'
  | 'defaultLocaleRouteNameSuffix'
  | 'trailingSlash'
  | 'routesNameSeparator'
  | 'strategy'
  | 'prefixable'
  | 'switchLocalePathIntercepter'
> & { localeCodes?: string[] }

const GlobalOptionsRegistory = makeSymbol('vue-i18n-routing-gor')

/**
 * Register global i18n routing option registory
 *
 * @param router - A router instance, about router type
 * @param options - A global options, about options type, see {@link I18nRoutingGlobalOptions}
 */
export function registerGlobalOptions<Context = unknown>(
  router: Router | VueRouter,
  options: I18nRoutingGlobalOptions<Context>
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _options: I18nRoutingGlobalOptions | undefined = (router as any)[GlobalOptionsRegistory]
  if (_options) {
    warn('already registered global options')
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(router as any)[GlobalOptionsRegistory] = options
  }
}

/**
 * Get global i18n routing options
 *
 * @param router - A router instance, about router type
 *
 * @returns - {@link I18nRoutingGlobalOptions | global options} from i18n routing options registory, if registered, return it, else empty object
 */
export function getGlobalOptions(router: Router | VueRouter): I18nRoutingGlobalOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (router as any)[GlobalOptionsRegistory] ?? {}
}

/**
 * Create a Vue Router instance
 *
 * @param i18n - A Vue I18n instance, see [Vue I18n API docs](https://vue-i18n.intlify.dev/api/general.html#i18n)
 * @param options - An options, see {@link I18nRoutingOptions}
 *
 * @returns A Vue Router instance
 *
 * @remakrs
 * You can create a vue router instance to be used by the Vue app.
 *
 * The routes of the created router instance are handled with i18n routing.
 *
 * At the Vue 2 will return a [Vue Router v3 instance](https://router.vuejs.org/api/#router-construction-options), and at the Vue 3 will return a [Vue Router v4 instance](https://next.router.vuejs.org/api/#createrouter).
 *
 * @public
 */
export function createRouter<Options extends I18nRoutingOptions = I18nRoutingOptions>(
  i18n: I18n,
  options?: Options
): Options['version'] extends 4 ? Router : VueRouter

// TODO: strictly `I18n` type!
export function createRouter(i18n: I18n, options = {} as I18nRoutingOptions) {
  const {
    version,
    defaultLocale,
    locales,
    strategy,
    trailingSlash,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    defaultDirection,
    baseUrl,
    routes,
    prefixable,
    switchLocalePathIntercepter,
    localizeRoutesPrefixable,
    routeOptionsResolver: optionsResolver
  } = asDefaultVueI18nRouterOptions(options)

  const normalizedLocaleCodes = getNormalizedLocales(locales)
  const localeCodes = normalizedLocaleCodes.map(l => l.code)
  const getLocaleFromRoute = createLocaleFromRouteGetter(localeCodes, routesNameSeparator, defaultLocaleRouteNameSuffix)

  const localizedRoutes = localizeRoutes(routes as I18nRoute[], {
    locales,
    defaultLocale,
    strategy,
    trailingSlash,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    localizeRoutesPrefixable,
    optionsResolver
  })
  options.routes = localizedRoutes as any // eslint-disable-line @typescript-eslint/no-explicit-any

  const router = createVueRouter(options, version)
  registerGlobalOptions(router, {
    defaultLocale,
    localeCodes,
    strategy,
    trailingSlash,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    defaultDirection,
    prefixable,
    switchLocalePathIntercepter
  })

  extendI18n(i18n, { locales: normalizedLocaleCodes, baseUrl, localeCodes, context: router })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removableGuardListener = router.beforeEach((to, from, next) => {
    // console.log('beforeEach', to, from)
    const currentLocale = getLocale(i18n)
    const finalLocale = getLocaleFromRoute(to) || currentLocale || defaultLocale || ''
    // console.log('currentLocale', currentLocale, 'finalLocale', finalLocale)
    if (currentLocale !== finalLocale) {
      setLocale(i18n, finalLocale)
    }
    next()
  })

  // console.log('create router', router)
  return router
}

function createVueRouter(options: I18nRoutingOptions, version: number): VueRouter | Router {
  if (isVue3 && version === 4) {
    return _createRouter(options)
  } else if (isVue2 && version === 3) {
    return new VueRouter3(options as any) as VueRouter // eslint-disable-line @typescript-eslint/no-explicit-any
  } else {
    // TODO:
    throw new Error('TODO:')
  }
}

export function getLocalesRegex(localeCodes: string[]) {
  return new RegExp(`^/(${localeCodes.join('|')})(?:/|$)`, 'i')
}

export function createLocaleFromRouteGetter(
  localeCodes: string[],
  routesNameSeparator: string,
  defaultLocaleRouteNameSuffix: string
) {
  const localesPattern = `(${localeCodes.join('|')})`
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`
  const regexpName = new RegExp(`${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`, 'i')
  const regexpPath = getLocalesRegex(localeCodes)

  /**
   * extract locale code from given route:
   * - if route has a name, try to extract locale from it
   * - otherwise, fall back to using the routes'path
   */
  const getLocaleFromRoute = (
    route: Route | RouteLocationNormalizedLoaded | RouteLocationNormalized | string
  ): string => {
    // extract from route name
    if (isObject(route)) {
      if (route.name) {
        const name = isString(route.name) ? route.name : route.name.toString()
        const matches = name.match(regexpName)
        if (matches && matches.length > 1) {
          return matches[1]
        }
      } else if (route.path) {
        // Extract from path
        const matches = route.path.match(regexpPath)
        if (matches && matches.length > 1) {
          return matches[1]
        }
      }
    } else if (isString(route)) {
      const matches = route.match(regexpPath)
      if (matches && matches.length > 1) {
        return matches[1]
      }
    }

    return ''
  }

  return getLocaleFromRoute
}

function asDefaultVueI18nRouterOptions(options: I18nRoutingOptions): Required<I18nRoutingOptions> {
  options.version = options.version ?? 4
  options.defaultLocale = options.defaultLocale ?? DEFAULT_LOCALE
  options.strategy = options.strategy ?? DEFAULT_STRATEGY
  options.trailingSlash = options.trailingSlash ?? DEFAULT_TRAILING_SLASH
  options.routesNameSeparator = options.routesNameSeparator ?? DEFAULT_ROUTES_NAME_SEPARATOR
  options.defaultLocaleRouteNameSuffix = options.defaultLocaleRouteNameSuffix ?? DEFAULT_LOCALE_ROUTE_NAME_SUFFIX
  options.locales = options.locales ?? []
  options.defaultDirection = options.defaultDirection ?? DEFAULT_DETECTION_DIRECTION
  options.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
  options.routes = options.routes ?? []
  options.prefixable = options.prefixable ?? DefaultPrefixable
  options.switchLocalePathIntercepter = options.switchLocalePathIntercepter ?? DefaultSwitchLocalePathIntercepter
  options.localizeRoutesPrefixable = options.localizeRoutesPrefixable ?? DefaultLocalizeRoutesPrefixable
  return options as Required<I18nRoutingOptions>
}
