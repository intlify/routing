import { isBoolean, isObject } from '@intlify/shared'
import { ref, computed, isVue3, effectScope, isVue2 } from 'vue-demi'
import { resolveBaseUrl, isVueI18n, getComposer } from '../utils'
import { DEFAULT_BASE_URL } from '../constants'
import {
  localePath,
  localeRoute,
  localeLocation,
  switchLocalePath,
  getRouteBaseName,
  resolveRoute,
  localeHead
} from '../compatibles'

import type { App, EffectScope } from 'vue-demi'
import type { I18n, Composer, VueI18n, ExportedGlobalComposer } from '@intlify/vue-i18n-bridge'
import type { I18nRoutingOptions, LocaleObject } from '../types'

type VueI18nExtendOptions = Pick<I18nRoutingOptions, 'baseUrl'> & {
  locales?: string[] | LocaleObject[]
  localeCodes?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Vue = any

// eslint-disable-next-line @typescript-eslint/ban-types
function proxyVueInstance(target: Function): Function {
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
}

export function extendI18n<TI18n extends I18n>(
  i18n: TI18n,
  { locales = [], localeCodes = [], baseUrl = DEFAULT_BASE_URL }: VueI18nExtendOptions = {}
) {
  // TODO: release reactive resources with `effectSceope`

  const orgInstall = i18n.install
  i18n.install = (vue: Vue, ...options: unknown[]) => {
    Reflect.apply(orgInstall, i18n, [vue, ...options])

    const composer = getComposer(i18n)

    // extend global
    extendComposer(composer, { locales, localeCodes, baseUrl })
    if (isVueI18n(i18n.global)) {
      extendVueI18n(i18n.global)
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
      extendExportedGlobal(exported, composer)
    }

    const pluginOptions = isPluginOptions(options[0]) ? options[0] : { inject: true }
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
  }
}

function extendComposer(composer: Composer, options: Required<VueI18nExtendOptions>) {
  const { locales, localeCodes, baseUrl } = options

  const _locales = ref<string[] | LocaleObject[]>(locales)
  const _localeCodes = ref<string[]>(localeCodes)

  composer.locales = computed(() => _locales.value)
  composer.localeCodes = computed(() => _localeCodes.value)
  composer.__baseUrl = resolveBaseUrl(baseUrl, {})
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extendExportedGlobal(exported: any, global: Composer) {
  Object.defineProperty(exported, 'locales', {
    get() {
      return global.locales.value
    }
  })
  Object.defineProperty(exported, 'localeCodes', {
    get() {
      return global.localeCodes.value
    }
  })
  Object.defineProperty(exported, '__baseUrl', {
    get() {
      return global.__baseUrl
    }
  })
}

function extendVueI18n(vueI18n: VueI18n): void {
  const composer = getComposer(vueI18n)
  Object.defineProperty(vueI18n, 'locales', {
    get() {
      return composer.locales.value
    }
  })
  Object.defineProperty(vueI18n, 'localeCodes', {
    get() {
      return composer.localeCodes.value
    }
  })
  Object.defineProperty(vueI18n, '__baseUrl', {
    get() {
      return composer.__baseUrl
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPluginOptions(options: any): options is VueI18nRoutingPluginOptions {
  return isObject(options) && 'inject' in options && isBoolean(options.inject)
}
