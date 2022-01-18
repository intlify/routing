import { createMemoryHistory, useRoute } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createRouter } from '../../extends/router'
import { getRouteBaseName } from '../utils'
import { useSetup } from '../../../scripts/vitest'

import type { Route } from '@intlify/vue-router-bridge'

describe('getRouteBaseName', () => {
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
        const name = getRouteBaseName(route)
        assert.equal(name, 'home')
      }, [i18n, router])
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
        const name = getRouteBaseName({} as Route)
        assert.equal(name, null)
      }, [i18n, router])
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
        const name = getRouteBaseName(route, { routesNameSeparator: '---' })
        assert.equal(name, 'home')
      }, [i18n, router])
    })
  })
})
