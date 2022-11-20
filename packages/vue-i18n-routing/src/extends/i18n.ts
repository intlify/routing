import { isBoolean, isObject } from '@intlify/shared'
import { ref, computed, watch, isVue3, effectScope, isVue2 } from 'vue-demi'

import {
  localePath,
  localeRoute,
  localeLocation,
  switchLocalePath,
  getRouteBaseName,
  resolveRoute,
  localeHead
} from '../compatibles'
import { DEFAULT_BASE_URL } from '../constants'
import { resolveBaseUrl, isVueI18n, getComposer, inBrowser } from '../utils'

import type { I18nRoutingOptions, LocaleObject } from '../types'
import type { I18n, Composer, VueI18n } from '@intlify/vue-i18n-bridge'
import type { App } from 'vue-demi'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Vue = any

// eslint-disable-next-line @typescript-eslint/ban-types
export function proxyVueInstance(target: Function): Function {
  // `this` is the Vue instance
  return function (this: Vue) {
    return Reflect.apply(
      target,
      {
        getRouteBaseName: this.getRouteBaseName,
        localePath: this.localePath,
        localeRoute: this.localeRoute,
        localeLocation: this.localeLocation,
        resolveRoute: this.resolveRoute,
        switchLocalePath: this.switchLocalePath,
        localeHead: this.localeHead,
        i18n: this.$i18n,
        route: this.$route,
        router: this.$router
      },
      // eslint-disable-next-line prefer-rest-params
      arguments
    )
  }
}

/**
 * An options of Vue I18n Routing Plugin
 */
export interface VueI18nRoutingPluginOptions {
  /**
   * Whether to inject some option APIs style methods into Vue instance
   *
   * @defaultValue `true`
   */
  inject?: boolean
  /**
   * @internal
   */
  __composerExtend?: (composer: Composer) => void
  /**
   * @internal
   */
  __vueI18nExtend?: (vueI18n: VueI18n) => void
}

export interface ExtendProperyDescripters {
  [key: string]: Pick<PropertyDescriptor, 'get'>
}
export type ExtendComposerHook = (compser: Composer) => void
export type ExtendVueI18nHook = (composer: Composer) => ExtendProperyDescripters
export type ExtendExportedGlobalHook = (global: Composer) => ExtendProperyDescripters

export interface ExtendHooks {
  onExtendComposer?: ExtendComposerHook
  onExtendExportedGlobal?: ExtendExportedGlobalHook
  onExtendVueI18n?: ExtendVueI18nHook
}

export type VueI18nExtendOptions<Context = unknown> = Pick<I18nRoutingOptions<Context>, 'baseUrl'> & {
  locales?: string[] | LocaleObject[]
  localeCodes?: string[]
  context?: Context
  hooks?: ExtendHooks
}

export function extendI18n<Context = unknown, TI18n extends I18n = I18n>(
  i18n: TI18n,
  {
    locales = [],
    localeCodes = [],
    baseUrl = DEFAULT_BASE_URL,
    hooks = {},
    context = {} as Context
  }: VueI18nExtendOptions<Context> = {}
) {
  const scope = effectScope()

  const orgInstall = i18n.install
  i18n.install = (vue: Vue, ...options: unknown[]) => {
    const pluginOptions = isPluginOptions(options[0]) ? options[0] : { inject: true }
    if (pluginOptions.inject == null) {
      pluginOptions.inject = true
    }
    pluginOptions.__composerExtend = (c: Composer) => {
      const g = getComposer(i18n)
      c.locales = computed(() => g.locales.value)
      c.localeCodes = computed(() => g.localeCodes.value)
      c.baseUrl = computed(() => g.baseUrl.value)
    }
    if (isVueI18n(i18n.global)) {
      pluginOptions.__vueI18nExtend = (vueI18n: VueI18n) => {
        extendVueI18n(vueI18n, hooks.onExtendVueI18n)
      }
    }

    Reflect.apply(orgInstall, i18n, [vue, ...options])

    const composer = getComposer(i18n)

    // extend global
    scope.run(() => extendComposer(composer, { locales, localeCodes, baseUrl, hooks, context }))
    if (isVueI18n(i18n.global)) {
      extendVueI18n(i18n.global, hooks.onExtendVueI18n)
    }

    // extend vue component instance for Vue 3
    const app = vue as App
    // prettier-ignore
    const exported = i18n.mode === 'composition'
      ? isVue3
        ? app.config.globalProperties.$i18n
        : i18n
      : isVue2
        ? i18n
        : null
    if (exported) {
      extendExportedGlobal(exported, composer, hooks.onExtendExportedGlobal)
    }

    if (pluginOptions.inject) {
      // extend vue component instance
      vue.mixin({
        methods: {
          resolveRoute: proxyVueInstance(resolveRoute),
          localePath: proxyVueInstance(localePath),
          localeRoute: proxyVueInstance(localeRoute),
          localeLocation: proxyVueInstance(localeLocation),
          switchLocalePath: proxyVueInstance(switchLocalePath),
          getRouteBaseName: proxyVueInstance(getRouteBaseName),
          localeHead: proxyVueInstance(localeHead)
        }
      })
    }

    // release scope on unmounting
    if (app.unmount) {
      const unmountApp = app.unmount
      app.unmount = () => {
        scope.stop()
        unmountApp()
      }
    }
  }

  return scope
}

function extendComposer<Context = unknown>(composer: Composer, options: VueI18nExtendOptions<Context>) {
  const { locales, localeCodes, baseUrl, context } = options

  const _locales = ref<string[] | LocaleObject[]>(locales!)
  const _localeCodes = ref<string[]>(localeCodes!)
  const _baseUrl = ref<string>('')

  composer.locales = computed(() => _locales.value)
  composer.localeCodes = computed(() => _localeCodes.value)
  composer.baseUrl = computed(() => _baseUrl.value)

  if (inBrowser) {
    watch(
      composer.locale,
      () => {
        _baseUrl.value = resolveBaseUrl(baseUrl!, context!)
      },
      { immediate: true }
    )
  } else {
    _baseUrl.value = resolveBaseUrl(baseUrl!, context!)
  }

  if (options.hooks && options.hooks.onExtendComposer) {
    options.hooks.onExtendComposer(composer)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extendExportedGlobal(exported: any, g: Composer, hook?: ExtendExportedGlobalHook) {
  const properties: ExtendProperyDescripters[] = [
    {
      locales: {
        get() {
          return g.locales.value
        }
      },
      localeCodes: {
        get() {
          return g.localeCodes.value
        }
      },
      baseUrl: {
        get() {
          return g.baseUrl.value
        }
      }
    }
  ]
  hook && properties.push(hook(g))
  for (const property of properties) {
    for (const [key, descriptor] of Object.entries(property)) {
      Object.defineProperty(exported, key, descriptor)
    }
  }
}

function extendVueI18n(vueI18n: VueI18n, hook?: ExtendVueI18nHook): void {
  const composer = getComposer(vueI18n)
  const properties: ExtendProperyDescripters[] = [
    {
      locales: {
        get() {
          return composer.locales.value
        }
      },
      localeCodes: {
        get() {
          return composer.localeCodes.value
        }
      },
      baseUrl: {
        get() {
          return composer.baseUrl.value
        }
      }
    }
  ]
  hook && properties.push(hook(composer))
  for (const property of properties) {
    for (const [key, descriptor] of Object.entries(property)) {
      Object.defineProperty(vueI18n, key, descriptor)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPluginOptions(options: any): options is VueI18nRoutingPluginOptions {
  return isObject(options) && 'inject' in options && isBoolean(options.inject)
}
