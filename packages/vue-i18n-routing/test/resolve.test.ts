import { expect, describe, it } from 'vitest'
import { localizeRoutes } from '../src/resolve'
import { DEFAULT_ROUTES_NAME_SEPARATOR } from '../src/constants'

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
      const localizedRoutes = localizeRoutes(routes, { locales: localeCodes })

      expect(localizedRoutes).toMatchSnapshot()
      expect(localizedRoutes.length).to.equal(4)
      localeCodes.forEach(locale => {
        routes.forEach(route => {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}`,
            name: `${route.name}${DEFAULT_ROUTES_NAME_SEPARATOR}${locale}`
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
      const children: VueI18nRoute[] = routes[0].children as VueI18nRoute[]

      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, { locales: localeCodes })

      expect(localizedRoutes).toMatchSnapshot()
      expect(localizedRoutes.length).to.equal(2)
      localeCodes.forEach(locale => {
        routes.forEach(route => {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}`,
            name: `${route.name}${DEFAULT_ROUTES_NAME_SEPARATOR}${locale}`,
            children: children.map(child => ({
              path: child.path,
              name: `${child.name}${DEFAULT_ROUTES_NAME_SEPARATOR}${locale}`
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
      const localizedRoutes = localizeRoutes(routes, { locales: localeCodes, trailingSlash: true })

      expect(localizedRoutes).toMatchSnapshot()
      expect(localizedRoutes.length).to.equal(4)
      localeCodes.forEach(locale => {
        routes.forEach(route => {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}/`,
            name: `${route.name}${DEFAULT_ROUTES_NAME_SEPARATOR}${locale}`
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
      const localizedRoutes = localizeRoutes(routes, { locales: localeCodes, routesNameSeparator: '__' })

      expect(localizedRoutes).toMatchSnapshot()
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

  describe('strategy: "prefix_and_default"', function () {
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
      const localizedRoutes = localizeRoutes(routes, {
        defaultLocale: 'en',
        strategy: 'prefix_and_default',
        locales: localeCodes
      })

      expect(localizedRoutes).toMatchSnapshot()
    })
  })

  describe('strategy: "prefix"', function () {
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
      const localizedRoutes = localizeRoutes(routes, {
        defaultLocale: 'en',
        strategy: 'prefix',
        locales: localeCodes,
        includeUprefixedFallback: true
      })

      expect(localizedRoutes).toMatchSnapshot()
    })
  })

  describe('strategy: "no_prefix"', function () {
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
      const localizedRoutes = localizeRoutes(routes, {
        defaultLocale: 'en',
        strategy: 'no_prefix',
        locales: localeCodes
      })

      expect(localizedRoutes).toMatchSnapshot()
    })
  })
})
