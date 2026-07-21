const rawDict = require('../src/views/General/resource_dict.json')
const { readFile } = require('node:fs/promises')
const axios = require('axios')
const baseURL = process.env.HOST_URL || 'http://mac:18084'
const swaggerFile = process.env.SWAGGER_FILE

const WILDCARD_MARKER = '[...]'

// Flatten hierarchical structure into dictMap
const dictMap = new Map()
rawDict.forEach((group) => {
  group.operations.forEach(({ method, path, name_label: label }) => {
    dictMap.set(`${method}:${path}`, { label, typeLabel: group.label })
  })
})

// Build regex patterns for wildcard entries (paths containing '[...]')
const wildcardPatterns = []
for (const key of dictMap.keys()) {
  if (key.includes(WILDCARD_MARKER)) {
    const colonIdx = key.indexOf(':')
    const method = key.slice(0, colonIdx)
    const path = key.slice(colonIdx + 1)
    const regexStr = path
      .replace(WILDCARD_MARKER, '\x00WILDCARD\x00')
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace('\x00WILDCARD\x00', '.*')
      .replace(/:[\w]+/g, '[^/]+')
    wildcardPatterns.push({ method, dictKey: key, pattern: new RegExp(`^${regexStr}$`) })
  }
}

const isMatchedByWildcard = (method, path) =>
  wildcardPatterns.some((w) => w.method === method && w.pattern.test(path))

const swaggerExistedKeyInfoMap = new Map([])
const missingDictItems = []
const uselessKeys = []

const specialMap = new Map([['post:/listeners', 'post:/listeners/:id']])
/**
 * method is `get` but will show in audit log
 */
const ignoreArr = ['get:/sso/oidc/callback']

const reg = /\{(\w+)\}/g
const replacePlaceholder = (path) =>
  path.replace(reg, ($0, $1) => {
    return `:${$1}`
  })
const loadSwagger = async () => {
  if (swaggerFile) {
    return JSON.parse(await readFile(swaggerFile, 'utf8'))
  }

  const { data } = await axios.get(`${baseURL}/api-docs/swagger.json`)
  return data
}
const check = async () => {
  const swaggerJSON = await loadSwagger()
  const { paths } = swaggerJSON
  Object.entries(paths).forEach(([rawPathItem, requestMap]) => {
    const pathItem = replacePlaceholder(rawPathItem)
    const requestMethods = Object.entries(requestMap)
    requestMethods.forEach(([method, info]) => {
      if (info.deprecated || method === 'get') {
        return
      }
      const key = `${method}:${pathItem}`
      swaggerExistedKeyInfoMap.set(key, {
        method,
        path: pathItem,
        operation_label: { en: 'TODO', zh: 'TODO' },
        name_label: { en: info.description, zh: 'TODO 中文翻译' },
      })
    })
  })

  for (const [key, info] of swaggerExistedKeyInfoMap) {
    const colonIdx = key.indexOf(':')
    const method = key.slice(0, colonIdx)
    const path = key.slice(colonIdx + 1)
    if (!dictMap.get(key) && !specialMap.get(key) && !isMatchedByWildcard(method, path)) {
      missingDictItems.push(info)
    }
  }

  for (const key of dictMap.keys()) {
    let isSpecialValue = false
    for (const value of specialMap.values()) {
      if (value === key) {
        isSpecialValue = true
      }
    }
    if (isSpecialValue || ignoreArr.includes(key)) {
      continue
    }
    if (key.includes(WILDCARD_MARKER)) {
      // Wildcard entry: useless only if no swagger entry matches its pattern
      const wEntry = wildcardPatterns.find((w) => w.dictKey === key)
      const hasMatch =
        wEntry &&
        [...swaggerExistedKeyInfoMap.keys()].some((swKey) => {
          const colonIdx = swKey.indexOf(':')
          const swMethod = swKey.slice(0, colonIdx)
          const swPath = swKey.slice(colonIdx + 1)
          return wEntry.method === swMethod && wEntry.pattern.test(swPath)
        })
      if (!hasMatch) {
        uselessKeys.push(key)
      }
    } else if (!swaggerExistedKeyInfoMap.get(key)) {
      uselessKeys.push(key)
    }
  }

  if (uselessKeys.length) {
    console.log('📜 Useless Keys\n', JSON.stringify(uselessKeys, null, 2))
  }
  if (missingDictItems.length) {
    console.log('📜 Missing Dict Items\n', JSON.stringify(missingDictItems, null, 2))
    throw new Error('MISSING DICT ITEMS')
  }
}

check()
