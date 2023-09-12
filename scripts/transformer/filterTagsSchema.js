/* eslint-disable @typescript-eslint/no-var-requires */
const { isObject, get } = require('lodash')

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

const getTargetRequestArr = (swaggerJSON, tags) => {
  const { paths } = swaggerJSON
  const targetRequestArr = []
  Object.entries(paths).forEach(([, methods]) => {
    Object.entries(methods).forEach(([, request]) => {
      if (request.tags.includes(tags)) {
        targetRequestArr.push(request)
      }
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

const filterTargetSchema = (swaggerJSON, tags) => {
  const targetRequestArr = getTargetRequestArr(swaggerJSON, tags)

  const paramRefs = getParamRefsInRequestArr(targetRequestArr)

  const firstLevelRefs = getSchemaRefsInRequestArr(targetRequestArr)
  const schemaRefs = getAllRefsByRefArr(swaggerJSON, firstLevelRefs)

  const ret = keepTargetParam(keepTargetSchema(swaggerJSON, schemaRefs), paramRefs)
  return removeAllDesc(ret)
}

module.exports = filterTargetSchema
