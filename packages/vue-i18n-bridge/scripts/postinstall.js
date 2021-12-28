const { switchVersion, loadModule, warn } = require('./utils') // eslint-disable-line @typescript-eslint/no-var-requires

const VueI18n = loadModule('vue-i18n/package.json')

if (!VueI18n || typeof VueI18n.version !== 'string') {
  warn('VueI18n is not found. Please run "npm install vue-i18n" to install.')
} else if (VueI18n.version.startsWith('8.')) {
  switchVersion(8)
} else if (VueI18n.version.startsWith('9.')) {
  switchVersion(9)
} else {
  warn(`VueI18n version v${VueI18n.version} is not suppported.`)
}
