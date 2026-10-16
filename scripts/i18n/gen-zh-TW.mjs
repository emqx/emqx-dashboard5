#!/usr/bin/env node
// Generate src/i18n/zh-TW.json from the Simplified Chinese strings already in
// the repository.
//
//   pnpm add -D opencc-js
//   node scripts/i18n/gen-zh-TW.mjs [--check]
//
// Sources: src/i18n/*.ts (the `zh` of every entry), src/schemaText/
// schema-text-zh.ts and src/schemaText/actionText/action-{desc,label}-zh.json.
// Conversion is OpenCC `cn -> twp` followed by scripts/i18n/zh-TW-terms.json,
// which fixes the terms OpenCC gets wrong for Taiwanese usage.
//
// Anything the generated file does not cover shows English at runtime, see
// src/i18n.ts, so hand edits to src/i18n/zh-TW.json survive a regeneration only
// if the matching term is added to zh-TW-terms.json.  Re-run this after
// changing the zh strings and review the diff.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..')
const SRC = path.join(ROOT, 'src')
const OUT = path.join(SRC, 'i18n', 'zh-TW.json')
const CHECK = process.argv.includes('--check')

const { Converter } = await import('opencc-js')
const toTW = Converter({ from: 'cn', to: 'twp' })
const { terms } = JSON.parse(
  fs.readFileSync(path.join(HERE, 'zh-TW-terms.json'), 'utf8'),
)
const rules = terms.map((t, i) => ({
  ...t,
  i,
  re: t.regex ? new RegExp(t.from, 'g') : null,
}))
// Namespace-scoped term overrides, for a word whose right translation depends
// on which part of the UI it appears in. Applied before KEY_TERMS.
const NS_TERMS = {
  AI: [['提供者', '供應商']],
}

// Per-key term overrides, for the entries where the shared table would be wrong.
// These replace a word inside one entry rather than the whole text, so the rest
// of the entry still tracks the Simplified Chinese source. 刪除 is right where
// the English says "delete"; these are the ones that say "remove".
const KEY_TERMS = {
  'MonitoringIntegration.authorizationHeaderConflict': [['刪除', '移除']],
  // a query filter is 篩選; 過濾器 is kept for the MQTT topic filter
  'A2A.exactFilterTip': [['過濾', '篩選']],
  'General.LDAPFilterDesc': [['過濾', '篩選']],
  // the English is just "Disabled"
  'General.disabled': [['不啟用', '停用']],
  'General.ssoDisabled': [['未啟用', '停用']],
  // 回車 is the Mainland name for the Enter key
  'Gateway.aObservePathPlaceholder': [['刪除', '移除'], ['按回車', '按 Enter 鍵']],
}
const keyTermsSeen = new Set()

const hits = new Map()

const convert = (text, keyPath) => {
  if (typeof text !== 'string') return text
  let out = toTW(text)
  for (const rule of rules) {
    const before = out
    out = rule.re ? out.replace(rule.re, rule.to) : out.split(rule.from).join(rule.to)
    if (out !== before) hits.set(rule.i, (hits.get(rule.i) ?? 0) + 1)
  }
  for (const [word, replacement] of NS_TERMS[String(keyPath).split('.')[0]] ?? []) {
    out = out.split(word).join(replacement)
  }
  for (const [word, replacement] of KEY_TERMS[keyPath] ?? []) {
    keyTermsSeen.add(keyPath)
    out = out.split(word).join(replacement)
  }
  return out
}

// The i18n modules are plain object literals, so they load as ESM once copied
// to a .mjs file -- no TypeScript parsing and no fragile regexes.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'emqx-i18n-'))
const loadModule = async (file) => {
  const copy = path.join(tmp, path.basename(file).replace(/\.ts$/, '.mjs'))
  fs.writeFileSync(copy, fs.readFileSync(file, 'utf8'), 'utf8')
  return (await import(pathToFileURL(copy).href)).default
}

const messages = {}
let count = 0

// src/i18n/*.ts -> { <FileName>: { <key>: <zh-TW text> } }
const i18nDir = path.join(SRC, 'i18n')
for (const file of fs.readdirSync(i18nDir).filter((f) => f.endsWith('.ts')).sort()) {
  const partKey = path.basename(file, '.ts')
  const mod = await loadModule(path.join(i18nDir, file))
  const part = {}
  for (const [key, value] of Object.entries(mod)) {
    if (value && typeof value.zh === 'string') {
      part[key] = convert(value.zh, `${partKey}.${key}`)
      count++
    }
  }
  if (Object.keys(part).length) messages[partKey] = part
}

// src/schemaText/schema-text-zh.ts -> ConfigSchema
const schemaZh = await loadModule(path.join(SRC, 'schemaText', 'schema-text-zh.ts'))
messages.ConfigSchema = {}
for (const [key, value] of Object.entries(schemaZh)) {
  const entry = {}
  for (const tag of ['label', 'desc']) {
    if (typeof value?.[tag] === 'string') {
      entry[tag] = convert(value[tag], `ConfigSchema.${key}.${tag}`)
      count++
    }
  }
  if (Object.keys(entry).length) messages.ConfigSchema[key] = entry
}

// src/schemaText/actionText/*-zh.json -> BridgeSchema
const actionDir = path.join(SRC, 'schemaText', 'actionText')
messages.BridgeSchema = {}
for (const [file, tag] of [['action-label-zh.json', 'label'], ['action-desc-zh.json', 'desc']]) {
  const data = JSON.parse(fs.readFileSync(path.join(actionDir, file), 'utf8'))
  for (const [type, entries] of Object.entries(data)) {
    for (const [key, text] of Object.entries(entries)) {
      if (typeof text !== 'string') continue
      messages.BridgeSchema[type] ??= {}
      messages.BridgeSchema[type][key] ??= {}
      messages.BridgeSchema[type][key][tag] = convert(text, `BridgeSchema.${type}.${key}.${tag}`)
      count++
    }
  }
}

// @emqx/shared-ui-i18n ships more Simplified Chinese action/connector labels
// and the schema symbol labels. It is optional so this script still runs in a
// checkout without node_modules; anything missing keeps its zh text at runtime.
const addTextConf = (data, tag) => {
  for (const [type, entries] of Object.entries(data ?? {})) {
    for (const [key, text] of Object.entries(entries ?? {})) {
      if (typeof text !== 'string') continue
      messages.BridgeSchema[type] ??= {}
      messages.BridgeSchema[type][key] ??= {}
      messages.BridgeSchema[type][key][tag] = convert(text, `BridgeSchema.${type}.${key}.${tag}`)
      count++
    }
  }
}

const convertTree = (node) => {
  if (typeof node === 'string') {
    count++
    return convert(node)
  }
  if (!node || typeof node !== 'object') return node
  return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, convertTree(v)]))
}

try {
  const shared = await import('@emqx/shared-ui-i18n')
  addTextConf(shared.zhConnectorsLabel, 'label')
  addTextConf(shared.zhActionsLabel, 'label')
  addTextConf(shared.zhIntegrationDesc, 'desc')
  messages.SchemaSymbolLabel = convertTree(shared.zhSymbolLabel)
} catch (err) {
  console.warn(
    'WARNING: @emqx/shared-ui-i18n could not be loaded (%s), its labels stay Simplified Chinese. Run pnpm install and retry.',
    err.code ?? err.message,
  )
}

fs.rmSync(tmp, { recursive: true, force: true })

const json = JSON.stringify(messages, null, 2) + '\n'
if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''
  if (current !== json) {
    console.error('src/i18n/zh-TW.json is out of date, run: node scripts/i18n/gen-zh-TW.mjs')
    process.exit(1)
  }
  console.log('src/i18n/zh-TW.json is up to date')
  process.exit(0)
}

fs.writeFileSync(OUT, json, 'utf8')
console.log(`wrote ${path.relative(ROOT, OUT)}: ${count} strings`)
const staleKeys = Object.keys(KEY_TERMS).filter((k) => !keyTermsSeen.has(k))
console.log(`per-key overrides: ${Object.keys(KEY_TERMS).length - staleKeys.length} applied`)
for (const k of staleKeys) console.log(`   STALE: ${k}`)
console.log('term override hits:')
for (const rule of rules) {
  const n = hits.get(rule.i)
  if (n) console.log(`   ${rule.to.padEnd(14)} ${String(n).padStart(5)}`)
}
