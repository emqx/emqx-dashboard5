/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, Ref, watch } from 'vue'
import _ from 'lodash'
import { InjectSchema, Properties, Component, Schema } from '@/types/schemaForm'
import { useStore } from 'vuex'
import axios from 'axios'
import { flattenObject, unflattenObject } from '@/common/tools'

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
  const schemaRequest = axios.create({
    baseURL: '',
  })
  const store = useStore()
  const schema: InjectSchema = ref({})
  const loadSchemaConfig = async () => {
    try {
      const configPath = `static/hot-config-schema-${store.state.lang}.json`
      const res = await schemaRequest.get(configPath)
      if (res.data) {
        schema.value = res.data
      }
    } catch (error) {
      // ignore error
    }
  }
  loadSchemaConfig()
  const components = ref<Properties>({})
  watch(
    () => schema?.value,
    (val) => {
      handleSchemaChanged(val)
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
    } else if (type === 'object') {
      const varName = Object.keys(properties).find((key) => /\$\w+/g.test(key))
      if (varName && properties[varName] && properties[varName].$ref) {
        ref = properties[varName].$ref as string
      }
    }
    const component = getComponentByRef(data, ref)
    const components = transComponents(component)
    return components
  }
  const handleSchemaChanged = (data: Schema) => {
    components.value = getComponents(data)
  }
  if (schema.value.paths) {
    handleSchemaChanged(schema.value)
  }
  return {
    flattenConfigs: flattenObject,
    unflattenConfigs: unflattenObject,
    schema,
    components,
  }
}
