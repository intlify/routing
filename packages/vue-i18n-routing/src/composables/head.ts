import { useI18n } from '@intlify/vue-i18n-bridge'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { ref, watchEffect, isVue3, onUnmounted } from 'vue-demi'

import { localeHead } from '../compatibles'
import { inBrowser, toRawRoute } from '../utils'

import type { I18nHeadOptions, I18nHeadMetaInfo } from '../compatibles'
import type { I18nCommonRoutingOptionsWithComposable } from '../utils'
import type {
  Router,
  VueRouter,
  RouteLocationNormalizedLoaded,
  RouteLocationNormalized,
  Route
} from '@intlify/vue-router-bridge'
import type { Ref } from 'vue-demi'

/**
 * Use localize head meta
 *
 * @param options - An options, see about details {@link I18nHeadOptions}, {@link ComposableOptions}, {@link I18nCommonRoutingOptions}
 *
 * @returns Genereated SEO head meta information
 */
export function useLocaleHead({
  addDirAttribute = false,
  addSeoAttributes = false,
  strategy = undefined,
  defaultLocale = undefined,
  route = useRoute(),
  router = useRouter(),
  i18n = useI18n()
}: Pick<I18nCommonRoutingOptionsWithComposable, 'strategy' | 'defaultLocale' | 'route' | 'router' | 'i18n'> &
  I18nHeadOptions = {}): Ref<I18nHeadMetaInfo> {
  type R = Router | VueRouter
  const _router = router as R

  const metaObject: Ref<I18nHeadMetaInfo> = ref({
    htmlAttrs: {},
    link: [],
    meta: []
  })

  function cleanMeta() {
    metaObject.value = {
      htmlAttrs: {},
      link: [],
      meta: []
    }
  }

  function updateMeta(_route: RouteLocationNormalizedLoaded | Route) {
    metaObject.value = Reflect.apply(
      localeHead,
      {
        router,
        route: _route,
        i18n,
        defaultLocale,
        strategy
      },
      [{ addDirAttribute, addSeoAttributes }]
    ) as I18nHeadMetaInfo
  }

  if (inBrowser) {
    if (isVue3) {
      const stop = watchEffect(() => {
        cleanMeta()
        updateMeta(toRawRoute(_router.currentRoute))
      })
      onUnmounted(() => stop())
    } else {
      /**
       * NOTE:
       * In vue 2 + `@vue/compoistion-api`, useRoute (`$route`) cannot be watched.
       * For this reason, use `afterEach` to work around it.
       */
      const handler = _router.afterEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (to: Route | RouteLocationNormalized, from: Route | RouteLocationNormalized) => {
          cleanMeta()
          updateMeta(to)
        }
      )
      onUnmounted(() => handler())
      updateMeta(route as Route)
    }
  } else {
    updateMeta(toRawRoute(_router.currentRoute))
  }

  return metaObject
}
