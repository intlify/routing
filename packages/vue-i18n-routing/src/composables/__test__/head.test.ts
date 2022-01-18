import { createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
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

    useSetup(() => {
      expect(useI18nHead({ addDirAttribute: true, addSeoAttributes: true })).toMatchSnapshot()
    }, [i18n, router])
  })
})
