import { ref, computed } from 'vue-demi'
import { isComposer, resolveBaseUrl } from '../utils'
import { DEFAULT_BASE_URL } from '../constants'

import type { I18n } from '@intlify/vue-i18n-bridge'
import type { VueI18nRoutingOptions, LocaleObject } from '../types'

type VueI18nExtendOptions = Pick<VueI18nRoutingOptions, 'baseUrl'> & {
  locales?: string[] | LocaleObject[]
  localeCodes?: string[]
}

export function extendI18n<TI18n extends I18n>(
  i18n: TI18n,
  { locales = [], localeCodes = [], baseUrl = DEFAULT_BASE_URL }: VueI18nExtendOptions = {}
): void {
  if (!isComposer(i18n.global, i18n.mode)) {
    throw new Error('TODO:')
  }

  // TODO: release reactive resources with `effectSceope`

  const _locales = ref<string[] | LocaleObject[]>(locales)
  const _localeCodes = ref<string[]>(localeCodes)

  i18n.global.locales = computed(() => _locales.value)
  i18n.global.localeCodes = computed(() => _localeCodes.value)
  i18n.global.__baseUrl = resolveBaseUrl(baseUrl, {})
}
