/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, Ref, watch } from 'vue'
import _ from 'lodash'
import { InjectSchema, Properties, Component, Schema } from '@/types/schemaForm'
import axios from 'axios'
import { flattenObject, unflattenObject } from '@/common/tools'

const CONNECTOR_KEY = 'connector'

/**
 * @param schemaFilePath
 * @param objForGetComponent path or ref; ref first
 * @returns
 */
export default function useSchemaForm(
  schemaFilePath: string,
  objForGetComponent: { path?: string; ref?: string },
): {
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
  const schema: InjectSchema = ref({})
  const loadSchemaConfig = async () => {
    try {
      const configPath = schemaFilePath
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

          // special handling for connector in bridge
          const isTargetConnectorProp =
            key === CONNECTOR_KEY &&
            'oneOf' in property &&
            property.oneOf.some(({ type }) => type === 'string') &&
            property.oneOf.some(({ $ref }) => !!$ref)
          if (isTargetConnectorProp) {
            const refValue = property.oneOf.find(({ $ref }) => !!$ref)?.$ref
            property.$ref = refValue
            Reflect.deleteProperty(property, 'oneOf')
          }

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
    let ref = ''
    if (objForGetComponent.ref) {
      ref = objForGetComponent.ref
    } else if (objForGetComponent.path) {
      const { $ref, type, properties } = data.paths[objForGetComponent.path].get
      if ($ref) {
        ref = $ref
      } else if (type === 'object') {
        const varName = Object.keys(properties).find((key) => /\$\w+/g.test(key))
        if (varName && properties[varName] && properties[varName].$ref) {
          ref = properties[varName].$ref as string
        }
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
