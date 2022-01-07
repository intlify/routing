# vue-i18n-routing API References

## Table Of Contents

- [Function](#function)
  - [createRouter](#createrouter)
  - [localizeRoutes](#localizeroutes)
  - [useI18nRouting](#usei18nrouting)
- [TypeAlias](#typealias)
  - [Directions](#directions)
  - [I18nRoutingOptions](#i18nroutingoptions)
  - [Strategies](#strategies)
  - [VueI18nRoute](#vuei18nroute)
  - [VueI18nRoutingOptions](#vuei18nroutingoptions)
- [Interface](#interface)
  - [I18nRouting](#i18nrouting)
  - [LocaleObject](#localeobject)
  - [Route](#route)
  - [RouteLegacy](#routelegacy)
- [Variable](#variable)
  - [VERSION](#version)

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

### localizeRoutes

### useI18nRouting


## TypeAlias

### Directions

Direction

**Signature:**
```typescript
export declare type Directions = 'ltr' | 'rtl' | 'auto';
```

### I18nRoutingOptions

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
export declare type VueI18nRoutingOptions = {
    version?: 3 | 4;
    defaultLocale?: string;
    locales?: string[] | LocaleObject[];
    strategy?: Strategies;
    trailingSlash?: boolean;
    routesNameSeparator?: string;
    defaultLocaleRouteNameSuffix?: string;
} & RouterOptions;
```

#### Remarks

This options is extended from Vue Router `RouterOptioins`, so you can specify those options.


## Interface

### I18nRouting


#### Methods

##### getRouteBaseName

##### localeLocation

##### localePath

##### localeRoute

##### switchLocalePath


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



## Variable

### VERSION

Vue I18n Routing Version

**Signature:**
```typescript
VERSION = ""
```

#### Remarks

Semver format. Same format as the package.json `version` field.


