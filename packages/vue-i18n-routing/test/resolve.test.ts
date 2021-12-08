import { expect } from 'chai'
import { localizeRoutes } from '../src/resolve'
import { VUE_I18N_ROUTING_DEFAULTS } from '../src/constants'

import type { VueI18nRoute } from '../src/types'

describe('localizeRoutes', function () {
  describe('basic', function () {
    it('should be localized routing', function () {
      const routes: VueI18nRoute[] = [
        {
          path: '/',
          name: 'home'
        },
        {
          path: '/about',
          name: 'about'
        }
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, { localeCodes })

      expect(localizedRoutes.length).to.equal(4)
      localeCodes.forEach(locale => {
        routes.forEach(route => {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}`,
            name: `${route.name}${VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator}${locale}`
          })
        })
      })
    })
  })

  describe('has children', function () {
    it('should be localized routing', function () {
      const routes: VueI18nRoute[] = [
        {
          path: '/user/:id',
          name: 'user',
          children: [
            {
              path: 'profile',
              name: 'user-profile'
            },
            {
              path: 'posts',
              name: 'user-posts'
            }
          ]
        }
      ]
      const children: VueI18nRoute[] = routes[0].children

      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, { localeCodes })

      expect(localizedRoutes.length).to.equal(2)
      localeCodes.forEach(locale => {
        routes.forEach(route => {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}`,
            name: `${route.name}${VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator}${locale}`,
            children: children.map(child => ({
              path: child.path,
              name: `${child.name}${VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator}${locale}`
            }))
          })
        })
      })
    })
  })

  describe('trailing slash', function () {
    it('should be localized routing', function () {
      const routes: VueI18nRoute[] = [
        {
          path: '/',
          name: 'home'
        },
        {
          path: '/about',
          name: 'about'
        }
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, { localeCodes, trailingSlash: true })

      expect(localizedRoutes.length).to.equal(4)
      localeCodes.forEach(locale => {
        routes.forEach(route => {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}/`,
            name: `${route.name}${VUE_I18N_ROUTING_DEFAULTS.routesNameSeparator}${locale}`
          })
        })
      })
    })
  })

  describe('route name separator', function () {
    it('should be localized routing', function () {
      const routes: VueI18nRoute[] = [
        {
          path: '/',
          name: 'home'
        },
        {
          path: '/about',
          name: 'about'
        }
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, { localeCodes, routesNameSeparator: '__' })

      expect(localizedRoutes.length).to.equal(4)
      localeCodes.forEach(locale => {
        routes.forEach(route => {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}`,
            name: `${route.name}${'__'}${locale}`
          })
        })
      })
    })
  })
})
