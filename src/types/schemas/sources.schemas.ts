export type PutSourcesIdMetricsReset404Code =
  (typeof PutSourcesIdMetricsReset404Code)[keyof typeof PutSourcesIdMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSourcesIdMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSourcesIdMetricsReset404 = {
  code?: PutSourcesIdMetricsReset404Code
  message?: string
}

export type GetSourcesIdMetrics404Code =
  (typeof GetSourcesIdMetrics404Code)[keyof typeof GetSourcesIdMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSourcesIdMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetSourcesIdMetrics404 = {
  code?: GetSourcesIdMetrics404Code
  message?: string
}

export type GetSourcesIdMetrics200 = {
  metrics?: BridgeMetrics
  node_metrics?: BridgeNodeMetrics[]
}

export type PutSourcesIdEnableEnable503Code =
  (typeof PutSourcesIdEnableEnable503Code)[keyof typeof PutSourcesIdEnableEnable503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSourcesIdEnableEnable503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutSourcesIdEnableEnable503 = {
  code?: PutSourcesIdEnableEnable503Code
  message?: string
}

export type PutSourcesIdEnableEnable404Code =
  (typeof PutSourcesIdEnableEnable404Code)[keyof typeof PutSourcesIdEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSourcesIdEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSourcesIdEnableEnable404 = {
  code?: PutSourcesIdEnableEnable404Code
  message?: string
}

export type PostSourcesIdOperation503Code =
  (typeof PostSourcesIdOperation503Code)[keyof typeof PostSourcesIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSourcesIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostSourcesIdOperation503 = {
  code?: PostSourcesIdOperation503Code
  message?: string
}

export type PostSourcesIdOperation501Code =
  (typeof PostSourcesIdOperation501Code)[keyof typeof PostSourcesIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSourcesIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostSourcesIdOperation501 = {
  code?: PostSourcesIdOperation501Code
  message?: string
}

export type PostSourcesIdOperation404Code =
  (typeof PostSourcesIdOperation404Code)[keyof typeof PostSourcesIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSourcesIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostSourcesIdOperation404 = {
  code?: PostSourcesIdOperation404Code
  message?: string
}

export type PostSourcesIdOperation400Code =
  (typeof PostSourcesIdOperation400Code)[keyof typeof PostSourcesIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSourcesIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostSourcesIdOperation400 = {
  code?: PostSourcesIdOperation400Code
  message?: string
}

export type DeleteSourcesId503Code =
  (typeof DeleteSourcesId503Code)[keyof typeof DeleteSourcesId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteSourcesId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteSourcesId503 = {
  code?: DeleteSourcesId503Code
  message?: string
}

export type DeleteSourcesId404Code =
  (typeof DeleteSourcesId404Code)[keyof typeof DeleteSourcesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteSourcesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteSourcesId404 = {
  code?: DeleteSourcesId404Code
  message?: string
}

export type DeleteSourcesId400Code =
  (typeof DeleteSourcesId400Code)[keyof typeof DeleteSourcesId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteSourcesId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteSourcesId400 = {
  code?: DeleteSourcesId400Code
  message?: string
  rules?: string[]
}

export type DeleteSourcesIdParams = {
  also_delete_dep_actions?: boolean
}

export type PutSourcesId503Code = (typeof PutSourcesId503Code)[keyof typeof PutSourcesId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSourcesId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutSourcesId503 = {
  code?: PutSourcesId503Code
  message?: string
}

export type PutSourcesId404Code = (typeof PutSourcesId404Code)[keyof typeof PutSourcesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSourcesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSourcesId404 = {
  code?: PutSourcesId404Code
  message?: string
}

export type PutSourcesId400Code = (typeof PutSourcesId400Code)[keyof typeof PutSourcesId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSourcesId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutSourcesId400 = {
  code?: PutSourcesId400Code
  message?: string
}

export type PutSourcesId200 =
  | BridgeMqttPublisherGetSource
  | BridgeRabbitmqGetSource
  | GcpPubsubConsumerGetSource
  | KafkaConsumerGetSource

export type PutSourcesIdBody =
  | BridgeMqttPublisherPutSource
  | BridgeRabbitmqPutSource
  | GcpPubsubConsumerPutSource
  | KafkaConsumerPutSource

export type GetSourcesId404Code = (typeof GetSourcesId404Code)[keyof typeof GetSourcesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSourcesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetSourcesId404 = {
  code?: GetSourcesId404Code
  message?: string
}

export type GetSourcesId200 =
  | BridgeMqttPublisherGetSource
  | BridgeRabbitmqGetSource
  | GcpPubsubConsumerGetSource
  | KafkaConsumerGetSource

export type PostSourcesProbe400Code =
  (typeof PostSourcesProbe400Code)[keyof typeof PostSourcesProbe400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSourcesProbe400Code = {
  TEST_FAILED: 'TEST_FAILED',
} as const

export type PostSourcesProbe400 = {
  code?: PostSourcesProbe400Code
  message?: string
}

export type PostSourcesProbeBody =
  | BridgeMqttPublisherPostSource
  | BridgeRabbitmqPostSource
  | GcpPubsubConsumerPostSource
  | KafkaConsumerPostSource

export type PostSources400Code = (typeof PostSources400Code)[keyof typeof PostSources400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSources400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostSources400 = {
  code?: PostSources400Code
  message?: string
}

export type PostSources201 =
  | BridgeMqttPublisherGetSource
  | BridgeRabbitmqGetSource
  | GcpPubsubConsumerGetSource
  | KafkaConsumerGetSource

export type PostSourcesBody =
  | BridgeMqttPublisherPostSource
  | BridgeRabbitmqPostSource
  | GcpPubsubConsumerPostSource
  | KafkaConsumerPostSource

export type GetSources200Item =
  | BridgeRabbitmqGetSource
  | BridgeMqttPublisherGetSource
  | KafkaConsumerGetSource
  | GcpPubsubConsumerGetSource

export type GetSourceTypes200Item =
  (typeof GetSourceTypes200Item)[keyof typeof GetSourceTypes200Item]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSourceTypes200Item = {
  gcp_pubsub_consumer: 'gcp_pubsub_consumer',
  kafka_consumer: 'kafka_consumer',
  mqtt: 'mqtt',
  rabbitmq: 'rabbitmq',
} as const

export type PostNodesNodeSourcesIdOperation503Code =
  (typeof PostNodesNodeSourcesIdOperation503Code)[keyof typeof PostNodesNodeSourcesIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeSourcesIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostNodesNodeSourcesIdOperation503 = {
  code?: PostNodesNodeSourcesIdOperation503Code
  message?: string
}

export type PostNodesNodeSourcesIdOperation501Code =
  (typeof PostNodesNodeSourcesIdOperation501Code)[keyof typeof PostNodesNodeSourcesIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeSourcesIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostNodesNodeSourcesIdOperation501 = {
  code?: PostNodesNodeSourcesIdOperation501Code
  message?: string
}

export type PostNodesNodeSourcesIdOperation404Code =
  (typeof PostNodesNodeSourcesIdOperation404Code)[keyof typeof PostNodesNodeSourcesIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeSourcesIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostNodesNodeSourcesIdOperation404 = {
  code?: PostNodesNodeSourcesIdOperation404Code
  message?: string
}

export type PostNodesNodeSourcesIdOperation400Code =
  (typeof PostNodesNodeSourcesIdOperation400Code)[keyof typeof PostNodesNodeSourcesIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeSourcesIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostNodesNodeSourcesIdOperation400 = {
  code?: PostNodesNodeSourcesIdOperation400Code
  message?: string
}

export type KafkaConsumerSourceParametersValueEncodingMode =
  (typeof KafkaConsumerSourceParametersValueEncodingMode)[keyof typeof KafkaConsumerSourceParametersValueEncodingMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const KafkaConsumerSourceParametersValueEncodingMode = {
  none: 'none',
  base64: 'base64',
} as const

export type KafkaConsumerSourceParametersOffsetResetPolicy =
  (typeof KafkaConsumerSourceParametersOffsetResetPolicy)[keyof typeof KafkaConsumerSourceParametersOffsetResetPolicy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const KafkaConsumerSourceParametersOffsetResetPolicy = {
  latest: 'latest',
  earliest: 'earliest',
} as const

export type KafkaConsumerSourceParametersKeyEncodingMode =
  (typeof KafkaConsumerSourceParametersKeyEncodingMode)[keyof typeof KafkaConsumerSourceParametersKeyEncodingMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const KafkaConsumerSourceParametersKeyEncodingMode = {
  none: 'none',
  base64: 'base64',
} as const

export interface KafkaConsumerSourceParameters {
  group_id?: string
  key_encoding_mode?: KafkaConsumerSourceParametersKeyEncodingMode
  max_batch_bytes?: string
  max_wait_time?: string
  offset_commit_interval_seconds?: string
  offset_reset_policy?: KafkaConsumerSourceParametersOffsetResetPolicy
  topic: string
  value_encoding_mode?: KafkaConsumerSourceParametersValueEncodingMode
}

export interface KafkaConsumerPutSource {
  connector: string
  description?: string
  enable?: boolean
  parameters: KafkaConsumerSourceParameters
  resource_opts?: ActionsAndSourcesSourceResourceOpts
  tags?: string[]
}

export type KafkaConsumerPostSourceType =
  (typeof KafkaConsumerPostSourceType)[keyof typeof KafkaConsumerPostSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const KafkaConsumerPostSourceType = {
  kafka_consumer: 'kafka_consumer',
} as const

export interface KafkaConsumerPostSource {
  connector: string
  description?: string
  enable?: boolean
  name: string
  parameters: KafkaConsumerSourceParameters
  resource_opts?: ActionsAndSourcesSourceResourceOpts
  tags?: string[]
  type: KafkaConsumerPostSourceType
}

export type KafkaConsumerGetSourceType =
  (typeof KafkaConsumerGetSourceType)[keyof typeof KafkaConsumerGetSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const KafkaConsumerGetSourceType = {
  kafka_consumer: 'kafka_consumer',
} as const

export type KafkaConsumerGetSourceStatus =
  (typeof KafkaConsumerGetSourceStatus)[keyof typeof KafkaConsumerGetSourceStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const KafkaConsumerGetSourceStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface KafkaConsumerGetSource {
  connector: string
  description?: string
  enable?: boolean
  name: string
  node_status?: BridgeNodeStatus[]
  parameters: KafkaConsumerSourceParameters
  resource_opts?: ActionsAndSourcesSourceResourceOpts
  status?: KafkaConsumerGetSourceStatus
  status_reason?: string
  tags?: string[]
  type: KafkaConsumerGetSourceType
}

export type GcpPubsubConsumerSourceResourceOptsRequestTtl = 'infinity' | string

export interface GcpPubsubConsumerSourceResourceOpts {
  health_check_interval?: string
  request_ttl?: GcpPubsubConsumerSourceResourceOptsRequestTtl
}

export interface GcpPubsubConsumerSourceParameters {
  /** @minimum 1 */
  pull_max_messages?: number
  topic: string
}

export interface GcpPubsubConsumerPutSource {
  connector: string
  description?: string
  enable?: boolean
  parameters: GcpPubsubConsumerSourceParameters
  resource_opts?: GcpPubsubConsumerSourceResourceOpts
  tags?: string[]
}

export type GcpPubsubConsumerPostSourceType =
  (typeof GcpPubsubConsumerPostSourceType)[keyof typeof GcpPubsubConsumerPostSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubConsumerPostSourceType = {
  gcp_pubsub_consumer: 'gcp_pubsub_consumer',
} as const

export interface GcpPubsubConsumerPostSource {
  connector: string
  description?: string
  enable?: boolean
  name: string
  parameters: GcpPubsubConsumerSourceParameters
  resource_opts?: GcpPubsubConsumerSourceResourceOpts
  tags?: string[]
  type: GcpPubsubConsumerPostSourceType
}

export type GcpPubsubConsumerGetSourceType =
  (typeof GcpPubsubConsumerGetSourceType)[keyof typeof GcpPubsubConsumerGetSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubConsumerGetSourceType = {
  gcp_pubsub_consumer: 'gcp_pubsub_consumer',
} as const

export type GcpPubsubConsumerGetSourceStatus =
  (typeof GcpPubsubConsumerGetSourceStatus)[keyof typeof GcpPubsubConsumerGetSourceStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubConsumerGetSourceStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeNodeStatusStatus =
  (typeof BridgeNodeStatusStatus)[keyof typeof BridgeNodeStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeNodeStatusStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeNodeStatus {
  node?: string
  status?: BridgeNodeStatusStatus
  status_reason?: string
}

export interface GcpPubsubConsumerGetSource {
  connector: string
  description?: string
  enable?: boolean
  name: string
  node_status?: BridgeNodeStatus[]
  parameters: GcpPubsubConsumerSourceParameters
  resource_opts?: GcpPubsubConsumerSourceResourceOpts
  status?: GcpPubsubConsumerGetSourceStatus
  status_reason?: string
  tags?: string[]
  type: GcpPubsubConsumerGetSourceType
}

export interface BridgeMetrics {
  dropped?: number
  'dropped.other'?: number
  'dropped.queue_full'?: number
  'dropped.resource_not_found'?: number
  'dropped.resource_stopped'?: number
  failed?: number
  inflight?: number
  matched?: number
  queuing?: number
  rate?: number
  rate_last5m?: number
  rate_max?: number
  received?: number
  retried?: number
  success?: number
}

export interface BridgeNodeMetrics {
  metrics?: BridgeMetrics
  node?: string
}

export interface BridgeRabbitmqSourceParameters {
  no_ack?: boolean
  queue: string
  wait_for_publish_confirmations?: boolean
}

export interface BridgeRabbitmqPutSource {
  connector: string
  description?: string
  enable?: boolean
  parameters: BridgeRabbitmqSourceParameters
  resource_opts?: ActionsAndSourcesSourceResourceOpts
  tags?: string[]
}

export type BridgeRabbitmqPostSourceType =
  (typeof BridgeRabbitmqPostSourceType)[keyof typeof BridgeRabbitmqPostSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqPostSourceType = {
  rabbitmq: 'rabbitmq',
} as const

export interface BridgeRabbitmqPostSource {
  connector: string
  description?: string
  enable?: boolean
  name: string
  parameters: BridgeRabbitmqSourceParameters
  resource_opts?: ActionsAndSourcesSourceResourceOpts
  tags?: string[]
  type: BridgeRabbitmqPostSourceType
}

export type BridgeRabbitmqGetSourceType =
  (typeof BridgeRabbitmqGetSourceType)[keyof typeof BridgeRabbitmqGetSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqGetSourceType = {
  rabbitmq: 'rabbitmq',
} as const

export type BridgeRabbitmqGetSourceStatus =
  (typeof BridgeRabbitmqGetSourceStatus)[keyof typeof BridgeRabbitmqGetSourceStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqGetSourceStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeRabbitmqGetSource {
  connector: string
  description?: string
  enable?: boolean
  name: string
  node_status?: BridgeNodeStatus[]
  parameters: BridgeRabbitmqSourceParameters
  resource_opts?: ActionsAndSourcesSourceResourceOpts
  status?: BridgeRabbitmqGetSourceStatus
  status_reason?: string
  tags?: string[]
  type: BridgeRabbitmqGetSourceType
}

export interface BridgeMqttPublisherSourceResourceOpts {
  health_check_interval?: string
}

export type BridgeMqttPublisherPostSourceType =
  (typeof BridgeMqttPublisherPostSourceType)[keyof typeof BridgeMqttPublisherPostSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherPostSourceType = {
  mqtt: 'mqtt',
} as const

export interface BridgeMqttPublisherIngressParameters {
  no_local?: boolean
  /**
   * @minimum 0
   * @maximum 2
   */
  qos?: number
  topic: string
}

export interface BridgeMqttPublisherPutSource {
  connector: string
  description?: string
  enable?: boolean
  parameters: BridgeMqttPublisherIngressParameters
  resource_opts?: BridgeMqttPublisherSourceResourceOpts
  tags?: string[]
}

export interface BridgeMqttPublisherPostSource {
  connector: string
  description?: string
  enable?: boolean
  name: string
  parameters: BridgeMqttPublisherIngressParameters
  resource_opts?: BridgeMqttPublisherSourceResourceOpts
  tags?: string[]
  type: BridgeMqttPublisherPostSourceType
}

export type BridgeMqttPublisherGetSourceType =
  (typeof BridgeMqttPublisherGetSourceType)[keyof typeof BridgeMqttPublisherGetSourceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherGetSourceType = {
  mqtt: 'mqtt',
} as const

export type BridgeMqttPublisherGetSourceStatus =
  (typeof BridgeMqttPublisherGetSourceStatus)[keyof typeof BridgeMqttPublisherGetSourceStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherGetSourceStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeMqttPublisherGetSource {
  connector: string
  description?: string
  enable?: boolean
  name: string
  node_status?: BridgeNodeStatus[]
  parameters: BridgeMqttPublisherIngressParameters
  resource_opts?: BridgeMqttPublisherSourceResourceOpts
  status?: BridgeMqttPublisherGetSourceStatus
  status_reason?: string
  tags?: string[]
  type: BridgeMqttPublisherGetSourceType
}

export interface ActionsAndSourcesSourceResourceOpts {
  health_check_interval?: string
}

export interface ActionsAndSourcesResponseNodeStatus {
  node?: string
  status?: string
  status_reason?: string
}

export interface ActionsAndSourcesResponseSummary {
  created_at?: number
  description?: string
  enable?: boolean
  last_modified_at?: number
  name?: string
  node_status?: ActionsAndSourcesResponseNodeStatus[]
  rules?: string[]
  status?: string
  status_reason?: string
  type?: string
}
