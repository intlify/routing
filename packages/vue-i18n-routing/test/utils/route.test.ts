import { assert, describe, it } from 'vitest'
import { adjustRoutePathForTrailingSlash } from '../../src/utils'

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
