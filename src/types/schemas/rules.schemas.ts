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

export type PutRuleEngine400Code = typeof PutRuleEngine400Code[keyof typeof PutRuleEngine400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutRuleEngine400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutRuleEngine400 = {
  code?: PutRuleEngine400Code
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
  action?: string[]
  source?: string[]
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export type RuleEngineUserProvidedFunctionArgs = { [key: string]: any }

export interface RuleEngineUserProvidedFunction {
  args?: RuleEngineUserProvidedFunctionArgs
  function: string
}

export type RuleEngineRuleTestContext =
  | RuleEngineCtxUnsub
  | RuleEngineCtxSub
  | RuleEngineCtxSchemaValidationFailed
  | RuleEngineCtxMessageTransformationFailed
  | RuleEngineCtxPub
  | RuleEngineCtxDropped
  | RuleEngineCtxDelivered
  | RuleEngineCtxAcked
  | RuleEngineCtxDeliveryDropped
  | RuleEngineCtxDisconnected
  | RuleEngineCtxConnected
  | RuleEngineCtxConnack
  | RuleEngineCtxCheckAuthzComplete
  | RuleEngineCtxCheckAuthnComplete
  | RuleEngineCtxAlarmDeactivated
  | RuleEngineCtxAlarmActivated
  | RuleEngineCtxBridgeMqtt

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
  actions?: RuleEngineRuleInfoActionsItem[]
  created_at?: string
  description?: string
  enable?: boolean
  from?: string[]
  id: string
  last_modified_at?: string
  metadata?: RuleEngineRuleInfoMetadata
  name?: string
  sql: string
}

export type RuleEngineRuleEventsTestColumns = { [key: string]: any }

export type RuleEngineRuleEventsEvent =
  typeof RuleEngineRuleEventsEvent[keyof typeof RuleEngineRuleEventsEvent]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineRuleEventsEvent = {
  '$events/sys/alarm_activated': '$events/sys/alarm_activated',
  '$events/sys/alarm_deactivated': '$events/sys/alarm_deactivated',
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

export type RuleEngineRuleEventsColumns = { [key: string]: any }

export interface RuleEngineRuleEvents {
  columns?: RuleEngineRuleEventsColumns
  description?: string
  event: RuleEngineRuleEventsEvent
  sql_example?: string
  test_columns?: RuleEngineRuleEventsTestColumns
  title?: string
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
  actions?: RuleEngineRuleCreationActionsItem[]
  description?: string
  enable?: boolean
  metadata?: RuleEngineRuleCreationMetadata
  name?: string
  sql: string
}

export type RuleEngineRuleApplyTestContext =
  | RuleEngineCtxUnsub
  | RuleEngineCtxSub
  | RuleEngineCtxSchemaValidationFailed
  | RuleEngineCtxMessageTransformationFailed
  | RuleEngineCtxPub
  | RuleEngineCtxDropped
  | RuleEngineCtxDelivered
  | RuleEngineCtxAcked
  | RuleEngineCtxDeliveryDropped
  | RuleEngineCtxDisconnected
  | RuleEngineCtxConnected
  | RuleEngineCtxConnack
  | RuleEngineCtxCheckAuthzComplete
  | RuleEngineCtxCheckAuthnComplete
  | RuleEngineCtxAlarmDeactivated
  | RuleEngineCtxAlarmActivated
  | RuleEngineCtxBridgeMqtt

export interface RuleEngineRuleApplyTest {
  context?: RuleEngineRuleApplyTestContext
  stop_action_after_template_rendering?: boolean
}

export interface RuleEngineRepublishMqttProperties {
  'Content-Type'?: string
  'Correlation-Data'?: string
  'Message-Expiry-Interval'?: string
  'Payload-Format-Indicator'?: string
  'Response-Topic'?: string
}

export type RuleEngineRepublishArgsRetain = string | boolean

export type RuleEngineRepublishArgsQos = string | number

export type RuleEngineRepublishArgsDirectDispatch = string | boolean

export interface RuleEngineRepublishArgs {
  direct_dispatch?: RuleEngineRepublishArgsDirectDispatch
  mqtt_properties?: RuleEngineRepublishMqttProperties
  payload?: string
  qos?: RuleEngineRepublishArgsQos
  retain?: RuleEngineRepublishArgsRetain
  topic: string
  user_properties?: string
}

export interface RuleEngineNodeMetrics {
  'actions.discarded'?: number
  'actions.failed'?: number
  'actions.failed.out_of_service'?: number
  'actions.failed.unknown'?: number
  'actions.success'?: number
  'actions.total'?: number
  failed?: number
  'failed.exception'?: number
  'failed.unknown'?: number
  matched?: number
  'matched.rate'?: number
  'matched.rate.last5m'?: number
  'matched.rate.max'?: number
  node?: string
  passed?: number
}

export interface RuleEngineMetrics {
  'actions.discarded'?: number
  'actions.failed'?: number
  'actions.failed.out_of_service'?: number
  'actions.failed.unknown'?: number
  'actions.success'?: number
  'actions.total'?: number
  failed?: number
  'failed.exception'?: number
  'failed.unknown'?: number
  matched?: number
  'matched.rate'?: number
  'matched.rate.last5m'?: number
  'matched.rate.max'?: number
  passed?: number
}

export type RuleEngineCtxUnsubEventType =
  typeof RuleEngineCtxUnsubEventType[keyof typeof RuleEngineCtxUnsubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxUnsubEventType = {
  session_unsubscribed: 'session_unsubscribed',
} as const

export interface RuleEngineCtxUnsub {
  clientid?: string
  event_type: RuleEngineCtxUnsubEventType
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  topic?: string
  username?: string
}

export type RuleEngineCtxSubEventType =
  typeof RuleEngineCtxSubEventType[keyof typeof RuleEngineCtxSubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxSubEventType = {
  session_subscribed: 'session_subscribed',
} as const

export interface RuleEngineCtxSub {
  clientid?: string
  event_type: RuleEngineCtxSubEventType
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  topic?: string
  username?: string
}

export type RuleEngineCtxSchemaValidationFailedEventType =
  typeof RuleEngineCtxSchemaValidationFailedEventType[keyof typeof RuleEngineCtxSchemaValidationFailedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxSchemaValidationFailedEventType = {
  schema_validation_failed: 'schema_validation_failed',
} as const

export interface RuleEngineCtxSchemaValidationFailed {
  clientid?: string
  event_type: RuleEngineCtxSchemaValidationFailedEventType
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  topic?: string
  username?: string
  validation?: string
}

export type RuleEngineCtxPubEventType =
  typeof RuleEngineCtxPubEventType[keyof typeof RuleEngineCtxPubEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxPubEventType = {
  message_publish: 'message_publish',
} as const

export interface RuleEngineCtxPub {
  clientid?: string
  event_type: RuleEngineCtxPubEventType
  id?: string
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  topic?: string
  username?: string
}

export type RuleEngineCtxMessageTransformationFailedEventType =
  typeof RuleEngineCtxMessageTransformationFailedEventType[keyof typeof RuleEngineCtxMessageTransformationFailedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxMessageTransformationFailedEventType = {
  message_transformation_failed: 'message_transformation_failed',
} as const

export interface RuleEngineCtxMessageTransformationFailed {
  clientid?: string
  event_type: RuleEngineCtxMessageTransformationFailedEventType
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  topic?: string
  transformation?: string
  username?: string
}

export type RuleEngineCtxDroppedEventType =
  typeof RuleEngineCtxDroppedEventType[keyof typeof RuleEngineCtxDroppedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxDroppedEventType = {
  message_dropped: 'message_dropped',
} as const

export interface RuleEngineCtxDropped {
  clientid?: string
  event_type: RuleEngineCtxDroppedEventType
  id?: string
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  reason?: string
  topic?: string
  username?: string
}

export type RuleEngineCtxDisconnectedEventType =
  typeof RuleEngineCtxDisconnectedEventType[keyof typeof RuleEngineCtxDisconnectedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxDisconnectedEventType = {
  client_disconnected: 'client_disconnected',
} as const

export interface RuleEngineCtxDisconnected {
  clientid?: string
  disconnected_at?: number
  event_type: RuleEngineCtxDisconnectedEventType
  peername?: string
  reason?: string
  sockname?: string
  username?: string
}

export type RuleEngineCtxDeliveryDroppedEventType =
  typeof RuleEngineCtxDeliveryDroppedEventType[keyof typeof RuleEngineCtxDeliveryDroppedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxDeliveryDroppedEventType = {
  delivery_dropped: 'delivery_dropped',
} as const

export interface RuleEngineCtxDeliveryDropped {
  clientid?: string
  event_type: RuleEngineCtxDeliveryDroppedEventType
  from_clientid?: string
  from_username?: string
  id?: string
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  reason?: string
  topic?: string
  username?: string
}

export type RuleEngineCtxDeliveredEventType =
  typeof RuleEngineCtxDeliveredEventType[keyof typeof RuleEngineCtxDeliveredEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxDeliveredEventType = {
  message_delivered: 'message_delivered',
} as const

export interface RuleEngineCtxDelivered {
  clientid?: string
  event_type: RuleEngineCtxDeliveredEventType
  from_clientid?: string
  from_username?: string
  id?: string
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  topic?: string
  username?: string
}

export type RuleEngineCtxConnectedEventType =
  typeof RuleEngineCtxConnectedEventType[keyof typeof RuleEngineCtxConnectedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxConnectedEventType = {
  client_connected: 'client_connected',
} as const

export interface RuleEngineCtxConnected {
  clean_start?: boolean
  clientid?: string
  connected_at?: number
  event_type: RuleEngineCtxConnectedEventType
  expiry_interval?: number
  is_bridge?: boolean
  keepalive?: number
  mountpoint?: string
  peername?: string
  proto_name?: string
  proto_ver?: string
  sockname?: string
  username?: string
}

export type RuleEngineCtxConnackEventType =
  typeof RuleEngineCtxConnackEventType[keyof typeof RuleEngineCtxConnackEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxConnackEventType = {
  client_connack: 'client_connack',
} as const

export interface RuleEngineCtxConnack {
  clean_start?: boolean
  clientid?: string
  connected_at?: number
  event_type: RuleEngineCtxConnackEventType
  expiry_interval?: number
  keepalive?: number
  peername?: string
  proto_name?: string
  proto_ver?: string
  reason_code?: string
  sockname?: string
  username?: string
}

export type RuleEngineCtxCheckAuthzCompleteEventType =
  typeof RuleEngineCtxCheckAuthzCompleteEventType[keyof typeof RuleEngineCtxCheckAuthzCompleteEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxCheckAuthzCompleteEventType = {
  client_check_authz_complete: 'client_check_authz_complete',
} as const

export interface RuleEngineCtxCheckAuthzComplete {
  action?: string
  authz_source?: string
  clientid?: string
  event_type: RuleEngineCtxCheckAuthzCompleteEventType
  peerhost?: string
  result?: string
  topic?: string
  username?: string
}

export type RuleEngineCtxCheckAuthnCompleteEventType =
  typeof RuleEngineCtxCheckAuthnCompleteEventType[keyof typeof RuleEngineCtxCheckAuthnCompleteEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxCheckAuthnCompleteEventType = {
  client_check_authn_complete: 'client_check_authn_complete',
} as const

export interface RuleEngineCtxCheckAuthnComplete {
  clientid?: string
  event_type: RuleEngineCtxCheckAuthnCompleteEventType
  is_anonymous?: boolean
  is_superuser?: boolean
  peername?: string
  reason_code?: string
  username?: string
}

export type RuleEngineCtxBridgeMqttEventType =
  typeof RuleEngineCtxBridgeMqttEventType[keyof typeof RuleEngineCtxBridgeMqttEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxBridgeMqttEventType = {
  '$bridges/mqtt:*': '$bridges/mqtt:*',
} as const

export interface RuleEngineCtxBridgeMqtt {
  dup?: string
  event_type: RuleEngineCtxBridgeMqttEventType
  id?: string
  message_received_at?: number
  payload?: string
  qos?: number
  retain?: string
  server?: string
  topic?: string
}

export type RuleEngineCtxAlarmDeactivatedEventType =
  typeof RuleEngineCtxAlarmDeactivatedEventType[keyof typeof RuleEngineCtxAlarmDeactivatedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxAlarmDeactivatedEventType = {
  alarm_deactivated: 'alarm_deactivated',
} as const

export type RuleEngineCtxAlarmDeactivatedDetails = { [key: string]: any }

export interface RuleEngineCtxAlarmDeactivated {
  activated_at?: number
  deactivated_at?: number
  details?: RuleEngineCtxAlarmDeactivatedDetails
  event_type: RuleEngineCtxAlarmDeactivatedEventType
  message?: string
  name?: string
}

export type RuleEngineCtxAlarmActivatedEventType =
  typeof RuleEngineCtxAlarmActivatedEventType[keyof typeof RuleEngineCtxAlarmActivatedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxAlarmActivatedEventType = {
  alarm_activated: 'alarm_activated',
} as const

export type RuleEngineCtxAlarmActivatedDetails = { [key: string]: any }

export interface RuleEngineCtxAlarmActivated {
  activated_at?: number
  details?: RuleEngineCtxAlarmActivatedDetails
  event_type: RuleEngineCtxAlarmActivatedEventType
  message?: string
  name?: string
}

export type RuleEngineCtxAckedEventType =
  typeof RuleEngineCtxAckedEventType[keyof typeof RuleEngineCtxAckedEventType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineCtxAckedEventType = {
  message_acked: 'message_acked',
} as const

export interface RuleEngineCtxAcked {
  clientid?: string
  event_type: RuleEngineCtxAckedEventType
  from_clientid?: string
  from_username?: string
  id?: string
  payload?: string
  peerhost?: string
  publish_received_at?: number
  qos?: number
  topic?: string
  username?: string
}

export type RuleEngineBuiltinActionRepublishFunction =
  typeof RuleEngineBuiltinActionRepublishFunction[keyof typeof RuleEngineBuiltinActionRepublishFunction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RuleEngineBuiltinActionRepublishFunction = {
  republish: 'republish',
} as const

export interface RuleEngineBuiltinActionRepublish {
  args?: RuleEngineRepublishArgs
  function?: RuleEngineBuiltinActionRepublishFunction
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
  count?: number
  hasnext: boolean
  limit?: number
  page?: number
}
