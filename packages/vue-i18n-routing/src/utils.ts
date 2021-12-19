import { isRef } from 'vue'
import { isString } from '@intlify/shared'

import type { Composer, I18nMode } from 'vue-i18n'
import type { LocaleObject } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/*#__PURE__*/ export function _isVue2(vueApp: any) {
  return vueApp.version && Number(vueApp.version.split('.')[0]) === 2
}
export function getNormalizedLocales(locales: string[] | LocaleObject[]): LocaleObject[] {
  locales = locales || []
  const normalized: LocaleObject[] = []
  for (const locale of locales) {
    if (isString(locale)) {
      normalized.push({ code: locale })
    } else {
      normalized.push(locale)
    }
  }
  return normalized
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isComposer(target: any, mode: I18nMode): target is Composer {
  return isRef(target.locale) && mode === 'composition'
}

// Language: typescript
export function adjustRoutePathForTrailingSlash(
  pagePath: string,
  trailingSlash: boolean,
  isChildWithRelativePath: boolean
) {
  return pagePath.replace(/\/+$/, '') + (trailingSlash ? '/' : '') || (isChildWithRelativePath ? '' : '/')
}
