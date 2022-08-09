import { PropType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { set } from 'lodash'

export default (): {
  initRecordByComponents: (data: Properties) => Record<string, any>
} => {
  const createInitValueByType = (prop: Property) => {
    const { type } = prop
    switch (type) {
      case PropType.Array:
        return []
      case PropType.Enum:
        return Array.isArray(prop.symbols) && prop.symbols.length > 0 ? prop.symbols[0] : ''
      case PropType.Boolean:
        return false
      case PropType.Number:
        return undefined
      default:
        return ''
    }
  }

  const initRecordByComponents = (data: Properties) => {
    const ret: Record<string, any> = {}
    const walkALevel = (components: Properties) => {
      Object.keys(components).forEach((key) => {
        const propItem = components[key]
        const { default: defaultValue, path, properties } = propItem
        if (!path) {
          return
        }
        if (typeof properties === 'object') {
          set(ret, path, {})
          walkALevel(properties)
        } else {
          const valueToSet = defaultValue || createInitValueByType(propItem)
          set(ret, path, valueToSet)
        }
      })
    }
    walkALevel(data)
    return ret
  }

  return {
    initRecordByComponents,
  }
}
