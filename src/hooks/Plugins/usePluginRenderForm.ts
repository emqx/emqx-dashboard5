import { ref, Ref } from 'vue'

interface PluginUIConfigs {
  record: Ref<Record<string, any>>
  uiConfig: Ref<Record<string, any> | null>
  schema: Ref<Record<string, any> | null>
}

interface AvroSchema {
  type: string | string[]
  name: string
  fields: AvroField[]
  doc?: string
  default?: any
}

interface AvroEnum {
  type: string | string[]
  name: string
  symbols: string[]
  default?: any
  doc?: string
}

interface AvroArray {
  type: string | string[]
  items: AvroSchema | string
  default?: any
  doc?: string
}

interface AvroField {
  name: string
  type: string | string[] | AvroSchema | AvroEnum | AvroArray
  default?: any
  doc?: string
}

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
      }
    }
  })
  return configs
}

export default function usePluginRenderForm(pluginInfo: { name: string }): PluginUIConfigs {
  const record = ref<Record<string, any>>({})

  const uiConfig = ref<Record<string, any> | null>(null)
  const schema = ref<AvroSchema | null>(null)

  async function fetchPluginConfigs(pluginName: string) {
    const uiConfigUrl = `/static/${pluginName}-UI.json`
    const schemaUrl = `/static/${pluginName}-Schema.json`

    try {
      const responses = await Promise.all([fetch(uiConfigUrl), fetch(schemaUrl)])
      const [uiConfigResponse, schemaResponse] = responses
      if (!uiConfigResponse.ok || !schemaResponse.ok) {
        console.error('Failed to fetch plugin UI configs')
        return
      }
      uiConfig.value = Object.freeze(await uiConfigResponse.json())
      schema.value = Object.freeze(await schemaResponse.json()) as AvroSchema
      if (schema.value) {
        console.log(constructObjectFromAvroSchema(schema.value))
      }
    } catch (error) {
      console.error('Error fetching plugin UI configs:', error)
    }
  }

  fetchPluginConfigs(pluginInfo.name)

  return {
    record,
    uiConfig,
    schema,
  }
}
