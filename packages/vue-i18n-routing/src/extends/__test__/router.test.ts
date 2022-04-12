import { vi, describe, it, assert, afterEach, expect } from 'vitest'
import { registerGlobalOptions, createRouter, getGlobalOptions } from '../router'
import { createMemoryHistory } from '@intlify/vue-router-bridge'
import { createI18n } from '@intlify/vue-i18n-bridge'
import { createRouter as _createRouter } from '@intlify/vue-router-bridge'

describe('registerGlobalOptions', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be worked', () => {
    const spy = vi.spyOn(console, 'warn')

    const router = _createRouter({
      routes: [],
      history: createMemoryHistory()
    })

    registerGlobalOptions(router, { localeCodes: ['en', 'ja'] })
    const { localeCodes } = getGlobalOptions(router)
    assert.deepEqual(localeCodes, ['en', 'ja'])

    registerGlobalOptions(router, { localeCodes: ['en', 'ja'] })
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain('already registered global options')
  })
})

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
    const { localeCodes } = getGlobalOptions(router)
    assert.deepEqual(localeCodes, ['en', 'ja'])
  })
})
