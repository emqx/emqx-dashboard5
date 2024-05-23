import { PropType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { set } from 'lodash'

export default (): {
  createInitValueByType: (prop: Property) => any
  initRecordByComponents: (data: Properties) => Record<string, any>
} => {
  const createInitValueByType = (prop: Property): any => {
    const { type, default: dV } = prop
    if (dV !== undefined) {
      return dV
    }
    switch (type) {
      case PropType.Array:
        return []
      case PropType.Enum:
        return Array.isArray(prop.symbols) && prop.symbols.length > 0 ? prop.symbols[0] : ''
      case PropType.Boolean:
        return false
      case PropType.Number:
        return undefined
      case PropType.Object:
        return {}
      default:
        return ''
    }
  }

  const initRecordByComponents = (data: Properties) => {
    const ret: Record<string, any> = {}
    const walkALevel = (components: Properties) => {
      Object.keys(components).forEach((key) => {
        const propItem = components[key]
        const { path, properties } = propItem
        if (!path) {
          return
        }
        if (typeof properties === 'object') {
          set(ret, path, {})
          walkALevel(properties)
        } else {
          const valueToSet = createInitValueByType(propItem)
          set(ret, path, valueToSet)
        }
      })
    }
    walkALevel(data)
    return ret
  }

  return {
    createInitValueByType,
    initRecordByComponents,
  }
}
