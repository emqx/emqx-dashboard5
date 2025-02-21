/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropType } from '@/types/enum'
import { Component, Properties, Property, Schema } from '@/types/schemaForm'
import axios from 'axios'
import useSchemaFormRules, { SchemaRules } from './useSchemaFormRules'
import useSchemaRecord from './useSchemaRecord'

const CONNECTOR_CONF_KEYS = 'connector'

const keysNeedRemove = ['label', 'description', 'summary']
const removeUselessKey = (obj: any) => {
  for (const key in obj) {
    const value = obj[key]
    if (value && typeof value === 'object') {
      removeUselessKey(value)
    } else if (keysNeedRemove.includes(key) && typeof value === 'string') {
      if (key === 'label' || key === 'description' || key === 'summary') {
        delete obj[key]
      }
    }
  }
  return obj
}

/**
 * @param schemaFilePath
 * @param objForGetComponent path or ref; ref first
 * @returns
 */
export default function useSchemaForm(
  schemaFilePath: string,
  objForGetComponent: { path?: string; ref?: string | Array<string> },
  needRules = false,
): {
  rules: Ref<SchemaRules>
  components: Ref<Properties>
  schemaLoadPromise: Promise<void>
  getComponents: (objForGetComponent: { path?: string; ref?: string | Array<string> }) => Properties
  setTypeForProperty: (property: Properties[string]) => Properties[string]
  resetObjForGetComponent: (obj: { path?: string; ref?: string | Array<string> }) => void
} {
  const { getters, commit } = useStore()

  const schemaRequest = axios.create({
    baseURL: '',
  })
  let schema: any = {}
  const { rules, setToRules, countRules } = useSchemaFormRules()
  const { initRecordByComponents } = useSchemaRecord()
  /**
   * for get component
   */
  let pathOrRefObj = objForGetComponent

  const components = ref<Properties>({})

  const loadSchemaConfig = async () => {
    try {
      const configPath = schemaFilePath
      const data = getters.getSchema(configPath)
      if (data) {
        schema = data
      } else {
        const res = await schemaRequest.get(configPath)
        if (res.data) {
          schema = removeUselessKey(res.data)
          commit('SET_SCHEMA_DATA', { key: configPath, data: cloneDeep(schema) })
        }
      }
      if (schema) {
        generateComponents()
      }
      return Promise.resolve()
    } catch (error) {
      // ignore error
    }
  }

  const filter = (ref: string | Array<string>) => {
    if (Array.isArray(ref)) {
      return ref
    }
    return ref.replace('#/', '').split('/')
  }
  // https://www.lodashjs.com/docs/lodash.get
  const getComponentByRef = (data: Schema, ref: string | Array<string>): Component =>
    get(data, filter(ref), {})

  const getIsTemplateFromOneOfArr = (oneof: Property['oneOf']): boolean => {
    if (!oneof) {
      return false
    }
    return oneof.some((item) => item.is_template)
  }

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
      } else if (property.path === CONNECTOR_CONF_KEYS) {
        property.type = 'connector'
      }
    } else if (property.type === 'integer') {
      property.type = 'number'
    }
    return property
  }
  const simpleTypes = ['string', 'number', 'boolean', 'integer']
  const getComponents = (objForGetComponent: { path?: string; ref?: string | Array<string> }) => {
    let lastLabel = ''
    /**
     * @param component component
     * @param path ref path
     * @param withRules Some places may require special processing by self
     * @returns Properties
     */
    const transComponents = (
      component: Component,
      path?: string,
      withRules = needRules,
    ): Properties => {
      const res: Properties = {}
      const { properties, type } = component
      if (type === 'object' && properties) {
        if (withRules) {
          setToRules(component, path)
        }
        Object.keys(properties).forEach((key) => {
          let property: Properties[string] = cloneDeep(properties[key])
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

          // If the length of `oneof` is 1, replace it directly
          if (property.oneOf && property.oneOf.length === 1) {
            const oneOfItem = property.oneOf[0]
            property = { ...property, ...oneOfItem }
            delete property.oneOf
          }

          const { $ref, label, oneOf } = property

          if ($ref) {
            const component = getComponentByRef(schema, $ref)
            property.properties = transComponents(component, property.path, withRules)
          } else if (property.properties && property.type === 'object') {
            lastLabel = label
            const component: Component = {
              properties: property.properties,
              type: property.type,
            }
            property.properties = transComponents(component, property.path, withRules)
          } else if (property.type === 'array' && property.items) {
            if (property.items.oneOf) {
              property.items.oneOf.forEach((item) => {
                if (item.$ref) {
                  const component = getComponentByRef(schema, item.$ref)
                  item.path = property.path
                  item.key = key
                  item.properties = transComponents(component, item.path, withRules)
                }
              })
            } else if (property.items.$ref) {
              const component = getComponentByRef(schema, property.items.$ref)
              property.items.path = property.path
              /**
               * Here's a bug that could be exploited
               * The rule set for array type items is wrong.
               */
              property.items.properties = transComponents(component, property.items.path, withRules)
            }
          } else if (oneOf) {
            property.oneOf = oneOf.map((item) => {
              if (item.$ref) {
                const component = getComponentByRef(schema, item.$ref)
                item.properties = transComponents(component, property.path, false)
                item.rules = countRules(component, {}, property.path)
                if (property.path) {
                  // Because when oneof refs takes the default, it does not take the default of the fields in sequence,
                  // but the default of the ref, so it needs to be processed here.
                  item.default = get(
                    initRecordByComponents(item.properties),
                    property.path,
                    withRules,
                  )
                }
              } else if (item.type === 'object' && item.properties) {
                return transComponents(item as Component, property.path, withRules)
              } else {
                setTypeForProperty(item)
              }
              return item
            }) as Property[]
            property.is_template = property.is_template ?? getIsTemplateFromOneOfArr(property.oneOf)
            const isSimpleOneof = oneOf.every(({ type }) => simpleTypes.includes(type))
            if (isSimpleOneof && property.is_template) {
              const justWithBoolean =
                oneOf.length === 2 &&
                oneOf.every(({ type }) =>
                  [PropType.Boolean, PropType.String].includes(type as PropType),
                )
              property.type = justWithBoolean ? 'enum' : 'string'
              property.symbols = justWithBoolean ? [true, false] : undefined
              property.default = property.default ?? (justWithBoolean ? '' : undefined)
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
    let ref: string | Array<string> = ''
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
  const resetObjForGetComponent = (obj: { path?: string; ref?: string | Array<string> }) => {
    pathOrRefObj = obj
    generateComponents()
  }

  const schemaLoadPromise = loadSchemaConfig()

  return {
    rules,
    components,
    schemaLoadPromise,
    getComponents,
    setTypeForProperty,
    resetObjForGetComponent,
  }
}
