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

const sortMetricsKey = (metrics) => {
  const sortedMetrics = Object.keys(metrics).sort((a, b) => a.localeCompare(b))
  const sortedMetricsObj = sortedMetrics.reduce((obj, key) => {
    obj[key] = metrics[key]
    return obj
  }, {})
  return sortedMetricsObj
}
const handleMetricsJSON = (swaggerJSON) => {
  const handleTarget = (key) => {
    const targetObj = swaggerJSON.components.schemas[key].properties
    swaggerJSON.components.schemas[key].properties = sortMetricsKey(targetObj)
  }
  handleTarget('emqx_dashboard_monitor_api.sampler_current')
  handleTarget('emqx_dashboard_monitor_api.sampler_current_node')
  return swaggerJSON
}

const specialHandlers = new Map([
  ['Actions', handleActionJSON],
  ['Sources', handleSourceJSON],
  ['Metrics', handleMetricsJSON],
])

const sortObj = (rawObj) => {
  const sortedKeys = Object.keys(rawObj).sort((a, b) => a.localeCompare(b))
  const sortedObj = sortedKeys.reduce((obj, key) => {
    obj[key] = rawObj[key]
    return obj
  }, {})
  return sortedObj
}

const sortOneofRefs = (oneofRefs) => {
  const sortedRefs = oneofRefs.sort((a, b) => {
    if (a.$ref && b.$ref) {
      return a.$ref.localeCompare(b.$ref)
    }
    return 0
  })
  return sortedRefs
}

const sortDataContent = (data) => {
  if (data.content) {
    Object.values(data.content).forEach((content) => {
      if (content.schema && content.schema.oneOf) {
        content.schema.oneOf = sortOneofRefs(content.schema.oneOf)
      }
    })
  }
}

const sortResult = (swaggerObj) => {
  const { paths, components } = swaggerObj
  swaggerObj.paths = sortObj(paths)
  Object.values(paths).forEach((path) => {
    Object.values(path).forEach((method) => {
      if (method.responses) {
        Object.values(method.responses).forEach((response) => {
          sortDataContent(response)
        })
      }
      if (method.requestBody) {
        sortDataContent(method.requestBody)
      }
    })
  })

  const { parameters, schemas } = components
  components.parameters = sortObj(parameters)

  components.schemas = sortObj(schemas)
  Object.values(components.schemas).forEach((schema) => {
    if (schema.properties) {
      schema.properties = sortObj(schema.properties)
    }
  })

  return swaggerObj
}

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
  return sortResult(removeAllDesc(ret))
}

export default filterTargetSchema
