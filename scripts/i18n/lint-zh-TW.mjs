#!/usr/bin/env node
// Check src/i18n/zh-TW.json for wording that does not belong in it.
//
//   pnpm i18n:zh-TW:lint
//
// Three checks:
//
//   1. the terms in zh-TW-lint.json — Mainland wording, the forms OpenCC
//      produces that Taiwan does not use, and terms that are only wrong
//      outside the contexts a rule allows;
//   2. Simplified characters left behind, from the list in zh-TW-lint.json
//      (opencc-js widens the net when installed, but is not required);
//   3. spacing the conversion introduced — a space between two Han characters
//      that the Simplified Chinese string does not have. The zh strings come
//      from the same files gen-zh-TW.mjs reads.
//
// Exits non-zero when anything is found.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..')
const SRC = path.join(ROOT, 'src')

// OpenCC's s2t normalises these to an orthodox variant, but the form s2twp
// produces is the one Taiwan writes, so they are not leftovers.
const TW_VARIANTS = new Set([...'台峰游秘里群'])
const HAN_SPACE = /[一-鿿] +[一-鿿]/g

const lint = JSON.parse(fs.readFileSync(path.join(HERE, 'zh-TW-lint.json'), 'utf8'))
const { rules } = lint
const SIMPLIFIED = new Set([...(lint.simplifiedChars ?? '')])
const generated = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n', 'zh-TW.json'), 'utf8'))

// flatten { A: { b: 'text' } } to [['A.b', 'text'], ...]
const flatten = (node, prefix = []) =>
  typeof node === 'string'
    ? [[prefix.join('.'), node]]
    : node && typeof node === 'object'
      ? Object.entries(node).flatMap(([k, v]) => flatten(v, [...prefix, k]))
      : []

// the Simplified strings, loaded the way gen-zh-TW.mjs loads them
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'emqx-i18n-lint-'))
const loadModule = async (file) => {
  const copy = path.join(tmp, path.basename(file).replace(/\.ts$/, '.mjs'))
  fs.writeFileSync(copy, fs.readFileSync(file, 'utf8'), 'utf8')
  return (await import(pathToFileURL(copy).href)).default
}

const zh = new Map()
const i18nDir = path.join(SRC, 'i18n')
for (const file of fs.readdirSync(i18nDir).filter((f) => f.endsWith('.ts')).sort()) {
  const part = path.basename(file, '.ts')
  const mod = await loadModule(path.join(i18nDir, file))
  for (const [key, value] of Object.entries(mod)) {
    if (typeof value?.zh === 'string') zh.set(`${part}.${key}`, value.zh)
  }
}
const schemaZh = await loadModule(path.join(SRC, 'schemaText', 'schema-text-zh.ts'))
for (const [key, value] of Object.entries(schemaZh)) {
  for (const tag of ['label', 'desc']) {
    if (typeof value?.[tag] === 'string') zh.set(`ConfigSchema.${key}.${tag}`, value[tag])
  }
}
fs.rmSync(tmp, { recursive: true, force: true })

const entries = flatten(generated)
console.log(`checking ${entries.length} strings in src/i18n/zh-TW.json against ${rules.length} rules`)

const show = (text, needle, width = 34) => {
  const flat = text.replace(/\n/g, ' ')
  const i = flat.indexOf(needle)
  return i < 0 ? flat.slice(0, width * 2) : flat.slice(Math.max(0, i - width), i + needle.length + width)
}

let problems = 0

// --- 1. terms -------------------------------------------------------------
const termHits = []
for (const [key, text] of entries) {
  for (const rule of rules) {
    if ((rule.allowKeyPrefix ?? []).some((p) => key.startsWith(p))) continue
    let probe = text
    for (const allowed of rule.allow ?? []) probe = probe.split(allowed).join('')
    if (probe.includes(rule.term)) termHits.push([rule, key, text])
  }
}
if (termHits.length) {
  problems += termHits.length
  console.log(`\n${termHits.length} strings use wording that should not appear:`)
  for (const [rule, key, text] of termHits.slice(0, 40)) {
    console.log(`   ${key}`)
    console.log(`      ${rule.term} -> ${rule.prefer}${rule.note ? '   # ' + rule.note : ''}`)
    console.log(`      ...${show(text, rule.term)}...`)
  }
  if (termHits.length > 40) console.log(`   ... and ${termHits.length - 40} more`)
}

// --- 2. Simplified characters --------------------------------------------
// The character list in zh-TW-lint.json makes this work with no dependency;
// opencc-js widens the net when installed, catching a character the Simplified
// source had not used before.
let s2t = null
try {
  const { Converter } = await import('opencc-js')
  s2t = Converter({ from: 'cn', to: 'tw' })
} catch {
  /* the embedded list is enough */
}
{
  const hits = []
  for (const [key, text] of entries) {
    const bad = [...new Set([...text])].filter(
      (c) =>
        SIMPLIFIED.has(c) ||
        (s2t && c >= '一' && c <= '鿿' && !TW_VARIANTS.has(c) && s2t(c) !== c),
    )
    if (bad.length) hits.push([key, bad.join(''), text])
  }
  if (hits.length) {
    problems += hits.length
    console.log(`\n${hits.length} strings still hold Simplified characters:`)
    for (const [key, chars, text] of hits.slice(0, 20)) {
      console.log(`   ${key.padEnd(46)} ${chars}`)
      console.log(`      ...${show(text, chars[0])}...`)
    }
  }
}

// --- 3. spacing the conversion introduced --------------------------------
const spacing = []
for (const [key, text] of entries) {
  const before = (zh.get(key) ?? '').match(HAN_SPACE)?.length ?? 0
  const after = text.match(HAN_SPACE) ?? []
  if (zh.has(key) && after.length > before) spacing.push([key, after[0], text])
}
if (spacing.length) {
  problems += spacing.length
  console.log(`\n${spacing.length} strings gained a space between two Han characters:`)
  for (const [key, frag, text] of spacing.slice(0, 20)) {
    console.log(`   ${key.padEnd(46)} ${JSON.stringify(frag)}`)
    console.log(`      ...${show(text, frag)}...`)
  }
}

if (problems) {
  console.log(`\n${problems} problems found`)
  process.exit(1)
}
console.log('\nOK')
