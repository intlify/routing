const { switchVersion, warn, log } = require('./utils') // eslint-disable-line @typescript-eslint/no-var-requires

const version = process.argv[2]
const vueRouterEntry = process.argv[3] || 'vue-router'

if (version == '3') {
  switchVersion(3, vueRouterEntry)
  log(`Switched for Vue Router 3 (entry: "${vueRouterEntry}")`)
} else if (version == '4') {
  switchVersion(4, vueRouterEntry)
  log(`Switched for Vue Router 4 (entry: "${vueRouterEntry}")`)
} else {
  warn(`expecting version "3" or "4" but got "${version}"`)
  process.exit(1)
}
