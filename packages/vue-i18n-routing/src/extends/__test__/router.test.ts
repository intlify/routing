import { describe, it, assert } from 'vitest'
import { createRouter } from '../router'
import { createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import {
  DEFAULT_LOCALE,
  DEFAULT_TRAILING_SLASH,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_STRATEGY
} from '../../constants'

describe('createRouter', () => {
  it('should be created Vue Router v4 instance', () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    const router = createRouter(i18n, {
      version: 4,
      locales: ['en', 'ja'],
      routes: [],
      history: createMemoryHistory()
    })

    // check router instance
    assert.isNotNull(router)
    assert.isDefined(router.isReady)
    // check router extending for internal
    assert.equal(router.__defaultLocale, DEFAULT_LOCALE)
    assert.equal(router.__strategy, DEFAULT_STRATEGY)
    assert.equal(router.__trailingSlash, DEFAULT_TRAILING_SLASH)
    assert.equal(router.__routesNameSeparator, DEFAULT_ROUTES_NAME_SEPARATOR)
    assert.equal(router.__defaultLocaleRouteNameSuffix, DEFAULT_LOCALE_ROUTE_NAME_SUFFIX)
    assert.deepEqual(router.__localeCodes, ['en', 'ja'])
  })
})
