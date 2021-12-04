import { promises as fs } from 'fs'
import { resolve, dirname } from 'pathe'
import { globby } from 'globby'
import semver from 'semver'
import yaml from 'js-yaml'

const _dirname = dirname(new URL(import.meta.url).pathname)

type Deps = {
  name: string
  range: string
  type: string
}
type DepsReviver = (deps: Deps) => Deps | undefined

async function loadPackage(dir: string) {
  const pkgPath = resolve(dir, 'package.json')
  const data = JSON.parse(await fs.readFile(pkgPath, 'utf-8').catch(() => '{}'))
  const save = () => fs.writeFile(pkgPath, JSON.stringify(data, null, 2) + '\n')
  // const save = () =>
  //   console.log(`package: ${dir}`, JSON.stringify(data, null, 2))

  const updateDeps = (reviver: DepsReviver) => {
    for (const type of [
      'dependencies',
      'devDependencies',
      'optionalDependencies',
      'peerDependencies'
    ]) {
      if (!data[type]) {
        continue
      }
      for (const e of Object.entries(data[type])) {
        const dep = { name: e[0], range: e[1] as string, type }
        delete data[type][dep.name]
        const updated = reviver(dep) || dep
        data[updated.type] = data[updated.type] || {}
        data[updated.type][updated.name] = updated.range
      }
    }
  }

  return {
    dir,
    data,
    save,
    updateDeps
  }
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type Package = ThenArg<ReturnType<typeof loadPackage>>

async function loadWorkspaceData(path: string): Promise<string[]> {
  const workspacesYaml = await fs.readFile(path, 'utf-8')
  const data = (yaml.load(workspacesYaml) as any).packages
  return Array.isArray(data) ? (data as string[]) : []
}

async function loadWorkspace(dir: string, workspaces: string[] = []) {
  const workspacePkg = await loadPackage(dir)
  const workspacesYaml = await loadWorkspaceData(
    resolve(_dirname, '../pnpm-workspace.yaml')
  )
  workspacePkg.data.workspaces = [...workspaces, ...workspacesYaml]

  const pkgDirs = await globby(
    [...(workspacePkg.data.workspaces || []), ...workspaces],
    {
      onlyDirectories: true
    }
  )

  const packages: Package[] = []

  for (const pkgDir of pkgDirs) {
    const pkg = await loadPackage(pkgDir)
    if (!pkg.data.name) {
      continue
    }
    packages.push(pkg)
  }

  const find = (name: string) => {
    const pkg = packages.find(pkg => pkg.data.name === name)
    if (!pkg) {
      throw new Error('Workspace package not found: ' + name)
    }
    return pkg
  }

  const rename = (from: string, to: string) => {
    find(from).data.name = to
    for (const pkg of packages) {
      pkg.updateDeps(dep => {
        return undefined
      })
    }
  }

  const setVersion = (name: string, newVersion: string) => {
    find(name).data.version = newVersion
    for (const pkg of packages) {
      pkg.updateDeps(dep => {
        if (dep.name === name) {
          dep.range = newVersion
        }
        return undefined
      })
    }
  }

  const save = async () => {
    await workspacePkg.save()
    return Promise.all(packages.map(pkg => pkg.save()))
  }

  return {
    dir,
    workspacePkg,
    packages,
    save,
    find,
    rename,
    setVersion
  }
}

async function main() {
  const workspace = await loadWorkspace(process.cwd())

  const release = semver.inc(workspace.workspacePkg.data.version, 'patch')
  if (!release) {
    throw new Error('Invalid version: ' + workspace.workspacePkg.data.version)
  }

  workspace.workspacePkg.data.version = release
  for (const pkg of workspace.packages.filter(p => !p.data.private)) {
    workspace.setVersion(pkg.data.name, release)
    if (pkg.data.name !== 'vue-i18n-routing') {
      workspace.rename(pkg.data.name, pkg.data.name)
    }
  }

  await workspace.save()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
