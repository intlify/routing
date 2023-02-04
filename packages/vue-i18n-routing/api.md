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
  - [LocalizeRoutesPrefixable](#localizeroutesprefixable)
  - [MetaAttrs](#metaattrs)
  - [Prefixable](#prefixable)
  - [PrefixableOptions](#prefixableoptions)
  - [RouteOptionsResolver](#routeoptionsresolver)
  - [Strategies](#strategies)
  - [SwitchLocalePathFunction](#switchlocalepathfunction)
  - [SwitchLocalePathIntercepter](#switchlocalepathintercepter)
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
  - [LocalizeRoutesPrefixableOptions](#localizeroutesprefixableoptions)
  - [RouteLegacy](#routelegacy)
  - [RoutingProxy](#routingproxy)
  - [SeoAttributesOptions](#seoattributesoptions)
  - [VueI18nRoutingPluginOptions](#vuei18nroutingpluginoptions)
- [Function](#function)
  - [createLocaleFromRouteGetter](#createlocalefromroutegetter)
  - [createRouter](#createrouter)
  - [extendI18n](#extendi18n)
  - [findBrowserLocale](#findbrowserlocale)
  - [getComposer](#getcomposer)
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
  - [DefaultLocalizeRoutesPrefixable](#defaultlocalizeroutesprefixable)
  - [DefaultPrefixable](#defaultprefixable)
  - [DefaultSwitchLocalePathIntercepter](#defaultswitchlocalepathintercepter)
  - [VERSION](#version)

## TypeAlias

### BaseUrlResolveHandler



**Signature:**
```typescript
export declare type BaseUrlResolveHandler<Context = unknown> = (context: Context) => string;
```

### BrowserLocaleMatcher

The browser locale matcher

**Signature:**
```typescript
export declare type BrowserLocaleMatcher = (locales: TargetLocale[], browserLocales: string[]) => BrowserLocale[];
```

#### Remarks

This matcher is used by [findBrowserLocale](#findbrowserlocale) function

### Directions

Direction

**Signature:**
```typescript
export declare type Directions = 'ltr' | 'rtl' | 'auto';
```

### ExtendComposerHook

### ExtendExportedGlobalHook

### ExtendVueI18nHook

### I18nCommonRoutingOptions



**Signature:**
```typescript
export declare type I18nCommonRoutingOptions = Pick<I18nRoutingOptions, 'defaultLocale' | 'strategy' | 'defaultLocaleRouteNameSuffix' | 'trailingSlash' | 'locales' | 'routesNameSeparator'>;
```

### I18nCommonRoutingOptionsWithComposable



**Signature:**
```typescript
export declare type I18nCommonRoutingOptionsWithComposable = I18nCommonRoutingOptions & ComposableOptions;
```

### I18nRoute

Route config for vue-i18n-routing

**Signature:**
```typescript
export declare type I18nRoute = Route & RouteLegacy & {
    redirect?: string;
};
```

### I18nRoutingGlobalOptions

Global options for i18n routing

**Signature:**
```typescript
export declare type I18nRoutingGlobalOptions<Context = unknown> = Pick<I18nRoutingOptions<Context>, 'defaultLocale' | 'defaultDirection' | 'defaultLocaleRouteNameSuffix' | 'trailingSlash' | 'routesNameSeparator' | 'strategy' | 'prefixable' | 'switchLocalePathIntercepter' | 'dynamicRouteParamsKey'> & {
    localeCodes?: string[];
};
```

### I18nRoutingOptions

Options to initialize a VueRouter instance

**Signature:**
```typescript
export declare type I18nRoutingOptions<Context = unknown> = {
    version?: 3 | 4;
    defaultLocale?: string;
    locales?: string[] | LocaleObject[];
    strategy?: Strategies;
    trailingSlash?: boolean;
    routesNameSeparator?: string;
    defaultLocaleRouteNameSuffix?: string;
    defaultDirection?: Directions;
    baseUrl?: string | BaseUrlResolveHandler<Context>;
    routeOptionsResolver?: RouteOptionsResolver;
    prefixable?: Prefixable;
    switchLocalePathIntercepter?: SwitchLocalePathIntercepter;
    localizeRoutesPrefixable?: LocalizeRoutesPrefixable;
    dynamicRouteParamsKey?: string | symbol;
} & RouterOptions;
```

#### Remarks

This options is extended from Vue Router `RouterOptioins`, so you can specify those options.

### LocaleLocationFunction

The function that resolve locale location.

**Signature:**
```typescript
export declare type LocaleLocationFunction = (route: RawLocation | RouteLocationRaw, locale?: Locale) => Location | RouteLocation | undefined;
```

#### Remarks

The parameter sygnatures of this function is same as [localeLocation](#localelocation).

### LocalePathFunction

The function that resolve locale path.

**Signature:**
```typescript
export declare type LocalePathFunction = (route: RawLocation | RouteLocation, locale?: Locale) => string;
```

#### Remarks

The parameter sygnatures of this function is same as [localePath](#localepath).

### LocaleRouteFunction

The function that resolve route.

**Signature:**
```typescript
export declare type LocaleRouteFunction = (route: RawLocation | RouteLocationRaw, locale?: Locale) => Route | ReturnType<Router['resolve']> | undefined;
```

#### Remarks

The parameter sygnatures of this function is same as [localeRoute](#localeroute).

### LocalizeRoutesPrefixable

Localize route path prefix judgment logic in [localizeRoutes](#localizeroutes) function

**Signature:**
```typescript
export declare type LocalizeRoutesPrefixable = (options: LocalizeRoutesPrefixableOptions) => boolean;
```

### MetaAttrs

Meta attributes for head properties.

**Signature:**
```typescript
export declare type MetaAttrs = Record<string, any>;
```

### Prefixable

Route path prefix judgment logic in [resolveRoute](#resolveroute) function

**Signature:**
```typescript
export declare type Prefixable = (optons: PrefixableOptions) => boolean;
```

### PrefixableOptions

Route path prefix judgment options used in [Prefixable](#prefixable)

**Signature:**
```typescript
export declare type PrefixableOptions = Pick<LocalizeRoutesPrefixableOptions, 'currentLocale' | 'defaultLocale' | 'strategy'>;
```

### RouteOptionsResolver

Resolver for route localizing options

**Signature:**
```typescript
export declare type RouteOptionsResolver = (route: I18nRoute, localeCodes: string[]) => ComputedRouteOptions | null;
```

### Strategies

Routing strategy

**Signature:**
```typescript
export declare type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];
```

### SwitchLocalePathFunction

The functin that swtich locale path.

**Signature:**
```typescript
export declare type SwitchLocalePathFunction = (locale?: Locale) => string;
```

#### Remarks

The parameter sygnatures of this function is same as [switchLocalePath](#switchlocalepath).

### SwitchLocalePathIntercepter

The intercept handler which is called in [switchLocalePath](#switchlocalepath) function

**Signature:**
```typescript
export declare type SwitchLocalePathIntercepter = (path: string, locale: Locale) => string;
```

### TargetLocale

The target locale info

**Signature:**
```typescript
export declare type TargetLocale = Required<Pick<LocaleObject, 'code' | 'iso'>>;
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

This type is used by  in [findBrowserLocale](#findbrowserlocale) function


#### Properties

##### code

The locale code, such as BCP 47 (e.g `en-US`), or `ja`

**Signature:**
```typescript
code: string;
```

##### score

The score number

**Signature:**
```typescript
score: number;
```

#### Remarks

The score number that is used by `sorter` of [FindBrowserLocaleOptions](#findbrowserlocaleoptions)


### ComposableOptions



**Signature:**
```typescript
export interface ComposableOptions 
```


#### Properties

##### i18n

vue-i18n Composer instance.

**Signature:**
```typescript
i18n?: Composer;
```

##### route

vue-router route instance, which is returned with `useRoute`.

**Signature:**
```typescript
route?: ReturnType<typeof useRoute>;
```

##### router

vue-router router instance, which is returned with `useRouter`.

**Signature:**
```typescript
router?: ReturnType<typeof useRouter>;
```


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

I18n header meta info.

**Signature:**
```typescript
export interface I18nHeadMetaInfo 
```


#### Properties

##### htmlAttrs

##### link

##### meta


### I18nHeadOptions

Options for [localeHead](#localehead) function.

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


### LocalizeRoutesPrefixableOptions

Localize route path prefix judgment options used in [LocalizeRoutesPrefixable](#localizeroutesprefixable)

**Signature:**
```typescript
export interface LocalizeRoutesPrefixableOptions 
```


#### Properties

##### currentLocale

Current locale

**Signature:**
```typescript
currentLocale: Locale;
```

##### defaultLocale

Default locale

**Signature:**
```typescript
defaultLocale: Locale;
```

##### isChild

Whether the route to be resolved is child or not

**Signature:**
```typescript
isChild: boolean;
```

##### path

The path of route

**Signature:**
```typescript
path: string;
```

##### strategy

Curernt strategy

**Signature:**
```typescript
strategy: Strategies;
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

##### dynamicRouteParamsKey

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

##### switchLocalePathIntercepter

##### trailingSlash


### SeoAttributesOptions

SEO Attribute options.

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
export declare function createRouter<Options extends I18nRoutingOptions = I18nRoutingOptions>(i18n: I18n, options?: Options): Options['version'] extends 4 ? Router : VueRouter;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| i18n | I18n | A Vue I18n instance, see [Vue I18n API docs](https://vue-i18n.intlify.dev/api/general.html#i18n) |
| options | Options | An options, see [I18nRoutingOptions](#i18nroutingoptions) |

#### Returns

 A Vue Router instance

#### Remarks

You can create a vue router instance to be used by the Vue app.

The routes of the created router instance are handled with i18n routing.

At the Vue 2 will return a [Vue Router v3 instance](https://router.vuejs.org/api/#router-construction-options), and at the Vue 3 will return a [Vue Router v4 instance](https://next.router.vuejs.org/api/#createrouter).

### extendI18n

### findBrowserLocale

Find the browser locale

**Signature:**
```typescript
export declare function findBrowserLocale(locales: LocaleObject[], browserLocales: string[], { matcher, comparer }?: FindBrowserLocaleOptions): string | '';
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locales | LocaleObject[] | The target [locale](#localeobject) list |
| browserLocales | string[] | The locale code list that is used in browser |
| { matcher, comparer } | FindBrowserLocaleOptions |  |

#### Returns

 The matched the locale code

### getComposer

### getGlobalOptions

Get global i18n routing options

**Signature:**
```typescript
export declare function getGlobalOptions(router: Router | VueRouter): I18nRoutingGlobalOptions;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| router | Router &#124; VueRouter | A router instance, about router type |

#### Returns

 - [global options](#i18nroutingglobaloptions) from i18n routing options registory, if registered, return it, else empty object

### getLocale

Get a locale

**Signature:**
```typescript
export declare function getLocale(i18n: I18n | Composer | VueI18n): Locale;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| i18n | I18n &#124; Composer &#124; VueI18n | An [I18n](https://vue-i18n.intlify.dev/api/general.html#i18n) instance or a [Composer](https://vue-i18n.intlify.dev/api/composition.html#composer) instance |

#### Returns

 A locale

### getLocaleCodes

### getLocales

### getLocalesRegex

### getRouteBaseName

Returns base name of current (if argument not provided) or passed in route.

**Signature:**
```typescript
export declare function getRouteBaseName(this: RoutingProxy, givenRoute?: Route | RouteLocationNormalizedLoaded): string | undefined;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| this | RoutingProxy | A [RoutingProxy](#routingproxy) instance. |
| givenRoute | Route &#124; RouteLocationNormalizedLoaded | A route. |

#### Returns

 The route base name. if cannot get, `undefined` is returned.

#### Remarks

Base name is name of the route without locale suffix and other metadata added by nuxt i18n module

### isComposer

### isExportedGlobalComposer

### isI18nInstance

### isLegacyVueI18n

### isVueI18n

### localeHead

Returns localized head properties for locale-related aspects.

**Signature:**
```typescript
export declare function localeHead(this: RoutingProxy, { addDirAttribute, addSeoAttributes, identifierAttribute }?: I18nHeadOptions): I18nHeadMetaInfo;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| this | RoutingProxy | A [RoutingProxy](#routingproxy) instance. |
| { addDirAttribute, addSeoAttributes, identifierAttribute } | I18nHeadOptions |  |

#### Returns

 The localized [head properties](#i18nheadmetainfo).

### localeLocation

Returns localized location for passed in route parameters.

**Signature:**
```typescript
export declare function localeLocation(this: RoutingProxy, route: RawLocation | RouteLocationRaw, locale?: Locale): Location | RouteLocation | undefined;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| this | RoutingProxy | A [RoutingProxy](#routingproxy) instance. |
| route | RawLocation &#124; RouteLocationRaw | A route. |
| locale | Locale | A locale, optional. |

#### Returns

 A route location. if cannot resolve, `undefined` is returned.

#### Remarks

If `locale` is not specified, uses current locale.

### localePath

Returns localized path for passed in route.

**Signature:**
```typescript
export declare function localePath(this: RoutingProxy, route: RawLocation | RouteLocationRaw, locale?: Locale): string;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| this | RoutingProxy | A [RoutingProxy](#routingproxy) instance. |
| route | RawLocation &#124; RouteLocationRaw | A route. |
| locale | Locale | A locale, optional. |

#### Returns

 A path of the current route.

#### Remarks

If locale is not specified, uses current locale.

### localeRoute

Returns localized route for passed in `route` parameters.

**Signature:**
```typescript
export declare function localeRoute(this: RoutingProxy, route: RawLocation | RouteLocationRaw, locale?: Locale): Route | ReturnType<Router['resolve']> | undefined;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| this | RoutingProxy | A [RoutingProxy](#routingproxy) instance. |
| route | RawLocation &#124; RouteLocationRaw | A route. |
| locale | Locale | A locale, optional. |

#### Returns

 A route. if cannot resolve, `undefined` is returned.

#### Remarks

If `locale` is not specified, uses current locale.

### localizeRoutes

Localize routes

**Signature:**
```typescript
export declare function localizeRoutes(routes: I18nRoute[], { defaultLocale, strategy, trailingSlash, routesNameSeparator, defaultLocaleRouteNameSuffix, includeUprefixedFallback, optionsResolver, localizeRoutesPrefixable, locales }?: Pick<I18nRoutingOptions, 'defaultLocale' | 'strategy' | 'locales' | 'routesNameSeparator' | 'trailingSlash' | 'defaultLocaleRouteNameSuffix' | 'localizeRoutesPrefixable'> & {
    includeUprefixedFallback?: boolean;
    optionsResolver?: RouteOptionsResolver;
}): I18nRoute[];
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| routes | I18nRoute[] | Some routes |
| { defaultLocale, strategy, trailingSlash, routesNameSeparator, defaultLocaleRouteNameSuffix, includeUprefixedFallback, optionsResolver, localizeRoutesPrefixable, locales } | Pick&lt;I18nRoutingOptions, 'defaultLocale' &#124; 'strategy' &#124; 'locales' &#124; 'routesNameSeparator' &#124; 'trailingSlash' &#124; 'defaultLocaleRouteNameSuffix' &#124; 'localizeRoutesPrefixable'&gt; &amp; {
    includeUprefixedFallback?: boolean;
    optionsResolver?: RouteOptionsResolver;
} |  |

#### Returns

 Localized routes

### proxyVueInstance

### registerGlobalOptions

Register global i18n routing option registory

**Signature:**
```typescript
export declare function registerGlobalOptions<Context = unknown>(router: Router | VueRouter, options: I18nRoutingGlobalOptions<Context>): void;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| router | Router &#124; VueRouter | A router instance, about router type |
| options | I18nRoutingGlobalOptions&lt;Context&gt; | A global options, about options type, see [I18nRoutingGlobalOptions](#i18nroutingglobaloptions) |

### resolveBaseUrl

Resolve base url

**Signature:**
```typescript
export declare function resolveBaseUrl<Context = unknown>(baseUrl: string | BaseUrlResolveHandler<Context>, context: Context): string;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| baseUrl | string &#124; BaseUrlResolveHandler&lt;Context&gt; | A base url to resolve on SEO and domain. if you want to resolve with dynamically, you can spacify [BaseUrlResolveHandler](#baseurlresolvehandler) |
| context | Context | A context to resolve base url, if you want to resolve base url with [BaseUrlResolveHandler](#baseurlresolvehandler) |

#### Returns

 A resolved base url

### resolveRoute

### setLocale

Set a locale

**Signature:**
```typescript
export declare function setLocale(i18n: I18n | Composer, locale: Locale): void;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| i18n | I18n &#124; Composer | An [I18n](https://vue-i18n.intlify.dev/api/general.html#i18n) instance or a [Composer](https://vue-i18n.intlify.dev/api/composition.html#composer) instance |
| locale | Locale | A target locale |

### switchLocalePath

Returns path of the current route for specified locale.

**Signature:**
```typescript
export declare function switchLocalePath(this: RoutingProxy, locale: Locale): string;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| this | RoutingProxy | A [RoutingProxy](#routingproxy) instance. |
| locale | Locale | A locale |

#### Returns

 A path of the current route.

### useLocaleHead

The `useLocaleHead` composable returns localized head properties for locale-related aspects.

**Signature:**
```typescript
export declare function useLocaleHead({ addDirAttribute, addSeoAttributes, identifierAttribute, strategy, defaultLocale, route, router, i18n }?: Pick<I18nCommonRoutingOptionsWithComposable, 'strategy' | 'defaultLocale' | 'route' | 'router' | 'i18n'> & I18nHeadOptions): Ref<I18nHeadMetaInfo>;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| { addDirAttribute, addSeoAttributes, identifierAttribute, strategy, defaultLocale, route, router, i18n } | Pick&lt;I18nCommonRoutingOptionsWithComposable, 'strategy' &#124; 'defaultLocale' &#124; 'route' &#124; 'router' &#124; 'i18n'&gt; &amp; I18nHeadOptions |  |

#### Returns

 The localized [head properties](#i18nheadmetainfo) with Vue `ref`.

### useLocaleLocation

The `useLocaleLocation` composable returns function that resolve the locale location.

**Signature:**
```typescript
export declare function useLocaleLocation({ router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash }?: I18nCommonRoutingOptionsWithComposable): LocaleLocationFunction;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash } | I18nCommonRoutingOptionsWithComposable |  |

#### Returns

 A [LocaleLocationFunction](#localelocationfunction).

#### Remarks

The function returned by `useLocaleLocation` is the wrapper function with the same signature as [localeLocation](#localelocation).

### useLocalePath

The `useLocalePath` composable returns function that resolve the locale path.

**Signature:**
```typescript
export declare function useLocalePath({ router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash }?: I18nCommonRoutingOptionsWithComposable): LocalePathFunction;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash } | I18nCommonRoutingOptionsWithComposable |  |

#### Returns

 A [LocalePathFunction](#localepathfunction).

#### Remarks

The function returned by `useLocalePath` is the wrapper function with the same signature as [localePath](#localepath).

### useLocaleRoute

The `useLocaleRoute` composable returns function that resolve the locale route.

**Signature:**
```typescript
export declare function useLocaleRoute({ router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash }?: I18nCommonRoutingOptionsWithComposable): LocaleRouteFunction;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash } | I18nCommonRoutingOptionsWithComposable |  |

#### Returns

 A [LocaleRouteFunction](#localeroutefunction).

#### Remarks

The function returned by `useLocaleRoute` is the wrapper function with the same signature as [localeRoute](#localeroute).

### useRouteBaseName

The `useRouteBaseName` composable returns the route base name.

**Signature:**
```typescript
export declare function useRouteBaseName(givenRoute?: Route | RouteLocationNormalizedLoaded, { router, routesNameSeparator }?: I18nCommonRoutingOptionsWithComposable): string | undefined;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| givenRoute | Route &#124; RouteLocationNormalizedLoaded | A route object. if not provided, the route is returned with `useRoute` will be used internally |
| { router, routesNameSeparator } | I18nCommonRoutingOptionsWithComposable |  |

#### Returns

 The route base name, if route name is not defined, return `null`.

#### Remarks

The `useRouteBaseName` is the composable function which is [getRouteBaseName](#getroutebasename) wrapper.

### useSwitchLocalePath

The `useSwitchLocalePath` composable returns function that resolve the locale location.

**Signature:**
```typescript
export declare function useSwitchLocalePath({ router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash }?: I18nCommonRoutingOptionsWithComposable): SwitchLocalePathFunction;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| { router, route, i18n, defaultLocale, defaultLocaleRouteNameSuffix, routesNameSeparator, strategy, trailingSlash } | I18nCommonRoutingOptionsWithComposable |  |

#### Returns

 A [SwitchLocalePathFunction](#switchlocalepathfunction).

#### Remarks

The function returned by `useSwitchLocalePath` is the wrapper function with the same signature as [switchLocalePath](#switchlocalepath).


## Variable

### DefaultLocalizeRoutesPrefixable

### DefaultPrefixable

### DefaultSwitchLocalePathIntercepter

### VERSION

Vue I18n Routing Version

**Signature:**
```typescript
VERSION: string
```

#### Remarks

Semver format. Same format as the package.json `version` field.


