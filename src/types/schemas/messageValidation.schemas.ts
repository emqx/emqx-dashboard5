export type GetMessageValidationsValidationName404Code =
  typeof GetMessageValidationsValidationName404Code[keyof typeof GetMessageValidationsValidationName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageValidationsValidationName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageValidationsValidationName404 = {
  code?: GetMessageValidationsValidationName404Code
  message?: string
}

export type DeleteMessageValidationsValidationName404Code =
  typeof DeleteMessageValidationsValidationName404Code[keyof typeof DeleteMessageValidationsValidationName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageValidationsValidationName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteMessageValidationsValidationName404 = {
  code?: DeleteMessageValidationsValidationName404Code
  message?: string
}

export type GetMessageValidationsValidationNameMetrics404Code =
  typeof GetMessageValidationsValidationNameMetrics404Code[keyof typeof GetMessageValidationsValidationNameMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageValidationsValidationNameMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageValidationsValidationNameMetrics404 = {
  code?: GetMessageValidationsValidationNameMetrics404Code
  message?: string
}

export type PostMessageValidationsValidationNameEnableEnable404Code =
  typeof PostMessageValidationsValidationNameEnableEnable404Code[keyof typeof PostMessageValidationsValidationNameEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageValidationsValidationNameEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostMessageValidationsValidationNameEnableEnable404 = {
  code?: PostMessageValidationsValidationNameEnableEnable404Code
  message?: string
}

export type PostMessageValidationsValidationNameEnableEnable400Code =
  typeof PostMessageValidationsValidationNameEnableEnable400Code[keyof typeof PostMessageValidationsValidationNameEnableEnable400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageValidationsValidationNameEnableEnable400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMessageValidationsValidationNameEnableEnable400 = {
  code?: PostMessageValidationsValidationNameEnableEnable400Code
  message?: string
}

export type PostMessageValidationsReorder400Code =
  typeof PostMessageValidationsReorder400Code[keyof typeof PostMessageValidationsReorder400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageValidationsReorder400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMessageValidationsReorder400 = {
  not_found?: string[]
  not_reordered?: string[]
  duplicated?: string[]
  code?: PostMessageValidationsReorder400Code
  message?: string
}

export type PutMessageValidations404Code =
  typeof PutMessageValidations404Code[keyof typeof PutMessageValidations404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageValidations404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutMessageValidations404 = {
  code?: PutMessageValidations404Code
  message?: string
}

export type PutMessageValidations400Code =
  typeof PutMessageValidations400Code[keyof typeof PutMessageValidations400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageValidations400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMessageValidations400 = {
  code?: PutMessageValidations400Code
  message?: string
}

export type PostMessageValidations400Code =
  typeof PostMessageValidations400Code[keyof typeof PostMessageValidations400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageValidations400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostMessageValidations400 = {
  code?: PostMessageValidations400Code
  message?: string
}

export type PostMessageValidationsValidationNameMetricsReset404Code =
  typeof PostMessageValidationsValidationNameMetricsReset404Code[keyof typeof PostMessageValidationsValidationNameMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageValidationsValidationNameMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostMessageValidationsValidationNameMetricsReset404 = {
  code?: PostMessageValidationsValidationNameMetricsReset404Code
  message?: string
}

export type MessageValidationValidationFailureAction =
  typeof MessageValidationValidationFailureAction[keyof typeof MessageValidationValidationFailureAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageValidationValidationFailureAction = {
  drop: 'drop',
  disconnect: 'disconnect',
  ignore: 'ignore',
} as const

export type MessageValidationValidationStrategy =
  typeof MessageValidationValidationStrategy[keyof typeof MessageValidationValidationStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageValidationValidationStrategy = {
  any_pass: 'any_pass',
  all_pass: 'all_pass',
} as const

export type MessageValidationValidationTopics = string[] | string

export type MessageValidationLogFailureLevel =
  typeof MessageValidationLogFailureLevel[keyof typeof MessageValidationLogFailureLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageValidationLogFailureLevel = {
  error: 'error',
  warning: 'warning',
  notice: 'notice',
  info: 'info',
  debug: 'debug',
  none: 'none',
} as const

export interface MessageValidationLogFailure {
  level?: MessageValidationLogFailureLevel
}

export interface MessageValidationValidation {
  tags?: string[]
  description?: string
  enable?: boolean
  name: string
  topics: MessageValidationValidationTopics
  strategy: MessageValidationValidationStrategy
  failure_action: MessageValidationValidationFailureAction
  log_failure?: MessageValidationLogFailure
  checks: MessageValidationValidationChecksItem[]
}

export type MessageValidationCheckSqlType =
  typeof MessageValidationCheckSqlType[keyof typeof MessageValidationCheckSqlType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageValidationCheckSqlType = {
  sql: 'sql',
} as const

export interface MessageValidationCheckSql {
  type?: MessageValidationCheckSqlType
  sql: string
}

export type MessageValidationCheckProtobufType =
  typeof MessageValidationCheckProtobufType[keyof typeof MessageValidationCheckProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageValidationCheckProtobufType = {
  protobuf: 'protobuf',
} as const

export interface MessageValidationCheckProtobuf {
  type?: MessageValidationCheckProtobufType
  schema: string
  message_type: string
}

export type MessageValidationCheckJsonType =
  typeof MessageValidationCheckJsonType[keyof typeof MessageValidationCheckJsonType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageValidationCheckJsonType = {
  json: 'json',
} as const

export interface MessageValidationCheckJson {
  type?: MessageValidationCheckJsonType
  schema: string
}

export type MessageValidationValidationChecksItem =
  | MessageValidationCheckProtobuf
  | MessageValidationCheckAvro
  | MessageValidationCheckJson
  | MessageValidationCheckSql

export type MessageValidationCheckAvroType =
  typeof MessageValidationCheckAvroType[keyof typeof MessageValidationCheckAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageValidationCheckAvroType = {
  avro: 'avro',
} as const

export interface MessageValidationCheckAvro {
  type?: MessageValidationCheckAvroType
  schema: string
}

export interface MessageValidationHttpApiReorder {
  order: string[]
}

export interface MessageValidationHttpApiNodeMetrics {
  node?: string
  matched?: number
  succeeded?: number
  failed?: number
}

export interface MessageValidationHttpApiMetrics {
  matched?: number
  succeeded?: number
  failed?: number
}

export interface MessageValidationHttpApiGetMetrics {
  metrics?: MessageValidationHttpApiMetrics
  node_metrics?: MessageValidationHttpApiNodeMetrics
}
