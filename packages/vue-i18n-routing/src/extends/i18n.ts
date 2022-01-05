import { ref, computed } from 'vue-demi'
import { isComposer } from '../utils'

import type { I18n } from '@intlify/vue-i18n-bridge'
import type { VueI18nRoutingOptions, LocaleObject } from '../types'

type VueI18nExtendOptions = Pick<VueI18nRoutingOptions, 'localeCodes'>

export function extendI18n<TI18n extends I18n>(i18n: TI18n, { localeCodes = [] }: VueI18nExtendOptions = {}): void {
  if (!isComposer(i18n.global, i18n.mode)) {
    throw new Error('')
  }

  // TODO: release reactive resources with `effectSceope`

  const _localeCodes = ref<string[] | LocaleObject[]>(localeCodes)

  i18n.global.locales = computed(() => _localeCodes.value)

  console.log('... extends i18n done')
}
