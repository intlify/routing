/* eslint-disable @typescript-eslint/no-explicit-any */

import { makeSymbol } from '@intlify/shared'
import { createI18n } from '@intlify/vue-i18n-bridge'
import { createMemoryHistory } from '@intlify/vue-router-bridge'
import { describe, it, assert, expect } from 'vitest'

import { useSetup } from '../../scripts/vitest'
import { STRATEGIES } from '../constants'
import { createRouter } from '../extends/router'

import type { I18n } from '@intlify/vue-i18n-bridge'

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
      const vm = useSetup(() => {}, [[router], [i18n]]) as any // FIXME:
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
      const vm = useSetup(() => {}, [[router], [i18n]]) as any // FIXME:
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
          const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
          const vm = useSetup(() => {}, [[router], [i18n]]) as any // FIXME:

          // path
          assert.equal(vm.localePath('/'), '/en')
          assert.equal(vm.localePath('/about', 'ja'), '/ja/about')
          // name
          assert.equal(vm.localePath('index', 'ja'), '/ja')
          assert.equal(vm.localePath('about'), '/en/about')
          assert.equal(vm.localePath('not-found', 'ja'), '/ja')
          assert.equal(vm.localePath('not-found'), '/en')
          // object
          assert.equal(vm.localePath({ name: 'about' }, 'ja'), '/ja/about')
          // omit name & path
          assert.equal(vm.localePath({ state: { foo: 1 } }), '/en')
          await router.push('/ja')
          assert.equal(vm.localePath({ state: { foo: 1 } }), '/ja')

          // preserve query parameters
          assert.equal(vm.localePath({ query: { foo: 1 } }), '/ja?foo=1')
          assert.equal(vm.localePath({ path: '/', query: { foo: 1 } }), '/ja?foo=1')
          assert.equal(vm.localePath({ name: 'about', query: { foo: 1 } }), '/ja/about?foo=1')
          assert.equal(vm.localePath({ path: '/about', query: { foo: 1 } }), '/ja/about?foo=1')
          assert.equal(vm.localePath('/?foo=1'), '/ja?foo=1')
          assert.equal(vm.localePath('/about?foo=1'), '/ja/about?foo=1')
          assert.equal(vm.localePath('/about?foo=1&test=2'), '/ja/about?foo=1&test=2')

          assert.equal(vm.localePath({ path: '/about', hash: '#foo=bar' }), '/ja/about#foo=bar')
          // no define path
          assert.equal(vm.localePath('/vue-i18n'), '/ja/vue-i18n')
          // no define name
          assert.equal(vm.localePath('vue-i18n'), '')

          // for vue-router deprecation
          // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
          expect(warn).not.toHaveBeenCalledWith('Discarded invalid param(s)')
        })
      })
    })

    describe(`route strategy: ${STRATEGIES.NO_PREFIX}`, () => {
      it('should be worked', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
        const vm = useSetup(() => {}, [[router], [i18n]]) as any // FIXME:

        // path
        assert.equal(vm.localePath('/'), '/')
        assert.equal(vm.localePath('/about', 'ja'), '/about')
        // name
        assert.equal(vm.localePath('index', 'ja'), '/')
        assert.equal(vm.localePath('about'), '/about')
        assert.equal(vm.localePath('not-found', 'ja'), '/')
        assert.equal(vm.localePath('not-found'), '/')
        // object
        assert.equal(vm.localePath({ name: 'about' }, 'ja'), '/about')
        // omit name & path
        assert.equal(vm.localePath({ state: { foo: 1 } }), '/')
        await router.push('/ja')
        assert.equal(vm.localePath({ state: { foo: 1 } }), '/')
        // no define path
        assert.equal(vm.localePath('/vue-i18n'), '/vue-i18n')
        // no define
        assert.equal(vm.localePath('vue-i18n'), '')

        // for vue-router deprecation
        // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
        expect(warn).not.toHaveBeenCalledWith('Discarded invalid param(s)')
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
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
      const vm = useSetup(() => {}, [[router], [i18n]]) as any // FIXME:

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
      // no define path
      assert.include(vm.localeRoute('/vue-i18n', 'ja'), {
        fullPath: '/ja/vue-i18n',
        path: '/ja/vue-i18n',
        name: 'not-found___ja',
        href: '/ja/vue-i18n'
      })
      // no define name
      assert.isUndefined(vm.localeRoute('vue-i18n'))

      // for vue-router deprecation
      // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
      expect(warn).not.toHaveBeenCalledWith('Discarded invalid param(s)')
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
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
      const vm = useSetup(() => {}, [[router], [i18n]]) as any // FIXME:

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
      // no define path
      assert.include(vm.localeLocation('/vue-i18n', 'ja'), {
        fullPath: '/ja/vue-i18n',
        path: '/ja/vue-i18n',
        name: 'not-found___ja',
        href: '/ja/vue-i18n'
      })
      // no define name
      assert.isUndefined(vm.localeLocation('vue-i18n'))

      // for vue-router deprecation
      // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
      expect(warn).not.toHaveBeenCalledWith('Discarded invalid param(s)')
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
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const key = makeSymbol('i18n')
      const router = createRouter(i18n, {
        version: 4,
        locales: ['en', 'ja', 'fr'],
        dynamicRouteParamsKey: key,
        routes: [
          { path: '/', name: 'index', component: { template: '<div>index</div>' } },
          { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
          {
            path: '/category/:id',
            name: 'category',
            meta: {
              [key]: {
                en: { id: 'english' },
                ja: { id: 'japanese' },
                fr: { id: 'franch' }
              }
            },
            component: { template: '<div>Category</div>' }
          },
          {
            path: '/count/:id',
            name: 'count',
            component: { template: '<div>Category</div>' }
          },
          {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            meta: {
              [key]: {
                en: { pathMatch: 'not-found-english' },
                ja: { pathMatch: 'not-found-japanese' },
                fr: { pathMatch: 'not-found-franch' }
              }
            },
            component: { template: '<div>Not Found</div>' }
          }
        ],
        history: createMemoryHistory()
      })
      await router.push('/en/about')
      const vm = useSetup(() => {}, [[router], [i18n]]) as any // FIXME:
      await router.push('/ja')

      assert.equal(vm.switchLocalePath('ja'), '/ja')
      assert.equal(vm.switchLocalePath('en'), '/en')
      assert.equal(vm.switchLocalePath('fr'), '/fr')
      assert.equal(vm.switchLocalePath('vue-i18n'), '')

      await router.push('/ja/about')

      assert.equal(vm.switchLocalePath('ja'), '/ja/about')
      assert.equal(vm.switchLocalePath('en'), '/en/about')
      assert.equal(vm.switchLocalePath('fr'), '/fr/about')
      assert.equal(vm.switchLocalePath('vue-i18n'), '')

      await router.push('/ja/about?foo=1&test=2')
      assert.equal(vm.switchLocalePath('ja'), '/ja/about?foo=1&test=2')
      assert.equal(vm.switchLocalePath('fr'), '/fr/about?foo=1&test=2')
      assert.equal(vm.switchLocalePath('en'), '/en/about?foo=1&test=2')

      await router.push('/ja/about?foo=bär&four=四&foo=bar')
      assert.equal(vm.switchLocalePath('ja'), '/ja/about?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B')
      assert.equal(vm.switchLocalePath('fr'), '/fr/about?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B')
      assert.equal(vm.switchLocalePath('en'), '/en/about?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B')

      await router.push('/ja/about?foo=bär&four=四')
      assert.equal(vm.switchLocalePath('ja'), '/ja/about?foo=b%C3%A4r&four=%E5%9B%9B')
      assert.equal(vm.switchLocalePath('fr'), '/fr/about?foo=b%C3%A4r&four=%E5%9B%9B')
      assert.equal(vm.switchLocalePath('en'), '/en/about?foo=b%C3%A4r&four=%E5%9B%9B')

      await router.push('/ja/about#foo=bar')
      assert.equal(vm.switchLocalePath('ja'), '/ja/about#foo=bar')
      assert.equal(vm.switchLocalePath('fr'), '/fr/about#foo=bar')
      assert.equal(vm.switchLocalePath('en'), '/en/about#foo=bar')

      await router.push('/ja/about?foo=é')
      assert.equal(vm.switchLocalePath('ja'), '/ja/about?foo=%C3%A9')

      await router.push('/ja/category/1')
      assert.equal(vm.switchLocalePath('ja'), '/ja/category/japanese')
      assert.equal(vm.switchLocalePath('en'), '/en/category/english')
      assert.equal(vm.switchLocalePath('fr'), '/fr/category/franch')

      await router.push('/ja/count/三')
      assert.equal(vm.switchLocalePath('ja'), '/ja/count/%E4%B8%89')
      assert.equal(vm.switchLocalePath('en'), '/en/count/%E4%B8%89')
      assert.equal(vm.switchLocalePath('fr'), '/fr/count/%E4%B8%89')

      await router.push('/ja/count/三?foo=bär&four=四&foo=bar')
      assert.equal(vm.switchLocalePath('ja'), '/ja/count/%E4%B8%89?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B')
      assert.equal(vm.switchLocalePath('fr'), '/fr/count/%E4%B8%89?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B')
      assert.equal(vm.switchLocalePath('en'), '/en/count/%E4%B8%89?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B')

      await router.push('/ja/foo')
      assert.equal(vm.switchLocalePath('ja'), '/ja/not-found-japanese')
      assert.equal(vm.switchLocalePath('en'), '/en/not-found-english')
      assert.equal(vm.switchLocalePath('fr'), '/fr/not-found-franch')

      // for vue-router deprecation
      // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
      expect(warn).not.toHaveBeenCalledWith('Discarded invalid param(s)')
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
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
      const vm = useSetup(() => {}, [[router], [i18n]]) as any // FIXME:

      let head = vm.localeHead({ addDirAttribute: true, addSeoAttributes: true })
      expect(head).toMatchSnapshot('en')
      assert.equal(head.htmlAttrs.lang, 'en-US')

      await router.push('/ja')
      head = vm.localeHead({ addDirAttribute: true, addSeoAttributes: true })
      expect(head).toMatchSnapshot('ja')
      assert.equal(head.htmlAttrs.lang, 'ja-JP')

      // for vue-router deprecation
      // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
      expect(warn).not.toHaveBeenCalledWith('Discarded invalid param(s)')
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
