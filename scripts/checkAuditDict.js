import rawDict from "'../src/views/General/resource_dict.json'"
import axios from 'axios'
const baseURL = process.env.HOST_URL || 'http://localhost:18083'

const dictMap = rawDict.reduce((map, dictItem) => {
  const { method, path, operation_name_label: label, operation_label: typeLabel } = dictItem
  map.set(`${method}:${path}`, { label, typeLabel })
  return map
}, new Map())

const swaggerExistedKeyInfoMap = new Map([])
const missingDictItems = []
const uselessKeys = []

const specialMap = new Map([['post:/listeners', 'post:/listeners/:id']])

const reg = /\{(\w+)\}/g
const replacePlaceholder = (path) =>
  path.replace(reg, ($0, $1) => {
    return `:${$1}`
  })
const check = async () => {
  const { data: swaggerJSON } = await axios.get(`${baseURL}/api-docs/swagger.json`)
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
        operation_name_label: { en: info.description, zh: 'TODO 中文翻译' },
      })
    })
  })
  for (const key of swaggerExistedKeyInfoMap.keys()) {
    if (!dictMap.get(key) && !specialMap.get(key)) {
      missingDictItems.push(swaggerExistedKeyInfoMap.get(key))
    }
  }

  for (let key of dictMap.keys()) {
    let isSpecialValue = false
    for (let value of specialMap.values()) {
      if (value === key) {
        isSpecialValue = true
      }
    }
    if (!swaggerExistedKeyInfoMap.get(key) && !isSpecialValue) {
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
