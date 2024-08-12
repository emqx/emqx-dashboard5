import { PluginStatus } from './enum'

export interface PluginItem {
  running_status: Array<{
    node: string
    status: PluginStatus
  }>
  authors: Array<string>
  builder: {
    contact: string
    name: string
    website: string
  }
  built_on_otp_release: string
  compatibility: {
    emqx: string
  }
  date: string
  description: string
  functionality: Array<string>
  git_ref: string
  metadata_vsn: string
  name: string
  rel_apps: Array<string>
  rel_vsn: string
  repo: string
  git_commit_or_build_date: string
  with_config_schema?: boolean
}

export interface PluginDetail extends PluginItem {
  readme: string
}

interface Metadata {
  author: string
  release_date: string
  links: Array<{
    name: string
    link: string
  }>
  licenses: any[]
  emqx_version: Array<string>
}

type AvroType =
  | 'string'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'boolean'
  | 'record'
  | 'enum'
  | 'array'
  | 'map'
  | 'null'

export interface AvroSchema {
  type: string | string[]
  name: string
  fields: Array<{
    name: string
    type: string | string[] | AvroArray | AvroEnum | AvroSchema
    default?: any
    $ui?: PluginUIConfigForm
  }>
  doc?: string
  default?: any
}

export interface AvroEnum {
  type: string | string[]
  name: string
  symbols: string[]
  default?: any
  doc?: string
}

export interface AvroArray {
  type: string | string[]
  items: AvroSchema | string
  default?: any
  doc?: string
}

interface Rule {
  type: 'pattern' | 'range' | 'length'
  pattern?: string | number
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  message: string
}

interface ConfigOption {
  label: string
  value: string | number | boolean
}

type ComponentType =
  | 'input'
  | 'input-password'
  | 'input-number'
  | 'input-textarea'
  | 'switch'
  | 'select'
  | 'code-editor'
  | 'input-array'
  | 'key-value-editor'
  | 'maps-editor'

interface ConfigField {
  label: string
  description: string
  flex: number
  component: ComponentType
  required?: boolean
  rules?: Rule[]
  options?: ConfigOption[]
  type?: AvroType
  items?: {
    [key: string]: {
      label: string
      description: string
      type: string
      order?: number
    }
  }
  format: 'sql' | 'json'
  children: PluginUIConfigForm
}

interface PluginUIConfigForm {
  [key: string]: ConfigFields
}

export interface PluginUIConfigs {
  $form: PluginUIConfigForm
}
