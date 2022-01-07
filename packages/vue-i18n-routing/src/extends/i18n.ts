import { ref, computed } from 'vue-demi'
import { isComposer } from '../utils'

import type { I18n } from '@intlify/vue-i18n-bridge'
import type { VueI18nRoutingOptions, LocaleObject } from '../types'

type VueI18nExtendOptions = Pick<VueI18nRoutingOptions, 'locales'>

export function extendI18n<TI18n extends I18n>(i18n: TI18n, { locales = [] }: VueI18nExtendOptions = {}): void {
  if (!isComposer(i18n.global, i18n.mode)) {
    throw new Error('')
  }

  // TODO: release reactive resources with `effectSceope`

  const _locales = ref<string[] | LocaleObject[]>(locales)

  i18n.global.locales = computed(() => _locales.value)

  console.log('... extends i18n done')
}
