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
 * The `useRouteBaseName` composable returns the route base name.
 *
 * @remarks
 * The `useRouteBaseName` is the composable function which is {@link getRouteBaseName} wrapper.
 *
 * @param givenRoute - A route object. if not provided, the route is returned with `useRoute` will be used internally
 * @param options - An options, which has `router` and `routesNameSeparator` fields. see about details {@link I18nCommonRoutingOptionsWithComposable} for these option fields.
 *
 * @returns The route base name, if route name is not defined, return `null`.
 *
 * @see {@link getRouteBaseName}
 *
 * @public
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
 * The function that resolve locale path.
 *
 * @remarks
 * The parameter sygnatures of this function is same as {@link localePath}.
 *
 * @param route - A route location. The path or name of the route or an object for more complex routes.
 * @param locale - A locale optional, if not specified, uses the current locale.
 *
 * @returns Returns the localized URL for a given route.
 *
 * @see {@link useLocalePath}
 *
 * @public
 */
export type LocalePathFunction = (route: RawLocation | RouteLocation, locale?: Locale) => string

/**
 * The `useLocalePath` composable returns function  that resolve the locale path.
 *
 * @remarks
 * The function returned by `useLocalePath` is the wrapper function with the same signature as {@link localePath}.
 *
 * @param options - An options, see about details {@link I18nCommonRoutingOptionsWithComposable}.
 *
 * @returns A {@link LocalePathFunction}.
 *
 * @public
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
 * The function that resolve route.
 *
 * @remarks
 * The parameter sygnatures of this function is same as {@link localeRoute}.
 *
 * @param route - A route location. The path or name of the route or an object for more complex routes.
 * @param locale - A locale optinal, if not specified, uses the current locale.
 *
 * @returns the route object for a given route, the route object is resolved by vue-router rather than just a full route path.
 *
 * @see {@link useLocaleRoute}
 *
 * @public
 */
export type LocaleRouteFunction = (
  route: RawLocation | RouteLocationRaw,
  locale?: Locale
) => Route | ReturnType<Router['resolve']> | undefined

/**
 * The `useLocaleRoute` composable returns function that resolve the locale route.
 *
 * @remarks
 * The function returned by `useLocaleRoute` is the wrapper function with the same signature as {@link localeRoute}.
 *
 * @param options - An options, see about details {@link I18nCommonRoutingOptionsWithComposable}
 *
 * @returns A {@link LocaleRouteFunction}.
 *
 * @public
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
 * The function that resolve locale location.
 *
 * @remarks
 * The parameter sygnatures of this function is same as {@link localeLocation}.
 *
 * @param route - A route location. The path or name of the route or an object for more complex routes.
 * @param locale - A locale optional, if not specified, uses the current locale.
 *
 * @returns the location object for a given route, the location object is resolved by vue-router rather than just a full route path.
 *
 * @see {@link useLocaleLocation}
 *
 * @public
 */
export type LocaleLocationFunction = (
  route: RawLocation | RouteLocationRaw,
  locale?: Locale
) => Location | RouteLocation | undefined

/**
 * The `useLocaleLocation` composable returns function that resolve the locale location.
 *
 * @remarks
 * The function returned by `useLocaleLocation` is the wrapper function with the same signature as {@link localeLocation}.
 *
 * @param options - An options, see about details {@link I18nCommonRoutingOptionsWithComposable}
 *
 * @returns A {@link LocaleLocationFunction}.
 *
 * @public
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
 * The functin that swtich locale path.
 *
 * @remarks
 * The parameter sygnatures of this function is same as {@link switchLocalePath}.
 *
 * @param locale - A locale optional, if not specified, uses the current locale.
 *
 * @returns A link to the current route in another language.
 *
 * @see {@link useSwitchLocalePath}
 *
 * @public
 */
export type SwitchLocalePathFunction = (locale?: Locale) => string

/**
 * The `useSwitchLocalePath` composable returns function that resolve the locale location.
 *
 * @remarks
 * The function returned by `useSwitchLocalePath` is the wrapper function with the same signature as {@link switchLocalePath}.
 *
 * @param options - An options, see about details {@link I18nCommonRoutingOptionsWithComposable}
 *
 * @returns A {@link SwitchLocalePathFunction}.
 *
 * @public
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
