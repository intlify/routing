/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs'
import path from 'pathe'

function toText(data: any): string {
  return JSON.stringify(data, null, 2)
}

function isString(val: unknown): val is string {
  return typeof val === 'string'
}

type FileCache = {
  [key: string]: any
}

const fileCache: FileCache = {}

function readSnap(file: string, name: string) {
  if (fileCache[file] === undefined) {
    fileCache[file] = fs.existsSync(file) ? require(file) : false
  }
  if (!fileCache[file] || !(name in fileCache[file])) {
    throw `Snapshot does not exists`
  }
  return fileCache[file][name]
}

function writeSnap(file: string, name: string, data: any) {
  if (!fs.existsSync(path.dirname(file))) {
    fs.mkdirSync(path.dirname(file))
  }

  const snapShotCountsBefore = fileCache[file] ? Object.keys(fileCache[file]).length : 0

  if (snapShotCountsBefore === 0) {
    fileCache[file] = { [name]: data }
  } else {
    fileCache[file][name] = data
  }

  let snap
  const snapShotCountsAfter = Object.keys(fileCache[file]).length
  if (snapShotCountsBefore === 0 || snapShotCountsBefore !== snapShotCountsAfter) {
    snap = `exports[\`${name}\`] = \`${toText(data)}\`;\n\n`
    fs.appendFileSync(file, snap, { encoding: 'utf8' })
    return true
  }

  snap = ''
  for (const snapshot in fileCache[file]) {
    snap = `${snap}exports[\`${snapshot}\`] = \`${toText(fileCache[file][snapshot])}\`;\n\n`
  }

  fs.writeFileSync(file, snap, { encoding: 'utf8' })

  return true
}

export function chatSnaptshotPlugin(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  utils.addProperty(chai.Assertion.prototype, 'force', function () {
    utils.flag(this, 'updateSnapshot', true)
  })

  const UPDATE_SNAPSHOT = process.env.UPDATE_SNAPSHOT

  function matchSnapshot(passedContext: Record<string, any>) {
    const actual = utils.flag(this, 'object')
    const isForced = UPDATE_SNAPSHOT || utils.flag(this, 'updateSnapshot')
    const context = passedContext.test ? passedContext.test : passedContext
    const dir = path.dirname(context.file)
    const filename = path.basename(context.file)
    const snapshotFile = path.join(dir, '__snapshots__', filename + '.snap')

    const prepareTitle = (chain: Record<string, any>): string => {
      if (chain.parent && chain.parent.file && path.basename(chain.parent.file) === filename) {
        return `${prepareTitle(chain.parent)} : ${chain.title}`
      }
      return chain.title
    }

    if (!context.matchSequence) {
      context.matchSequence = 1
    }

    const name = `${prepareTitle(context)} ${context.matchSequence++}`
    let expected
    try {
      expected = readSnap(snapshotFile, name)
    } catch (e) {
      if (!isForced) {
        throw e
      }
    }
    if (isForced) {
      writeSnap(snapshotFile, name, actual)
      expected = actual
    }

    if (actual !== null && typeof actual === 'object') {
      chai.assert.deepEqual(actual, expected != null && isString(expected) ? JSON.parse(expected) : expected)
    } else {
      chai.assert.equal(actual, expected)
    }
  }

  utils.addMethod(chai.Assertion.prototype, 'matchSnapshot', matchSnapshot)
}

/* eslint-enable @typescript-eslint/no-explicit-any */
