import { createMemoryHistory, useRoute, useRouter } from 'vue-router'
import { createI18n, useI18n } from 'vue-i18n'
import { createRouter } from '../../extends/router'
import { useI18nHead } from '../head'
import { useSetup } from '../../../scripts/vitest'

describe('useI18nHead', () => {
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
      const head = useI18nHead({ addDirAttribute: true, addSeoAttributes: true, route, router, i18n })
      expect(head.value).toMatchSnapshot(i18n.locale.value)
      assert.equal(head.value.htmlAttrs!.lang, 'en-US')
      return {
        i18n,
        head
      }
    }, [i18n, router])

    await router.push('/ja')
    expect(vm.head).toMatchSnapshot(vm.i18n.locale.value)
    assert.equal(vm.head.htmlAttrs!.lang, 'ja-JP')
  })
})
