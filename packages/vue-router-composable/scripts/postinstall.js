const { switchVersion, loadModule, warn } = require('./utils') // eslint-disable-line @typescript-eslint/no-var-requires

const VueRouter = loadModule('vue-router/package.json')

if (!VueRouter || typeof VueRouter.version !== 'string') {
  warn('VueRouter is not found. Please run "npm install vue-router" to install.')
} else if (VueRouter.version.startsWith('3.')) {
  switchVersion(3)
} else if (VueRouter.version.startsWith('4.')) {
  switchVersion(4)
} else {
  warn(`VueRouter version v${VueRouter.version} is not suppported.`)
}
