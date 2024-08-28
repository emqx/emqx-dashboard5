import { computed, ref, Ref } from 'vue'
import { useStore } from 'vuex'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import { AvroEnum, AvroSchema, PluginUIConfigForm, PluginUIConfigs } from '@/types/plugin'
import { getPluginConfigs, getPluginSchema, updatePluginConfigs } from '@/api/plugins'
import { AvroJsonToObject, objectToAvroJson } from './avroUtils'
import avro from 'avsc'
import { isUndefined } from 'lodash'

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

interface Field {
  name: string
  type: any
  default?: any
  $ui?: any
}

const getFieldOrder = (field: Field) => (!isUndefined(field.$ui?.order) ? field.$ui.order : 9999)
const orderFields = (fields: Array<Field>) =>
  fields.sort((a, b) => getFieldOrder(a) - getFieldOrder(b))

/**
 * Extracts UI configurations from a given schema.
 *
 * @param schema - The schema object containing fields and their configurations.
 * @returns The extracted UI configurations in the form of an object.
 */
function extractUIConfigs(schema: { fields: Array<Field> }): {
  $form: { [key: string]: PluginUIConfigForm }
} {
  const uiConfigs: { $form: { [key: string]: PluginUIConfigForm } } = { $form: {} }
  orderFields(schema.fields).forEach((field) => {
    if (field.$ui) {
      const { name } = field
      const uiConfig = { ...field.$ui }
      uiConfigs.$form[name] = uiConfig
    } else {
      const { type, name } = field
      if (typeof type === 'object' && type.type === 'record' && type.fields.length !== 0) {
        const extracted = extractUIConfigs({ fields: type.fields })
        if (!isEmptyObj(extracted.$form)) {
          uiConfigs.$form[name] = { children: extracted.$form }
        }
      }
    }
  })
  return uiConfigs
}

/**
 * Replaces the internationalization (i18n) placeholders in the given plugin UI configuration form
 * with the corresponding translations based on the provided i18n configurations and language.
 *
 * @param configs - The plugin UI configuration form to modify.
 * @param i18nConfigs - The i18n configurations containing the translations for the placeholders.
 * @param lang - The language code ('zh' for Chinese, 'en' for English) to determine the translation to use.
 * @returns The modified plugin UI configuration form with the i18n placeholders replaced.
 */
function replaceI18nInConfigs(
  configs: PluginUIConfigForm,
  i18nConfigs: Record<string, any>,
  lang: 'zh' | 'en',
): PluginUIConfigForm {
  for (const key in configs) {
    if (typeof configs[key] === 'object') {
      replaceI18nInConfigs(configs[key], i18nConfigs, lang)
    } else if (['label', 'description', 'message'].includes(key) && configs[key].startsWith('$')) {
      const i18nKey = configs[key]
      if (i18nConfigs[i18nKey]) {
        configs[key] = i18nConfigs[i18nKey][lang]
      }
    }
  }
  return configs
}

export interface PluginUI {
  record: Ref<Record<string, any>>
  uiConfigs: Ref<PluginUIConfigs | null>
  schema: Ref<Record<string, any> | null>
  schemaLoading: Ref<boolean>
  i18nConfigs: Ref<Record<string, any> | null>
  fetchPluginSchema: (pluginName: string, pluginVersion: string) => Promise<void>
  fetchPluginConfigs: (pluginName: string, pluginVersion: string) => Promise<void>
  savePluginsConfigs: (
    pluginName: string,
    pluginVersion: string,
    data: Record<string, any>,
  ) => Promise<void>
}

export default function usePluginRenderForm(): PluginUI {
  const record = ref<Record<string, any>>({})
  const uiConfigs = ref<PluginUIConfigs | null>(null)
  const i18nConfigs = ref<Record<string, any> | null>(null)
  const schema = ref<AvroSchema | null>(null)
  // Default true to prevent UI display before schema loads
  const schemaLoading = ref(true)

  const store = useStore()

  const lang = computed<'zh' | 'en'>(() => {
    return store.state.lang
  })

  async function fetchPluginSchema(pluginName: string, pluginVersion: string) {
    schemaLoading.value = true
    try {
      const { avsc, i18n } = await getPluginSchema(pluginName, pluginVersion)
      schema.value = avsc
      i18nConfigs.value = i18n
      if (schema.value) {
        record.value = constructObjectFromAvroSchema(schema.value)
        const extracted = extractUIConfigs(schema.value)
        uiConfigs.value = isEmptyObj(extracted.$form) ? null : extracted
        if (
          i18nConfigs.value !== null &&
          !isEmptyObj(i18nConfigs.value) &&
          uiConfigs.value !== null &&
          !isEmptyObj(uiConfigs.value.$form)
        ) {
          uiConfigs.value.$form = replaceI18nInConfigs(
            uiConfigs.value.$form,
            i18nConfigs.value,
            lang.value,
          )
        }
      }
    } catch (error) {
      // ignore error
    } finally {
      schemaLoading.value = false
    }
  }

  async function fetchPluginConfigs(pluginName: string, pluginVersion: string) {
    try {
      const configs = await getPluginConfigs(pluginName, pluginVersion)
      if (configs !== null && !isEmptyObj(configs)) {
        const decodeConfigs = await AvroJsonToObject(schema.value as avro.Schema, configs)
        record.value = decodeConfigs
      } else if (schema.value) {
        record.value = constructObjectFromAvroSchema(schema.value)
      }
    } catch (error) {
      // ignore error
    }
  }

  async function savePluginsConfigs(
    pluginName: string,
    pluginVersion: string,
    data: Record<string, any>,
  ): Promise<void> {
    const encodedData = await objectToAvroJson(schema.value as avro.Schema, data)
    return await updatePluginConfigs(pluginName, pluginVersion, encodedData)
  }

  return {
    record,
    uiConfigs,
    schema,
    schemaLoading,
    i18nConfigs,
    fetchPluginSchema,
    fetchPluginConfigs,
    savePluginsConfigs,
  }
}
