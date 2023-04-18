/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Properties, Schema } from '@/types/schemaForm'
import axios from 'axios'
import _ from 'lodash'
import { ref, Ref } from 'vue'
import useSchemaFormRules, { SchemaRules } from './useSchemaFormRules'

const CONNECTOR_KEY = 'connector'

/**
 * @param schemaFilePath
 * @param objForGetComponent path or ref; ref first
 * @returns
 */
export default function useSchemaForm(
  schemaFilePath: string,
  objForGetComponent: { path?: string; ref?: string },
  needRules = false,
): {
  rules: Ref<SchemaRules>
  components: Ref<Properties>
  schemaLoadPromise: Promise<void>
  getComponents: (objForGetComponent: { path?: string; ref?: string }) => Properties
  setTypeForProperty: (property: Properties[string]) => Properties[string]
  resetObjForGetComponent: (obj: { path?: string; ref?: string }) => void
} {
  const schemaRequest = axios.create({
    baseURL: '',
  })
  let schema: any = {}
  const { rules, countRules } = useSchemaFormRules()
  /**
   * for get component
   */
  let pathOrRefObj = objForGetComponent

  const loadSchemaConfig = async () => {
    try {
      const configPath = schemaFilePath
      const res = await schemaRequest.get(configPath)
      if (res.data) {
        schema = res.data
        generateComponents()
      }
      return Promise.resolve()
    } catch (error) {
      // ignore error
    }
  }

  const schemaLoadPromise = loadSchemaConfig()
  const components = ref<Properties>({})

  const filter = (ref: string) => ref.replace('#/', '').split('/')
  // https://www.lodashjs.com/docs/lodash.get
  const getComponentByRef = (data: Schema, ref: string): Component => _.get(data, filter(ref), {})

  /**
   * Calling it before components are assigned as much as possible will reduce the number of re-renders,
   * but because sometimes data such as `format` may be custom modified by the parent component
   * and may need to be called again, it needs to be exposed.
   */
  const setTypeForProperty = (property: Properties[string]) => {
    if (property.oneOf && !property.type) {
      property.type = 'oneof'
    } else if (property.type === 'string') {
      if (property.format === 'sql') {
        property.type = 'sql'
      } else if (property.format === 'file') {
        property.type = 'file'
      }
    }
    return property
  }
  const getComponents = (objForGetComponent: { path?: string; ref?: string }) => {
    let lastLabel = ''
    const transComponents = (component: Component, path?: string): Properties => {
      const res: Properties = {}
      const { properties, type } = component
      if (type === 'object' && properties) {
        if (needRules) {
          countRules(component, path)
        }
        Object.keys(properties).forEach((key) => {
          const property: Properties[string] = _.cloneDeep(properties[key])
          // remove deprecated prop
          if (property.deprecated) {
            return
          }
          // hide token
          if (typeof property.label === 'string' && /token/i.test(property.label)) {
            property.format === 'password'
          }
          property.path = path ? `${path}.${key}` : key
          property.key = key

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
            const component = getComponentByRef(schema, $ref)
            property.properties = transComponents(component, property.path)
          } else if (property.properties && property.type === 'object') {
            lastLabel = label
            const component: Component = {
              properties: property.properties,
              type: property.type,
            }
            property.properties = transComponents(component, property.path)
          } else if (property.type === 'array' && property.items) {
            if (property.items.oneOf) {
              property.items.oneOf.forEach((item) => {
                if (item.$ref) {
                  const component = getComponentByRef(schema, item.$ref)
                  item.path = property.path
                  // TODO:maybe useless?
                  item.key = key
                  item.properties = transComponents(component, item.path)
                }
              })
            } else if (property.items.$ref) {
              const component = getComponentByRef(schema, property.items.$ref)
              property.items.path = property.path
              property.properties = transComponents(component, property.items.path)
            }
          }
          if (!label) {
            property.label = lastLabel
          }
          res[key] = setTypeForProperty(property)
        })
      }
      return res
    }
    let ref = ''
    if (objForGetComponent.ref) {
      ref = objForGetComponent.ref
    } else if (objForGetComponent.path) {
      const { $ref, type, properties } = schema.paths[objForGetComponent.path].get
      if ($ref) {
        ref = $ref
      } else if (type === 'object') {
        const varName = Object.keys(properties).find((key) => /\$\w+/g.test(key))
        if (varName && properties[varName] && properties[varName].$ref) {
          ref = properties[varName].$ref as string
        }
      }
    }
    const component = getComponentByRef(schema, ref)
    const components = transComponents(component)
    return components
  }
  const generateComponents = () => {
    if (needRules) {
      // for init
      rules.value = {}
    }
    components.value = getComponents(pathOrRefObj)
  }

  /**
   * will refresh component
   */
  const resetObjForGetComponent = (obj: { path?: string; ref?: string }) => {
    pathOrRefObj = obj
    generateComponents()
  }

  return {
    rules,
    components,
    schemaLoadPromise,
    getComponents,
    setTypeForProperty,
    resetObjForGetComponent,
  }
}
