export type PostNodesNodeActionsIdOperation503Code =
  typeof PostNodesNodeActionsIdOperation503Code[keyof typeof PostNodesNodeActionsIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostNodesNodeActionsIdOperation503 = {
  code?: PostNodesNodeActionsIdOperation503Code
  message?: string
}

export type PostNodesNodeActionsIdOperation501Code =
  typeof PostNodesNodeActionsIdOperation501Code[keyof typeof PostNodesNodeActionsIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostNodesNodeActionsIdOperation501 = {
  code?: PostNodesNodeActionsIdOperation501Code
  message?: string
}

export type PostNodesNodeActionsIdOperation404Code =
  typeof PostNodesNodeActionsIdOperation404Code[keyof typeof PostNodesNodeActionsIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostNodesNodeActionsIdOperation404 = {
  code?: PostNodesNodeActionsIdOperation404Code
  message?: string
}

export type PostNodesNodeActionsIdOperation400Code =
  typeof PostNodesNodeActionsIdOperation400Code[keyof typeof PostNodesNodeActionsIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostNodesNodeActionsIdOperation400 = {
  code?: PostNodesNodeActionsIdOperation400Code
  message?: string
}

export type GetActionsIdMetrics404Code =
  typeof GetActionsIdMetrics404Code[keyof typeof GetActionsIdMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetActionsIdMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetActionsIdMetrics404 = {
  code?: GetActionsIdMetrics404Code
  message?: string
}

export type GetActionsIdMetrics200 = {
  metrics?: BridgeMetrics
  node_metrics?: BridgeNodeMetrics[]
}

export type PutActionsId404Code = typeof PutActionsId404Code[keyof typeof PutActionsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsId404 = {
  code?: PutActionsId404Code
  message?: string
}

export type PutActionsId400Code = typeof PutActionsId400Code[keyof typeof PutActionsId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutActionsId400 = {
  code?: PutActionsId400Code
  message?: string
}

export type PutActionsId200 =
  | BridgeTimescaleGetBridgeV2
  | SyskeeperGetBridgeV2
  | RedisGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2

export type PutActionsIdBody =
  | BridgeTimescalePutBridgeV2
  | SyskeeperPutBridgeV2
  | RedisPutBridgeV2
  | BridgePgsqlPutBridgeV2
  | BridgeMongodbPutBridgeV2
  | BridgeMatrixPutBridgeV2
  | BridgeKafkaPutBridgeV2
  | GcpPubsubProducerPutBridgeV2
  | ConfluentPutBridgeV2
  | BridgeAzureEventHubPutBridgeV2

export type GetActionsId404Code = typeof GetActionsId404Code[keyof typeof GetActionsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetActionsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetActionsId404 = {
  code?: GetActionsId404Code
  message?: string
}

export type GetActionsId200 =
  | BridgeTimescaleGetBridgeV2
  | SyskeeperGetBridgeV2
  | RedisGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2

export type DeleteActionsId503Code =
  typeof DeleteActionsId503Code[keyof typeof DeleteActionsId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteActionsId503 = {
  code?: DeleteActionsId503Code
  message?: string
}

export type DeleteActionsId404Code =
  typeof DeleteActionsId404Code[keyof typeof DeleteActionsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteActionsId404 = {
  code?: DeleteActionsId404Code
  message?: string
}

export type DeleteActionsId400Code =
  typeof DeleteActionsId400Code[keyof typeof DeleteActionsId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteActionsId400 = {
  code?: DeleteActionsId400Code
  message?: string
}

export type DeleteActionsIdParams = {
  also_delete_dep_actions?: boolean
}

export type GetActionTypes200Item = typeof GetActionTypes200Item[keyof typeof GetActionTypes200Item]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetActionTypes200Item = {
  azure_event_hub_producer: 'azure_event_hub_producer',
  confluent_producer: 'confluent_producer',
  gcp_pubsub_producer: 'gcp_pubsub_producer',
  kafka_producer: 'kafka_producer',
  mongodb: 'mongodb',
  syskeeper_forwarder: 'syskeeper_forwarder',
  redis: 'redis',
  timescale: 'timescale',
  matrix: 'matrix',
  pgsql: 'pgsql',
} as const

export type PostActionsProbe400Code =
  typeof PostActionsProbe400Code[keyof typeof PostActionsProbe400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsProbe400Code = {
  TEST_FAILED: 'TEST_FAILED',
} as const

export type PostActionsProbe400 = {
  code?: PostActionsProbe400Code
  message?: string
}

export type PostActionsProbeBody =
  | BridgeTimescalePostBridgeV2
  | SyskeeperPostBridgeV2
  | RedisPostBridgeV2
  | BridgePgsqlPostBridgeV2
  | BridgeMongodbPostBridgeV2
  | BridgeMatrixPostBridgeV2
  | BridgeKafkaPostBridgeV2
  | GcpPubsubProducerPostBridgeV2
  | ConfluentPostBridgeV2
  | BridgeAzureEventHubPostBridgeV2

export type PostActions400Code = typeof PostActions400Code[keyof typeof PostActions400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActions400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostActions400 = {
  code?: PostActions400Code
  message?: string
}

export type PostActions201 =
  | BridgeTimescaleGetBridgeV2
  | SyskeeperGetBridgeV2
  | RedisGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2

export type PostActionsBody =
  | BridgeTimescalePostBridgeV2
  | SyskeeperPostBridgeV2
  | RedisPostBridgeV2
  | BridgePgsqlPostBridgeV2
  | BridgeMongodbPostBridgeV2
  | BridgeMatrixPostBridgeV2
  | BridgeKafkaPostBridgeV2
  | GcpPubsubProducerPostBridgeV2
  | ConfluentPostBridgeV2
  | BridgeAzureEventHubPostBridgeV2

export type GetActions200Item =
  | BridgeTimescaleGetBridgeV2
  | SyskeeperGetBridgeV2
  | RedisGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2

export type PutActionsIdEnableEnable503Code =
  typeof PutActionsIdEnableEnable503Code[keyof typeof PutActionsIdEnableEnable503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdEnableEnable503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutActionsIdEnableEnable503 = {
  code?: PutActionsIdEnableEnable503Code
  message?: string
}

export type PutActionsIdEnableEnable404Code =
  typeof PutActionsIdEnableEnable404Code[keyof typeof PutActionsIdEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsIdEnableEnable404 = {
  code?: PutActionsIdEnableEnable404Code
  message?: string
}

export type PostActionsIdOperation503Code =
  typeof PostActionsIdOperation503Code[keyof typeof PostActionsIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostActionsIdOperation503 = {
  code?: PostActionsIdOperation503Code
  message?: string
}

export type PostActionsIdOperation501Code =
  typeof PostActionsIdOperation501Code[keyof typeof PostActionsIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostActionsIdOperation501 = {
  code?: PostActionsIdOperation501Code
  message?: string
}

export type PostActionsIdOperation404Code =
  typeof PostActionsIdOperation404Code[keyof typeof PostActionsIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostActionsIdOperation404 = {
  code?: PostActionsIdOperation404Code
  message?: string
}

export type PostActionsIdOperation400Code =
  typeof PostActionsIdOperation400Code[keyof typeof PostActionsIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostActionsIdOperation400 = {
  code?: PostActionsIdOperation400Code
  message?: string
}

export type PutActionsIdMetricsReset404Code =
  typeof PutActionsIdMetricsReset404Code[keyof typeof PutActionsIdMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsIdMetricsReset404 = {
  code?: PutActionsIdMetricsReset404Code
  message?: string
}

export type SyskeeperPostBridgeV2Type =
  typeof SyskeeperPostBridgeV2Type[keyof typeof SyskeeperPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperPostBridgeV2Type = {
  syskeeper_forwarder: 'syskeeper_forwarder',
} as const

export interface SyskeeperParameters {
  target_topic?: string
  target_qos?: number
  template?: string
}

export interface SyskeeperPutBridgeV2 {
  enable?: boolean
  description?: string
  connector: string
  parameters: SyskeeperParameters
  local_topic?: string
  resource_opts?: SyskeeperCreationOpts
}

export interface SyskeeperPostBridgeV2 {
  type: SyskeeperPostBridgeV2Type
  name: string
  enable?: boolean
  description?: string
  connector: string
  parameters: SyskeeperParameters
  local_topic?: string
  resource_opts?: SyskeeperCreationOpts
}

export type SyskeeperGetBridgeV2Type =
  typeof SyskeeperGetBridgeV2Type[keyof typeof SyskeeperGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperGetBridgeV2Type = {
  syskeeper_forwarder: 'syskeeper_forwarder',
} as const

export type SyskeeperGetBridgeV2Status =
  typeof SyskeeperGetBridgeV2Status[keyof typeof SyskeeperGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type SyskeeperCreationOptsRequestTtl = 'infinity' | string

export type SyskeeperCreationOptsQueryMode =
  typeof SyskeeperCreationOptsQueryMode[keyof typeof SyskeeperCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type SyskeeperCreationOptsAutoRestartInterval = string | 'infinity'

export interface SyskeeperCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: SyskeeperCreationOptsAutoRestartInterval
  query_mode?: SyskeeperCreationOptsQueryMode
  request_ttl?: SyskeeperCreationOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface SyskeeperGetBridgeV2 {
  status?: SyskeeperGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: SyskeeperGetBridgeV2Type
  name: string
  enable?: boolean
  description?: string
  connector: string
  parameters: SyskeeperParameters
  local_topic?: string
  resource_opts?: SyskeeperCreationOpts
}

export type RedisResourceOptsRequestTtl = 'infinity' | string

export type RedisResourceOptsQueryMode =
  typeof RedisResourceOptsQueryMode[keyof typeof RedisResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type RedisResourceOptsAutoRestartInterval = string | 'infinity'

export interface RedisResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: RedisResourceOptsAutoRestartInterval
  query_mode?: RedisResourceOptsQueryMode
  request_ttl?: RedisResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export type RedisPutBridgeV2RedisType =
  typeof RedisPutBridgeV2RedisType[keyof typeof RedisPutBridgeV2RedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisPutBridgeV2RedisType = {
  single: 'single',
  sentinel: 'sentinel',
  cluster: 'cluster',
} as const

export interface RedisPutBridgeV2 {
  redis_type: RedisPutBridgeV2RedisType
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgeRedisActionParameters
  resource_opts: RedisResourceOpts
}

export type RedisPostBridgeV2RedisType =
  typeof RedisPostBridgeV2RedisType[keyof typeof RedisPostBridgeV2RedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisPostBridgeV2RedisType = {
  single: 'single',
  sentinel: 'sentinel',
  cluster: 'cluster',
} as const

export type RedisPostBridgeV2Type = typeof RedisPostBridgeV2Type[keyof typeof RedisPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisPostBridgeV2Type = {
  redis: 'redis',
} as const

export interface RedisPostBridgeV2 {
  type: RedisPostBridgeV2Type
  name: string
  redis_type: RedisPostBridgeV2RedisType
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgeRedisActionParameters
  resource_opts: RedisResourceOpts
}

export type RedisGetBridgeV2RedisType =
  typeof RedisGetBridgeV2RedisType[keyof typeof RedisGetBridgeV2RedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisGetBridgeV2RedisType = {
  single: 'single',
  sentinel: 'sentinel',
  cluster: 'cluster',
} as const

export type RedisGetBridgeV2Type = typeof RedisGetBridgeV2Type[keyof typeof RedisGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisGetBridgeV2Type = {
  redis: 'redis',
} as const

export type RedisGetBridgeV2Status =
  typeof RedisGetBridgeV2Status[keyof typeof RedisGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface RedisGetBridgeV2 {
  status?: RedisGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: RedisGetBridgeV2Type
  name: string
  redis_type: RedisGetBridgeV2RedisType
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgeRedisActionParameters
  resource_opts: RedisResourceOpts
}

export type GcpPubsubProducerPostBridgeV2Type =
  typeof GcpPubsubProducerPostBridgeV2Type[keyof typeof GcpPubsubProducerPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubProducerPostBridgeV2Type = {
  gcp_pubsub_producer: 'gcp_pubsub_producer',
} as const

export interface GcpPubsubProducerPostBridgeV2 {
  type: GcpPubsubProducerPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: GcpPubsubProducerActionParameters
  resource_opts?: ActionsResourceOpts
}

export type GcpPubsubProducerGetBridgeV2Type =
  typeof GcpPubsubProducerGetBridgeV2Type[keyof typeof GcpPubsubProducerGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubProducerGetBridgeV2Type = {
  gcp_pubsub_producer: 'gcp_pubsub_producer',
} as const

export type GcpPubsubProducerGetBridgeV2Status =
  typeof GcpPubsubProducerGetBridgeV2Status[keyof typeof GcpPubsubProducerGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubProducerGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface GcpPubsubProducerActionParameters {
  attributes_template?: BridgeGcpPubsubKeyValuePair[]
  ordering_key_template?: string
  payload_template?: string
  pubsub_topic: string
}

export interface ConfluentPutBridgeV2 {
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: ConfluentProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type ConfluentProducerKafkaOptsQueryMode =
  typeof ConfluentProducerKafkaOptsQueryMode[keyof typeof ConfluentProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export type ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode =
  typeof ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode[keyof typeof ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode = {
  none: 'none',
  json: 'json',
} as const

export type ConfluentProducerKafkaOptsRequiredAcks =
  typeof ConfluentProducerKafkaOptsRequiredAcks[keyof typeof ConfluentProducerKafkaOptsRequiredAcks]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsRequiredAcks = {
  all_isr: 'all_isr',
  leader_only: 'leader_only',
  none: 'none',
} as const

export type ConfluentProducerKafkaOptsPartitionStrategy =
  typeof ConfluentProducerKafkaOptsPartitionStrategy[keyof typeof ConfluentProducerKafkaOptsPartitionStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsPartitionStrategy = {
  random: 'random',
  key_dispatch: 'key_dispatch',
} as const

export type ConfluentProducerKafkaOptsCompression =
  typeof ConfluentProducerKafkaOptsCompression[keyof typeof ConfluentProducerKafkaOptsCompression]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsCompression = {
  no_compression: 'no_compression',
  snappy: 'snappy',
  gzip: 'gzip',
} as const

export type ConfluentPostBridgeV2Type =
  typeof ConfluentPostBridgeV2Type[keyof typeof ConfluentPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentPostBridgeV2Type = {
  confluent_producer: 'confluent_producer',
} as const

export interface ConfluentPostBridgeV2 {
  type: ConfluentPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: ConfluentProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export interface ConfluentKafkaMessage {
  key?: string
  value?: string
}

export interface ConfluentProducerKafkaOpts {
  topic: string
  message?: ConfluentKafkaMessage
  max_batch_bytes?: string
  compression?: ConfluentProducerKafkaOptsCompression
  partition_strategy?: ConfluentProducerKafkaOptsPartitionStrategy
  required_acks?: ConfluentProducerKafkaOptsRequiredAcks
  kafka_headers?: string
  kafka_ext_headers?: BridgeKafkaProducerKafkaExtHeaders[]
  kafka_header_value_encode_mode?: ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode
  partition_count_refresh_interval?: string
  max_inflight?: number
  buffer?: BridgeKafkaProducerBuffer
  query_mode?: ConfluentProducerKafkaOptsQueryMode
  sync_query_timeout?: string
}

export type ConfluentGetBridgeV2Type =
  typeof ConfluentGetBridgeV2Type[keyof typeof ConfluentGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentGetBridgeV2Type = {
  confluent_producer: 'confluent_producer',
} as const

export type ConfluentGetBridgeV2Status =
  typeof ConfluentGetBridgeV2Status[keyof typeof ConfluentGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface ConfluentGetBridgeV2 {
  status?: ConfluentGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: ConfluentGetBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: ConfluentProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type BridgeNodeStatusStatus =
  typeof BridgeNodeStatusStatus[keyof typeof BridgeNodeStatusStatus]

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

export interface GcpPubsubProducerGetBridgeV2 {
  status?: GcpPubsubProducerGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: GcpPubsubProducerGetBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: GcpPubsubProducerActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgeMetrics {
  dropped?: number
  'dropped.other'?: number
  'dropped.queue_full'?: number
  'dropped.resource_not_found'?: number
  'dropped.resource_stopped'?: number
  matched?: number
  queuing?: number
  retried?: number
  failed?: number
  inflight?: number
  success?: number
  rate?: number
  rate_max?: number
  rate_last5m?: number
  received?: number
}

export interface BridgeNodeMetrics {
  node?: string
  metrics?: BridgeMetrics
}

export interface BridgeTimescaleGetBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgeRedisActionParameters {
  command_template: string[]
}

export type BridgePgsqlActionParametersPrepareStatement = { [key: string]: any }

export interface BridgePgsqlActionParameters {
  sql?: string
  prepare_statement?: BridgePgsqlActionParametersPrepareStatement
}

export interface BridgeTimescalePutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgeTimescalePostBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgePgsqlPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgePgsqlPostBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgePgsqlGetBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgeMongodbPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgeMongodbActionParameters
  resource_opts?: ActionsResourceOpts
}

export type BridgeMongodbPostBridgeV2Type =
  typeof BridgeMongodbPostBridgeV2Type[keyof typeof BridgeMongodbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostBridgeV2Type = {
  mongodb: 'mongodb',
} as const

export interface BridgeMongodbPostBridgeV2 {
  type: BridgeMongodbPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgeMongodbActionParameters
  resource_opts?: ActionsResourceOpts
}

export type BridgeMongodbGetBridgeV2Type =
  typeof BridgeMongodbGetBridgeV2Type[keyof typeof BridgeMongodbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetBridgeV2Type = {
  mongodb: 'mongodb',
} as const

export type BridgeMongodbGetBridgeV2Status =
  typeof BridgeMongodbGetBridgeV2Status[keyof typeof BridgeMongodbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeMongodbActionParameters {
  collection?: string
  payload_template?: string
}

export interface BridgeMatrixPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgeMatrixPostBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgeMatrixGetBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgeKafkaResourceOpts {
  health_check_interval?: string
}

export type BridgeKafkaProducerKafkaOptsQueryMode =
  typeof BridgeKafkaProducerKafkaOptsQueryMode[keyof typeof BridgeKafkaProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export type BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode =
  typeof BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode[keyof typeof BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode = {
  none: 'none',
  json: 'json',
} as const

export type BridgeKafkaProducerKafkaOptsRequiredAcks =
  typeof BridgeKafkaProducerKafkaOptsRequiredAcks[keyof typeof BridgeKafkaProducerKafkaOptsRequiredAcks]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsRequiredAcks = {
  all_isr: 'all_isr',
  leader_only: 'leader_only',
  none: 'none',
} as const

export type BridgeKafkaProducerKafkaOptsPartitionStrategy =
  typeof BridgeKafkaProducerKafkaOptsPartitionStrategy[keyof typeof BridgeKafkaProducerKafkaOptsPartitionStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsPartitionStrategy = {
  random: 'random',
  key_dispatch: 'key_dispatch',
} as const

export type BridgeKafkaProducerKafkaOptsCompression =
  typeof BridgeKafkaProducerKafkaOptsCompression[keyof typeof BridgeKafkaProducerKafkaOptsCompression]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsCompression = {
  no_compression: 'no_compression',
  snappy: 'snappy',
  gzip: 'gzip',
} as const

export interface BridgeKafkaProducerKafkaExtHeaders {
  kafka_ext_header_key: string
  kafka_ext_header_value: string
}

export type BridgeKafkaProducerBufferMode =
  typeof BridgeKafkaProducerBufferMode[keyof typeof BridgeKafkaProducerBufferMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerBufferMode = {
  memory: 'memory',
  disk: 'disk',
  hybrid: 'hybrid',
} as const

export interface BridgeKafkaProducerBuffer {
  mode?: BridgeKafkaProducerBufferMode
  per_partition_limit?: string
  segment_bytes?: string
  memory_overload_protection?: boolean
}

export interface BridgeKafkaProducerKafkaOpts {
  topic: string
  message?: BridgeKafkaKafkaMessage
  max_batch_bytes?: string
  compression?: BridgeKafkaProducerKafkaOptsCompression
  partition_strategy?: BridgeKafkaProducerKafkaOptsPartitionStrategy
  required_acks?: BridgeKafkaProducerKafkaOptsRequiredAcks
  kafka_headers?: string
  kafka_ext_headers?: BridgeKafkaProducerKafkaExtHeaders[]
  kafka_header_value_encode_mode?: BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode
  partition_count_refresh_interval?: string
  max_inflight?: number
  buffer?: BridgeKafkaProducerBuffer
  query_mode?: BridgeKafkaProducerKafkaOptsQueryMode
  sync_query_timeout?: string
}

export interface BridgeKafkaPutBridgeV2 {
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: BridgeKafkaProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type BridgeKafkaPostBridgeV2Type =
  typeof BridgeKafkaPostBridgeV2Type[keyof typeof BridgeKafkaPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPostBridgeV2Type = {
  kafka_producer: 'kafka_producer',
} as const

export interface BridgeKafkaPostBridgeV2 {
  type: BridgeKafkaPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: BridgeKafkaProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export interface BridgeKafkaKafkaMessage {
  key?: string
  value?: string
  timestamp?: string
}

export type BridgeKafkaGetBridgeV2Type =
  typeof BridgeKafkaGetBridgeV2Type[keyof typeof BridgeKafkaGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetBridgeV2Type = {
  kafka_producer: 'kafka_producer',
} as const

export type BridgeKafkaGetBridgeV2Status =
  typeof BridgeKafkaGetBridgeV2Status[keyof typeof BridgeKafkaGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeKafkaGetBridgeV2 {
  status?: BridgeKafkaGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeKafkaGetBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: BridgeKafkaProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export interface BridgeGcpPubsubKeyValuePair {
  key: string
  value: string
}

export interface BridgeAzureEventHubPutBridgeV2 {
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: BridgeAzureEventHubProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type BridgeAzureEventHubProducerKafkaOptsQueryMode =
  typeof BridgeAzureEventHubProducerKafkaOptsQueryMode[keyof typeof BridgeAzureEventHubProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export type BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode =
  typeof BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode[keyof typeof BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode = {
  none: 'none',
  json: 'json',
} as const

export type BridgeAzureEventHubProducerKafkaOptsRequiredAcks =
  typeof BridgeAzureEventHubProducerKafkaOptsRequiredAcks[keyof typeof BridgeAzureEventHubProducerKafkaOptsRequiredAcks]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsRequiredAcks = {
  all_isr: 'all_isr',
  leader_only: 'leader_only',
} as const

export type BridgeAzureEventHubProducerKafkaOptsPartitionStrategy =
  typeof BridgeAzureEventHubProducerKafkaOptsPartitionStrategy[keyof typeof BridgeAzureEventHubProducerKafkaOptsPartitionStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsPartitionStrategy = {
  random: 'random',
  key_dispatch: 'key_dispatch',
} as const

export interface BridgeAzureEventHubProducerKafkaOpts {
  topic: string
  message?: BridgeAzureEventHubKafkaMessage
  max_batch_bytes?: string
  partition_strategy?: BridgeAzureEventHubProducerKafkaOptsPartitionStrategy
  required_acks?: BridgeAzureEventHubProducerKafkaOptsRequiredAcks
  kafka_headers?: string
  kafka_ext_headers?: BridgeKafkaProducerKafkaExtHeaders[]
  kafka_header_value_encode_mode?: BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode
  partition_count_refresh_interval?: string
  max_inflight?: number
  buffer?: BridgeKafkaProducerBuffer
  query_mode?: BridgeAzureEventHubProducerKafkaOptsQueryMode
  sync_query_timeout?: string
}

export type BridgeAzureEventHubPostBridgeV2Type =
  typeof BridgeAzureEventHubPostBridgeV2Type[keyof typeof BridgeAzureEventHubPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubPostBridgeV2Type = {
  azure_event_hub_producer: 'azure_event_hub_producer',
} as const

export interface BridgeAzureEventHubPostBridgeV2 {
  type: BridgeAzureEventHubPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: BridgeAzureEventHubProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export interface BridgeAzureEventHubKafkaMessage {
  key?: string
  value?: string
}

export type BridgeAzureEventHubGetBridgeV2Type =
  typeof BridgeAzureEventHubGetBridgeV2Type[keyof typeof BridgeAzureEventHubGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetBridgeV2Type = {
  azure_event_hub_producer: 'azure_event_hub_producer',
} as const

export type BridgeAzureEventHubGetBridgeV2Status =
  typeof BridgeAzureEventHubGetBridgeV2Status[keyof typeof BridgeAzureEventHubGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeAzureEventHubGetBridgeV2 {
  status?: BridgeAzureEventHubGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeAzureEventHubGetBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  description?: string
  local_topic?: string
  parameters: BridgeAzureEventHubProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type ActionsResourceOptsRequestTtl = 'infinity' | string

export type ActionsResourceOptsQueryMode =
  typeof ActionsResourceOptsQueryMode[keyof typeof ActionsResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionsResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type ActionsResourceOptsAutoRestartInterval = string | 'infinity'

export interface ActionsResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: ActionsResourceOptsAutoRestartInterval
  query_mode?: ActionsResourceOptsQueryMode
  request_ttl?: ActionsResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface GcpPubsubProducerPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: GcpPubsubProducerActionParameters
  resource_opts?: ActionsResourceOpts
}

export interface BridgeMongodbGetBridgeV2 {
  status?: BridgeMongodbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeMongodbGetBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  description?: string
  parameters: BridgeMongodbActionParameters
  resource_opts?: ActionsResourceOpts
}
