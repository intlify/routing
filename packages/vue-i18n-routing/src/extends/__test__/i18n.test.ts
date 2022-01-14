import { extendI18n } from '../i18n'
import { createI18n as createI18nNext } from 'vue-i18n'

import type { Composer } from 'vue-i18n'

describe('extendI18n', () => {
  describe('vue-i18n v9', () => {
    it('should be extended', () => {
      const i18n = createI18nNext({ legacy: false, locale: 'en' })
      extendI18n(i18n, {
        locales: [{ code: 'en' }, { code: 'ja' }]
      })

      assert.deepEqual((i18n.global as unknown as Composer).locales.value, [{ code: 'en' }, { code: 'ja' }])
    })
  })
})
