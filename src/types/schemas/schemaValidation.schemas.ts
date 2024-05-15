export type PostSchemaValidationsValidationNameEnableEnable404Code =
  typeof PostSchemaValidationsValidationNameEnableEnable404Code[keyof typeof PostSchemaValidationsValidationNameEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaValidationsValidationNameEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostSchemaValidationsValidationNameEnableEnable404 = {
  code?: PostSchemaValidationsValidationNameEnableEnable404Code
  message?: string
}

export type PostSchemaValidationsValidationNameEnableEnable400Code =
  typeof PostSchemaValidationsValidationNameEnableEnable400Code[keyof typeof PostSchemaValidationsValidationNameEnableEnable400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaValidationsValidationNameEnableEnable400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostSchemaValidationsValidationNameEnableEnable400 = {
  code?: PostSchemaValidationsValidationNameEnableEnable400Code
  message?: string
}

export type PutSchemaValidations404Code =
  typeof PutSchemaValidations404Code[keyof typeof PutSchemaValidations404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSchemaValidations404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSchemaValidations404 = {
  code?: PutSchemaValidations404Code
  message?: string
}

export type PutSchemaValidations400Code =
  typeof PutSchemaValidations400Code[keyof typeof PutSchemaValidations400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSchemaValidations400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutSchemaValidations400 = {
  code?: PutSchemaValidations400Code
  message?: string
}

export type PostSchemaValidations400Code =
  typeof PostSchemaValidations400Code[keyof typeof PostSchemaValidations400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaValidations400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostSchemaValidations400 = {
  code?: PostSchemaValidations400Code
  message?: string
}

export type GetSchemaValidationsValidationName404Code =
  typeof GetSchemaValidationsValidationName404Code[keyof typeof GetSchemaValidationsValidationName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSchemaValidationsValidationName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetSchemaValidationsValidationName404 = {
  code?: GetSchemaValidationsValidationName404Code
  message?: string
}

export type DeleteSchemaValidationsValidationName404Code =
  typeof DeleteSchemaValidationsValidationName404Code[keyof typeof DeleteSchemaValidationsValidationName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteSchemaValidationsValidationName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteSchemaValidationsValidationName404 = {
  code?: DeleteSchemaValidationsValidationName404Code
  message?: string
}

export type PostSchemaValidationsValidationNameMetricsReset404Code =
  typeof PostSchemaValidationsValidationNameMetricsReset404Code[keyof typeof PostSchemaValidationsValidationNameMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaValidationsValidationNameMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostSchemaValidationsValidationNameMetricsReset404 = {
  code?: PostSchemaValidationsValidationNameMetricsReset404Code
  message?: string
}

export type PostSchemaValidationsReorder400Code =
  typeof PostSchemaValidationsReorder400Code[keyof typeof PostSchemaValidationsReorder400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaValidationsReorder400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostSchemaValidationsReorder400 = {
  not_found?: string[]
  not_reordered?: string[]
  duplicated?: string[]
  code?: PostSchemaValidationsReorder400Code
  message?: string
}

export type GetSchemaValidationsValidationNameMetrics404Code =
  typeof GetSchemaValidationsValidationNameMetrics404Code[keyof typeof GetSchemaValidationsValidationNameMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSchemaValidationsValidationNameMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetSchemaValidationsValidationNameMetrics404 = {
  code?: GetSchemaValidationsValidationNameMetrics404Code
  message?: string
}

export type SchemaValidationValidationFailureAction =
  typeof SchemaValidationValidationFailureAction[keyof typeof SchemaValidationValidationFailureAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaValidationValidationFailureAction = {
  drop: 'drop',
  disconnect: 'disconnect',
  ignore: 'ignore',
} as const

export type SchemaValidationValidationStrategy =
  typeof SchemaValidationValidationStrategy[keyof typeof SchemaValidationValidationStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaValidationValidationStrategy = {
  any_pass: 'any_pass',
  all_pass: 'all_pass',
} as const

export type SchemaValidationValidationTopics = string[] | string

export type SchemaValidationLogFailureLevel =
  typeof SchemaValidationLogFailureLevel[keyof typeof SchemaValidationLogFailureLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaValidationLogFailureLevel = {
  error: 'error',
  warning: 'warning',
  notice: 'notice',
  info: 'info',
  debug: 'debug',
  none: 'none',
} as const

export interface SchemaValidationLogFailure {
  level?: SchemaValidationLogFailureLevel
}

export interface SchemaValidationValidation {
  tags?: string[]
  description?: string
  enable?: boolean
  name: string
  topics: SchemaValidationValidationTopics
  strategy: SchemaValidationValidationStrategy
  failure_action: SchemaValidationValidationFailureAction
  log_failure?: SchemaValidationLogFailure
  checks: SchemaValidationValidationChecksItem[]
}

export type SchemaValidationCheckSqlType =
  typeof SchemaValidationCheckSqlType[keyof typeof SchemaValidationCheckSqlType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaValidationCheckSqlType = {
  sql: 'sql',
} as const

export interface SchemaValidationCheckSql {
  type?: SchemaValidationCheckSqlType
  sql: string
}

export type SchemaValidationCheckProtobufType =
  typeof SchemaValidationCheckProtobufType[keyof typeof SchemaValidationCheckProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaValidationCheckProtobufType = {
  protobuf: 'protobuf',
} as const

export interface SchemaValidationCheckProtobuf {
  type?: SchemaValidationCheckProtobufType
  schema: string
  message_type: string
}

export type SchemaValidationCheckJsonType =
  typeof SchemaValidationCheckJsonType[keyof typeof SchemaValidationCheckJsonType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaValidationCheckJsonType = {
  json: 'json',
} as const

export interface SchemaValidationCheckJson {
  type?: SchemaValidationCheckJsonType
  schema: string
}

export type SchemaValidationValidationChecksItem =
  | SchemaValidationCheckProtobuf
  | SchemaValidationCheckAvro
  | SchemaValidationCheckJson
  | SchemaValidationCheckSql

export type SchemaValidationCheckAvroType =
  typeof SchemaValidationCheckAvroType[keyof typeof SchemaValidationCheckAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaValidationCheckAvroType = {
  avro: 'avro',
} as const

export interface SchemaValidationCheckAvro {
  type?: SchemaValidationCheckAvroType
  schema: string
}

export interface SchemaValidationHttpApiReorder {
  order: string[]
}

export interface SchemaValidationHttpApiNodeMetrics {
  node?: string
  matched?: number
  succeeded?: number
  failed?: number
}

export interface SchemaValidationHttpApiMetrics {
  matched?: number
  succeeded?: number
  failed?: number
}

export interface SchemaValidationHttpApiGetMetrics {
  metrics?: SchemaValidationHttpApiMetrics
  node_metrics?: SchemaValidationHttpApiNodeMetrics
}
