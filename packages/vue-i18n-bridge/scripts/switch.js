const { switchVersion, warn, log } = require('./utils') // eslint-disable-line @typescript-eslint/no-var-requires

const version = process.argv[2]
const vueI18nEntry = process.argv[3] || 'vue-i18n'

if (version == '8') {
  switchVersion(8, vueI18nEntry)
  log(`Switched for Vue I18n 8 (entry: "${vueI18nEntry}")`)
} else if (version == '9') {
  switchVersion(9, vueI18nEntry)
  log(`Switched for Vue I18n 9 (entry: "${vueI18nEntry}")`)
} else {
  warn(`expecting version "8" or "9" but got "${version}"`)
  process.exit(1)
}
