/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, ref, Ref, watch } from 'vue'
import _ from 'lodash'
import { InjectSchema, Properties, Component, Schema } from '@/types/schemaForm'

export default function useSchemaForm(path: string): {
  schema: InjectSchema
  components: Ref<Properties>
  flattenConfigs: (
    obj: any,
    prefix?: any[],
    current?: {
      [key: string]: any
    },
  ) => {
    [key: string]: any
  }
  unflattenConfigs: (obj: { [key: string]: any }) => {
    [key: string]: any
  }
} {
  const schema: InjectSchema = inject('schema')
  const components = ref<Properties>({})
  watch(
    () => schema?.value,
    (val) => {
      handleInjectChanged(val)
    },
  )
  const filter = (ref: string) => ref.replace('#/', '').split('/')
  // https://www.lodashjs.com/docs/lodash.get
  const getComponentByRef = (data: Schema, ref: string): Component => _.get(data, filter(ref), {})
  const getComponents = (data: Schema) => {
    let lastLabel = ''
    const transComponents = (component: Component, path?: string): Properties => {
      const res: Properties = {}
      const { properties, type } = component
      if (type === 'object' && properties) {
        Object.keys(properties).forEach((key) => {
          const property: Properties[string] = _.cloneDeep(properties[key])
          property.path = path ? `${path}.${key}` : key
          const { $ref, label } = property
          if ($ref) {
            const component = getComponentByRef(data, $ref)
            property.properties = transComponents(component, property.path)
          } else if (property.properties && property.type === 'object') {
            lastLabel = label
            const component: Component = {
              properties: property.properties,
              type: property.type,
            }
            property.properties = transComponents(component, property.path)
          } else if (property.type === 'array' && property.items && property.items.oneOf) {
            property.items.oneOf.forEach((item) => {
              if (item.$ref) {
                const component = getComponentByRef(data, item.$ref)
                item.path = property.path
                item.properties = transComponents(component, item.path)
              }
            })
          }
          if (!label) {
            property.label = lastLabel
          }
          res[key] = property
        })
      }
      return res
    }
    const { $ref, type, properties } = data.paths[path].get
    let ref = ''
    if ($ref) {
      ref = $ref
    } else if (type === 'object' && properties.$name && properties.$name.$ref) {
      ref = properties.$name.$ref
    }
    const component = getComponentByRef(data, ref)
    const components = transComponents(component)
    return components
  }
  const handleInjectChanged = (data: Schema) => {
    components.value = getComponents(data)
  }
  if (schema.value.paths) {
    handleInjectChanged(schema.value)
  }
  // { a: { b: c: 1 } } => { 'a.b.c': 1 }
  const flattenConfigs = (
    obj: { [key: string]: any },
    prefix: any[] = [],
    current: { [key: string]: any } = {},
  ) => {
    if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
      for (const key of Object.keys(obj)) {
        flattenConfigs(obj[key], prefix.concat(key), current)
      }
    } else {
      current[prefix.join('.')] = obj
    }
    return current
  }
  // { 'a.b.c': 1 } => { a: { b: { c: 1 } } }
  const unflattenConfigs = (obj: { [key: string]: any }) => {
    if (Object(obj) !== obj && !Array.isArray(obj)) return obj
    const regex = /\.?([^.[\]]+)|\[(\d+)\]/g
    const resultholder: { [key: string]: any } = {}
    for (const p in obj) {
      let current = resultholder
      let prop = ''
      let m: any
      while ((m = regex.exec(p))) {
        current = current[prop] || (current[prop] = m[2] ? [] : {})
        prop = m[2] || m[1]
      }
      current[prop] = obj[p]
    }
    return resultholder[''] || resultholder
  }
  return {
    flattenConfigs,
    unflattenConfigs,
    schema,
    components,
  }
}
