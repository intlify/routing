import { createI18n, useI18n } from '@intlify/vue-i18n-bridge'
import { createMemoryHistory, useRoute, useRouter } from '@intlify/vue-router-bridge'
import { describe, it, assert } from 'vitest'

import { useSetup } from '../../../scripts/vitest'
import { STRATEGIES } from '../../constants'
import { createRouter } from '../../extends/router'
import { useRouteBaseName, useLocalePath, useLocaleRoute, useLocaleLocation, useSwitchLocalePath } from '../routing'

import type { Route } from '@intlify/vue-router-bridge'

describe('useRouteBaseName', () => {
  describe('route object', () => {
    it('should return base name', async () => {
      const i18n = createI18n({ legacy: false, locale: 'en' })
      const router = createRouter(i18n, {
        version: 4,
        locales: ['en', 'ja'],
        routes: [
          {
            path: '/',
            component: {
              template: '<div>Home</div>'
            },
            name: 'home'
          }
        ],
        history: createMemoryHistory()
      })
      await router.push('/en')
      useSetup(() => {
        const route = useRoute()
        const name = useRouteBaseName(route)
        assert.equal(name, 'home')
      }, [router, i18n])
    })
  })

  describe('route object is not included name', () => {
    it('should return null', async () => {
      const i18n = createI18n({ legacy: false, locale: 'en' })
      const router = createRouter(i18n, {
        version: 4,
        locales: ['en', 'ja'],
        routes: [
          {
            path: '/',
            component: {
              template: '<div>Home</div>'
            },
            name: 'home'
          }
        ],
        history: createMemoryHistory()
      })
      await router.push('/en')
      useSetup(() => {
        const name = useRouteBaseName({} as Route)
        assert.equal(name, null)
      }, [router, i18n])
    })
  })

  describe('route name separator option', () => {
    it('should resolve with route name separator', async () => {
      const i18n = createI18n({ legacy: false, locale: 'en' })
      const router = createRouter(i18n, {
        version: 4,
        locales: ['en', 'ja'],
        routesNameSeparator: '---',
        routes: [
          {
            path: '/',
            component: {
              template: '<div>Home</div>'
            },
            name: 'home'
          }
        ],
        history: createMemoryHistory()
      })
      await router.push('/ja')
      useSetup(() => {
        const route = useRoute()
        const name = useRouteBaseName(route, { routesNameSeparator: '---' })
        assert.equal(name, 'home')
      }, [router, i18n])
    })
  })
})

describe('useLocalePath', () => {
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
          const localePath = useLocalePath()
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
        }, [router, i18n])
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
        const localePath = useLocalePath()
        // path
        assert.equal(localePath('/'), '/')
        assert.equal(localePath('/about', 'ja'), '/about')
        assert.equal(localePath('/:pathMatch(.*)*', 'ja'), '/:pathMatch(.*)*')
        // name
        assert.equal(localePath('index', 'ja'), '/')
        assert.equal(localePath('about'), '/about')
        assert.equal(localePath('not-found', 'ja'), '/')
        assert.equal(localePath('not-found'), '/')
        // object
        assert.equal(localePath({ name: 'about' }, 'ja'), '/about')
      }, [router, i18n])
    })
  })
})

describe('useLocaleRoute', () => {
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
      const localeRoute = useLocaleRoute()
      // path
      assert.include(localeRoute('/'), {
        fullPath: '/en',
        path: '/en',
        // name: 'not-found___en',
        name: 'index___en',
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
    }, [router, i18n])
  })
})

describe('useLocaleLocation', () => {
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
      const localeLocation = useLocaleLocation()
      // path
      assert.include(localeLocation('/'), {
        fullPath: '/en',
        path: '/en',
        // name: 'not-found___en',
        name: 'index___en',
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
    }, [router, i18n])
  })
})

describe('useSwitchLocalePath', () => {
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
      const switchLocalePath = useSwitchLocalePath({ route, router, i18n })
      const change = (locale: string) => switchLocalePath(locale)
      assert.equal(switchLocalePath('ja'), '/ja/about')
      assert.equal(switchLocalePath('en'), '/en/about')
      assert.equal(switchLocalePath('fr'), '/fr/about')
      return {
        switchLocalePath: change
      }
    }, [router, i18n])

    await router.push('/ja')
    assert.equal(vm.switchLocalePath('ja'), '/ja')
    assert.equal(vm.switchLocalePath('en'), '/en')
    assert.equal(vm.switchLocalePath('fr'), '/fr')
  })
})
