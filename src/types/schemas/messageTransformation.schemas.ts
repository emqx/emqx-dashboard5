export type PostMessageTransformationsTransformationNameMetricsReset404Code =
  typeof PostMessageTransformationsTransformationNameMetricsReset404Code[keyof typeof PostMessageTransformationsTransformationNameMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsTransformationNameMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostMessageTransformationsTransformationNameMetricsReset404 = {
  code?: PostMessageTransformationsTransformationNameMetricsReset404Code
  message?: string
}

export type PostMessageTransformationsTransformationNameEnableEnable404Code =
  typeof PostMessageTransformationsTransformationNameEnableEnable404Code[keyof typeof PostMessageTransformationsTransformationNameEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsTransformationNameEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostMessageTransformationsTransformationNameEnableEnable404 = {
  code?: PostMessageTransformationsTransformationNameEnableEnable404Code
  message?: string
}

export type PostMessageTransformationsTransformationNameEnableEnable400Code =
  typeof PostMessageTransformationsTransformationNameEnableEnable400Code[keyof typeof PostMessageTransformationsTransformationNameEnableEnable400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsTransformationNameEnableEnable400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMessageTransformationsTransformationNameEnableEnable400 = {
  code?: PostMessageTransformationsTransformationNameEnableEnable400Code
  message?: string
}

export type DeleteMessageTransformationsTransformationName404Code =
  typeof DeleteMessageTransformationsTransformationName404Code[keyof typeof DeleteMessageTransformationsTransformationName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageTransformationsTransformationName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteMessageTransformationsTransformationName404 = {
  code?: DeleteMessageTransformationsTransformationName404Code
  message?: string
}

export type GetMessageTransformationsTransformationName404Code =
  typeof GetMessageTransformationsTransformationName404Code[keyof typeof GetMessageTransformationsTransformationName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageTransformationsTransformationName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageTransformationsTransformationName404 = {
  code?: GetMessageTransformationsTransformationName404Code
  message?: string
}

export type PostMessageTransformationsReorder400Code =
  typeof PostMessageTransformationsReorder400Code[keyof typeof PostMessageTransformationsReorder400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsReorder400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMessageTransformationsReorder400 = {
  not_found?: string[]
  not_reordered?: string[]
  duplicated?: string[]
  code?: PostMessageTransformationsReorder400Code
  message?: string
}

export type GetMessageTransformationsTransformationNameMetrics404Code =
  typeof GetMessageTransformationsTransformationNameMetrics404Code[keyof typeof GetMessageTransformationsTransformationNameMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageTransformationsTransformationNameMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageTransformationsTransformationNameMetrics404 = {
  code?: GetMessageTransformationsTransformationNameMetrics404Code
  message?: string
}

export type PostMessageTransformationsDryrun400Code =
  typeof PostMessageTransformationsDryrun400Code[keyof typeof PostMessageTransformationsDryrun400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsDryrun400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMessageTransformationsDryrun400 = {
  code?: PostMessageTransformationsDryrun400Code
  message?: string
}

export type PostMessageTransformations400Code =
  typeof PostMessageTransformations400Code[keyof typeof PostMessageTransformations400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformations400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostMessageTransformations400 = {
  code?: PostMessageTransformations400Code
  message?: string
}

export type PutMessageTransformations404Code =
  typeof PutMessageTransformations404Code[keyof typeof PutMessageTransformations404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageTransformations404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutMessageTransformations404 = {
  code?: PutMessageTransformations404Code
  message?: string
}

export type PutMessageTransformations400Code =
  typeof PutMessageTransformations400Code[keyof typeof PutMessageTransformations400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageTransformations400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMessageTransformations400 = {
  code?: PutMessageTransformations400Code
  message?: string
}

export type MessageTransformationTransformationPayloadEncoder =
  typeof MessageTransformationTransformationPayloadEncoder[keyof typeof MessageTransformationTransformationPayloadEncoder]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageTransformationTransformationPayloadEncoder = {
  payload_serde_protobuf: 'payload_serde_protobuf',
  payload_serde_avro: 'payload_serde_avro',
  payload_serde_json: 'payload_serde_json',
  payload_serde_none: 'payload_serde_none',
} as const

export type MessageTransformationTransformationPayloadDecoder =
  typeof MessageTransformationTransformationPayloadDecoder[keyof typeof MessageTransformationTransformationPayloadDecoder]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageTransformationTransformationPayloadDecoder = {
  payload_serde_protobuf: 'payload_serde_protobuf',
  payload_serde_avro: 'payload_serde_avro',
  payload_serde_json: 'payload_serde_json',
  payload_serde_none: 'payload_serde_none',
} as const

export type MessageTransformationTransformationFailureAction =
  typeof MessageTransformationTransformationFailureAction[keyof typeof MessageTransformationTransformationFailureAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageTransformationTransformationFailureAction = {
  drop: 'drop',
  disconnect: 'disconnect',
  ignore: 'ignore',
} as const

export type MessageTransformationTransformationTopics = string[] | string

export interface MessageTransformationOperation {
  key: string
  value: string
}

export interface MessageTransformationTransformation {
  tags?: string[]
  description?: string
  enable?: boolean
  name: string
  topics: MessageTransformationTransformationTopics
  failure_action: MessageTransformationTransformationFailureAction
  log_failure?: MessageTransformationLogFailure
  payload_decoder?: MessageTransformationTransformationPayloadDecoder
  payload_encoder?: MessageTransformationTransformationPayloadEncoder
  operations?: MessageTransformationOperation[]
}

export type MessageTransformationLogFailureLevel =
  typeof MessageTransformationLogFailureLevel[keyof typeof MessageTransformationLogFailureLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageTransformationLogFailureLevel = {
  error: 'error',
  warning: 'warning',
  notice: 'notice',
  info: 'info',
  debug: 'debug',
  none: 'none',
} as const

export interface MessageTransformationLogFailure {
  level?: MessageTransformationLogFailureLevel
}

export interface MessageTransformationHttpApiReorder {
  order: string[]
}

export interface MessageTransformationHttpApiNodeMetrics {
  node?: string
  matched?: number
  succeeded?: number
  failed?: number
}

export interface MessageTransformationHttpApiMetrics {
  matched?: number
  succeeded?: number
  failed?: number
}

export interface MessageTransformationHttpApiGetMetrics {
  metrics?: MessageTransformationHttpApiMetrics
  node_metrics?: MessageTransformationHttpApiNodeMetrics
}

export interface MessageTransformationHttpApiDryrunTransformation {
  transformation: MessageTransformationTransformation
  message: MessageTransformationHttpApiDryrunInputMessage
}

export type MessageTransformationHttpApiDryrunInputMessageUserProperty = { [key: string]: any }

export type MessageTransformationHttpApiDryrunInputMessageClientAttrs = { [key: string]: any }

export interface MessageTransformationHttpApiDryrunInputMessage {
  client_attrs?: MessageTransformationHttpApiDryrunInputMessageClientAttrs
  payload: string
  qos?: number
  retain?: boolean
  topic: string
  user_property?: MessageTransformationHttpApiDryrunInputMessageUserProperty
}
