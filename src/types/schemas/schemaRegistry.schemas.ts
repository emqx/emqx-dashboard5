export type DeleteSchemaRegistryName404Code =
  (typeof DeleteSchemaRegistryName404Code)[keyof typeof DeleteSchemaRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteSchemaRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteSchemaRegistryName404 = {
  code?: DeleteSchemaRegistryName404Code
  message?: string
}

export type PutSchemaRegistryName404Code =
  (typeof PutSchemaRegistryName404Code)[keyof typeof PutSchemaRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSchemaRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSchemaRegistryName404 = {
  code?: PutSchemaRegistryName404Code
  message?: string
}

export type PutSchemaRegistryName200 =
  | SchemaRegistryAvro
  | SchemaRegistryExternalHttp
  | SchemaRegistryJson
  | SchemaRegistryProtobuf

export type PutSchemaRegistryNameBody =
  | SchemaRegistryAvro
  | SchemaRegistryExternalHttp
  | SchemaRegistryJson
  | SchemaRegistryProtobuf

export type GetSchemaRegistryName404Code =
  (typeof GetSchemaRegistryName404Code)[keyof typeof GetSchemaRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSchemaRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetSchemaRegistryName404 = {
  code?: GetSchemaRegistryName404Code
  message?: string
}

export type GetSchemaRegistryName200 =
  | SchemaRegistryGetAvro
  | SchemaRegistryGetExternalHttp
  | SchemaRegistryGetJson
  | SchemaRegistryGetProtobuf

export type PostSchemaRegistryProtobufBundle400Code =
  (typeof PostSchemaRegistryProtobufBundle400Code)[keyof typeof PostSchemaRegistryProtobufBundle400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaRegistryProtobufBundle400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  BAD_FORM_DATA: 'BAD_FORM_DATA',
} as const

export type PostSchemaRegistryProtobufBundle400 = {
  code?: PostSchemaRegistryProtobufBundle400Code
  message?: string
}

export type PostSchemaRegistryProtobufBundleBody = {
  bundle?: Blob
  description?: Blob
  name?: Blob
  root_proto_file?: Blob
}

export type PutSchemaRegistryProtobufBundle404Code =
  (typeof PutSchemaRegistryProtobufBundle404Code)[keyof typeof PutSchemaRegistryProtobufBundle404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSchemaRegistryProtobufBundle404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSchemaRegistryProtobufBundle404 = {
  code?: PutSchemaRegistryProtobufBundle404Code
  message?: string
}

export type PutSchemaRegistryProtobufBundle400Code =
  (typeof PutSchemaRegistryProtobufBundle400Code)[keyof typeof PutSchemaRegistryProtobufBundle400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSchemaRegistryProtobufBundle400Code = {
  BAD_FORM_DATA: 'BAD_FORM_DATA',
} as const

export type PutSchemaRegistryProtobufBundle400 = {
  code?: PutSchemaRegistryProtobufBundle400Code
  message?: string
}

export type PutSchemaRegistryProtobufBundleBody = {
  bundle?: Blob
  description?: Blob
  name?: Blob
  root_proto_file?: Blob
}

export type PutSchemaRegistryExternalRegistryName404Code =
  (typeof PutSchemaRegistryExternalRegistryName404Code)[keyof typeof PutSchemaRegistryExternalRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSchemaRegistryExternalRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSchemaRegistryExternalRegistryName404 = {
  code?: PutSchemaRegistryExternalRegistryName404Code
  message?: string
}

export type GetSchemaRegistryExternalRegistryName404Code =
  (typeof GetSchemaRegistryExternalRegistryName404Code)[keyof typeof GetSchemaRegistryExternalRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSchemaRegistryExternalRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetSchemaRegistryExternalRegistryName404 = {
  code?: GetSchemaRegistryExternalRegistryName404Code
  message?: string
}

export type PostSchemaRegistryExternal400Code =
  (typeof PostSchemaRegistryExternal400Code)[keyof typeof PostSchemaRegistryExternal400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaRegistryExternal400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostSchemaRegistryExternal400 = {
  code?: PostSchemaRegistryExternal400Code
  message?: string
}

export type GetSchemaRegistryExternal200Name = {
  $name?: SchemaRegistryConfluentSchemaRegistry
}

export type GetSchemaRegistryExternal200 = {
  $name?: GetSchemaRegistryExternal200Name
}

export type PostSchemaRegistry400Code =
  (typeof PostSchemaRegistry400Code)[keyof typeof PostSchemaRegistry400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaRegistry400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostSchemaRegistry400 = {
  code?: PostSchemaRegistry400Code
  message?: string
}

export type PostSchemaRegistry201 =
  | SchemaRegistryPostAvro
  | SchemaRegistryPostExternalHttp
  | SchemaRegistryPostJson
  | SchemaRegistryPostProtobuf

export type PostSchemaRegistryBody =
  | SchemaRegistryPostAvro
  | SchemaRegistryPostExternalHttp
  | SchemaRegistryPostJson
  | SchemaRegistryPostProtobuf

export type GetSchemaRegistry200Item =
  | SchemaRegistryGetExternalHttp
  | SchemaRegistryGetJson
  | SchemaRegistryGetProtobuf
  | SchemaRegistryGetAvro

export type SchemaRegistryPutProtobufType =
  (typeof SchemaRegistryPutProtobufType)[keyof typeof SchemaRegistryPutProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryPutProtobufType = {
  protobuf: 'protobuf',
} as const

export interface SchemaRegistryPutProtobuf {
  description?: string
  source: SchemaRegistryPutProtobufSource
  type: SchemaRegistryPutProtobufType
}

export type SchemaRegistryProtobufBundleSourceType =
  (typeof SchemaRegistryProtobufBundleSourceType)[keyof typeof SchemaRegistryProtobufBundleSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryProtobufBundleSourceType = {
  bundle: 'bundle',
} as const

export interface SchemaRegistryProtobufBundleSource {
  root_proto_path?: string
  type: SchemaRegistryProtobufBundleSourceType
}

export type SchemaRegistryPutProtobufSource = SchemaRegistryProtobufBundleSource | string

export type SchemaRegistryProtobufType =
  (typeof SchemaRegistryProtobufType)[keyof typeof SchemaRegistryProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryProtobufType = {
  protobuf: 'protobuf',
} as const

export type SchemaRegistryProtobufSource = SchemaRegistryProtobufBundleSource | string

export interface SchemaRegistryProtobuf {
  description?: string
  source: SchemaRegistryProtobufSource
  type: SchemaRegistryProtobufType
}

export type SchemaRegistryPostProtobufType =
  (typeof SchemaRegistryPostProtobufType)[keyof typeof SchemaRegistryPostProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryPostProtobufType = {
  protobuf: 'protobuf',
} as const

export type SchemaRegistryPostProtobufSource = SchemaRegistryProtobufBundleSource | string

export interface SchemaRegistryPostProtobuf {
  description?: string
  name: string
  source: SchemaRegistryPostProtobufSource
  type: SchemaRegistryPostProtobufType
}

export type SchemaRegistryPostJsonType =
  (typeof SchemaRegistryPostJsonType)[keyof typeof SchemaRegistryPostJsonType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryPostJsonType = {
  json: 'json',
} as const

export interface SchemaRegistryPostJson {
  description?: string
  name: string
  source: string
  type: SchemaRegistryPostJsonType
}

export type SchemaRegistryPostExternalHttpType =
  (typeof SchemaRegistryPostExternalHttpType)[keyof typeof SchemaRegistryPostExternalHttpType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryPostExternalHttpType = {
  external_http: 'external_http',
} as const

export interface SchemaRegistryPostExternalHttp {
  description?: string
  name: string
  parameters: SchemaRegistryExternalHttpParams
  type: SchemaRegistryPostExternalHttpType
}

export type SchemaRegistryPostAvroType =
  (typeof SchemaRegistryPostAvroType)[keyof typeof SchemaRegistryPostAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryPostAvroType = {
  avro: 'avro',
} as const

export interface SchemaRegistryPostAvro {
  description?: string
  name: string
  source: string
  type: SchemaRegistryPostAvroType
}

export type SchemaRegistryJsonType =
  (typeof SchemaRegistryJsonType)[keyof typeof SchemaRegistryJsonType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryJsonType = {
  json: 'json',
} as const

export interface SchemaRegistryJson {
  description?: string
  source: string
  type: SchemaRegistryJsonType
}

export type SchemaRegistryGetProtobufType =
  (typeof SchemaRegistryGetProtobufType)[keyof typeof SchemaRegistryGetProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryGetProtobufType = {
  protobuf: 'protobuf',
} as const

export type SchemaRegistryGetProtobufSource = SchemaRegistryProtobufBundleSource | string

export interface SchemaRegistryGetProtobuf {
  description?: string
  name: string
  source: SchemaRegistryGetProtobufSource
  type: SchemaRegistryGetProtobufType
}

export type SchemaRegistryGetJsonType =
  (typeof SchemaRegistryGetJsonType)[keyof typeof SchemaRegistryGetJsonType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryGetJsonType = {
  json: 'json',
} as const

export interface SchemaRegistryGetJson {
  description?: string
  name: string
  source: string
  type: SchemaRegistryGetJsonType
}

export type SchemaRegistryGetExternalHttpType =
  (typeof SchemaRegistryGetExternalHttpType)[keyof typeof SchemaRegistryGetExternalHttpType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryGetExternalHttpType = {
  external_http: 'external_http',
} as const

export interface SchemaRegistryGetExternalHttp {
  description?: string
  name: string
  node_status?: SchemaRegistryApiNodeStatus[]
  parameters: SchemaRegistryExternalHttpParams
  status?: string
  type: SchemaRegistryGetExternalHttpType
}

export type SchemaRegistryGetAvroType =
  (typeof SchemaRegistryGetAvroType)[keyof typeof SchemaRegistryGetAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryGetAvroType = {
  avro: 'avro',
} as const

export interface SchemaRegistryGetAvro {
  description?: string
  name: string
  source: string
  type: SchemaRegistryGetAvroType
}

export type SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType =
  (typeof SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType)[keyof typeof SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType = {
  confluent: 'confluent',
} as const

export type SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryAuth =
  | SchemaRegistryConfluentSchemaRegistryAuthBasic
  | 'none'

export interface SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistry {
  auth?: SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryAuth
  name: string
  type?: SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType
  url: string
}

export type SchemaRegistryExternalHttpParamsPoolType =
  (typeof SchemaRegistryExternalHttpParamsPoolType)[keyof typeof SchemaRegistryExternalHttpParamsPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryExternalHttpParamsPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type SchemaRegistryExternalHttpParamsHeaders = { [key: string]: unknown }

export interface SchemaRegistryExternalHttpParams {
  connect_timeout?: string
  /** @minimum 1 */
  enable_pipelining?: number
  external_params?: string
  headers?: SchemaRegistryExternalHttpParamsHeaders
  max_inactive?: string
  /** @minimum 0 */
  max_retries?: number
  /** @minimum 1 */
  pool_size?: number
  pool_type?: SchemaRegistryExternalHttpParamsPoolType
  request_timeout?: string
  ssl?: EmqxSslClientOpts
  url: string
}

export type SchemaRegistryExternalHttpType =
  (typeof SchemaRegistryExternalHttpType)[keyof typeof SchemaRegistryExternalHttpType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryExternalHttpType = {
  external_http: 'external_http',
} as const

export interface SchemaRegistryExternalHttp {
  description?: string
  parameters: SchemaRegistryExternalHttpParams
  type: SchemaRegistryExternalHttpType
}

export interface SchemaRegistryConfluentSchemaRegistryAuthBasic {
  password: string
  username: string
}

export type SchemaRegistryConfluentSchemaRegistryType =
  (typeof SchemaRegistryConfluentSchemaRegistryType)[keyof typeof SchemaRegistryConfluentSchemaRegistryType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryConfluentSchemaRegistryType = {
  confluent: 'confluent',
} as const

export type SchemaRegistryConfluentSchemaRegistryAuth =
  | SchemaRegistryConfluentSchemaRegistryAuthBasic
  | 'none'

export interface SchemaRegistryConfluentSchemaRegistry {
  auth?: SchemaRegistryConfluentSchemaRegistryAuth
  type?: SchemaRegistryConfluentSchemaRegistryType
  url: string
}

export type SchemaRegistryAvroType =
  (typeof SchemaRegistryAvroType)[keyof typeof SchemaRegistryAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryAvroType = {
  avro: 'avro',
} as const

export interface SchemaRegistryAvro {
  description?: string
  source: string
  type: SchemaRegistryAvroType
}

export interface SchemaRegistryApiNodeStatus {
  node?: string
  status?: string
}

export type EmqxSslClientOptsVerify =
  (typeof EmqxSslClientOptsVerify)[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

export type EmqxSslClientOptsPartialChain =
  (typeof EmqxSslClientOptsPartialChain)[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  true: true,
  false: false,
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxSslClientOptsLogLevel =
  (typeof EmqxSslClientOptsLogLevel)[keyof typeof EmqxSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsLogLevel = {
  emergency: 'emergency',
  alert: 'alert',
  critical: 'critical',
  error: 'error',
  warning: 'warning',
  notice: 'notice',
  info: 'info',
  debug: 'debug',
  none: 'none',
  all: 'all',
} as const

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  /** @minimum 0 */
  depth?: number
  enable?: boolean
  hibernate_after?: string
  keyfile?: string
  log_level?: EmqxSslClientOptsLogLevel
  partial_chain?: EmqxSslClientOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
  verify?: EmqxSslClientOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}
