import { getLocaleRouteName } from '../utils'

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
