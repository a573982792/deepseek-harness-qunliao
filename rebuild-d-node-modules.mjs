// Rebuild the top-level node_modules of the D-drive harness checkout from its
// own .pnpm virtual store. Keeps .pnpm / .bin / .modules.yaml untouched;
// moves every other top-level entry to node_modules.old, then recreates
// junctions (store packages, highest version first) plus workspace
// self-junctions. Usage: node rebuild-d-node-modules.mjs [repoRoot]
import fs from 'node:fs'
import path from 'node:path'

const DEFAULT_ROOT = 'D:\\桌面\\deepseek-harness-master'
const root = path.resolve(process.argv[2] ?? DEFAULT_ROOT)
const nm = path.join(root, 'node_modules')
const store = path.join(nm, '.pnpm')

if (!fs.existsSync(store)) {
  console.error(`ABORT: no .pnpm store at ${store}`)
  process.exit(1)
}

function isJunction(p) { try { return fs.lstatSync(p).isSymbolicLink() } catch { return false } }

// 1) Stash every top-level entry except the store, bin shims, and lock marker.
const trash = path.join(root, 'node_modules.old')
fs.rmSync(trash, { recursive: true, force: true })
fs.mkdirSync(trash, { recursive: true })
let moved = 0
for (const entry of fs.readdirSync(nm, { withFileTypes: true })) {
  if (entry.name === '.pnpm' || entry.name === '.bin' || entry.name === '.modules.yaml') continue
  fs.renameSync(path.join(nm, entry.name), path.join(trash, entry.name))
  moved++
}
console.log('stashed broken entries:', moved, '->', trash)

// 2) Map store entries: name -> highest version.
function versionKey(v) {
  const parts = String(v).split('.').map(n => parseInt(n, 10) || 0)
  return parts[0] * 1000000 + (parts[1] ?? 0) * 1000 + (parts[2] ?? 0)
}
const best = new Map()
for (const entry of fs.readdirSync(store, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const e = entry.name
  const m = /^(@[^+]+)\+([^@]+)@(\d[^_]*)/.exec(e) || /^([^@]+)@(\d[^_]*)/.exec(e)
  if (!m) continue
  const scope = m[1]?.startsWith('@') ? m[1] : ''
  const name = scope ? m[2] : m[1]
  const version = scope ? m[3] : m[2]
  const key = `${scope}/${name}`
  const nodeModulesPath = path.join(store, e, 'node_modules', scope, name)
  if (!fs.existsSync(nodeModulesPath)) continue
  const cur = best.get(key)
  if (!cur || versionKey(version) > versionKey(cur.version)) best.set(key, { entry: e, version, nodeModulesPath })
}
console.log('store packages mapped:', best.size)

// 3) Junction store packages at the root.
let linked = 0, failed = 0
for (const [key, info] of best) {
  const [scope, name] = key.startsWith('@') ? [key.split('/')[0], key.split('/')[1]] : ['', key]
  const scopeDir = scope ? path.join(nm, scope) : nm
  const dst = path.join(scopeDir, name)
  if (fs.existsSync(dst)) { failed++; continue }
  fs.mkdirSync(scopeDir, { recursive: true })
  try { fs.symlinkSync(info.nodeModulesPath, dst, 'junction'); linked++ }
  catch (err) { failed++; console.log('FAIL', key, err.message) }
}
console.log('linked store packages:', linked, 'skipped/failed:', failed)

// 4) Workspace self-junctions.
const pkgDirs = []
for (const group of ['packages', 'vendor', 'apps', 'native']) {
  const base = path.join(root, group)
  if (!fs.existsSync(base)) continue
  const walk = (dir) => {
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue
      const full = path.join(dir, d.name)
      const pj = path.join(full, 'package.json')
      if (fs.existsSync(pj)) {
        try { const j = JSON.parse(fs.readFileSync(pj, 'utf8')); if (typeof j.name === 'string') pkgDirs.push({ name: j.name, dir: full }) } catch {}
        continue
      }
      walk(full)
    }
  }
  walk(base)
}
let ws = 0
for (const { name, dir } of pkgDirs) {
  const scope = name.startsWith('@') ? name.split('/')[0] : ''
  const base = scope ? name.split('/')[1] : name
  const scopeDir = scope ? path.join(nm, scope) : nm
  const dst = path.join(scopeDir, base)
  if (fs.existsSync(dst)) continue
  fs.mkdirSync(scopeDir, { recursive: true })
  fs.symlinkSync(dir, dst, 'junction')
  ws++
}
console.log('linked workspace packages:', ws, 'of', pkgDirs.length)
console.log('DONE')
