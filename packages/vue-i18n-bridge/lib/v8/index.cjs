var VueI18n = require('vue-i18n')
var VueI18nBridge = require('vue-i18n-bridge')

Object.keys(VueI18nBridge).forEach(function(key) {
  exports[key] = Vue[key]
})

exports.default = VueI18n
exports.isVueI18n8 = true
exports.isVueI18n9 = false

