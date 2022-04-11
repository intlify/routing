import { describe, it, assert } from 'vitest'
import { registerGlobalOptions, createRouter, getGlobalOptions } from '../router'
import { createMemoryHistory } from '@intlify/vue-router-bridge'
import { createI18n } from '@intlify/vue-i18n-bridge'
import { createRouter as _createRouter } from '@intlify/vue-router-bridge'
import { isEmptyObject } from '@intlify/shared'

describe('registerGlobalOptions', () => {
  it('should be worked', () => {
    const router = _createRouter({
      routes: [],
      history: createMemoryHistory()
    })

    const unregister = registerGlobalOptions(router, { localeCodes: ['en', 'ja'] })
    assert.isNotNull(unregister)
    const { localeCodes } = getGlobalOptions(router)
    assert.deepEqual(localeCodes, ['en', 'ja'])

    const result = unregister!()
    assert.ok(result)
    assert.ok(isEmptyObject(getGlobalOptions(router)))
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
