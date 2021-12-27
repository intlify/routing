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
  console.warn(`[vue-router-composable] `, ...args)
}

function log(...args) {
  console.log(`[vue-router-composable] `, ...args)
}

function copy(name, version, router) {
  const src = path.join(dir, `v${version}`, name)
  const dest = path.join(dir, name)
  let content = fs.readFileSync(src, 'utf-8')
  content = content.replace(/'router'/g, `'${router}'`)
  try {
    fs.unlinkSync(dest)
  } catch (error) {}
  fs.writeFileSync(dest, content, 'utf-8')
}

function checkVCA() {
  const VCA = loadModule('@vue/composition-api')
  if (!VCA) {
    warn('Composition API plugin is not found. Please run "npm install @vue/composition-api" to install.')
    return false
  }
  return true
}

function switchVersion(version, router) {
  router = router || 'vue-router'
  if (version === 3 && !checkVCA()) {
    return
  }
  copy('index.cjs', version, router)
  copy('index.mjs', version, router)
  copy('index.d.ts', version, router)
}

module.exports.warn = warn
module.exports.log = log
module.exports.loadModule = loadModule
module.exports.switchVersion = switchVersion
