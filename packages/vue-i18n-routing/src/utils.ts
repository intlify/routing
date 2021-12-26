import { isRef } from 'vue'
import { isString } from '@intlify/shared'

import type { I18n, Composer, I18nMode, Locale } from 'vue-i18n'
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

function isI18nInstance(i18n: I18n | Composer): i18n is I18n {
  return 'global' in i18n && 'mode' in i18n
}

export function getLocale(i18n: I18n | Composer): Locale {
  // prettier-ignore
  return isI18nInstance(i18n)
    ? isComposer(i18n.global, i18n.mode)
      ? i18n.global.locale.value
      : i18n.global.locale
    : isRef(i18n.locale)
      ? i18n.locale.value
      : i18n.locale
}

export function setLocale(i18n: I18n | Composer, locale: Locale): void {
  // prettier-ignore
  if (isI18nInstance(i18n)) {
   if (isComposer(i18n.global, i18n.mode)) {
     i18n.global.locale.value = locale
   } else {
     i18n.global.locale = locale
   }
  } else if (isRef(i18n.locale)) {
    i18n.locale.value = locale
  }
}

// Language: typescript
export function adjustRoutePathForTrailingSlash(
  pagePath: string,
  trailingSlash: boolean,
  isChildWithRelativePath: boolean
) {
  return pagePath.replace(/\/+$/, '') + (trailingSlash ? '/' : '') || (isChildWithRelativePath ? '' : '/')
}
