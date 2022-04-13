/* eslint-disable @typescript-eslint/no-explicit-any */

import { vi, describe, it, assert, expect } from 'vitest'
import { createI18n } from '@intlify/vue-i18n-bridge'
import { ref, nextTick } from 'vue-demi'
import { extendI18n } from '../i18n'
import { useSetup } from '../../../scripts/vitest'

import type { Ref } from 'vue-demi'
import type { Composer, VueI18n } from 'vue-i18n'

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

  describe('extend hooks', () => {
    describe('composition mode', () => {
      it('should be extended', async () => {
        const exportedGlobalSpy = vi.fn()
        exportedGlobalSpy.mockImplementation(() => 'foo')

        const i18n = createI18n({ legacy: false, globalInjection: true, locale: 'en' })
        extendI18n(i18n, {
          locales: [{ code: 'en' }, { code: 'ja' }],
          localeCodes: ['en', 'ja'],
          hooks: {
            onExtendComposer(composer: Composer) {
              const foo = ref('foo')
              ;(composer as any).foo = foo
            },
            onExtendExportedGlobal() {
              return {
                foo: {
                  get: exportedGlobalSpy
                }
              }
            }
          }
        })
        const vm = useSetup(() => {}, [i18n])
        const $i18n = (vm as any).$i18n

        const composer = i18n.global as unknown as Composer
        const foo = (composer as any).foo as Ref<string>
        assert.equal(foo.value, 'foo')
        assert.equal($i18n.foo, 'foo')
        expect(exportedGlobalSpy).toHaveBeenCalledOnce()

        foo.value = 'bar'
        await nextTick()
        assert.equal(foo.value, 'bar')

        vm.unmount()
      })
    })

    describe('legacy mode', () => {
      it('should be extended', async () => {
        const exportedGlobalSpy = vi.fn()
        exportedGlobalSpy.mockImplementation(() => 'foo')
        const vueI18nSpy = vi.fn()
        vueI18nSpy.mockImplementation(() => 'vue-i18n-foo')

        const i18n = createI18n({ locale: 'en' })
        extendI18n(i18n, {
          locales: [{ code: 'en' }, { code: 'ja' }],
          localeCodes: ['en', 'ja'],
          hooks: {
            onExtendComposer(composer: Composer) {
              const foo = ref('foo')
              ;(composer as any).foo = foo
            },
            onExtendExportedGlobal() {
              return {
                foo: {
                  get: exportedGlobalSpy
                }
              }
            },
            onExtendVueI18n() {
              return {
                foo: {
                  get: vueI18nSpy
                }
              }
            }
          }
        })
        const vm = useSetup(() => {}, [i18n])
        const $i18n = (vm as any).$i18n

        const vueI18n = i18n.global as unknown as VueI18n
        const foo = (vueI18n as any).foo as string
        assert.equal(foo, 'vue-i18n-foo')
        assert.equal($i18n.foo, 'vue-i18n-foo')
        expect(exportedGlobalSpy).not.toHaveBeenCalledOnce()
        expect(vueI18nSpy).toHaveBeenCalledTimes(2)

        vm.unmount()
      })
    })
  })
})

/* eslint-enable @typescript-eslint/no-explicit-any */
