/* eslint-disable @typescript-eslint/no-var-requires */
const { isObject, get, set } = require('lodash')

const paramRefReg = /^#\/components\/parameters\//
const schemaRefReg = /^#\/components\/schemas\//

const removeAllDesc = (swaggerJSON) => {
  const walk = (target) => {
    if (typeof target !== 'object') return
    Object.entries(target).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => walk(item))
      } else if (isObject(value)) {
        walk(value)
      } else if (typeof value === 'string' && key === 'description') {
        Reflect.deleteProperty(target, key)
      }
    })
  }
  walk(swaggerJSON)
  return swaggerJSON
}

const filterUselessRequest = (swaggerJSON, tag) => {
  const ret = swaggerJSON
  const { paths } = swaggerJSON
  Object.entries(paths).forEach(([path, methodRequestMap]) => {
    Object.entries(methodRequestMap).forEach(([method, request]) => {
      if (!request.tags.includes(tag)) {
        Reflect.deleteProperty(methodRequestMap, method)
      }
    })
    if (Object.keys(methodRequestMap).length === 0) {
      Reflect.deleteProperty(paths, path)
    }
  })
  return ret
}

const getTargetRequestArr = (swaggerJSON) => {
  const { paths } = swaggerJSON
  const targetRequestArr = []
  Object.entries(paths).forEach(([, methods]) => {
    Object.entries(methods).forEach(([, request]) => {
      targetRequestArr.push(request)
    })
  })
  return targetRequestArr
}

const removeRefRoot = (ref) => ref.replace(/^#\//, '')

const getParamRefsInRequestArr = (requestArr) => {
  return [
    ...requestArr.reduce((set, request) => {
      const { parameters } = request
      if (!parameters) return set
      const refs = parameters.reduce((arr, { $ref }) => {
        if ($ref && typeof $ref === 'string' && paramRefReg.test($ref)) {
          arr.push($ref)
        }
        return arr
      }, [])
      refs.forEach((ref) => set.add(ref))
      return set
    }, new Set()),
  ]
}

const getSchemaRefsInRequest = (requestItem) => {
  const refArr = []
  const walk = (target) => {
    Object.entries(target).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => walk(item))
      } else if (isObject(value)) {
        walk(value)
      } else if (typeof value === 'string' && key === '$ref' && schemaRefReg.test(value)) {
        refArr.push(value)
      }
    })
  }
  walk(requestItem)
  return refArr
}

const getSchemaRefsInRequestArr = (requestArr) => {
  const refsArr = requestArr.reduce((set, item) => {
    const refs = getSchemaRefsInRequest(item)
    refs.forEach((ref) => set.add(ref))
    return set
  }, new Set())
  return Array.from(refsArr)
}

const getPathByRef = (ref) => removeRefRoot(ref).split('/')

const deepTraversalRefToGetAllRefs = (swaggerJSON, ref) => {
  const allRefs = []
  const walk = (target) => {
    if (typeof target !== 'object') return
    Object.entries(target).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => walk(item))
      } else if (isObject(value)) {
        walk(value)
      } else if (typeof value === 'string' && key === '$ref') {
        allRefs.push(value)
        const refObj = get(swaggerJSON, getPathByRef(value))
        walk(refObj)
      }
    })
  }
  const refObj = get(swaggerJSON, getPathByRef(ref))
  walk(refObj)
  return allRefs
}

const getAllRefsByRefArr = (swaggerJSON, refArr) => {
  const allRefs = refArr.reduce((set, ref) => {
    const refs = deepTraversalRefToGetAllRefs(swaggerJSON, ref)
    refs.forEach((ref) => set.add(ref))
    set.add(ref)
    return set
  }, new Set())
  return Array.from(allRefs)
}

const keepTargetParam = (swaggerJSON, refs) => {
  const sortedRefs = refs.sort((a, b) => a.localeCompare(b))
  const params = sortedRefs.reduce((obj, ref) => {
    const path = getPathByRef(ref)
    const key = path[path.length - 1]
    obj[key] = get(swaggerJSON, path)
    return obj
  }, {})
  swaggerJSON.components.parameters = params
  return swaggerJSON
}

const keepTargetSchema = (swaggerJSON, refs) => {
  const sortedRefs = refs.sort((a, b) => a.localeCompare(b))
  const schemas = sortedRefs.reduce((obj, ref) => {
    const path = getPathByRef(ref)
    const key = path[path.length - 1]
    obj[key] = get(swaggerJSON, path)
    return obj
  }, {})
  swaggerJSON.components.schemas = schemas
  return swaggerJSON
}

const handleActionJSON = (swaggerJSON) => {
  const path = [
    'paths',
    '/action_types',
    'get',
    'responses',
    '200',
    'content',
    'application/json',
    'schema',
    'items',
    'enum',
  ]
  const enums = get(swaggerJSON, path)
  if (enums) {
    set(swaggerJSON, path, enums.sort())
  }
  return swaggerJSON
}

const handleSourceJSON = (swaggerJSON) => {
  const path = [
    'paths',
    '/source_types',
    'get',
    'responses',
    '200',
    'content',
    'application/json',
    'schema',
    'items',
    'enum',
  ]
  const enums = get(swaggerJSON, path)
  if (enums) {
    set(swaggerJSON, path, enums.sort())
  }
  return swaggerJSON
}

const specialHandlers = new Map([
  ['Actions', handleActionJSON],
  ['Sources', handleSourceJSON],
])

const filterTargetSchema = (swaggerJSON, tag) => {
  const filteredUselessPathsJSON = filterUselessRequest(swaggerJSON, tag)
  const targetRequestArr = getTargetRequestArr(filteredUselessPathsJSON, tag)
  const paramRefs = getParamRefsInRequestArr(targetRequestArr)

  const firstLevelRefs = getSchemaRefsInRequestArr(targetRequestArr)
  const schemaRefs = getAllRefsByRefArr(filteredUselessPathsJSON, firstLevelRefs)

  let ret = keepTargetParam(keepTargetSchema(filteredUselessPathsJSON, schemaRefs), paramRefs)
  const specialHandler = specialHandlers.get(tag)
  if (specialHandler) {
    ret = specialHandler(ret)
  }
  return removeAllDesc(ret)
}

module.exports = filterTargetSchema
