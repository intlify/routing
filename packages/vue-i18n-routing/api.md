# vue-i18n-routing API References

## Table Of Contents

- [TypeAlias](#typealias)
  - [BaseUrlResolveHandler](#baseurlresolvehandler)
  - [BrowserLocaleMatcher](#browserlocalematcher)
  - [Directions](#directions)
  - [ExtendComposerHook](#extendcomposerhook)
  - [ExtendExportedGlobalHook](#extendexportedglobalhook)
  - [ExtendVueI18nHook](#extendvuei18nhook)
  - [I18nCommonRoutingOptions](#i18ncommonroutingoptions)
  - [I18nCommonRoutingOptionsWithComposable](#i18ncommonroutingoptionswithcomposable)
  - [I18nRoute](#i18nroute)
  - [I18nRoutingGlobalOptions](#i18nroutingglobaloptions)
  - [I18nRoutingOptions](#i18nroutingoptions)
  - [LocaleLocationFunction](#localelocationfunction)
  - [LocalePathFunction](#localepathfunction)
  - [LocaleRouteFunction](#localeroutefunction)
  - [MetaAttrs](#metaattrs)
  - [Prefixable](#prefixable)
  - [RouteOptionsResolver](#routeoptionsresolver)
  - [Strategies](#strategies)
  - [SwitchLocalePathFunction](#switchlocalepathfunction)
  - [TargetLocale](#targetlocale)
  - [VueI18nExtendOptions](#vuei18nextendoptions)
- [Interface](#interface)
  - [BrowserLocale](#browserlocale)
  - [ComposableOptions](#composableoptions)
  - [ComputedRouteOptions](#computedrouteoptions)
  - [ExtendHooks](#extendhooks)
  - [ExtendProperyDescripters](#extendproperydescripters)
  - [FindBrowserLocaleOptions](#findbrowserlocaleoptions)
  - [I18nHeadMetaInfo](#i18nheadmetainfo)
  - [I18nHeadOptions](#i18nheadoptions)
  - [LocaleObject](#localeobject)
  - [PrefixableOptions](#prefixableoptions)
  - [RouteLegacy](#routelegacy)
  - [RoutingProxy](#routingproxy)
  - [SeoAttributesOptions](#seoattributesoptions)
  - [VueI18nRoutingPluginOptions](#vuei18nroutingpluginoptions)
- [Function](#function)
  - [createLocaleFromRouteGetter](#createlocalefromroutegetter)
  - [createRouter](#createrouter)
  - [extendI18n](#extendi18n)
  - [findBrowserLocale](#findbrowserlocale)
  - [getGlobalOptions](#getglobaloptions)
  - [getLocale](#getlocale)
  - [getLocaleCodes](#getlocalecodes)
  - [getLocales](#getlocales)
  - [getLocalesRegex](#getlocalesregex)
  - [getRouteBaseName](#getroutebasename)
  - [isComposer](#iscomposer)
  - [isExportedGlobalComposer](#isexportedglobalcomposer)
  - [isI18nInstance](#isi18ninstance)
  - [isLegacyVueI18n](#islegacyvuei18n)
  - [isVueI18n](#isvuei18n)
  - [localeHead](#localehead)
  - [localeLocation](#localelocation)
  - [localePath](#localepath)
  - [localeRoute](#localeroute)
  - [localizeRoutes](#localizeroutes)
  - [proxyVueInstance](#proxyvueinstance)
  - [registerGlobalOptions](#registerglobaloptions)
  - [resolveBaseUrl](#resolvebaseurl)
  - [resolveRoute](#resolveroute)
  - [setLocale](#setlocale)
  - [switchLocalePath](#switchlocalepath)
  - [useLocaleHead](#uselocalehead)
  - [useLocaleLocation](#uselocalelocation)
  - [useLocalePath](#uselocalepath)
  - [useLocaleRoute](#uselocaleroute)
  - [useRouteBaseName](#useroutebasename)
  - [useSwitchLocalePath](#useswitchlocalepath)
- [Variable](#variable)
  - [DEFAULT_BASE_URL](#default_base_url)
  - [DEFAULT_DETECTION_DIRECTION](#default_detection_direction)
  - [DEFAULT_LOCALE_ROUTE_NAME_SUFFIX](#default_locale_route_name_suffix)
  - [DEFAULT_LOCALE](#default_locale)
  - [DEFAULT_ROUTES_NAME_SEPARATOR](#default_routes_name_separator)
  - [DEFAULT_STRATEGY](#default_strategy)
  - [DEFAULT_TRAILING_SLASH](#default_trailing_slash)
  - [DefaultPrefixable](#defaultprefixable)
  - [STRATEGIES](#strategies)
  - [VERSION](#version)

## TypeAlias

### BaseUrlResolveHandler

### BrowserLocaleMatcher

The browser locale matcher

**Signature:**

```typescript
export declare type BrowserLocaleMatcher = (locales: TargetLocale[], browserLocales: string[]) => BrowserLocale[]
```

#### Remarks

This matcher is used by [findBrowserLocale](#findbrowserlocale) function

### Directions

Direction

**Signature:**

```typescript
export declare type Directions = 'ltr' | 'rtl' | 'auto'
```

### ExtendComposerHook

### ExtendExportedGlobalHook

### ExtendVueI18nHook

### I18nCommonRoutingOptions

### I18nCommonRoutingOptionsWithComposable

### I18nRoute

Route config for vue-i18n-routing

**Signature:**

```typescript
export declare type I18nRoute = Route &
  RouteLegacy & {
    redirect?: string
  }
```

### I18nRoutingGlobalOptions

Global options for i18n routing

**Signature:**

```typescript
export declare type I18nRoutingGlobalOptions<BaseUrl extends BaseUrlResolveHandler = BaseUrlResolveHandler> = Pick<
  I18nRoutingOptions<BaseUrl>,
  | 'defaultLocale'
  | 'defaultDirection'
  | 'defaultLocaleRouteNameSuffix'
  | 'trailingSlash'
  | 'routesNameSeparator'
  | 'strategy'
  | 'prefixable'
> & {
  localeCodes?: string[]
}
```

### I18nRoutingOptions

Options to initialize a VueRouter instance

**Signature:**

```typescript
export declare type I18nRoutingOptions<BaseUrl extends BaseUrlResolveHandler = BaseUrlResolveHandler> = {
  version?: 3 | 4
  defaultLocale?: string
  locales?: string[] | LocaleObject[]
  strategy?: Strategies
  trailingSlash?: boolean
  routesNameSeparator?: string
  defaultLocaleRouteNameSuffix?: string
  defaultDirection?: Directions
  baseUrl?: string | BaseUrl
  routeOptionsResolver?: RouteOptionsResolver
  prefixable?: Prefixable
} & RouterOptions
```

#### Remarks

This options is extended from Vue Router `RouterOptioins`, so you can specify those options.

### LocaleLocationFunction

Resolve locale location function

**Signature:**

```typescript
export declare type LocaleLocationFunction = (
  route: RawLocation | RouteLocationRaw,
  locale?: Locale
) => Location | RouteLocation | undefined
```

### LocalePathFunction

Resolve locale path function

**Signature:**

```typescript
export declare type LocalePathFunction = (route: RawLocation | RouteLocation, locale?: Locale) => string
```

### LocaleRouteFunction

Resolve route fucntion

**Signature:**

```typescript
export declare type LocaleRouteFunction = (
  route: RawLocation | RouteLocationRaw,
  locale?: Locale
) => Route | ReturnType<Router['resolve']> | undefined
```

### MetaAttrs

### Prefixable

Route path prefix judgment logic in [resolveRoute](#resolveroute) function

**Signature:**

```typescript
export declare type Prefixable = (optons: PrefixableOptions) => boolean
```

### RouteOptionsResolver

Resolver for route localizing options

**Signature:**

```typescript
export declare type RouteOptionsResolver = (route: I18nRoute, localeCodes: string[]) => ComputedRouteOptions | null
```

### Strategies

Routing strategy

**Signature:**

```typescript
export declare type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES]
```

### SwitchLocalePathFunction

Swtich locale path function

**Signature:**

```typescript
export declare type SwitchLocalePathFunction = (locale?: Locale) => string
```

### TargetLocale

The target locale info

**Signature:**

```typescript
export declare type TargetLocale = Required<Pick<LocaleObject, 'code' | 'iso'>>
```

#### Remarks

This type is used by [BrowserLocaleMatcher](#browserlocalematcher) first argument

### VueI18nExtendOptions

## Interface

### BrowserLocale

The browser locale info

**Signature:**

```typescript
export interface BrowserLocale
```

#### Remarks

This type is used by in [findBrowserLocale](#findbrowserlocale) function

#### Properties

##### code

The locale code, such as BCP 47 (e.g `en-US`), or `ja`

**Signature:**

```typescript
code: string
```

##### score

The score number

**Signature:**

```typescript
score: number
```

#### Remarks

The score number that is used by `sorter` of [FindBrowserLocaleOptions](#findbrowserlocaleoptions)

### ComposableOptions

#### Properties

##### i18n

##### route

##### router

### ComputedRouteOptions

Options to compute route localizing

**Signature:**

```typescript
export interface ComputedRouteOptions
```

#### Remarks

The route options that is compute the route to be localized on [localizeRoutes](#localizeroutes)

#### Properties

##### locales

##### paths

### ExtendHooks

#### Properties

##### onExtendComposer

##### onExtendExportedGlobal

##### onExtendVueI18n

### ExtendProperyDescripters

### FindBrowserLocaleOptions

The options for [findBrowserLocale](#findbrowserlocale) function

**Signature:**

```typescript
export interface FindBrowserLocaleOptions
```

#### Properties

##### comparer

##### matcher

### I18nHeadMetaInfo

I18n header meta info

**Signature:**

```typescript
export interface I18nHeadMetaInfo
```

#### Properties

##### htmlAttrs

##### link

##### meta

### I18nHeadOptions

Options for [localeHead](#localehead) function

**Signature:**

```typescript
export interface I18nHeadOptions
```

#### Properties

##### addDirAttribute

Adds a `dir` attribute to the HTML element.

**Signature:**

```typescript
addDirAttribute?: boolean;
```

##### addSeoAttributes

Adds various SEO attributes.

**Signature:**

```typescript
addSeoAttributes?: boolean | SeoAttributesOptions;
```

##### identifierAttribute

Identifier attribute of `<meta>` tag

**Signature:**

```typescript
identifierAttribute?: string;
```

### LocaleObject

Locale object

**Signature:**

```typescript
export interface LocaleObject extends Record<string, any>
```

#### Properties

##### code

##### dir

##### domain

##### file

##### isCatchallLocale

##### iso

##### name

### PrefixableOptions

Route path prefix judgment options used in [Prefixable](#prefixable)

**Signature:**

```typescript
export interface PrefixableOptions
```

#### Properties

##### currentLocale

Current locale

**Signature:**

```typescript
currentLocale: Locale
```

##### defaultLocale

Default locale

**Signature:**

```typescript
defaultLocale: Locale
```

##### strategy

Curernt strategy

**Signature:**

```typescript
strategy: Strategies
```

### RouteLegacy

Route config for lagacy vue-router v3

**Signature:**

```typescript
export interface RouteLegacy extends Pick<_Route, Exclude<keyof _Route, 'children' | 'component'>>
```

#### Properties

##### children

##### chunkName

##### chunkNames

##### component

### RoutingProxy

Routing Proxy

**Signature:**

```typescript
export interface RoutingProxy
```

#### Properties

##### defaultDirection

##### defaultLocale

##### defaultLocaleRouteNameSuffix

##### getRouteBaseName

##### i18n

##### localeCodes

##### localeHead

##### localeLocation

##### localePath

##### localeRoute

##### prefixable

##### resolveRoute

##### route

##### router

##### routesNameSeparator

##### strategy

##### switchLocalePath

##### trailingSlash

### SeoAttributesOptions

SEO Attribute options

**Signature:**

```typescript
export interface SeoAttributesOptions
```

#### Properties

##### canonicalQueries

An array of strings corresponding to query params you would like to include in your canonical URL.

**Signature:**

```typescript
canonicalQueries?: string[];
```

### VueI18nRoutingPluginOptions

An options of Vue I18n Routing Plugin

**Signature:**

```typescript
export interface VueI18nRoutingPluginOptions
```

#### Properties

##### inject

Whether to inject some option APIs style methods into Vue instance

**Signature:**

```typescript
inject?: boolean;
```

## Function

### createLocaleFromRouteGetter

### createRouter

Create a Vue Router instance

**Signature:**

```typescript
export declare function createRouter<Options extends I18nRoutingOptions = I18nRoutingOptions>(
  i18n: I18n,
  options?: Options
): Options['version'] extends 4 ? Router : VueRouter
```

#### Parameters

| Parameter | Type    | Description                                                                                      |
| --------- | ------- | ------------------------------------------------------------------------------------------------ |
| i18n      | I18n    | A Vue I18n instance, see [Vue I18n API docs](https://vue-i18n.intlify.dev/api/general.html#i18n) |
| options   | Options | An options, see [I18nRoutingOptions](#i18nroutingoptions)                                        |

#### Returns

A Vue Router instance

You can create a vue router instance to be used by the Vue app.

The routes of the created router instance are handled with i18n routing.

At the Vue 2 will return a [Vue Router v3 instance](https://router.vuejs.org/api/#router-construction-options), and at the Vue 3 will return a [Vue Router v4 instance](https://next.router.vuejs.org/api/#createrouter).

### extendI18n

### findBrowserLocale

Find the browser locale

**Signature:**

```typescript
export declare function findBrowserLocale(
  locales: LocaleObject[],
  browserLocales: string[],
  { matcher, comparer }?: FindBrowserLocaleOptions
): string | ''
```

#### Parameters

| Parameter             | Type                     | Description                                  |
| --------------------- | ------------------------ | -------------------------------------------- |
| locales               | LocaleObject[]           | The target [locale](#localeobject) list      |
| browserLocales        | string[]                 | The locale code list that is used in browser |
| { matcher, comparer } | FindBrowserLocaleOptions |                                              |

#### Returns

The matched the locale code

### getGlobalOptions

Get global i18n routing options

**Signature:**

```typescript
export declare function getGlobalOptions(router: Router | VueRouter): I18nRoutingGlobalOptions
```

#### Parameters

| Parameter | Type                    | Description                          |
| --------- | ----------------------- | ------------------------------------ |
| router    | Router &#124; VueRouter | A router instance, about router type |

#### Returns

- [global options](#i18nroutingglobaloptions) from i18n routing options registory, if registered, return it, else empty object

### getLocale

Get a locale

**Signature:**

```typescript
export declare function getLocale(i18n: I18n | Composer | VueI18n): Locale
```

#### Parameters

| Parameter | Type                                | Description                                                                                                                                                 |
| --------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| i18n      | I18n &#124; Composer &#124; VueI18n | An [I18n](https://vue-i18n.intlify.dev/api/general.html#i18n) instance or a [Composer](https://vue-i18n.intlify.dev/api/composition.html#composer) instance |

#### Returns

A locale

### getLocaleCodes

### getLocales

### getLocalesRegex

### getRouteBaseName

### isComposer

### isExportedGlobalComposer

### isI18nInstance

### isLegacyVueI18n

### isVueI18n

### localeHead

### localeLocation

### localePath

### localeRoute

### localizeRoutes

Localize routes

**Signature:**

```typescript
export declare function localizeRoutes(
  routes: I18nRoute[],
  {
    defaultLocale,
    strategy,
    trailingSlash,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    includeUprefixedFallback,
    optionsResolver,
    locales
  }?: Pick<
    I18nRoutingOptions,
    'defaultLocale' | 'strategy' | 'locales' | 'routesNameSeparator' | 'trailingSlash' | 'defaultLocaleRouteNameSuffix'
  > & {
    includeUprefixedFallback?: boolean
    optionsResolver?: RouteOptionsResolver
  }
): I18nRoute[]
```

#### Parameters

| Parameter                                                                                                                                         | Type                                                                                                                                                                                 | Description |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| routes                                                                                                                                            | I18nRoute[]                                                                                                                                                                          | Some routes |
| { defaultLocale, strategy, trailingSlash, routesNameSeparator, defaultLocaleRouteNameSuffix, includeUprefixedFallback, optionsResolver, locales } | Pick&lt;I18nRoutingOptions, 'defaultLocale' &#124; 'strategy' &#124; 'locales' &#124; 'routesNameSeparator' &#124; 'trailingSlash' &#124; 'defaultLocaleRouteNameSuffix'&gt; &amp; { |

    includeUprefixedFallback?: boolean;
    optionsResolver?: RouteOptionsResolver;

} | |

#### Returns

Localized routes

### proxyVueInstance

### registerGlobalOptions

Register global i18n routing option registory

**Signature:**

```typescript
export declare function registerGlobalOptions<BaseUrl extends BaseUrlResolveHandler = BaseUrlResolveHandler>(
  router: Router | VueRouter,
  options: I18nRoutingGlobalOptions<BaseUrl>
): void
```

#### Parameters

| Parameter | Type                                    | Description                                                                                     |
| --------- | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| router    | Router &#124; VueRouter                 | A router instance, about router type                                                            |
| options   | I18nRoutingGlobalOptions&lt;BaseUrl&gt; | A global options, about options type, see [I18nRoutingGlobalOptions](#i18nroutingglobaloptions) |

### resolveBaseUrl

Resolve base url

**Signature:**

```typescript
export declare function resolveBaseUrl<Context = unknown>(
  baseUrl: string | BaseUrlResolveHandler<Context>,
  context: Context
): string
```

#### Parameters

| Parameter | Type                                               | Description                                                                                                                                       |
| --------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| baseUrl   | string &#124; BaseUrlResolveHandler&lt;Context&gt; | A base url to resolve on SEO and domain. if you want to resolve with dynamically, you can spacify [BaseUrlResolveHandler](#baseurlresolvehandler) |
| context   | Context                                            | A context to resolve base url, if you want to resolve base url with [BaseUrlResolveHandler](#baseurlresolvehandler)                               |

#### Returns

A resolved base url

### resolveRoute

### setLocale

Set a locale

**Signature:**

```typescript
export declare function setLocale(i18n: I18n | Composer, locale: Locale): void
```

#### Parameters

| Parameter | Type                 | Description                                                                                                                                                 |
| --------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| i18n      | I18n &#124; Composer | An [I18n](https://vue-i18n.intlify.dev/api/general.html#i18n) instance or a [Composer](https://vue-i18n.intlify.dev/api/composition.html#composer) instance |
| locale    | Locale               | A target locale                                                                                                                                             |

### switchLocalePath

### useLocaleHead

Use localize head meta

**Signature:**

```typescript
export declare function useLocaleHead({
  addDirAttribute,
  addSeoAttributes,
  identifierAttribute,
  strategy,
  defaultLocale,
  route,
  router,
  i18n
}?: Pick<I18nCommonRoutingOptionsWithComposable, 'strategy' | 'defaultLocale' | 'route' | 'router' | 'i18n'> &
  I18nHeadOptions): Ref<I18nHeadMetaInfo>
```

#### Parameters

| Parameter                                                                                                | Type                                                                                                                                                     | Description |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| { addDirAttribute, addSeoAttributes, identifierAttribute, strategy, defaultLocale, route, router, i18n } | Pick&lt;I18nCommonRoutingOptionsWithComposable, 'strategy' &#124; 'defaultLocale' &#124; 'route' &#124; 'router' &#124; 'i18n'&gt; &amp; I18nHeadOptions |             |

#### Returns

Genereated SEO head meta information

### useLocaleLocation

Use resolve locale location

**Signature:**

```typescript
export declare function useLocaleLocation({
  router,
  route,
  i18n,
  defaultLocale,
  defaultLocaleRouteNameSuffix,
  routesNameSeparator,
  strategy,
  trailingSlash
}?: I18nCommonRoutingOptionsWithComposable): LocaleLocationFunction
```

#### Parameters

| Parameter                                                                                                          | Type                                   | Description |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------- |
| { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash } | I18nCommonRoutingOptionsWithComposable |             |

#### Returns

Returns a [LocaleLocationFunction](#localelocationfunction)

### useLocalePath

Use resolve locale path

**Signature:**

```typescript
export declare function useLocalePath({
  router,
  route,
  i18n,
  defaultLocale,
  defaultLocaleRouteNameSuffix,
  routesNameSeparator,
  strategy,
  trailingSlash
}?: I18nCommonRoutingOptionsWithComposable): LocalePathFunction
```

#### Parameters

| Parameter                                                                                                          | Type                                   | Description |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------- |
| { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash } | I18nCommonRoutingOptionsWithComposable |             |

#### Returns

Returns a [LocalePathFunction](#localepathfunction)

### useLocaleRoute

Use resolve locale route

**Signature:**

```typescript
export declare function useLocaleRoute({
  router,
  route,
  i18n,
  defaultLocale,
  defaultLocaleRouteNameSuffix,
  routesNameSeparator,
  strategy,
  trailingSlash
}?: I18nCommonRoutingOptionsWithComposable): LocaleRouteFunction
```

#### Parameters

| Parameter                                                                                                          | Type                                   | Description |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------- |
| { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash } | I18nCommonRoutingOptionsWithComposable |             |

#### Returns

Returns a [LocaleRouteFunction](#localeroutefunction)

### useRouteBaseName

Use route base name

**Signature:**

```typescript
export declare function useRouteBaseName(
  givenRoute?: Route | RouteLocationNormalizedLoaded,
  { router, routesNameSeparator }?: I18nCommonRoutingOptionsWithComposable
): string | undefined
```

#### Parameters

| Parameter                       | Type                                       | Description                                                                         |
| ------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| givenRoute                      | Route &#124; RouteLocationNormalizedLoaded | A route object, if not provided, the route is returned with `useRoute` will be used |
| { router, routesNameSeparator } | I18nCommonRoutingOptionsWithComposable     |                                                                                     |

#### Returns

The route base name, if route name is not defined, return null

### useSwitchLocalePath

Use swtich locale path

**Signature:**

```typescript
export declare function useSwitchLocalePath({
  router,
  route,
  i18n,
  defaultLocale,
  defaultLocaleRouteNameSuffix,
  routesNameSeparator,
  strategy,
  trailingSlash
}?: I18nCommonRoutingOptionsWithComposable): SwitchLocalePathFunction
```

#### Parameters

| Parameter                                                                                                          | Type                                   | Description |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------- |
| { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash } | I18nCommonRoutingOptionsWithComposable |             |

#### Returns

Returns a [SwitchLocalePathFunction](#switchlocalepathfunction)

## Variable

### DEFAULT_BASE_URL

### DEFAULT_DETECTION_DIRECTION

### DEFAULT_LOCALE_ROUTE_NAME_SUFFIX

### DEFAULT_LOCALE

### DEFAULT_ROUTES_NAME_SEPARATOR

### DEFAULT_STRATEGY

### DEFAULT_TRAILING_SLASH

### DefaultPrefixable

### STRATEGIES

### VERSION

Vue I18n Routing Version

**Signature:**

```typescript
VERSION: string
```

#### Remarks

Semver format. Same format as the package.json `version` field.
