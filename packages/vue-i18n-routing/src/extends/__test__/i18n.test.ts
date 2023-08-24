/* eslint-disable @typescript-eslint/no-explicit-any */

import { createI18n, useI18n } from '@intlify/vue-i18n-bridge'
import { vi, describe, it, assert, expect } from 'vitest'
import { ref, nextTick } from 'vue-demi'

import { useSetup } from '../../../scripts/vitest'
import { extendI18n } from '../i18n'

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

      const vm = useSetup(() => {}, [[i18n]])
      const composer = i18n.global as unknown as Composer
      assert.deepEqual(composer.locales.value, [{ code: 'en' }, { code: 'ja' }])
      assert.deepEqual(composer.localeCodes.value, ['en', 'ja'])

      vm.unmount()
    })
  })

  describe('vue-i18n v9: legacy mode', () => {
    it('should be extended', () => {
      const i18n = createI18n({ legacy: true, locale: 'en' })
      extendI18n(i18n, {
        locales: [{ code: 'en' }, { code: 'ja' }],
        localeCodes: ['en', 'ja']
      })

      const vm = useSetup(() => {}, [[i18n]])
      const vueI18n = i18n.global as unknown as VueI18n
      assert.deepEqual(vueI18n.locales, [{ code: 'en' }, { code: 'ja' }])
      assert.deepEqual(vueI18n.localeCodes, ['en', 'ja'])

      vm.unmount()
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
        const vm = useSetup(() => {}, [[i18n]])
        const $i18n = (vm as any).$i18n
        const composer = i18n.global as unknown as Composer

        // custom extending
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

        const i18n = createI18n({ legacy: true, locale: 'en' })
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
        const vm = useSetup(() => {}, [[i18n]])
        const $i18n = (vm as any).$i18n
        const vueI18n = i18n.global as unknown as VueI18n

        // custom extending
        const foo = (vueI18n as any).foo as string
        assert.equal(foo, 'vue-i18n-foo')
        assert.equal($i18n.foo, 'vue-i18n-foo')
        expect(exportedGlobalSpy).not.toHaveBeenCalledOnce()
        expect(vueI18nSpy).toHaveBeenCalledTimes(2)

        vm.unmount()
      })
    })
  })

  describe('__composerExtend include in plugin options', () => {
    test('should be extended', async () => {
      const extendFn = vi.fn()
      const disposeFn = vi.fn()

      const i18n = createI18n({ legacy: false, globalInjection: true, locale: 'en' })
      extendI18n(i18n, {
        locales: [{ code: 'en' }, { code: 'ja' }],
        localeCodes: ['en', 'ja'],
        hooks: {
          onExtendComposer(composer: Composer) {
            ;(composer as any).fn = extendFn
          },
          onExtendExportedGlobal(g) {
            return {
              fn: {
                get() {
                  return (g as any).fn
                }
              }
            }
          }
        }
      })
      const pluginOptions = {
        __composerExtend: (c: Composer) => {
          ;(c as any).fn = (i18n.global as any).fn
          return disposeFn
        }
      }
      const vm = useSetup(() => {
        const i18n = useI18n({
          useScope: 'local'
        })
        ;(i18n as any).fn()
        return {}
      }, [[i18n, pluginOptions]])
      const $i18n = (vm as any).$i18n
      const composer = i18n.global as any

      $i18n.fn()
      composer.fn()

      await nextTick()
      expect(extendFn).toHaveBeenCalledTimes(3)

      vm.unmount()
      expect(disposeFn).toBeCalledTimes(1)
    })
  })
})

/* eslint-enable @typescript-eslint/no-explicit-any */
