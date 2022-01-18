# vue-i18n-routing API References

## Table Of Contents

- [TypeAlias](#typealias)
  - [BaseUrlResolveHandler](#baseurlresolvehandler)
  - [ComposableOptions](#composableoptions)
  - [Directions](#directions)
  - [I18nRoutingOptions](#i18nroutingoptions)
  - [MetaAttrs](#metaattrs)
  - [Strategies](#strategies)
  - [VueI18nRoute](#vuei18nroute)
  - [VueI18nRoutingOptions](#vuei18nroutingoptions)
- [Function](#function)
  - [createRouter](#createrouter)
  - [getRouteBaseName](#getroutebasename)
  - [localeLocation](#localelocation)
  - [localePath](#localepath)
  - [localeRoute](#localeroute)
  - [localizeRoutes](#localizeroutes)
  - [switchLocalePath](#switchlocalepath)
  - [useI18nHead](#usei18nhead)
- [Interface](#interface)
  - [I18nHeadMetaInfo](#i18nheadmetainfo)
  - [I18nHeadOptions](#i18nheadoptions)
  - [LocaleObject](#localeobject)
  - [Route](#route)
  - [RouteLegacy](#routelegacy)
  - [SeoAttributesOptions](#seoattributesoptions)
- [Variable](#variable)
  - [VERSION](#version)

## TypeAlias

### BaseUrlResolveHandler

### ComposableOptions

### Directions

Direction

**Signature:**
```typescript
export declare type Directions = 'ltr' | 'rtl' | 'auto';
```

### I18nRoutingOptions

Options for vue-i18n-routing common

**Signature:**
```typescript
export declare type I18nRoutingOptions = Pick<VueI18nRoutingOptions, 'defaultLocale' | 'strategy' | 'defaultLocaleRouteNameSuffix' | 'trailingSlash' | 'locales' | 'routesNameSeparator'> & ComposableOptions;
```

### MetaAttrs

### Strategies

Routing strategy

**Signature:**
```typescript
export declare type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];
```

### VueI18nRoute

Route config for vue-i18n-routing

**Signature:**
```typescript
export declare type VueI18nRoute = Route & RouteLegacy & {
    redirect?: string;
};
```

### VueI18nRoutingOptions

Options to initialize a VueRouter instance

**Signature:**
```typescript
export declare type VueI18nRoutingOptions<BaseUrl extends BaseUrlResolveHandler = BaseUrlResolveHandler> = {
    version?: 3 | 4;
    defaultLocale?: string;
    locales?: string[] | LocaleObject[];
    strategy?: Strategies;
    trailingSlash?: boolean;
    routesNameSeparator?: string;
    defaultLocaleRouteNameSuffix?: string;
    defaultDetection?: Directions;
    baseUrl?: string | BaseUrl;
} & RouterOptions;
```

#### Remarks

This options is extended from Vue Router `RouterOptioins`, so you can specify those options.


## Function

### createRouter

Create a Vue Router instance

**Signature:**
```typescript
export declare function createRouter<Options extends VueI18nRoutingOptions = VueI18nRoutingOptions>(i18n: I18n, options?: Options): Options['version'] extends 4 ? Router : VueRouter;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| i18n | I18n | A Vue I18n instance, see [Vue I18n API docs](https://vue-i18n.intlify.dev/api/general.html#i18n) |
| options | Options | An options, see [VueI18nRoutingOptions](#vuei18nroutingoptions) |

#### Returns

 A Vue Router instance

 You can create a vue router instance to be used by the Vue app.

The routes of the created router instance are handled with i18n routing.

At the Vue 2 will return a [Vue Router v3 instance](https://router.vuejs.org/api/#router-construction-options), and at the Vue 3 will return a [Vue Router v4 instance](https://next.router.vuejs.org/api/#createrouter).

### getRouteBaseName

Get route base name

**Signature:**
```typescript
export declare function getRouteBaseName(givenRoute?: Route | RouteLocationNormalizedLoaded, routesNameSeparator?: string): string | null;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| givenRoute | Route &#124; RouteLocationNormalizedLoaded | A route object, if not provided, the route is returned with `useRoute` will be used |
| routesNameSeparator | string | A route name separator, if not provided, default separator is `routesNameSeparator` option of [VueI18nRoutingOptions](#vuei18nroutingoptions) will be used |

#### Returns

 The route base name, if route name is not defined, return null

### localeLocation

Resolve locale location

**Signature:**
```typescript
export declare function localeLocation(route: RawLocation | RouteLocationRaw, locale?: Locale, // TODO: locale should be more type inference (completion)
options?: I18nRoutingOptions): Location | RouteLocation | undefined;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| route | RawLocation &#124; RouteLocationRaw | A route location. The path or name of the route or an object for more complex routes |
| locale | Locale | A locale code, if not specified, uses the current locale |
| options | I18nRoutingOptions | An options, see about details [I18nRoutingOptions](#i18nroutingoptions) |

#### Returns

 Returns the location object for a given route, the location object is resolved by vue-router rather than just a full route path.

### localePath

Resolve locale path

**Signature:**
```typescript
export declare function localePath(route: RawLocation | RouteLocationRaw, locale?: Locale, // TODO: locale should be more type inference (completion)
options?: I18nRoutingOptions): string;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| route | RawLocation &#124; RouteLocationRaw | A route location. The path or name of the route or an object for more complex routes |
| locale | Locale | A locale code, if not specified, uses the current locale |
| options | I18nRoutingOptions | An options, see about details [I18nRoutingOptions](#i18nroutingoptions) |

#### Returns

 Returns the localized URL for a given route

### localeRoute

Resolve locale route

**Signature:**
```typescript
export declare function localeRoute(route: RawLocation | RouteLocationRaw, locale?: Locale, // TODO: locale should be more type inference (completion)
options?: I18nRoutingOptions): Route | ReturnType<Router['resolve']> | undefined;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| route | RawLocation &#124; RouteLocationRaw | A route location. The path or name of the route or an object for more complex routes |
| locale | Locale | A locale code, if not specified, uses the current locale |
| options | I18nRoutingOptions | An options, see about details [I18nRoutingOptions](#i18nroutingoptions) |

#### Returns

 Returns the route object for a given route, the route object is resolved by vue-router rather than just a full route path.

### localizeRoutes

### switchLocalePath

Switch locale path

**Signature:**
```typescript
export declare function switchLocalePath(locale: Locale, { route, i18n }?: I18nRoutingOptions): string;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A locale code, if not specified, uses the current locale |
| { route, i18n } | I18nRoutingOptions |  |

#### Returns

 Returns a link to the current route in another language

### useI18nHead

Generate SEO head meta information

**Signature:**
```typescript
export declare function useI18nHead({ addDirAttribute, addSeoAttributes, strategy, defaultLocale, route, router, i18n }?: Pick<I18nRoutingOptions, 'strategy' | 'defaultLocale'> & ComposableOptions & I18nHeadOptions): I18nHeadMetaInfo;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| { addDirAttribute, addSeoAttributes, strategy, defaultLocale, route, router, i18n } | Pick&lt;I18nRoutingOptions, 'strategy' &#124; 'defaultLocale'&gt; &amp; ComposableOptions &amp; I18nHeadOptions |  |

#### Returns

 Genereated SEO head meta information


## Interface

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

Options for [useI18nHead](#usei18nhead) function

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


### Route

Route config for vue-router v4

**Signature:**
```typescript
export interface Route 
```


#### Properties

##### children

##### file

##### name

##### path


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



## Variable

### VERSION

Vue I18n Routing Version

**Signature:**
```typescript
VERSION: string
```

#### Remarks

Semver format. Same format as the package.json `version` field.


