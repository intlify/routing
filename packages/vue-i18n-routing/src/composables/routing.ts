import { useI18n } from '@intlify/vue-i18n-bridge'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'

import { getRouteBaseName, localePath, localeRoute, localeLocation, switchLocalePath } from '../compatibles'

import type { I18nCommonRoutingOptionsWithComposable } from '../utils'
import type { Locale } from '@intlify/vue-i18n-bridge'
import type {
  Route,
  RawLocation,
  RouteLocation,
  RouteLocationRaw,
  RouteLocationNormalizedLoaded,
  Router
} from '@intlify/vue-router-bridge'

// eslint-disable-next-line @typescript-eslint/ban-types
function proxyForComposable<T extends Function>(options: I18nCommonRoutingOptionsWithComposable, target: Function): T {
  const {
    router,
    route,
    i18n,
    defaultLocale,
    strategy,
    defaultLocaleRouteNameSuffix,
    trailingSlash,
    routesNameSeparator
  } = options
  return function (...args: unknown[]) {
    return Reflect.apply(
      target,
      {
        router,
        route,
        i18n,
        defaultLocale,
        strategy,
        defaultLocaleRouteNameSuffix,
        trailingSlash,
        routesNameSeparator
      },
      args
    )
  } as unknown as T
}

/**
 * Use route base name
 *
 * @param givenRoute - A route object, if not provided, the route is returned with `useRoute` will be used
 * @param options - An options, see about details {@link I18nRoutingOptions}
 *
 * @returns The route base name, if route name is not defined, return null
 */
export function useRouteBaseName(
  givenRoute: Route | RouteLocationNormalizedLoaded = useRoute(),
  { router = useRouter(), routesNameSeparator = undefined }: I18nCommonRoutingOptionsWithComposable = {}
) {
  const proxy = {
    router,
    route: givenRoute,
    routesNameSeparator
  }
  return getRouteBaseName.call(proxy as any, givenRoute) // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Resolve locale path function
 *
 * @param route - A route location. The path or name of the route or an object for more complex routes
 * @param locale - A locale code, if not specified, uses the current locale
 *
 * @returns Returns the localized URL for a given route
 *
 * @see {@link useLocalePath}
 */
export type LocalePathFunction = (route: RawLocation | RouteLocation, locale?: Locale) => string

/**
 * Use resolve locale path
 *
 * @param options - An options, see about details {@link I18nRoutingOptions}
 *
 * @returns Returns a {@link LocalePathFunction}
 */
export function useLocalePath({
  router = useRouter(),
  route = useRoute(),
  i18n = useI18n(),
  defaultLocale = undefined,
  defaultLocaleRouteNameSuffix = undefined,
  routesNameSeparator = undefined,
  strategy = undefined,
  trailingSlash = undefined
}: I18nCommonRoutingOptionsWithComposable = {}): LocalePathFunction {
  return proxyForComposable<LocalePathFunction>(
    { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash },
    localePath
  )
}

/**
 * Resolve route fucntion
 *
 * @param route - A route location. The path or name of the route or an object for more complex routes
 * @param locale - A locale code, if not specified, uses the current locale
 *
 * @returns Returns the route object for a given route, the route object is resolved by vue-router rather than just a full route path.
 *
 * @see {@link useLocaleRoute}
 */
export type LocaleRouteFunction = (
  route: RawLocation | RouteLocationRaw,
  locale?: Locale
) => Route | ReturnType<Router['resolve']> | undefined

/**
 * Use resolve locale route
 *
 * @param options - An options, see about details {@link I18nRoutingOptions}
 *
 * @returns Returns a {@link LocaleRouteFunction}
 */
export function useLocaleRoute({
  router = useRouter(),
  route = useRoute(),
  i18n = useI18n(),
  defaultLocale = undefined,
  defaultLocaleRouteNameSuffix = undefined,
  routesNameSeparator = undefined,
  strategy = undefined,
  trailingSlash = undefined
}: I18nCommonRoutingOptionsWithComposable = {}): LocaleRouteFunction {
  return proxyForComposable<LocaleRouteFunction>(
    {
      router,
      route,
      i18n,
      defaultLocale,
      defaultLocaleRouteNameSuffix,
      routesNameSeparator,
      strategy,
      trailingSlash
    },
    localeRoute
  )
}

/**
 * Resolve locale location function
 *
 * @param route - A route location. The path or name of the route or an object for more complex routes
 * @param locale - A locale code, if not specified, uses the current locale
 *
 * @returns Returns the location object for a given route, the location object is resolved by vue-router rather than just a full route path.
 *
 * @see {@link useLocaleLocation}
 */
export type LocaleLocationFunction = (
  route: RawLocation | RouteLocationRaw,
  locale?: Locale
) => Location | RouteLocation | undefined

/**
 * Use resolve locale location
 *
 * @param options - An options, see about details {@link I18nRoutingOptions}
 *
 * @returns Returns a {@link LocaleLocationFunction}
 */
export function useLocaleLocation({
  router = useRouter(),
  route = useRoute(),
  i18n = useI18n(),
  defaultLocale = undefined,
  defaultLocaleRouteNameSuffix = undefined,
  routesNameSeparator = undefined,
  strategy = undefined,
  trailingSlash = undefined
}: I18nCommonRoutingOptionsWithComposable = {}): LocaleLocationFunction {
  return proxyForComposable<LocaleLocationFunction>(
    {
      router,
      route,
      i18n,
      defaultLocale,
      defaultLocaleRouteNameSuffix,
      routesNameSeparator,
      strategy,
      trailingSlash
    },
    localeLocation
  )
}

/**
 * Swtich locale path function
 *
 * @param locale - A locale code, if not specified, uses the current locale
 *
 * @returns Returns a link to the current route in another language
 *
 * @see {@link useSwitchLocalePath}
 */
export type SwitchLocalePathFunction = (locale?: Locale) => string

/**
 * Use swtich locale path
 *
 * @param options - An options, see about details {@link I18nRoutingOptions}
 *
 * @returns Returns a {@link SwitchLocalePathFunction}
 */
export function useSwitchLocalePath({
  router = useRouter(),
  route = useRoute(),
  i18n = useI18n(),
  defaultLocale = undefined,
  defaultLocaleRouteNameSuffix = undefined,
  routesNameSeparator = undefined,
  strategy = undefined,
  trailingSlash = undefined
}: I18nCommonRoutingOptionsWithComposable = {}): SwitchLocalePathFunction {
  return proxyForComposable<SwitchLocalePathFunction>(
    {
      router,
      route,
      i18n,
      defaultLocale,
      defaultLocaleRouteNameSuffix,
      routesNameSeparator,
      strategy,
      trailingSlash
    },
    switchLocalePath
  )
}
