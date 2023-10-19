import { describe, it, assert, test } from 'vitest'

import { resolvedRouteToObject } from '../compatibles/utils'
import { adjustRoutePathForTrailingSlash, getLocaleRouteName, findBrowserLocale } from '../utils'

import type { BrowserLocale } from '../utils'

describe('adjustRouteDefinitionForTrailingSlash', function () {
  describe('pagePath: /foo/bar', function () {
    describe('trailingSlash: false, isChildWithRelativePath: true', function () {
      it('should be trailed with slash: /foo/bar/', function () {
        assert.equal(adjustRoutePathForTrailingSlash('/foo/bar', true, true), '/foo/bar/')
      })
    })

    describe('trailingSlash: false, isChildWithRelativePath: true', function () {
      it('should not be trailed with slash: /foo/bar/', function () {
        assert.equal(adjustRoutePathForTrailingSlash('/foo/bar', false, true), '/foo/bar')
      })
    })

    describe('trailingSlash: false, isChildWithRelativePath: false', function () {
      it('should be trailed with slash: /foo/bar/', function () {
        assert.equal(adjustRoutePathForTrailingSlash('/foo/bar', true, false), '/foo/bar/')
      })
    })

    describe('trailingSlash: false, isChildWithRelativePath: false', function () {
      it('should not be trailed with slash: /foo/bar/', function () {
        assert.equal(adjustRoutePathForTrailingSlash('/foo/bar', false, false), '/foo/bar')
      })
    })
  })

  describe('pagePath: /', function () {
    describe('trailingSlash: false, isChildWithRelativePath: true', function () {
      it('should not be trailed with slash: empty', function () {
        assert.equal(adjustRoutePathForTrailingSlash('/', false, true), '')
      })
    })
  })

  describe('pagePath: empty', function () {
    describe('trailingSlash: true, isChildWithRelativePath: true', function () {
      it('should not be trailed with slash: /', function () {
        assert.equal(adjustRoutePathForTrailingSlash('', true, true), '/')
      })
    })
  })
})

describe('getLocaleRouteName', () => {
  describe('strategy: prefix_and_default', () => {
    it('should be `route1___en___default`', () => {
      assert.equal(
        getLocaleRouteName('route1', 'en', {
          defaultLocale: 'en',
          strategy: 'prefix_and_default',
          routesNameSeparator: '___',
          defaultLocaleRouteNameSuffix: 'default'
        }),
        'route1___en___default'
      )
    })
  })

  describe('strategy: prefix_except_default', () => {
    it('should be `route1___en`', () => {
      assert.equal(
        getLocaleRouteName('route1', 'en', {
          defaultLocale: 'en',
          strategy: 'prefix_except_default',
          routesNameSeparator: '___',
          defaultLocaleRouteNameSuffix: 'default'
        }),
        'route1___en'
      )
    })
  })

  describe('strategy: no_prefix', () => {
    it('should be `route1`', () => {
      assert.equal(
        getLocaleRouteName('route1', 'en', {
          defaultLocale: 'en',
          strategy: 'no_prefix',
          routesNameSeparator: '___',
          defaultLocaleRouteNameSuffix: 'default'
        }),
        'route1'
      )
    })
  })

  describe('irregular', () => {
    describe('route name is null', () => {
      it('should be ` (null)___en___default`', () => {
        assert.equal(
          getLocaleRouteName(null, 'en', {
            defaultLocale: 'en',
            strategy: 'prefix_and_default',
            routesNameSeparator: '___',
            defaultLocaleRouteNameSuffix: 'default'
          }),
          '(null)___en___default'
        )
      })
    })
  })
})

describe('findBrowserLocale', () => {
  test('matches highest-ranked full locale', () => {
    const locales = [{ code: 'en' }, { code: 'en-US' }]
    const browserLocales = ['en-US', 'en']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'en-US')
  })

  test('matches highest-ranked short locale', () => {
    const locales = [{ code: 'en' }, { code: 'en-US' }]
    const browserLocales = ['en', 'en-US']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'en')
  })

  test('matches highest-ranked short locale (only short defined)', () => {
    const locales = [{ code: 'en' }]
    const browserLocales = ['en-US', 'en']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'en')
  })

  test('matches highest-ranked short locale', () => {
    const locales = [{ code: 'en' }, { code: 'fr' }]
    const browserLocales = ['en-US', 'en-GB']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'en')
  })

  test('does not match any locale', () => {
    const locales = [{ code: 'pl' }, { code: 'fr' }]
    const browserLocales = ['en-US', 'en']

    assert.ok(findBrowserLocale(locales, browserLocales) === '')
  })

  test('matches full locale with mixed short and full, full having highest rank', () => {
    const locales = [{ code: 'en-US' }, { code: 'en-GB' }, { code: 'en' }]
    const browserLocales = ['en-GB', 'en-US', 'en']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'en-GB')
  })

  test('matches short locale with mixed short and full, short having highest rank', () => {
    const locales = [{ code: 'en-US' }, { code: 'en-GB' }, { code: 'en' }]
    const browserLocales = ['en', 'en-GB', 'en-US']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'en')
  })

  test('matches short locale case-insensitively', () => {
    const locales = [{ code: 'EN' }, { code: 'en-GB' }]
    const browserLocales = ['en', 'en-GB', 'en-US']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'EN')
  })

  test('matches long locale case-insensitively', () => {
    const locales = [{ code: 'en-gb' }, { code: 'en-US' }]
    const browserLocales = ['en-GB', 'en-US']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'en-gb')
  })

  test('matches ISO locale code', () => {
    const locales = [
      { code: 'cn', iso: 'zh-CN' },
      { code: 'en', iso: 'en-US' }
    ]
    const browserLocales = ['zh', 'zh-CN']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'cn')
  })

  test('matches full ISO code', () => {
    const locales = [
      { code: 'us', iso: 'en-US' },
      { code: 'gb', iso: 'en-GB' }
    ]
    const browserLocales = ['en-GB', 'en']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'gb')
  })

  test('matches locale when only languages match', () => {
    const locales = [{ code: 'en-GB' }, { code: 'en-US' }]
    const browserLocales = ['en-IN', 'en']

    assert.ok(findBrowserLocale(locales, browserLocales) === 'en-GB')
  })

  it('options', () => {
    const locale = findBrowserLocale([{ code: 'en' }, { code: 'ja' }], ['ja-JP', 'en-US'], {
      // custom matcher
      matcher(locales, browserLocales) {
        const matchedLocales = [] as BrowserLocale[]
        for (const [index, browserCode] of browserLocales.entries()) {
          const languageCode = browserCode.split('-')[0].toLowerCase()
          const matchedLocale = locales.find(l => l.iso.split('-')[0].toLowerCase() === languageCode)
          if (matchedLocale) {
            matchedLocales.push({ code: matchedLocale.code, score: 1 * index })
            break
          }
        }
        return matchedLocales
      },
      // custom comparer
      comparer: (a, b) => a.score - b.score
    })
    assert.ok(locale === 'ja')
  })
})

describe('resolvedRouteToObject', () => {
  it('should map resolved route without special characters', () => {
    const expected = {
      fullPath: '/ja/about',
      hash: '',
      query: {},
      name: 'about___ja',
      path: '/ja/about',
      params: {},
      matched: [
        {
          path: '/ja/about',
          redirect: undefined,
          name: 'about___ja',
          meta: {},
          aliasOf: undefined,
          beforeEnter: undefined,
          props: {
            default: false
          },
          children: [],
          instances: {},
          leaveGuards: {},
          updateGuards: {},
          enterCallbacks: {},
          components: {
            default: {
              template: '<div>About</div>'
            }
          }
        }
      ],
      meta: {},
      redirectedFrom: undefined,
      href: '/ja/about'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.deepEqual(resolvedRouteToObject(expected as any), expected as any)
  })

  it('should map resolved route without special characters and query', () => {
    const expected = {
      fullPath: '/ja/about?foo=1&test=2',
      hash: '',
      query: {
        foo: '1',
        test: '2'
      },
      name: 'about___ja',
      path: '/ja/about',
      params: {},
      matched: [
        {
          path: '/ja/about',
          redirect: undefined,
          name: 'about___ja',
          meta: {},
          aliasOf: undefined,
          beforeEnter: undefined,
          props: {
            default: false
          },
          children: [],
          instances: {},
          leaveGuards: {},
          updateGuards: {},
          enterCallbacks: {},
          components: {
            default: {
              template: '<div>About</div>'
            }
          }
        }
      ],
      meta: {},
      redirectedFrom: undefined,
      href: '/ja/about?foo=1&test=2'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.deepEqual(resolvedRouteToObject(expected as any), expected as any)
  })

  it('should map resolved route without special characters and query with special characters', () => {
    const expected = {
      fullPath: '/ja/about?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B',
      hash: '',
      query: {
        foo: ['bär', 'bar'],
        four: '四'
      },
      name: 'about___ja',
      path: '/ja/about',
      params: {},
      matched: [
        {
          path: '/ja/about',
          redirect: undefined,
          name: 'about___ja',
          meta: {},
          aliasOf: undefined,
          beforeEnter: undefined,
          props: {
            default: false
          },
          children: [],
          instances: {},
          leaveGuards: {},
          updateGuards: {},
          enterCallbacks: {},
          components: {
            default: {
              template: '<div>About</div>'
            }
          }
        }
      ],
      meta: {},
      redirectedFrom: undefined,
      href: '/ja/about?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.deepEqual(resolvedRouteToObject(expected as any), expected as any)
  })

  it('should map resolved route with special characters and query with special characters', () => {
    const provided = {
      fullPath: '/ja/count/三?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B',
      hash: '',
      query: {
        foo: ['bär', 'bar'],
        four: '四'
      },
      name: 'count___ja',
      path: '/ja/count/三',
      params: {
        id: '三'
      },
      matched: [
        {
          path: '/ja/count/:id',
          redirect: undefined,
          name: 'count___ja',
          meta: {},
          aliasOf: undefined,
          beforeEnter: undefined,
          props: {
            default: false
          },
          children: [],
          instances: {},
          leaveGuards: {},
          updateGuards: {},
          enterCallbacks: {},
          components: {
            default: {
              template: '<div>Category</div>'
            }
          }
        }
      ],
      meta: {},
      redirectedFrom: undefined,
      href: '/ja/count/%E5%9B%9B?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B'
    }
    const expected = {
      fullPath: '/ja/count/%E4%B8%89?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B',
      hash: '',
      query: {
        foo: ['bär', 'bar'],
        four: '四'
      },
      name: 'count___ja',
      path: '/ja/count/%E4%B8%89',
      params: {
        id: '三'
      },
      matched: [
        {
          path: '/ja/count/:id',
          redirect: undefined,
          name: 'count___ja',
          meta: {},
          aliasOf: undefined,
          beforeEnter: undefined,
          props: {
            default: false
          },
          children: [],
          instances: {},
          leaveGuards: {},
          updateGuards: {},
          enterCallbacks: {},
          components: {
            default: {
              template: '<div>Category</div>'
            }
          }
        }
      ],
      meta: {},
      redirectedFrom: undefined,
      href: '/ja/count/%E4%B8%89?foo=b%C3%A4r&foo=bar&four=%E5%9B%9B'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.deepEqual(resolvedRouteToObject(provided as any), expected as any)
  })

  it('should map resolved route with special characters', () => {
    const provided = {
      fullPath: '/ja/count/三',
      hash: '',
      query: {},
      name: 'count___ja',
      path: '/ja/count/三',
      params: {
        id: '三'
      },
      matched: [
        {
          path: '/ja/count/:id',
          redirect: undefined,
          name: 'count___ja',
          meta: {},
          aliasOf: undefined,
          beforeEnter: undefined,
          props: {
            default: false
          },
          children: [],
          instances: {},
          leaveGuards: {},
          updateGuards: {},
          enterCallbacks: {},
          components: {
            default: {
              template: '<div>Category</div>'
            }
          }
        }
      ],
      meta: {},
      redirectedFrom: undefined,
      href: '/ja/count/三'
    }
    const expected = {
      fullPath: '/ja/count/%E4%B8%89',
      hash: '',
      query: {},
      name: 'count___ja',
      path: '/ja/count/%E4%B8%89',
      params: {
        id: '三'
      },
      matched: [
        {
          path: '/ja/count/:id',
          redirect: undefined,
          name: 'count___ja',
          meta: {},
          aliasOf: undefined,
          beforeEnter: undefined,
          props: {
            default: false
          },
          children: [],
          instances: {},
          leaveGuards: {},
          updateGuards: {},
          enterCallbacks: {},
          components: {
            default: {
              template: '<div>Category</div>'
            }
          }
        }
      ],
      meta: {},
      redirectedFrom: undefined,
      href: '/ja/count/%E4%B8%89'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.deepEqual(resolvedRouteToObject(provided as any), expected as any)
  })
})
