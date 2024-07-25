export type PutRuleEngine400Code = typeof PutRuleEngine400Code[keyof typeof PutRuleEngine400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutRuleEngine400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutRuleEngine400 = {
  code?: PutRuleEngine400Code
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
  data?: RuleEngineRuleInfo[]
  meta?: PublicMeta
}

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

export type PostRulesIdTest412Code =
  typeof PostRulesIdTest412Code[keyof typeof PostRulesIdTest412Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRulesIdTest412Code = {
  NOT_MATCH: 'NOT_MATCH',
} as const

export type PostRulesIdTest412 = {
  code?: PostRulesIdTest412Code
  message?: string
}

export type PostRulesIdTest404Code =
  typeof PostRulesIdTest404Code[keyof typeof PostRulesIdTest404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRulesIdTest404Code = {
  RULE_NOT_FOUND: 'RULE_NOT_FOUND',
} as const

export type PostRulesIdTest404 = {
  code?: PostRulesIdTest404Code
  message?: string
}

export type PostRulesIdTest400Code =
  typeof PostRulesIdTest400Code[keyof typeof PostRulesIdTest400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRulesIdTest400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostRulesIdTest400 = {
  code?: PostRulesIdTest400Code
  message?: string
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

export type RuleEngineUserProvidedFunctionArgs = { [key: string]: any }

export interface RuleEngineUserProvidedFunction {
  function: string
  args?: RuleEngineUserProvidedFunctionArgs
}

export type RuleEngineRuleTestContext =
  | RuleEngineCtxMessageTransformationFailed
  | RuleEngineCtxSchemaValidationFailed
  | RuleEngineCtxDeliveryDropped
  | RuleEngineCtxBridgeMqtt
  | RuleEngineCtxCheckAuthnComplete
  | RuleEngineCtxCheckAuthzComplete
  | RuleEngineCtxConnack
  | RuleEngineCtxDisconnected
  | RuleEngineCtxConnected
  | RuleEngineCtxDropped
  | RuleEngineCtxAcked
  | RuleEngineCtxDelivered
  | RuleEngineCtxUnsub
  | RuleEngineCtxSub
  | RuleEngineCtxPub

export interface RuleEngineRuleTest {
  context?: RuleEngineRuleTestContext
  sql: string
}

export interface RuleEngineRuleMetrics {
  id: string
  metrics?: RuleEngineMetrics
  node_metrics?: RuleEngineNodeMetrics[]
}

export type RuleEngineRuleInfoMetadata = { [key: string]: any }

export type RuleEngineRuleInfoActionsItem =
  | RuleEngineUserProvidedFunction
  | RuleEngineBuiltinActionConsole
  | RuleEngineBuiltinActionRepublish
  | string

export interface RuleEngineRuleInfo {
  id: string
  from?: string[]
  created_at?: string
  name?: string
  sql: string
  actions?: RuleEngineRuleInfoActionsItem[]
  enable?: boolean
  description?: string
  metadata?: RuleEngineRuleInfoMetadata
}

export type RuleEngineRuleEventsTestColumns = { [key: string]: any }

export type RuleEngineRuleEventsColumns = { [key: string]: any }

export type RuleEngineRuleEventsEvent =
  typeof RuleEngineRuleEventsEvent[keyof typeof RuleEngineRuleEventsEvent]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineRuleEventsEvent = {
  '$events/client_connected': '$events/client_connected',
  '$events/client_disconnected': '$events/client_disconnected',
  '$events/client_connack': '$events/client_connack',
  '$events/client_check_authz_complete': '$events/client_check_authz_complete',
  '$events/session_subscribed': '$events/session_subscribed',
  '$events/session_unsubscribed': '$events/session_unsubscribed',
  '$events/message_delivered': '$events/message_delivered',
  '$events/message_acked': '$events/message_acked',
  '$events/message_dropped': '$events/message_dropped',
  '$events/message_transformation_failed': '$events/message_transformation_failed',
  '$events/schema_validation_failed': '$events/schema_validation_failed',
  '$events/delivery_dropped': '$events/delivery_dropped',
} as const

export interface RuleEngineRuleEvents {
  event: RuleEngineRuleEventsEvent
  title?: string
  description?: string
  columns?: RuleEngineRuleEventsColumns
  test_columns?: RuleEngineRuleEventsTestColumns
  sql_example?: string
}

export interface RuleEngineRuleEngine {
  ignore_sys_message?: boolean
  jq_function_default_timeout?: string
}

export type RuleEngineRuleCreationMetadata = { [key: string]: any }

export type RuleEngineRuleCreationActionsItem =
  | RuleEngineUserProvidedFunction
  | RuleEngineBuiltinActionConsole
  | RuleEngineBuiltinActionRepublish
  | string

export interface RuleEngineRuleCreation {
  name?: string
  sql: string
  actions?: RuleEngineRuleCreationActionsItem[]
  enable?: boolean
  description?: string
  metadata?: RuleEngineRuleCreationMetadata
}

export type RuleEngineRuleApplyTestContext =
  | RuleEngineCtxMessageTransformationFailed
  | RuleEngineCtxSchemaValidationFailed
  | RuleEngineCtxDeliveryDropped
  | RuleEngineCtxBridgeMqtt
  | RuleEngineCtxCheckAuthnComplete
  | RuleEngineCtxCheckAuthzComplete
  | RuleEngineCtxConnack
  | RuleEngineCtxDisconnected
  | RuleEngineCtxConnected
  | RuleEngineCtxDropped
  | RuleEngineCtxAcked
  | RuleEngineCtxDelivered
  | RuleEngineCtxUnsub
  | RuleEngineCtxSub
  | RuleEngineCtxPub

export interface RuleEngineRuleApplyTest {
  context?: RuleEngineRuleApplyTestContext
  stop_action_after_template_rendering?: boolean
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

export interface RuleEngineNodeMetrics {
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

export interface RuleEngineMetrics {
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

export type RuleEngineCtxUnsubEventType =
  typeof RuleEngineCtxUnsubEventType[keyof typeof RuleEngineCtxUnsubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxUnsubEventType = {
  session_unsubscribed: 'session_unsubscribed',
} as const

export interface RuleEngineCtxUnsub {
  event_type: RuleEngineCtxUnsubEventType
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type RuleEngineCtxSubEventType =
  typeof RuleEngineCtxSubEventType[keyof typeof RuleEngineCtxSubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxSubEventType = {
  session_subscribed: 'session_subscribed',
} as const

export interface RuleEngineCtxSub {
  event_type: RuleEngineCtxSubEventType
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type RuleEngineCtxSchemaValidationFailedEventType =
  typeof RuleEngineCtxSchemaValidationFailedEventType[keyof typeof RuleEngineCtxSchemaValidationFailedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxSchemaValidationFailedEventType = {
  schema_validation_failed: 'schema_validation_failed',
} as const

export interface RuleEngineCtxSchemaValidationFailed {
  event_type: RuleEngineCtxSchemaValidationFailedEventType
  validation?: string
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type RuleEngineCtxPubEventType =
  typeof RuleEngineCtxPubEventType[keyof typeof RuleEngineCtxPubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxPubEventType = {
  message_publish: 'message_publish',
} as const

export interface RuleEngineCtxPub {
  event_type: RuleEngineCtxPubEventType
  id?: string
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type RuleEngineCtxMessageTransformationFailedEventType =
  typeof RuleEngineCtxMessageTransformationFailedEventType[keyof typeof RuleEngineCtxMessageTransformationFailedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxMessageTransformationFailedEventType = {
  message_transformation_failed: 'message_transformation_failed',
} as const

export interface RuleEngineCtxMessageTransformationFailed {
  event_type: RuleEngineCtxMessageTransformationFailedEventType
  transformation?: string
  clientid?: string
  username?: string
  payload?: string
  peerhost?: string
  topic?: string
  publish_received_at?: number
  qos?: number
}

export type RuleEngineCtxDroppedEventType =
  typeof RuleEngineCtxDroppedEventType[keyof typeof RuleEngineCtxDroppedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxDroppedEventType = {
  message_dropped: 'message_dropped',
} as const

export interface RuleEngineCtxDropped {
  event_type: RuleEngineCtxDroppedEventType
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

export type RuleEngineCtxDisconnectedEventType =
  typeof RuleEngineCtxDisconnectedEventType[keyof typeof RuleEngineCtxDisconnectedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxDisconnectedEventType = {
  client_disconnected: 'client_disconnected',
} as const

export interface RuleEngineCtxDisconnected {
  event_type: RuleEngineCtxDisconnectedEventType
  clientid?: string
  username?: string
  reason?: string
  peername?: string
  sockname?: string
  disconnected_at?: number
}

export type RuleEngineCtxDeliveryDroppedEventType =
  typeof RuleEngineCtxDeliveryDroppedEventType[keyof typeof RuleEngineCtxDeliveryDroppedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxDeliveryDroppedEventType = {
  delivery_dropped: 'delivery_dropped',
} as const

export interface RuleEngineCtxDeliveryDropped {
  event_type: RuleEngineCtxDeliveryDroppedEventType
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

export type RuleEngineCtxDeliveredEventType =
  typeof RuleEngineCtxDeliveredEventType[keyof typeof RuleEngineCtxDeliveredEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxDeliveredEventType = {
  message_delivered: 'message_delivered',
} as const

export interface RuleEngineCtxDelivered {
  event_type: RuleEngineCtxDeliveredEventType
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

export type RuleEngineCtxConnectedEventType =
  typeof RuleEngineCtxConnectedEventType[keyof typeof RuleEngineCtxConnectedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxConnectedEventType = {
  client_connected: 'client_connected',
} as const

export interface RuleEngineCtxConnected {
  event_type: RuleEngineCtxConnectedEventType
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

export type RuleEngineCtxConnackEventType =
  typeof RuleEngineCtxConnackEventType[keyof typeof RuleEngineCtxConnackEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxConnackEventType = {
  client_connack: 'client_connack',
} as const

export interface RuleEngineCtxConnack {
  event_type: RuleEngineCtxConnackEventType
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

export type RuleEngineCtxCheckAuthzCompleteEventType =
  typeof RuleEngineCtxCheckAuthzCompleteEventType[keyof typeof RuleEngineCtxCheckAuthzCompleteEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxCheckAuthzCompleteEventType = {
  client_check_authz_complete: 'client_check_authz_complete',
} as const

export interface RuleEngineCtxCheckAuthzComplete {
  event_type: RuleEngineCtxCheckAuthzCompleteEventType
  clientid?: string
  username?: string
  peerhost?: string
  topic?: string
  action?: string
  authz_source?: string
  result?: string
}

export type RuleEngineCtxCheckAuthnCompleteEventType =
  typeof RuleEngineCtxCheckAuthnCompleteEventType[keyof typeof RuleEngineCtxCheckAuthnCompleteEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxCheckAuthnCompleteEventType = {
  client_check_authn_complete: 'client_check_authn_complete',
} as const

export interface RuleEngineCtxCheckAuthnComplete {
  event_type: RuleEngineCtxCheckAuthnCompleteEventType
  clientid?: string
  username?: string
  reason_code?: string
  peername?: string
  is_anonymous?: boolean
  is_superuser?: boolean
}

export type RuleEngineCtxBridgeMqttEventType =
  typeof RuleEngineCtxBridgeMqttEventType[keyof typeof RuleEngineCtxBridgeMqttEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxBridgeMqttEventType = {
  '$bridges/mqtt:*': '$bridges/mqtt:*',
} as const

export interface RuleEngineCtxBridgeMqtt {
  event_type: RuleEngineCtxBridgeMqttEventType
  id?: string
  payload?: string
  topic?: string
  server?: string
  dup?: string
  retain?: string
  message_received_at?: number
  qos?: number
}

export type RuleEngineCtxAckedEventType =
  typeof RuleEngineCtxAckedEventType[keyof typeof RuleEngineCtxAckedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxAckedEventType = {
  message_acked: 'message_acked',
} as const

export interface RuleEngineCtxAcked {
  event_type: RuleEngineCtxAckedEventType
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
