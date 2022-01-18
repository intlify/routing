import { createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createRouter } from '../../extends/router'
import { STRATEGIES } from '../../constants'
import { localePath } from '../routing2'
import { useSetup } from '../../../scripts/vitest'

describe('localePath', () => {
  ;[STRATEGIES.PREFIX_EXCEPT_DEFAULT, STRATEGIES.PREFIX_AND_DEFAULT, STRATEGIES.PREFIX].forEach(strategy => {
    describe(`route strategy: ${strategy}`, () => {
      it('should be worked', async () => {
        const i18n = createI18n({ legacy: false, locale: 'en' })
        const router = createRouter(i18n, {
          version: 4,
          locales: ['en', 'ja'],
          strategy,
          routes: [
            { path: '/', name: 'index', component: { template: '<div>index</div>' } },
            { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
            { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div>Not Found</div>' } }
          ],
          history: createMemoryHistory()
        })
        await router.push('/en')

        useSetup(() => {
          // path
          assert.equal(localePath('/'), '/en')
          assert.equal(localePath('/about', 'ja'), '/ja/about')
          assert.equal(localePath('/:pathMatch(.*)*', 'ja'), '/ja/:pathMatch(.*)*')
          // name
          assert.equal(localePath('index', 'ja'), '/ja')
          assert.equal(localePath('about'), '/en/about')
          assert.equal(localePath('not-found', 'ja'), '/ja')
          assert.equal(localePath('not-found'), '/en')
          // object
          assert.equal(localePath({ name: 'about' }, 'ja'), '/ja/about')
        }, [i18n, router])
      })
    })
  })

  describe(`route strategy: ${STRATEGIES.NO_PREFIX}`, () => {
    it('should be worked', async () => {
      const i18n = createI18n({ legacy: false, locale: 'en' })
      const router = createRouter(i18n, {
        version: 4,
        locales: ['en', 'ja'],
        strategy: 'no_prefix',
        routes: [
          { path: '/', name: 'index', component: { template: '<div>index</div>' } },
          { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
          { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div>Not Found</div>' } }
        ],
        history: createMemoryHistory()
      })
      await router.push('/')

      useSetup(() => {
        // path
        assert.equal(localePath('/'), '/')
        assert.equal(localePath('/about', 'ja'), '/about')
        assert.equal(localePath('/:pathMatch(.*)*', 'ja'), '/:pathMatch(.*)*')
        // name
        assert.equal(localePath('index', 'ja'), '/')
        assert.equal(localePath('about'), '/about')
        assert.equal(localePath('not-found', 'ja'), '') // TOOD: check `@nuxtjs/i18n` behavior
        assert.equal(localePath('not-found'), '') // TOOD: check `@nuxtjs/i18n` behavior
        // object
        assert.equal(localePath({ name: 'about' }, 'ja'), '/about')
      }, [i18n, router])
    })
  })
})
