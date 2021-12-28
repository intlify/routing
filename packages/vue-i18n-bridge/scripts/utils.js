const fs = require('fs') // eslint-disable-line @typescript-eslint/no-var-requires
const path = require('path') // eslint-disable-line @typescript-eslint/no-var-requires

const dir = path.resolve(__dirname, '..', 'lib')

function loadModule(name) {
  try {
    return require(name)
  } catch (e) {
    return undefined
  }
}

function warn(...args) {
  console.warn(`[vue-i18n-bridge] `, ...args)
}

function log(...args) {
  console.log(`[vue-i18n-bridge] `, ...args)
}

function copy(name, version, i18n) {
  const src = path.join(dir, `v${version}`, name)
  const dest = path.join(dir, name)
  let content = fs.readFileSync(src, 'utf-8')
  content = content.replace(/'i18n'/g, `'${i18n}'`)
  try {
    fs.unlinkSync(dest)
  } catch (error) {}
  fs.writeFileSync(dest, content, 'utf-8')
}

function checkBridge() {
  const bridge = loadModule('vue-i18n-bridge')
  if (!bridge) {
    warn('Vue I18n Bridge plugin is not found. Please run "npm install vue-i18n-bridge" to install.')
    return false
  }
  return true
}

function switchVersion(version, i18n) {
  i18n = i18n || 'vue-i18n'
  if (version === 8 && !checkBridge()) {
    return
  }
  copy('index.cjs', version, i18n)
  copy('index.mjs', version, i18n)
  copy('index.d.ts', version, i18n)
}

module.exports.warn = warn
module.exports.log = log
module.exports.loadModule = loadModule
module.exports.switchVersion = switchVersion
