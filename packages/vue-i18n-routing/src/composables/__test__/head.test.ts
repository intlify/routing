import { createI18n, useI18n } from '@intlify/vue-i18n-bridge'
import { createMemoryHistory, useRoute, useRouter } from '@intlify/vue-router-bridge'
import { describe, it, expect, assert } from 'vitest'

import { useSetup } from '../../../scripts/vitest'
import { createRouter } from '../../extends/router'
import { useLocaleHead } from '../head'

describe('useLocaleHead', () => {
  describe('basic', () => {
    it('should be worked', async () => {
      const i18n = createI18n({ legacy: false, locale: 'en' })
      const router = createRouter(i18n, {
        version: 4,
        locales: [
          {
            code: 'en',
            iso: 'en-US',
            dir: 'ltr'
          },
          {
            code: 'ja',
            iso: 'ja-JP'
          }
        ],
        baseUrl: 'http://localhost:8080',
        routes: [
          { path: '/', name: 'index', component: { template: '<div>index</div>' } },
          { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
          { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div>Not Found</div>' } }
        ],
        history: createMemoryHistory()
      })
      await router.push('/en/about')

      const vm = useSetup(() => {
        const route = useRoute()
        const router = useRouter()
        const i18n = useI18n()
        const head = useLocaleHead({ addDirAttribute: true, addSeoAttributes: true, route, router, i18n })
        expect(head.value).toMatchSnapshot(i18n.locale.value)
        assert.equal(head.value.htmlAttrs!.lang, 'en-US')
        return {
          i18n,
          head
        }
      }, [[router], [i18n]])

      await router.push('/ja')
      expect(vm.head).toMatchSnapshot(vm.i18n.locale.value)
      assert.equal(vm.head.htmlAttrs!.lang, 'ja-JP')
    })
  })

  describe('identifierAttribute option', () => {
    it('should be worked', async () => {
      const i18n = createI18n({ legacy: false, locale: 'en' })
      const router = createRouter(i18n, {
        version: 4,
        locales: [
          {
            code: 'en',
            iso: 'en-US',
            dir: 'ltr'
          },
          {
            code: 'ja',
            iso: 'ja-JP'
          }
        ],
        baseUrl: 'http://localhost:8080',
        routes: [
          { path: '/', name: 'index', component: { template: '<div>index</div>' } },
          { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
          { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div>Not Found</div>' } }
        ],
        history: createMemoryHistory()
      })
      await router.push('/en/about')

      const vm = useSetup(() => {
        const route = useRoute()
        const router = useRouter()
        const i18n = useI18n()
        const head = useLocaleHead({ addSeoAttributes: true, identifierAttribute: 'key', route, router, i18n })
        return {
          i18n,
          head
        }
      }, [[router], [i18n]])

      await router.push('/ja')
      for (const m of vm.head.meta || []) {
        expect(m).toHaveProperty('key')
      }
    })
  })
})
