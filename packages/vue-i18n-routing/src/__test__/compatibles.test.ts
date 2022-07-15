/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, assert, expect } from 'vitest'
import { createMemoryHistory } from '@intlify/vue-router-bridge'
import { createI18n, I18n } from '@intlify/vue-i18n-bridge'
import { createRouter } from '../extends/router'
import { STRATEGIES } from '../constants'
import { useSetup } from '../../scripts/vitest'

describe('getRouteBaseName', () => {
  describe('vue-i18n composition mode', () => {
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
      const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:
      const name = vm.getRouteBaseName()
      assert.equal(name, 'home')
    })
  })

  describe('vue-i18n legacy mode', () => {
    it('should return base name', async () => {
      const i18n = createI18n({ locale: 'en' })
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
      const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:
      const name = vm.getRouteBaseName()
      assert.equal(name, 'home')
    })
  })
})

describe('localePath', () => {
  function testLocalePath(legacy = false) {
    ;[STRATEGIES.PREFIX_EXCEPT_DEFAULT, STRATEGIES.PREFIX_AND_DEFAULT, STRATEGIES.PREFIX].forEach(strategy => {
      describe(`route strategy: ${strategy}`, () => {
        it('should be worked', async () => {
          const i18n = createI18n({ legacy, locale: 'en' })
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
          const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:

          // path
          assert.equal(vm.localePath('/'), '/en')
          assert.equal(vm.localePath('/about', 'ja'), '/ja/about')
          assert.equal(vm.localePath('/:pathMatch(.*)*', 'ja'), '/ja/:pathMatch(.*)*')
          // name
          assert.equal(vm.localePath('index', 'ja'), '/ja')
          assert.equal(vm.localePath('about'), '/en/about')
          assert.equal(vm.localePath('not-found', 'ja'), '/ja')
          assert.equal(vm.localePath('not-found'), '/en')
          // object
          assert.equal(vm.localePath({ name: 'about' }, 'ja'), '/ja/about')
        })

        it('should be worked', async () => {
          const i18n = createI18n({ legacy, locale: 'en' })
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
          const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:

          // path
          assert.equal(vm.localePath('/'), '/en')
          assert.equal(vm.localePath('/about', 'ja'), '/ja/about')
          assert.equal(vm.localePath('/:pathMatch(.*)*', 'ja'), '/ja/:pathMatch(.*)*')
          // name
          assert.equal(vm.localePath('index', 'ja'), '/ja')
          assert.equal(vm.localePath('about'), '/en/about')
          assert.equal(vm.localePath('not-found', 'ja'), '/ja')
          assert.equal(vm.localePath('not-found'), '/en')
          // object
          assert.equal(vm.localePath({ name: 'about' }, 'ja'), '/ja/about')
        })
      })
    })

    describe(`route strategy: ${STRATEGIES.NO_PREFIX}`, () => {
      it('should be worked', async () => {
        const i18n = createI18n({ legacy, locale: 'en' })
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
        const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:

        // path
        assert.equal(vm.localePath('/'), '/')
        assert.equal(vm.localePath('/about', 'ja'), '/about')
        assert.equal(vm.localePath('/:pathMatch(.*)*', 'ja'), '/:pathMatch(.*)*')
        // name
        assert.equal(vm.localePath('index', 'ja'), '/')
        assert.equal(vm.localePath('about'), '/about')
        assert.equal(vm.localePath('not-found', 'ja'), '/')
        assert.equal(vm.localePath('not-found'), '/')
        // object
        assert.equal(vm.localePath({ name: 'about' }, 'ja'), '/about')
      })
    })
  }

  describe('composition mode', () => {
    testLocalePath()
  })

  describe('legacy mode', () => {
    testLocalePath(false)
  })
})

describe('localeRoute', () => {
  function testLocaleRoute(i18n: I18n) {
    it('should return route', async () => {
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
      const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:

      // path
      assert.include(vm.localeRoute('/'), {
        fullPath: '/en',
        path: '/en',
        // name: 'not-found___en',
        name: 'index___en',
        href: '/en'
      })
      assert.include(vm.localeRoute('/about', 'ja'), {
        fullPath: '/ja/about',
        path: '/ja/about',
        name: 'about___ja',
        href: '/ja/about'
      })
      assert.include(vm.localeRoute('/:pathMatch(.*)*', 'ja'), {
        fullPath: '/ja/:pathMatch(.*)*',
        path: '/ja/:pathMatch(.*)*',
        name: 'not-found___ja',
        href: '/ja/:pathMatch(.*)*'
      })
      // name
      assert.include(vm.localeRoute('index', 'ja'), {
        fullPath: '/ja',
        path: '/ja',
        name: 'index___ja',
        href: '/ja'
      })
      assert.include(vm.localeRoute('about'), {
        fullPath: '/en/about',
        path: '/en/about',
        name: 'about___en',
        href: '/en/about'
      })
      assert.include(vm.localeRoute('not-found', 'ja'), {
        fullPath: '/ja',
        path: '/ja',
        name: 'not-found___ja',
        href: '/ja'
      })
      assert.include(vm.localeRoute('not-found'), {
        fullPath: '/en',
        path: '/en',
        name: 'not-found___en',
        href: '/en'
      })
      // object
      assert.include(vm.localeRoute({ name: 'about' }, 'ja'), {
        fullPath: '/ja/about',
        path: '/ja/about',
        name: 'about___ja',
        href: '/ja/about'
      })
    })
  }

  describe('composition mode', () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    testLocaleRoute(i18n)
  })

  describe('legacy mode', () => {
    const i18n = createI18n({ locale: 'en' })
    testLocaleRoute(i18n)
  })
})

describe('localeLocation', () => {
  function testLocaleLocation(i18n: I18n) {
    it('should return route', async () => {
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
      const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:

      // path
      assert.include(vm.localeLocation('/'), {
        fullPath: '/en',
        path: '/en',
        // name: 'not-found___en',
        name: 'index___en',
        href: '/en'
      })
      assert.include(vm.localeLocation('/about', 'ja'), {
        fullPath: '/ja/about',
        path: '/ja/about',
        name: 'about___ja',
        href: '/ja/about'
      })
      assert.include(vm.localeLocation('/:pathMatch(.*)*', 'ja'), {
        fullPath: '/ja/:pathMatch(.*)*',
        path: '/ja/:pathMatch(.*)*',
        name: 'not-found___ja',
        href: '/ja/:pathMatch(.*)*'
      })
      // name
      assert.include(vm.localeLocation('index', 'ja'), {
        fullPath: '/ja',
        path: '/ja',
        name: 'index___ja',
        href: '/ja'
      })
      assert.include(vm.localeLocation('about'), {
        fullPath: '/en/about',
        path: '/en/about',
        name: 'about___en',
        href: '/en/about'
      })
      assert.include(vm.localeLocation('not-found', 'ja'), {
        fullPath: '/ja',
        path: '/ja',
        name: 'not-found___ja',
        href: '/ja'
      })
      assert.include(vm.localeLocation('not-found'), {
        fullPath: '/en',
        path: '/en',
        name: 'not-found___en',
        href: '/en'
      })
      // object
      assert.include(vm.localeLocation({ name: 'about' }, 'ja'), {
        fullPath: '/ja/about',
        path: '/ja/about',
        name: 'about___ja',
        href: '/ja/about'
      })
    })
  }

  describe('composition mode', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', globalInjection: true })
    testLocaleLocation(i18n)
  })

  describe('legacy mode', () => {
    const i18n = createI18n({ locale: 'en' })
    testLocaleLocation(i18n)
  })
})

describe('switchLocalePath', () => {
  function testSwtichLocalePath(i18n: I18n) {
    it('should be worked', async () => {
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
      const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:
      await router.push('/ja')

      assert.equal(vm.switchLocalePath('ja'), '/ja')
      assert.equal(vm.switchLocalePath('en'), '/en')
      assert.equal(vm.switchLocalePath('fr'), '/fr')
    })
  }

  describe('composition mode', () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    testSwtichLocalePath(i18n)
  })

  describe('legacy mode', () => {
    const i18n = createI18n({ locale: 'en' })
    testSwtichLocalePath(i18n)
  })
})

describe('localeHead', () => {
  function testLocaleHead(i18n: I18n) {
    it('should be worked', async () => {
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
      const vm = useSetup(() => {}, [router, i18n]) as any // FIXME:

      let head = vm.localeHead({ addDirAttribute: true, addSeoAttributes: true })
      expect(head).toMatchSnapshot('en')
      assert.equal(head.htmlAttrs.lang, 'en-US')

      await router.push('/ja')
      head = vm.localeHead({ addDirAttribute: true, addSeoAttributes: true })
      expect(head).toMatchSnapshot('ja')
      assert.equal(head.htmlAttrs.lang, 'ja-JP')
    })
  }

  describe('composition mode', () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    testLocaleHead(i18n)
  })

  describe('legacy mode', () => {
    const i18n = createI18n({ locale: 'en' })
    testLocaleHead(i18n)
  })
})

/* eslint-enable @typescript-eslint/no-explicit-any */
