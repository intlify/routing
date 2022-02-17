import { describe, it, assert } from 'vitest'
import { adjustRoutePathForTrailingSlash, getLocaleRouteName, findBrowserLocale } from '../utils'

import { BrowserLocale } from '../utils'

describe('adjustRouteDefinitionForTrailingSlash', function () {
  describe('pagePath: /foo/bar', function () {
    describe('trailingSlash: faawklse, isChildWithRelativePath: true', function () {
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
  describe('default', () => {
    it('should be worked', () => {
      const locale = findBrowserLocale(
        [
          {
            code: 'en',
            iso: 'en-US'
          },
          {
            code: 'ja',
            iso: 'ja-JP'
          }
        ],
        ['ja-JP', 'en-US']
      )
      assert.ok(locale === 'ja')
    })
  })

  describe('options', () => {
    it('should be worked', () => {
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
})
