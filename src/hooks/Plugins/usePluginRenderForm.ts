import { AvroEnum, AvroSchema, PluginUIConfigForm, PluginUIConfigs } from '@/types/plugin'
import { ref, Ref } from 'vue'

export interface PluginUI {
  record: Ref<Record<string, any>>
  uiConfigs: Ref<PluginUIConfigs | null>
  schema: Ref<Record<string, any> | null>
}

/**
 * Returns the default value for a given basic type.
 *
 * @param type - The basic type for which to get the default value.
 * @returns The default value for the given basic type.
 */
function getDefaultForBasicType(type: string): any {
  switch (type) {
    case 'string':
      return ''
    case 'int':
    case 'long':
    case 'float':
    case 'double':
      return 0
    case 'boolean':
      return false
    default:
      // For unknown types, return null as a safe default
      return null
  }
}

/**
 * Constructs an object from an Avro schema.
 *
 * @param schema - The Avro schema to construct the object from.
 * @returns The constructed object.
 */
function constructObjectFromAvroSchema(schema: AvroSchema): any {
  const configs: Record<string, any> = {}
  schema.fields.forEach((field) => {
    // Handle basic types and union types with a default value
    if (typeof field.type === 'string') {
      configs[field.name] =
        field.default !== undefined ? field.default : getDefaultForBasicType(field.type as string)
    } else if (Array.isArray(field.type)) {
      configs[field.name] =
        field.default !== undefined
          ? field.default
          : getDefaultForBasicType(field.type[0] as string)
    } else if (typeof field.type === 'object') {
      // Handle complex types (record, enum, array)
      let enumType: AvroEnum
      switch (field.type.type) {
        case 'record':
          configs[field.name] = constructObjectFromAvroSchema(field.type as AvroSchema)
          break
        case 'enum':
          enumType = field.type as AvroEnum // Assign the value inside the case block
          configs[field.name] = field.default !== undefined ? field.default : enumType.symbols[0]
          break
        case 'array':
          configs[field.name] = field.default !== undefined ? field.default : []
          break
        case 'map':
          configs[field.name] = field.default !== undefined ? field.default : {}
          break
        default:
          // For unknown types, use null as a safe default
          configs[field.name] = null
      }
    }
  })
  return configs
}

/**
 * Extracts UI configurations from a given schema.
 *
 * @param schema - The schema object containing fields and their configurations.
 * @returns The extracted UI configurations in the form of an object.
 */
function extractUIConfigs(schema: {
  fields: Array<{
    name: string
    type: any
    default?: any
    $ui?: any
  }>
}): { $form: { [key: string]: PluginUIConfigForm } } {
  const uiConfigs: { $form: { [key: string]: PluginUIConfigForm } } = { $form: {} }
  schema.fields.forEach((field) => {
    if (field.$ui) {
      const { name } = field
      const uiConfig = { ...field.$ui }
      uiConfigs.$form[name] = uiConfig
    } else {
      const { type, name } = field
      if (typeof type === 'object' && type.type === 'record' && type.fields.length !== 0) {
        const nestedUIConfig = extractUIConfigs({ fields: type.fields }).$form
        uiConfigs.$form[name] = { children: nestedUIConfig }
      }
    }
  })
  return uiConfigs
}

export default function usePluginRenderForm(pluginInfo: { name: string }): PluginUI {
  const record = ref<Record<string, any>>({})

  const uiConfigs = ref<PluginUIConfigs | null>(null)
  const schema = ref<AvroSchema | null>(null)

  async function fetchPluginConfigs(pluginName: string) {
    const schemaUrl = `/static/${pluginName}-Schema.json`

    try {
      const schemaResponse = await fetch(schemaUrl)
      if (!schemaResponse.ok) {
        console.error('Failed to fetch plugin UI configs')
        return
      }
      schema.value = Object.freeze(await schemaResponse.json())
      if (schema.value) {
        record.value = constructObjectFromAvroSchema(schema.value)
        uiConfigs.value = Object.freeze(extractUIConfigs(schema.value))
      }
    } catch (error) {
      console.error('Error fetching plugin UI configs:', error)
    }
  }

  fetchPluginConfigs(pluginInfo.name)

  return {
    record,
    uiConfigs,
    schema,
  }
}
