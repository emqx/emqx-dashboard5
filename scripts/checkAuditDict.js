const rawDict = require('../src/views/General/resource_dict.json')
const axios = require('axios')

const dict = rawDict.reduce((obj, dictItem) => {
  const { method, path, operation_name_label: label, operation_label: typeLabel } = dictItem
  obj[`${method}:${path}`] = { label, typeLabel }
  return obj
}, {})

const swaggerExistedKeys = []
const missingKeys = []
const uselessKeys = []
const duplicatedContent = []

const reg = /\{(\w+)\}/g
const replacePlaceholder = (path) =>
  path.replace(reg, ($0, $1) => {
    return `:${$1}`
  })
const check = async () => {
  const { data: swaggerJSON } = await axios.get('http://localhost:18083/api-docs/swagger.json')
  const { paths } = swaggerJSON
  Object.entries(paths).forEach(([rawPathItem, requestMap]) => {
    const pathItem = replacePlaceholder(rawPathItem)
    const requestMethods = Object.keys(requestMap)
    requestMethods.forEach((method) => {
      if (method === 'get') {
        return
      }
      const key = `${method}:${pathItem}`
      swaggerExistedKeys.push(key)
    })
  })
  swaggerExistedKeys.forEach((key) => {
    if (!dict[key]) {
      missingKeys.push(key)
    }
  })
  Object.keys(dict).forEach((key) => {
    if (!swaggerExistedKeys.includes(key)) {
      uselessKeys.push(key)
    }
  })
  console.table(missingKeys)
  console.table(uselessKeys)

  const dictKeyValuePairs = Object.entries(dict)
  for (let index = 0; index < dictKeyValuePairs.length; index++) {
    const { label } = dictKeyValuePairs[index][1]
    const { en, zh } = label
    for (let j = index + 1; j < dictKeyValuePairs.length; j++) {
      const { label: labelForCompare } = dictKeyValuePairs[j][1]
      const { en: enForCompare, zh: zhForCompare } = labelForCompare
      if (en === enForCompare || zh === zhForCompare) {
        duplicatedContent.push(rawDict[index], rawDict[j])
      }
    }
  }

  console.log(JSON.stringify(duplicatedContent, null, 2))
}

check()
