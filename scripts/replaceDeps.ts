import { promises as fs, constants as FS_CONSTANTS } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { readPackageJSON, writePackageJSON } from 'pkg-types'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PKG_MAP = new Map<string, string>()

export async function isExists(path: string) {
  try {
    await fs.access(path, FS_CONSTANTS.F_OK)
    return true
  } catch {
    return false
  }
}

async function main() {
  const packagesPath = resolve(__dirname, '../packages')
  for (const pkg of await fs.readdir(packagesPath)) {
    const pkgJson = await readPackageJSON(resolve(packagesPath, pkg, 'package.json'))
    const tgzPath = resolve(packagesPath, pkg, `${pkg}-${pkgJson.version}.tgz`)
    if (await isExists(tgzPath)) {
      PKG_MAP.set(pkg, tgzPath)
    }
  }
  const playgroundPath = resolve(__dirname, '../playground')
  for (const ex of await fs.readdir(playgroundPath)) {
    const examplePath = resolve(playgroundPath, ex, 'package.json')
    const pkgJson = await readPackageJSON(examplePath)
    for (const [pkg, tgzPath] of PKG_MAP.entries()) {
      if (tgzPath && pkgJson.dependencies) {
        pkgJson.dependencies[`${pkg}`] = `file:${tgzPath}`
      }
    }
    await writePackageJSON(examplePath, pkgJson)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
