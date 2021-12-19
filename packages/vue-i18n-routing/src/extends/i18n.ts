import { isVue2, ref, computed } from 'vue-demi'
import { isComposer } from '../utils'

import type { VueI18nRoutingOptions, LocaleObject } from '../types'
import type { I18n } from 'vue-i18n'

type VueI18nExtendOptions = Pick<VueI18nRoutingOptions, 'localeCodes'>

export function extendI18n<TI18n extends I18n>(i18n: TI18n, { localeCodes = [] }: VueI18nExtendOptions = {}): void {
  // TODO: release reactive resources with `effectSceope`
  if (!isComposer(i18n.global, i18n.mode)) {
    throw new Error('')
  }

  const _localeCodes = ref<string[] | LocaleObject[]>(localeCodes)

  i18n.global.locales = computed(() => _localeCodes.value)
  console.log('... extends i18n done')
}
