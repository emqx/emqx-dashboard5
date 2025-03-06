export type PostMessageTransformationsTransformationNameMetricsReset404Code =
  (typeof PostMessageTransformationsTransformationNameMetricsReset404Code)[keyof typeof PostMessageTransformationsTransformationNameMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsTransformationNameMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostMessageTransformationsTransformationNameMetricsReset404 = {
  code?: PostMessageTransformationsTransformationNameMetricsReset404Code
  message?: string
}

export type GetMessageTransformationsTransformationNameMetrics404Code =
  (typeof GetMessageTransformationsTransformationNameMetrics404Code)[keyof typeof GetMessageTransformationsTransformationNameMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageTransformationsTransformationNameMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageTransformationsTransformationNameMetrics404 = {
  code?: GetMessageTransformationsTransformationNameMetrics404Code
  message?: string
}

export type PostMessageTransformationsTransformationNameEnableEnable404Code =
  (typeof PostMessageTransformationsTransformationNameEnableEnable404Code)[keyof typeof PostMessageTransformationsTransformationNameEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsTransformationNameEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostMessageTransformationsTransformationNameEnableEnable404 = {
  code?: PostMessageTransformationsTransformationNameEnableEnable404Code
  message?: string
}

export type PostMessageTransformationsTransformationNameEnableEnable400Code =
  (typeof PostMessageTransformationsTransformationNameEnableEnable400Code)[keyof typeof PostMessageTransformationsTransformationNameEnableEnable400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsTransformationNameEnableEnable400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMessageTransformationsTransformationNameEnableEnable400 = {
  code?: PostMessageTransformationsTransformationNameEnableEnable400Code
  message?: string
}

export type DeleteMessageTransformationsTransformationName404Code =
  (typeof DeleteMessageTransformationsTransformationName404Code)[keyof typeof DeleteMessageTransformationsTransformationName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageTransformationsTransformationName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteMessageTransformationsTransformationName404 = {
  code?: DeleteMessageTransformationsTransformationName404Code
  message?: string
}

export type GetMessageTransformationsTransformationName404Code =
  (typeof GetMessageTransformationsTransformationName404Code)[keyof typeof GetMessageTransformationsTransformationName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageTransformationsTransformationName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageTransformationsTransformationName404 = {
  code?: GetMessageTransformationsTransformationName404Code
  message?: string
}

export type PostMessageTransformationsReorder400Code =
  (typeof PostMessageTransformationsReorder400Code)[keyof typeof PostMessageTransformationsReorder400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsReorder400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMessageTransformationsReorder400 = {
  code?: PostMessageTransformationsReorder400Code
  duplicated?: string[]
  message?: string
  not_found?: string[]
  not_reordered?: string[]
}

export type PostMessageTransformationsDryrun400Code =
  (typeof PostMessageTransformationsDryrun400Code)[keyof typeof PostMessageTransformationsDryrun400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformationsDryrun400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMessageTransformationsDryrun400 = {
  code?: PostMessageTransformationsDryrun400Code
  message?: string
}

export type PostMessageTransformations400Code =
  (typeof PostMessageTransformations400Code)[keyof typeof PostMessageTransformations400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageTransformations400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostMessageTransformations400 = {
  code?: PostMessageTransformations400Code
  message?: string
}

export type PutMessageTransformations404Code =
  (typeof PutMessageTransformations404Code)[keyof typeof PutMessageTransformations404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageTransformations404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutMessageTransformations404 = {
  code?: PutMessageTransformations404Code
  message?: string
}

export type PutMessageTransformations400Code =
  (typeof PutMessageTransformations400Code)[keyof typeof PutMessageTransformations400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageTransformations400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMessageTransformations400 = {
  code?: PutMessageTransformations400Code
  message?: string
}

export type MessageTransformationTransformationTopics = string[] | string

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageTransformationTransformationPayloadEncoder = {
  payload_serde_avro: 'payload_serde_avro',
  payload_serde_json: 'payload_serde_json',
  payload_serde_none: 'payload_serde_none',
  payload_serde_protobuf: 'payload_serde_protobuf',
} as const

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageTransformationTransformationPayloadDecoder = {
  payload_serde_avro: 'payload_serde_avro',
  payload_serde_json: 'payload_serde_json',
  payload_serde_none: 'payload_serde_none',
  payload_serde_protobuf: 'payload_serde_protobuf',
} as const

export type MessageTransformationTransformationFailureAction =
  (typeof MessageTransformationTransformationFailureAction)[keyof typeof MessageTransformationTransformationFailureAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageTransformationTransformationFailureAction = {
  drop: 'drop',
  disconnect: 'disconnect',
  ignore: 'ignore',
} as const

export interface MessageTransformationOperation {
  key: string
  value: string
}

export type MessageTransformationLogFailureLevel =
  (typeof MessageTransformationLogFailureLevel)[keyof typeof MessageTransformationLogFailureLevel]

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

export interface MessageTransformationTransformation {
  description?: string
  enable?: boolean
  failure_action: MessageTransformationTransformationFailureAction
  log_failure?: MessageTransformationLogFailure
  name: string
  operations?: MessageTransformationOperation[]
  payload_decoder?: (typeof MessageTransformationTransformationPayloadDecoder)[keyof typeof MessageTransformationTransformationPayloadDecoder]
  payload_encoder?: (typeof MessageTransformationTransformationPayloadEncoder)[keyof typeof MessageTransformationTransformationPayloadEncoder]
  tags?: string[]
  topics: MessageTransformationTransformationTopics
}

export interface MessageTransformationHttpApiReorder {
  order: string[]
}

export interface MessageTransformationHttpApiNodeMetrics {
  /** @minimum 0 */
  failed?: number
  /** @minimum 0 */
  matched?: number
  node?: string
  /** @minimum 0 */
  succeeded?: number
}

export interface MessageTransformationHttpApiMetrics {
  /** @minimum 0 */
  failed?: number
  /** @minimum 0 */
  matched?: number
  /** @minimum 0 */
  succeeded?: number
}

export interface MessageTransformationHttpApiGetMetrics {
  metrics?: MessageTransformationHttpApiMetrics
  node_metrics?: MessageTransformationHttpApiNodeMetrics
}

export interface MessageTransformationHttpApiDryrunTransformation {
  message: MessageTransformationHttpApiDryrunInputMessage
  transformation: MessageTransformationTransformation
}

export type MessageTransformationHttpApiDryrunInputMessageUserProperty = { [key: string]: unknown }

export type MessageTransformationHttpApiDryrunInputMessagePubProps = { [key: string]: unknown }

export type MessageTransformationHttpApiDryrunInputMessageClientAttrs = { [key: string]: unknown }

export interface MessageTransformationHttpApiDryrunInputMessage {
  client_attrs?: MessageTransformationHttpApiDryrunInputMessageClientAttrs
  clientid?: string
  payload: string
  peername?: string
  pub_props?: MessageTransformationHttpApiDryrunInputMessagePubProps
  /**
   * @minimum 0
   * @maximum 2
   */
  qos?: number
  retain?: boolean
  topic: string
  user_property?: MessageTransformationHttpApiDryrunInputMessageUserProperty
  username?: string
}
