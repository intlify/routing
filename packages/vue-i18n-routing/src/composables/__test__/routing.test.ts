import { computed } from 'vue-demi'
import { createMemoryHistory, useRoute, useRouter } from 'vue-router'
import { createI18n, useI18n } from 'vue-i18n'
import { createRouter } from '../../extends/router'
import { STRATEGIES } from '../../constants'
import { localePath, localeRoute, localeLocation, switchLocalePath } from '../routing'
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

describe('localeRoute', () => {
  it('should return route', async () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    const router = createRouter(i18n, {
      version: 4,
      locales: ['en', 'ja'],
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
      assert.include(localeRoute('/'), {
        fullPath: '/en',
        path: '/en',
        name: 'not-found___en',
        href: '/en'
      })
      assert.include(localeRoute('/about', 'ja'), {
        fullPath: '/ja/about',
        path: '/ja/about',
        name: 'about___ja',
        href: '/ja/about'
      })
      assert.include(localeRoute('/:pathMatch(.*)*', 'ja'), {
        fullPath: '/ja/:pathMatch(.*)*',
        path: '/ja/:pathMatch(.*)*',
        name: 'not-found___ja',
        href: '/ja/:pathMatch(.*)*'
      })
      // name
      assert.include(localeRoute('index', 'ja'), {
        fullPath: '/ja',
        path: '/ja',
        name: 'index___ja',
        href: '/ja'
      })
      assert.include(localeRoute('about'), {
        fullPath: '/en/about',
        path: '/en/about',
        name: 'about___en',
        href: '/en/about'
      })
      assert.include(localeRoute('not-found', 'ja'), {
        fullPath: '/ja',
        path: '/ja',
        name: 'not-found___ja',
        href: '/ja'
      })
      assert.include(localeRoute('not-found'), {
        fullPath: '/en',
        path: '/en',
        name: 'not-found___en',
        href: '/en'
      })
      // object
      assert.include(localeRoute({ name: 'about' }, 'ja'), {
        fullPath: '/ja/about',
        path: '/ja/about',
        name: 'about___ja',
        href: '/ja/about'
      })
    }, [i18n, router])
  })
})

describe('localeLocation', () => {
  it('should return route', async () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    const router = createRouter(i18n, {
      version: 4,
      locales: ['en', 'ja'],
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
      assert.include(localeLocation('/'), {
        fullPath: '/en',
        path: '/en',
        name: 'not-found___en',
        href: '/en'
      })
      assert.include(localeLocation('/about', 'ja'), {
        fullPath: '/ja/about',
        path: '/ja/about',
        name: 'about___ja',
        href: '/ja/about'
      })
      assert.include(localeLocation('/:pathMatch(.*)*', 'ja'), {
        fullPath: '/ja/:pathMatch(.*)*',
        path: '/ja/:pathMatch(.*)*',
        name: 'not-found___ja',
        href: '/ja/:pathMatch(.*)*'
      })
      // name
      assert.include(localeLocation('index', 'ja'), {
        fullPath: '/ja',
        path: '/ja',
        name: 'index___ja',
        href: '/ja'
      })
      assert.include(localeLocation('about'), {
        fullPath: '/en/about',
        path: '/en/about',
        name: 'about___en',
        href: '/en/about'
      })
      assert.include(localeLocation('not-found', 'ja'), {
        fullPath: '/ja',
        path: '/ja',
        name: 'not-found___ja',
        href: '/ja'
      })
      assert.include(localeLocation('not-found'), {
        fullPath: '/en',
        path: '/en',
        name: 'not-found___en',
        href: '/en'
      })
      // object
      assert.include(localeLocation({ name: 'about' }, 'ja'), {
        fullPath: '/ja/about',
        path: '/ja/about',
        name: 'about___ja',
        href: '/ja/about'
      })
    }, [i18n, router])
  })
})

describe('switchLocalePath', () => {
  it('should be worked', async () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    const router = createRouter(i18n, {
      version: 4,
      locales: ['en', 'ja', 'fr'],
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
      const change = (locale: string) => switchLocalePath(locale, { route, router, i18n })
      assert.equal(switchLocalePath('ja'), '/ja/about')
      assert.equal(switchLocalePath('en'), '/en/about')
      assert.equal(switchLocalePath('fr'), '/fr/about')
      return {
        switchLocalePath: change
      }
    }, [i18n, router])

    await router.push('/ja')
    assert.equal(vm.switchLocalePath('ja'), '/ja')
    assert.equal(vm.switchLocalePath('en'), '/en')
    assert.equal(vm.switchLocalePath('fr'), '/fr')
  })
})
