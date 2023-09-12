export type PutRuleEngine400Code = typeof PutRuleEngine400Code[keyof typeof PutRuleEngine400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutRuleEngine400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutRuleEngine400 = {
  code?: PutRuleEngine400Code
  message?: string
}

export type PutRulesId400Code = typeof PutRulesId400Code[keyof typeof PutRulesId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutRulesId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutRulesId400 = {
  code?: PutRulesId400Code
  message?: string
}

export type GetRulesId404Code = typeof GetRulesId404Code[keyof typeof GetRulesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetRulesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetRulesId404 = {
  code?: GetRulesId404Code
  message?: string
}

export type DeleteRulesId404Code = typeof DeleteRulesId404Code[keyof typeof DeleteRulesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteRulesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteRulesId404 = {
  code?: DeleteRulesId404Code
  message?: string
}

export type PutRulesIdMetricsReset404Code =
  typeof PutRulesIdMetricsReset404Code[keyof typeof PutRulesIdMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutRulesIdMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutRulesIdMetricsReset404 = {
  code?: PutRulesIdMetricsReset404Code
  message?: string
}

export type GetRulesIdMetrics404Code =
  typeof GetRulesIdMetrics404Code[keyof typeof GetRulesIdMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetRulesIdMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetRulesIdMetrics404 = {
  code?: GetRulesIdMetrics404Code
  message?: string
}

export type PostRules400Code = typeof PostRules400Code[keyof typeof PostRules400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRules400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostRules400 = {
  code?: PostRules400Code
  message?: string
}

export type GetRules400Code = typeof GetRules400Code[keyof typeof GetRules400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetRules400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetRules400 = {
  code?: GetRules400Code
  message?: string
}

export type GetRules200 = {
  data?: EmqxRuleApiSchemaRuleInfo[]
  meta?: PublicMeta
}

export type PostRuleTest412Code = typeof PostRuleTest412Code[keyof typeof PostRuleTest412Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRuleTest412Code = {
  NOT_MATCH: 'NOT_MATCH',
} as const

export type PostRuleTest412 = {
  code?: PostRuleTest412Code
  message?: string
}

export type PostRuleTest400Code = typeof PostRuleTest400Code[keyof typeof PostRuleTest400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRuleTest400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostRuleTest400 = {
  code?: PostRuleTest400Code
  message?: string
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetRulesParams = {
  enable?: boolean
  from?: string
  like_id?: string
  like_from?: string
  like_description?: string
  match_from?: string
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export type RuleEngineUserProvidedFunctionArgs = { [key: string]: any }

export interface RuleEngineUserProvidedFunction {
  function: string
  args?: RuleEngineUserProvidedFunctionArgs
}

export interface RuleEngineRepublishMqttProperties {
  'Payload-Format-Indicator'?: string
  'Message-Expiry-Interval'?: string
  'Content-Type'?: string
  'Response-Topic'?: string
  'Correlation-Data'?: string
}

export type RuleEngineRepublishArgsRetain = string | boolean

export type RuleEngineRepublishArgsQos = string | number

export interface RuleEngineRepublishArgs {
  topic: string
  qos?: RuleEngineRepublishArgsQos
  retain?: RuleEngineRepublishArgsRetain
  payload?: string
  mqtt_properties?: RuleEngineRepublishMqttProperties
  user_properties?: string
}

export type RuleEngineBuiltinActionRepublishFunction =
  typeof RuleEngineBuiltinActionRepublishFunction[keyof typeof RuleEngineBuiltinActionRepublishFunction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineBuiltinActionRepublishFunction = {
  republish: 'republish',
} as const

export interface RuleEngineBuiltinActionRepublish {
  function?: RuleEngineBuiltinActionRepublishFunction
  args?: RuleEngineRepublishArgs
}

export type RuleEngineBuiltinActionConsoleFunction =
  typeof RuleEngineBuiltinActionConsoleFunction[keyof typeof RuleEngineBuiltinActionConsoleFunction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineBuiltinActionConsoleFunction = {
  console: 'console',
} as const

export interface RuleEngineBuiltinActionConsole {
  function?: RuleEngineBuiltinActionConsoleFunction
}

export interface PublicMeta {
  page?: number
  limit?: number
  count?: number
  hasnext: boolean
}

export type EmqxRuleApiSchemaRuleTestContext =
  | EmqxRuleApiSchemaCtxDeliveryDropped
  | EmqxRuleApiSchemaCtxBridgeMqtt
  | EmqxRuleApiSchemaCtxCheckAuthzComplete
  | EmqxRuleApiSchemaCtxConnack
  | EmqxRuleApiSchemaCtxDisconnected
  | EmqxRuleApiSchemaCtxConnected
  | EmqxRuleApiSchemaCtxDropped
  | EmqxRuleApiSchemaCtxAcked
  | EmqxRuleApiSchemaCtxDelivered
  | EmqxRuleApiSchemaCtxUnsub
  | EmqxRuleApiSchemaCtxSub
  | EmqxRuleApiSchemaCtxPub

export interface EmqxRuleApiSchemaRuleTest {
  context?: EmqxRuleApiSchemaRuleTestContext
  sql: string
}

export interface EmqxRuleApiSchemaRuleMetrics {
  id: string
  metrics?: EmqxRuleApiSchemaMetrics
  node_metrics?: EmqxRuleApiSchemaNodeMetrics[]
}

export type EmqxRuleApiSchemaRuleInfoMetadata = { [key: string]: any }

export type EmqxRuleApiSchemaRuleInfoActionsItem =
  | RuleEngineUserProvidedFunction
  | RuleEngineBuiltinActionConsole
  | RuleEngineBuiltinActionRepublish
  | string

export interface EmqxRuleApiSchemaRuleInfo {
  id: string
  from?: string[]
  created_at?: string
  name?: string
  sql: string
  actions?: EmqxRuleApiSchemaRuleInfoActionsItem[]
  enable?: boolean
  description?: string
  metadata?: EmqxRuleApiSchemaRuleInfoMetadata
}

export type EmqxRuleApiSchemaRuleEventsTestColumns = { [key: string]: any }

export type EmqxRuleApiSchemaRuleEventsColumns = { [key: string]: any }

export type EmqxRuleApiSchemaRuleEventsEvent =
  typeof EmqxRuleApiSchemaRuleEventsEvent[keyof typeof EmqxRuleApiSchemaRuleEventsEvent]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaRuleEventsEvent = {
  '$events/client_connected': '$events/client_connected',
  '$events/client_disconnected': '$events/client_disconnected',
  '$events/client_connack': '$events/client_connack',
  '$events/client_check_authz_complete': '$events/client_check_authz_complete',
  '$events/session_subscribed': '$events/session_subscribed',
  '$events/session_unsubscribed': '$events/session_unsubscribed',
  '$events/message_delivered': '$events/message_delivered',
  '$events/message_acked': '$events/message_acked',
  '$events/message_dropped': '$events/message_dropped',
  '$events/delivery_dropped': '$events/delivery_dropped',
} as const

export interface EmqxRuleApiSchemaRuleEvents {
  event: EmqxRuleApiSchemaRuleEventsEvent
  title?: string
  description?: string
  columns?: EmqxRuleApiSchemaRuleEventsColumns
  test_columns?: EmqxRuleApiSchemaRuleEventsTestColumns
  sql_example?: string
}

export interface EmqxRuleApiSchemaRuleEngine {
  ignore_sys_message?: boolean
  jq_function_default_timeout?: string
}

export type EmqxRuleApiSchemaRuleCreationMetadata = { [key: string]: any }

export type EmqxRuleApiSchemaRuleCreationActionsItem =
  | RuleEngineUserProvidedFunction
  | RuleEngineBuiltinActionConsole
  | RuleEngineBuiltinActionRepublish
  | string

export interface EmqxRuleApiSchemaRuleCreation {
  name?: string
  sql: string
  actions?: EmqxRuleApiSchemaRuleCreationActionsItem[]
  enable?: boolean
  description?: string
  metadata?: EmqxRuleApiSchemaRuleCreationMetadata
}

export interface EmqxRuleApiSchemaNodeMetrics {
  node?: string
  matched?: number
  'matched.rate'?: number
  'matched.rate.max'?: number
  'matched.rate.last5m'?: number
  passed?: number
  failed?: number
  'failed.exception'?: number
  'failed.unknown'?: number
  'actions.total'?: number
  'actions.success'?: number
  'actions.failed'?: number
  'actions.failed.out_of_service'?: number
  'actions.failed.unknown'?: number
}

export interface EmqxRuleApiSchemaMetrics {
  matched?: number
  'matched.rate'?: number
  'matched.rate.max'?: number
  'matched.rate.last5m'?: number
  passed?: number
  failed?: number
  'failed.exception'?: number
  'failed.unknown'?: number
  'actions.total'?: number
  'actions.success'?: number
  'actions.failed'?: number
  'actions.failed.out_of_service'?: number
  'actions.failed.unknown'?: number
}

export type EmqxRuleApiSchemaCtxUnsubEventType =
  typeof EmqxRuleApiSchemaCtxUnsubEventType[keyof typeof EmqxRuleApiSchemaCtxUnsubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxUnsubEventType = {
  session_unsubscribed: 'session_unsubscribed',
} as const

export interface EmqxRuleApiSchemaCtxUnsub {
  event_type: EmqxRuleApiSchemaCtxUnsubEventType
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type EmqxRuleApiSchemaCtxSubEventType =
  typeof EmqxRuleApiSchemaCtxSubEventType[keyof typeof EmqxRuleApiSchemaCtxSubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxSubEventType = {
  session_subscribed: 'session_subscribed',
} as const

export interface EmqxRuleApiSchemaCtxSub {
  event_type: EmqxRuleApiSchemaCtxSubEventType
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type EmqxRuleApiSchemaCtxPubEventType =
  typeof EmqxRuleApiSchemaCtxPubEventType[keyof typeof EmqxRuleApiSchemaCtxPubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxPubEventType = {
  message_publish: 'message_publish',
} as const

export interface EmqxRuleApiSchemaCtxPub {
  event_type: EmqxRuleApiSchemaCtxPubEventType
  id?: string
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type EmqxRuleApiSchemaCtxDroppedEventType =
  typeof EmqxRuleApiSchemaCtxDroppedEventType[keyof typeof EmqxRuleApiSchemaCtxDroppedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxDroppedEventType = {
  message_dropped: 'message_dropped',
} as const

export interface EmqxRuleApiSchemaCtxDropped {
  event_type: EmqxRuleApiSchemaCtxDroppedEventType
  id?: string
  reason?: string
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type EmqxRuleApiSchemaCtxDisconnectedEventType =
  typeof EmqxRuleApiSchemaCtxDisconnectedEventType[keyof typeof EmqxRuleApiSchemaCtxDisconnectedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxDisconnectedEventType = {
  client_disconnected: 'client_disconnected',
} as const

export interface EmqxRuleApiSchemaCtxDisconnected {
  event_type: EmqxRuleApiSchemaCtxDisconnectedEventType
  clientid?: string
  username?: string
  reason?: string
  peername?: string
  sockname?: string
  disconnected_at?: number
}

export type EmqxRuleApiSchemaCtxDeliveryDroppedEventType =
  typeof EmqxRuleApiSchemaCtxDeliveryDroppedEventType[keyof typeof EmqxRuleApiSchemaCtxDeliveryDroppedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxDeliveryDroppedEventType = {
  delivery_dropped: 'delivery_dropped',
} as const

export interface EmqxRuleApiSchemaCtxDeliveryDropped {
  event_type: EmqxRuleApiSchemaCtxDeliveryDroppedEventType
  id?: string
  reason?: string
  from_clientid?: string
  from_username?: string
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type EmqxRuleApiSchemaCtxDeliveredEventType =
  typeof EmqxRuleApiSchemaCtxDeliveredEventType[keyof typeof EmqxRuleApiSchemaCtxDeliveredEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxDeliveredEventType = {
  message_delivered: 'message_delivered',
} as const

export interface EmqxRuleApiSchemaCtxDelivered {
  event_type: EmqxRuleApiSchemaCtxDeliveredEventType
  id?: string
  from_clientid?: string
  from_username?: string
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type EmqxRuleApiSchemaCtxConnectedEventType =
  typeof EmqxRuleApiSchemaCtxConnectedEventType[keyof typeof EmqxRuleApiSchemaCtxConnectedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxConnectedEventType = {
  client_connected: 'client_connected',
} as const

export interface EmqxRuleApiSchemaCtxConnected {
  event_type: EmqxRuleApiSchemaCtxConnectedEventType
  clientid?: string
  username?: string
  mountpoint?: string
  peername?: string
  sockname?: string
  proto_name?: string
  proto_ver?: string
  keepalive?: number
  clean_start?: boolean
  expiry_interval?: number
  is_bridge?: boolean
  connected_at?: number
}

export type EmqxRuleApiSchemaCtxConnackEventType =
  typeof EmqxRuleApiSchemaCtxConnackEventType[keyof typeof EmqxRuleApiSchemaCtxConnackEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxConnackEventType = {
  client_connack: 'client_connack',
} as const

export interface EmqxRuleApiSchemaCtxConnack {
  event_type: EmqxRuleApiSchemaCtxConnackEventType
  reason_code?: string
  clientid?: string
  clean_start?: boolean
  username?: string
  peername?: string
  sockname?: string
  proto_name?: string
  proto_ver?: string
  keepalive?: number
  expiry_interval?: number
  connected_at?: number
}

export type EmqxRuleApiSchemaCtxCheckAuthzCompleteEventType =
  typeof EmqxRuleApiSchemaCtxCheckAuthzCompleteEventType[keyof typeof EmqxRuleApiSchemaCtxCheckAuthzCompleteEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxCheckAuthzCompleteEventType = {
  client_check_authz_complete: 'client_check_authz_complete',
} as const

export interface EmqxRuleApiSchemaCtxCheckAuthzComplete {
  event_type: EmqxRuleApiSchemaCtxCheckAuthzCompleteEventType
  clientid?: string
  username?: string
  peerhost?: string
  topic?: string
  action?: string
  authz_source?: string
  result?: string
}

export type EmqxRuleApiSchemaCtxBridgeMqttEventType =
  typeof EmqxRuleApiSchemaCtxBridgeMqttEventType[keyof typeof EmqxRuleApiSchemaCtxBridgeMqttEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxBridgeMqttEventType = {
  '$bridges/mqtt:*': '$bridges/mqtt:*',
} as const

export interface EmqxRuleApiSchemaCtxBridgeMqtt {
  event_type: EmqxRuleApiSchemaCtxBridgeMqttEventType
  id?: string
  payload?: string
  topic?: string
  server?: string
  dup?: string
  retain?: string
  message_received_at?: number
  qos?: number
}

export type EmqxRuleApiSchemaCtxAckedEventType =
  typeof EmqxRuleApiSchemaCtxAckedEventType[keyof typeof EmqxRuleApiSchemaCtxAckedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRuleApiSchemaCtxAckedEventType = {
  message_acked: 'message_acked',
} as const

export interface EmqxRuleApiSchemaCtxAcked {
  event_type: EmqxRuleApiSchemaCtxAckedEventType
  id?: string
  from_clientid?: string
  from_username?: string
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}
