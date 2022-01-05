# vue-i18n-routing API References

## Table Of Contents

- [TypeAlias](#typealias)
  - [Directions](#directions)
  - [I18nRoutingOptions](#i18nroutingoptions)
  - [Strategies](#strategies)
  - [VueI18nRoute](#vuei18nroute)
- [Function](#function)
  - [extendRouting](#extendrouting)
  - [localizeRoutes](#localizeroutes)
  - [useI18nRouting](#usei18nrouting)
- [Interface](#interface)
  - [I18nRouting](#i18nrouting)
  - [LocaleObject](#localeobject)
  - [Route](#route)
  - [RouteLegacy](#routelegacy)
  - [VueI18nRoutingOptions](#vuei18nroutingoptions)
- [Variable](#variable)
  - [VERSION](#version)

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


## Function

### extendRouting

### localizeRoutes

### useI18nRouting


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


### VueI18nRoutingOptions

Vue I18n routing options

**Signature:**
```typescript
export interface VueI18nRoutingOptions 
```


#### Properties

##### defaultLocale

##### defaultLocaleRouteNameSuffix

##### i18n

Vue I18n instance

**Signature:**
```typescript
i18n?: I18n;
```

##### localeCodes

##### router

Vue Router instance

**Signature:**
```typescript
router?: VueRouter | Router;
```

##### routesNameSeparator

##### strategy

##### trailingSlash



## Variable

### VERSION

Vue I18n Routing Version

**Signature:**
```typescript
VERSION = ""
```

#### Remarks

Semver format. Same format as the package.json `version` field.


