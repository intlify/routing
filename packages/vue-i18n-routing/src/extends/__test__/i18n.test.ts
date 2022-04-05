import { describe, it, assert } from 'vitest'
import { createI18n } from '@intlify/vue-i18n-bridge'
import { extendI18n } from '../i18n'
import { useSetup } from '../../../scripts/vitest'

import type { Composer } from 'vue-i18n'

describe('extendI18n', () => {
  describe('vue-i18n v9: composition mode', () => {
    it('should be extended', () => {
      const i18n = createI18n({ legacy: false, locale: 'en' })
      extendI18n(i18n, {
        locales: [{ code: 'en' }, { code: 'ja' }],
        localeCodes: ['en', 'ja']
      })

      useSetup(() => {}, [i18n])
      const composer = i18n.global as unknown as Composer
      assert.deepEqual(composer.locales!.value, [{ code: 'en' }, { code: 'ja' }])
      assert.deepEqual(composer.localeCodes!.value, ['en', 'ja'])
    })
  })
})
