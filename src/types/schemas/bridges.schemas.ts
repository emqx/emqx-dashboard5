export type PostBridges400Code = typeof PostBridges400Code[keyof typeof PostBridges400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBridges400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostBridges400 = {
  code?: PostBridges400Code
  message?: string
}

export type PostBridges201 =
  | BridgeKafkaGetProducer
  | BridgeTimescaleGet
  | RocketmqGet
  | BridgeKafkaGetConsumer
  | BridgeMatrixGet
  | BridgeSqlserverGet
  | BridgeClickhouseGet
  | BridgeGcpPubsubGetConsumer
  | BridgeCassaGet
  | BridgeRedisGetSingle
  | BridgeGcpPubsubGetProducer
  | BridgeInfluxdbGetApiV1
  | BridgeHstreamdbGet
  | BridgeOracleGet
  | BridgeMongodbGetRs
  | BridgeMongodbGetSharded
  | BridgeOpentsGet
  | BridgeGreptimedbGetGrpcV1
  | BridgeMongodbGetSingle
  | BridgeTdengineGet
  | BridgeDynamoGet
  | BridgeRabbitmqGet
  | BridgeMqttGet
  | BridgeKinesisGetProducer
  | BridgeMysqlGet
  | BridgeRedisGetCluster
  | BridgePgsqlGet
  | BridgePulsarGetProducer
  | BridgeRedisGetSentinel
  | BridgeAzureEventHubGetProducer
  | BridgeHttpGet
  | BridgeIotdbGet
  | BridgeInfluxdbGetApiV2

export type PostBridgesBody =
  | BridgeKafkaPostProducer
  | BridgeTimescalePost
  | RocketmqPost
  | BridgeKafkaPostConsumer
  | BridgeMatrixPost
  | BridgeSqlserverPost
  | BridgeClickhousePost
  | BridgeGcpPubsubPostConsumer
  | BridgeCassaPost
  | BridgeRedisPostSingle
  | BridgeGcpPubsubPostProducer
  | BridgeInfluxdbPostApiV1
  | BridgeHstreamdbPost
  | BridgeOraclePost
  | BridgeMongodbPostRs
  | BridgeMongodbPostSharded
  | BridgeOpentsPost
  | BridgeGreptimedbPostGrpcV1
  | BridgeMongodbPostSingle
  | BridgeTdenginePost
  | BridgeDynamoPost
  | BridgeRabbitmqPost
  | BridgeMqttPost
  | BridgeKinesisPostProducer
  | BridgeMysqlPost
  | BridgeRedisPostCluster
  | BridgePgsqlPost
  | BridgePulsarPostProducer
  | BridgeRedisPostSentinel
  | BridgeAzureEventHubPostProducer
  | BridgeHttpPost
  | BridgeIotdbPost
  | BridgeInfluxdbPostApiV2

export type GetBridges200Item =
  | BridgeKafkaGetProducer
  | BridgeTimescaleGet
  | RocketmqGet
  | BridgeKafkaGetConsumer
  | BridgeMatrixGet
  | BridgeSqlserverGet
  | BridgeClickhouseGet
  | BridgeGcpPubsubGetConsumer
  | BridgeCassaGet
  | BridgeRedisGetSingle
  | BridgeGcpPubsubGetProducer
  | BridgeInfluxdbGetApiV1
  | BridgeHstreamdbGet
  | BridgeOracleGet
  | BridgeMongodbGetRs
  | BridgeMongodbGetSharded
  | BridgeOpentsGet
  | BridgeGreptimedbGetGrpcV1
  | BridgeMongodbGetSingle
  | BridgeTdengineGet
  | BridgeDynamoGet
  | BridgeRabbitmqGet
  | BridgeMqttGet
  | BridgeKinesisGetProducer
  | BridgeMysqlGet
  | BridgeRedisGetCluster
  | BridgePgsqlGet
  | BridgePulsarGetProducer
  | BridgeRedisGetSentinel
  | BridgeAzureEventHubGetProducer
  | BridgeHttpGet
  | BridgeIotdbGet
  | BridgeInfluxdbGetApiV2

export type PostBridgesIdOperation503Code =
  typeof PostBridgesIdOperation503Code[keyof typeof PostBridgesIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBridgesIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostBridgesIdOperation503 = {
  code?: PostBridgesIdOperation503Code
  message?: string
}

export type PostBridgesIdOperation501Code =
  typeof PostBridgesIdOperation501Code[keyof typeof PostBridgesIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBridgesIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostBridgesIdOperation501 = {
  code?: PostBridgesIdOperation501Code
  message?: string
}

export type PostBridgesIdOperation404Code =
  typeof PostBridgesIdOperation404Code[keyof typeof PostBridgesIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBridgesIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostBridgesIdOperation404 = {
  code?: PostBridgesIdOperation404Code
  message?: string
}

export type PostBridgesIdOperation400Code =
  typeof PostBridgesIdOperation400Code[keyof typeof PostBridgesIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBridgesIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostBridgesIdOperation400 = {
  code?: PostBridgesIdOperation400Code
  message?: string
}

export type DeleteBridgesId503Code =
  typeof DeleteBridgesId503Code[keyof typeof DeleteBridgesId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteBridgesId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteBridgesId503 = {
  code?: DeleteBridgesId503Code
  message?: string
}

export type DeleteBridgesId404Code =
  typeof DeleteBridgesId404Code[keyof typeof DeleteBridgesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteBridgesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteBridgesId404 = {
  code?: DeleteBridgesId404Code
  message?: string
}

export type DeleteBridgesId400Code =
  typeof DeleteBridgesId400Code[keyof typeof DeleteBridgesId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteBridgesId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteBridgesId400 = {
  rules?: string[]
  code?: DeleteBridgesId400Code
  message?: string
}

export type PutBridgesId404Code = typeof PutBridgesId404Code[keyof typeof PutBridgesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutBridgesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutBridgesId404 = {
  code?: PutBridgesId404Code
  message?: string
}

export type PutBridgesId400Code = typeof PutBridgesId400Code[keyof typeof PutBridgesId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutBridgesId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutBridgesId400 = {
  code?: PutBridgesId400Code
  message?: string
}

export type PutBridgesId200 =
  | BridgeKafkaGetProducer
  | BridgeTimescaleGet
  | RocketmqGet
  | BridgeKafkaGetConsumer
  | BridgeMatrixGet
  | BridgeSqlserverGet
  | BridgeClickhouseGet
  | BridgeGcpPubsubGetConsumer
  | BridgeCassaGet
  | BridgeRedisGetSingle
  | BridgeGcpPubsubGetProducer
  | BridgeInfluxdbGetApiV1
  | BridgeHstreamdbGet
  | BridgeOracleGet
  | BridgeMongodbGetRs
  | BridgeMongodbGetSharded
  | BridgeOpentsGet
  | BridgeGreptimedbGetGrpcV1
  | BridgeMongodbGetSingle
  | BridgeTdengineGet
  | BridgeDynamoGet
  | BridgeRabbitmqGet
  | BridgeMqttGet
  | BridgeKinesisGetProducer
  | BridgeMysqlGet
  | BridgeRedisGetCluster
  | BridgePgsqlGet
  | BridgePulsarGetProducer
  | BridgeRedisGetSentinel
  | BridgeAzureEventHubGetProducer
  | BridgeHttpGet
  | BridgeIotdbGet
  | BridgeInfluxdbGetApiV2

export type PutBridgesIdBody =
  | BridgeKafkaPutProducer
  | BridgeTimescalePut
  | RocketmqPut
  | BridgeKafkaPutConsumer
  | BridgeMatrixPut
  | BridgeSqlserverPut
  | BridgeClickhousePut
  | BridgeGcpPubsubPutConsumer
  | BridgeCassaPut
  | BridgeRedisPutSingle
  | BridgeGcpPubsubPutProducer
  | BridgeInfluxdbPutApiV1
  | BridgeHstreamdbPut
  | BridgeOraclePut
  | BridgeMongodbPutRs
  | BridgeMongodbPutSharded
  | BridgeOpentsPut
  | BridgeGreptimedbPutGrpcV1
  | BridgeMongodbPutSingle
  | BridgeTdenginePut
  | BridgeDynamoPut
  | BridgeRabbitmqPut
  | BridgeMqttPut
  | BridgeKinesisPutProducer
  | BridgeMysqlPut
  | BridgeRedisPutCluster
  | BridgePgsqlPut
  | BridgePulsarPutProducer
  | BridgeRedisPutSentinel
  | BridgeAzureEventHubPutProducer
  | BridgeHttpPut
  | BridgeIotdbPut
  | BridgeInfluxdbPutApiV2

export type GetBridgesId404Code = typeof GetBridgesId404Code[keyof typeof GetBridgesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBridgesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetBridgesId404 = {
  code?: GetBridgesId404Code
  message?: string
}

export type GetBridgesId200 =
  | BridgeKafkaGetProducer
  | BridgeTimescaleGet
  | RocketmqGet
  | BridgeKafkaGetConsumer
  | BridgeMatrixGet
  | BridgeSqlserverGet
  | BridgeClickhouseGet
  | BridgeGcpPubsubGetConsumer
  | BridgeCassaGet
  | BridgeRedisGetSingle
  | BridgeGcpPubsubGetProducer
  | BridgeInfluxdbGetApiV1
  | BridgeHstreamdbGet
  | BridgeOracleGet
  | BridgeMongodbGetRs
  | BridgeMongodbGetSharded
  | BridgeOpentsGet
  | BridgeGreptimedbGetGrpcV1
  | BridgeMongodbGetSingle
  | BridgeTdengineGet
  | BridgeDynamoGet
  | BridgeRabbitmqGet
  | BridgeMqttGet
  | BridgeKinesisGetProducer
  | BridgeMysqlGet
  | BridgeRedisGetCluster
  | BridgePgsqlGet
  | BridgePulsarGetProducer
  | BridgeRedisGetSentinel
  | BridgeAzureEventHubGetProducer
  | BridgeHttpGet
  | BridgeIotdbGet
  | BridgeInfluxdbGetApiV2

export type GetBridgesIdMetrics404Code =
  typeof GetBridgesIdMetrics404Code[keyof typeof GetBridgesIdMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBridgesIdMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetBridgesIdMetrics404 = {
  code?: GetBridgesIdMetrics404Code
  message?: string
}

export type GetBridgesIdMetrics200 = {
  metrics?: BridgeMetrics
  node_metrics?: BridgeNodeMetrics[]
}

export type PutBridgesIdEnableEnable503Code =
  typeof PutBridgesIdEnableEnable503Code[keyof typeof PutBridgesIdEnableEnable503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutBridgesIdEnableEnable503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutBridgesIdEnableEnable503 = {
  code?: PutBridgesIdEnableEnable503Code
  message?: string
}

export type PutBridgesIdEnableEnable404Code =
  typeof PutBridgesIdEnableEnable404Code[keyof typeof PutBridgesIdEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutBridgesIdEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutBridgesIdEnableEnable404 = {
  code?: PutBridgesIdEnableEnable404Code
  message?: string
}

export type PutBridgesIdEnableEnable400Code =
  typeof PutBridgesIdEnableEnable400Code[keyof typeof PutBridgesIdEnableEnable400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutBridgesIdEnableEnable400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutBridgesIdEnableEnable400 = {
  code?: PutBridgesIdEnableEnable400Code
  message?: string
}

export type PostBridgesProbe400Code =
  typeof PostBridgesProbe400Code[keyof typeof PostBridgesProbe400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBridgesProbe400Code = {
  TEST_FAILED: 'TEST_FAILED',
} as const

export type PostBridgesProbe400 = {
  code?: PostBridgesProbe400Code
  message?: string
}

export type PostBridgesProbeBody =
  | BridgeKafkaPostProducer
  | BridgeTimescalePost
  | RocketmqPost
  | BridgeKafkaPostConsumer
  | BridgeMatrixPost
  | BridgeSqlserverPost
  | BridgeClickhousePost
  | BridgeGcpPubsubPostConsumer
  | BridgeCassaPost
  | BridgeRedisPostSingle
  | BridgeGcpPubsubPostProducer
  | BridgeInfluxdbPostApiV1
  | BridgeHstreamdbPost
  | BridgeOraclePost
  | BridgeMongodbPostRs
  | BridgeMongodbPostSharded
  | BridgeOpentsPost
  | BridgeGreptimedbPostGrpcV1
  | BridgeMongodbPostSingle
  | BridgeTdenginePost
  | BridgeDynamoPost
  | BridgeRabbitmqPost
  | BridgeMqttPost
  | BridgeKinesisPostProducer
  | BridgeMysqlPost
  | BridgeRedisPostCluster
  | BridgePgsqlPost
  | BridgePulsarPostProducer
  | BridgeRedisPostSentinel
  | BridgeAzureEventHubPostProducer
  | BridgeHttpPost
  | BridgeIotdbPost
  | BridgeInfluxdbPostApiV2

export type PostNodesNodeBridgesIdOperation503Code =
  typeof PostNodesNodeBridgesIdOperation503Code[keyof typeof PostNodesNodeBridgesIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeBridgesIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostNodesNodeBridgesIdOperation503 = {
  code?: PostNodesNodeBridgesIdOperation503Code
  message?: string
}

export type PostNodesNodeBridgesIdOperation501Code =
  typeof PostNodesNodeBridgesIdOperation501Code[keyof typeof PostNodesNodeBridgesIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeBridgesIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostNodesNodeBridgesIdOperation501 = {
  code?: PostNodesNodeBridgesIdOperation501Code
  message?: string
}

export type PostNodesNodeBridgesIdOperation404Code =
  typeof PostNodesNodeBridgesIdOperation404Code[keyof typeof PostNodesNodeBridgesIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeBridgesIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostNodesNodeBridgesIdOperation404 = {
  code?: PostNodesNodeBridgesIdOperation404Code
  message?: string
}

export type PostNodesNodeBridgesIdOperation400Code =
  typeof PostNodesNodeBridgesIdOperation400Code[keyof typeof PostNodesNodeBridgesIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeBridgesIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostNodesNodeBridgesIdOperation400 = {
  code?: PostNodesNodeBridgesIdOperation400Code
  message?: string
}

export type PutBridgesIdMetricsReset404Code =
  typeof PutBridgesIdMetricsReset404Code[keyof typeof PutBridgesIdMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutBridgesIdMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutBridgesIdMetricsReset404 = {
  code?: PutBridgesIdMetricsReset404Code
  message?: string
}

export type RocketmqPutStrategy = string | 'roundrobin'

export interface RocketmqPut {
  enable?: boolean
  template?: string
  local_topic?: string
  strategy?: RocketmqPutStrategy
  resource_opts?: ResourceSchemaCreationOpts
  servers: string
  namespace?: string
  topic?: string
  access_key?: string
  secret_key?: string
  security_token?: string
  sync_timeout?: string
  refresh_interval?: string
  send_buffer?: string
  pool_size?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type RocketmqPostStrategy = string | 'roundrobin'

export type RocketmqPostType = typeof RocketmqPostType[keyof typeof RocketmqPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RocketmqPostType = {
  rocketmq: 'rocketmq',
} as const

export interface RocketmqPost {
  type: RocketmqPostType
  name: string
  enable?: boolean
  template?: string
  local_topic?: string
  strategy?: RocketmqPostStrategy
  resource_opts?: ResourceSchemaCreationOpts
  servers: string
  namespace?: string
  topic?: string
  access_key?: string
  secret_key?: string
  security_token?: string
  sync_timeout?: string
  refresh_interval?: string
  send_buffer?: string
  pool_size?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type RocketmqGetStrategy = string | 'roundrobin'

export type RocketmqGetType = typeof RocketmqGetType[keyof typeof RocketmqGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RocketmqGetType = {
  rocketmq: 'rocketmq',
} as const

export type RocketmqGetStatus = typeof RocketmqGetStatus[keyof typeof RocketmqGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RocketmqGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface RocketmqGet {
  status?: RocketmqGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: RocketmqGetType
  name: string
  enable?: boolean
  template?: string
  local_topic?: string
  strategy?: RocketmqGetStrategy
  resource_opts?: ResourceSchemaCreationOpts
  servers: string
  namespace?: string
  topic?: string
  access_key?: string
  secret_key?: string
  security_token?: string
  sync_timeout?: string
  refresh_interval?: string
  send_buffer?: string
  pool_size?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type ResourceSchemaCreationOptsRequestTtl = 'infinity' | string

export type ResourceSchemaCreationOptsQueryMode =
  typeof ResourceSchemaCreationOptsQueryMode[keyof typeof ResourceSchemaCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ResourceSchemaCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type ResourceSchemaCreationOptsAutoRestartInterval = string | 'infinity'

export interface ResourceSchemaCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: ResourceSchemaCreationOptsAutoRestartInterval
  query_mode?: ResourceSchemaCreationOptsQueryMode
  request_ttl?: ResourceSchemaCreationOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface PulsarProducerPulsarMessage {
  key?: string
  value?: string
}

export interface MongoTopology {
  max_overflow?: number
  overflow_ttl?: string
  overflow_check_period?: string
  local_threshold_ms?: string
  connect_timeout_ms?: string
  socket_timeout_ms?: string
  server_selection_timeout_ms?: string
  wait_queue_timeout_ms?: string
  heartbeat_frequency_ms?: string
  min_heartbeat_frequency_ms?: string
}

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

export type EmqxSslClientOptsPartialChain =
  typeof EmqxSslClientOptsPartialChain[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxSslClientOptsLogLevel =
  typeof EmqxSslClientOptsLogLevel[keyof typeof EmqxSslClientOptsLogLevel]

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

export type EmqxSslClientOptsVerify =
  typeof EmqxSslClientOptsVerify[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxSslClientOptsLogLevel
  hibernate_after?: string
  partial_chain?: EmqxSslClientOptsPartialChain
  verify_peer_ext_key_usage?: string
  enable?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
}

export interface ConnectorMqttIngressRemote {
  topic: string
  qos?: number
}

export type ConnectorMqttIngressLocalRetain = string | boolean

export type ConnectorMqttIngressLocalQos = string | number

export interface ConnectorMqttIngressLocal {
  topic?: string
  qos?: ConnectorMqttIngressLocalQos
  retain?: ConnectorMqttIngressLocalRetain
  payload?: string
}

export interface ConnectorMqttIngress {
  pool_size?: number
  remote?: ConnectorMqttIngressRemote
  local?: ConnectorMqttIngressLocal
}

export type ConnectorMqttEgressRemoteRetain = string | boolean

export type ConnectorMqttEgressRemoteQos = string | number

export interface ConnectorMqttEgressRemote {
  topic: string
  qos?: ConnectorMqttEgressRemoteQos
  retain?: ConnectorMqttEgressRemoteRetain
  payload?: string
}

export interface ConnectorMqttEgressLocal {
  topic?: string
}

export interface ConnectorMqttEgress {
  pool_size?: number
  local?: ConnectorMqttEgressLocal
  remote: ConnectorMqttEgressRemote
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

export interface BridgeTimescalePut {
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeTimescalePostType =
  typeof BridgeTimescalePostType[keyof typeof BridgeTimescalePostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTimescalePostType = {
  timescale: 'timescale',
} as const

export interface BridgeTimescalePost {
  type: BridgeTimescalePostType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeTimescaleGetType =
  typeof BridgeTimescaleGetType[keyof typeof BridgeTimescaleGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTimescaleGetType = {
  pgsql: 'pgsql',
} as const

export type BridgeTimescaleGetStatus =
  typeof BridgeTimescaleGetStatus[keyof typeof BridgeTimescaleGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTimescaleGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeTimescaleGet {
  status?: BridgeTimescaleGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeTimescaleGetType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export interface BridgeTdenginePut {
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username?: string
  password: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeTdenginePostType =
  typeof BridgeTdenginePostType[keyof typeof BridgeTdenginePostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTdenginePostType = {
  tdengine: 'tdengine',
} as const

export interface BridgeTdenginePost {
  type: BridgeTdenginePostType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username?: string
  password: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeTdengineGetType = typeof BridgeTdengineGetType[keyof typeof BridgeTdengineGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTdengineGetType = {
  tdengine: 'tdengine',
} as const

export type BridgeTdengineGetStatus =
  typeof BridgeTdengineGetStatus[keyof typeof BridgeTdengineGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTdengineGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeTdengineGet {
  status?: BridgeTdengineGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeTdengineGetType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username?: string
  password: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export interface BridgeSqlserverPut {
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: BridgeSqlserverCreationOpts
  driver?: string
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeSqlserverPostType =
  typeof BridgeSqlserverPostType[keyof typeof BridgeSqlserverPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverPostType = {
  sqlserver: 'sqlserver',
} as const

export interface BridgeSqlserverPost {
  type: BridgeSqlserverPostType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: BridgeSqlserverCreationOpts
  driver?: string
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeSqlserverGetType =
  typeof BridgeSqlserverGetType[keyof typeof BridgeSqlserverGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverGetType = {
  sqlserver: 'sqlserver',
} as const

export type BridgeSqlserverGetStatus =
  typeof BridgeSqlserverGetStatus[keyof typeof BridgeSqlserverGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeSqlserverGet {
  status?: BridgeSqlserverGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeSqlserverGetType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: BridgeSqlserverCreationOpts
  driver?: string
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeSqlserverCreationOptsRequestTtl = 'infinity' | string

export type BridgeSqlserverCreationOptsQueryMode =
  typeof BridgeSqlserverCreationOptsQueryMode[keyof typeof BridgeSqlserverCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeSqlserverCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeSqlserverCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeSqlserverCreationOptsAutoRestartInterval
  query_mode?: BridgeSqlserverCreationOptsQueryMode
  request_ttl?: BridgeSqlserverCreationOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export type BridgeRedisPutSingleRedisType =
  typeof BridgeRedisPutSingleRedisType[keyof typeof BridgeRedisPutSingleRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPutSingleRedisType = {
  single: 'single',
} as const

export interface BridgeRedisPutSingle {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisSingle
  server: string
  redis_type?: BridgeRedisPutSingleRedisType
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeRedisPutSentinelRedisType =
  typeof BridgeRedisPutSentinelRedisType[keyof typeof BridgeRedisPutSentinelRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPutSentinelRedisType = {
  sentinel: 'sentinel',
} as const

export interface BridgeRedisPutSentinel {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisSentinel
  servers: string
  redis_type?: BridgeRedisPutSentinelRedisType
  sentinel: string
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeRedisPutClusterRedisType =
  typeof BridgeRedisPutClusterRedisType[keyof typeof BridgeRedisPutClusterRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPutClusterRedisType = {
  cluster: 'cluster',
} as const

export interface BridgeRedisPutCluster {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisCluster
  servers: string
  redis_type?: BridgeRedisPutClusterRedisType
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeRedisPostSingleType =
  typeof BridgeRedisPostSingleType[keyof typeof BridgeRedisPostSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPostSingleType = {
  redis_single: 'redis_single',
} as const

export type BridgeRedisPostSingleRedisType =
  typeof BridgeRedisPostSingleRedisType[keyof typeof BridgeRedisPostSingleRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPostSingleRedisType = {
  single: 'single',
} as const

export interface BridgeRedisPostSingle {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisSingle
  server: string
  redis_type?: BridgeRedisPostSingleRedisType
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  type: BridgeRedisPostSingleType
  name: string
}

export type BridgeRedisPostSentinelType =
  typeof BridgeRedisPostSentinelType[keyof typeof BridgeRedisPostSentinelType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPostSentinelType = {
  redis_sentinel: 'redis_sentinel',
} as const

export type BridgeRedisPostSentinelRedisType =
  typeof BridgeRedisPostSentinelRedisType[keyof typeof BridgeRedisPostSentinelRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPostSentinelRedisType = {
  sentinel: 'sentinel',
} as const

export type BridgeRedisPostClusterType =
  typeof BridgeRedisPostClusterType[keyof typeof BridgeRedisPostClusterType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPostClusterType = {
  redis_cluster: 'redis_cluster',
} as const

export type BridgeRedisPostClusterRedisType =
  typeof BridgeRedisPostClusterRedisType[keyof typeof BridgeRedisPostClusterRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisPostClusterRedisType = {
  cluster: 'cluster',
} as const

export type BridgeRedisGetSingleStatus =
  typeof BridgeRedisGetSingleStatus[keyof typeof BridgeRedisGetSingleStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetSingleStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeRedisGetSingleType =
  typeof BridgeRedisGetSingleType[keyof typeof BridgeRedisGetSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetSingleType = {
  redis_single: 'redis_single',
} as const

export type BridgeRedisGetSingleRedisType =
  typeof BridgeRedisGetSingleRedisType[keyof typeof BridgeRedisGetSingleRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetSingleRedisType = {
  single: 'single',
} as const

export type BridgeRedisGetSentinelStatus =
  typeof BridgeRedisGetSentinelStatus[keyof typeof BridgeRedisGetSentinelStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetSentinelStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeRedisGetSentinelType =
  typeof BridgeRedisGetSentinelType[keyof typeof BridgeRedisGetSentinelType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetSentinelType = {
  redis_sentinel: 'redis_sentinel',
} as const

export type BridgeRedisGetSentinelRedisType =
  typeof BridgeRedisGetSentinelRedisType[keyof typeof BridgeRedisGetSentinelRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetSentinelRedisType = {
  sentinel: 'sentinel',
} as const

export interface BridgeRedisGetSentinel {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisSentinel
  servers: string
  redis_type?: BridgeRedisGetSentinelRedisType
  sentinel: string
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  type: BridgeRedisGetSentinelType
  name: string
  status?: BridgeRedisGetSentinelStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
}

export type BridgeRedisGetClusterStatus =
  typeof BridgeRedisGetClusterStatus[keyof typeof BridgeRedisGetClusterStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetClusterStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeRedisGetClusterType =
  typeof BridgeRedisGetClusterType[keyof typeof BridgeRedisGetClusterType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetClusterType = {
  redis_cluster: 'redis_cluster',
} as const

export type BridgeRedisGetClusterRedisType =
  typeof BridgeRedisGetClusterRedisType[keyof typeof BridgeRedisGetClusterRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisGetClusterRedisType = {
  cluster: 'cluster',
} as const

export interface BridgeRedisGetCluster {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisCluster
  servers: string
  redis_type?: BridgeRedisGetClusterRedisType
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  type: BridgeRedisGetClusterType
  name: string
  status?: BridgeRedisGetClusterStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
}

export type BridgeRedisCreationOptsRedisSingleRequestTtl = 'infinity' | string

export type BridgeRedisCreationOptsRedisSingleQueryMode =
  typeof BridgeRedisCreationOptsRedisSingleQueryMode[keyof typeof BridgeRedisCreationOptsRedisSingleQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisCreationOptsRedisSingleQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeRedisCreationOptsRedisSingleAutoRestartInterval = string | 'infinity'

export interface BridgeRedisCreationOptsRedisSingle {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeRedisCreationOptsRedisSingleAutoRestartInterval
  query_mode?: BridgeRedisCreationOptsRedisSingleQueryMode
  request_ttl?: BridgeRedisCreationOptsRedisSingleRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeRedisGetSingle {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisSingle
  server: string
  redis_type?: BridgeRedisGetSingleRedisType
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  type: BridgeRedisGetSingleType
  name: string
  status?: BridgeRedisGetSingleStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
}

export type BridgeRedisCreationOptsRedisSentinelRequestTtl = 'infinity' | string

export type BridgeRedisCreationOptsRedisSentinelQueryMode =
  typeof BridgeRedisCreationOptsRedisSentinelQueryMode[keyof typeof BridgeRedisCreationOptsRedisSentinelQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisCreationOptsRedisSentinelQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeRedisCreationOptsRedisSentinelAutoRestartInterval = string | 'infinity'

export interface BridgeRedisCreationOptsRedisSentinel {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeRedisCreationOptsRedisSentinelAutoRestartInterval
  query_mode?: BridgeRedisCreationOptsRedisSentinelQueryMode
  request_ttl?: BridgeRedisCreationOptsRedisSentinelRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeRedisPostSentinel {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisSentinel
  servers: string
  redis_type?: BridgeRedisPostSentinelRedisType
  sentinel: string
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  type: BridgeRedisPostSentinelType
  name: string
}

export type BridgeRedisCreationOptsRedisClusterRequestTtl = 'infinity' | string

export type BridgeRedisCreationOptsRedisClusterQueryMode =
  typeof BridgeRedisCreationOptsRedisClusterQueryMode[keyof typeof BridgeRedisCreationOptsRedisClusterQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRedisCreationOptsRedisClusterQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeRedisCreationOptsRedisClusterAutoRestartInterval = string | 'infinity'

export interface BridgeRedisCreationOptsRedisCluster {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeRedisCreationOptsRedisClusterAutoRestartInterval
  query_mode?: BridgeRedisCreationOptsRedisClusterQueryMode
  request_ttl?: BridgeRedisCreationOptsRedisClusterRequestTtl
  inflight_window?: number
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeRedisPostCluster {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  command_template: string[]
  resource_opts?: BridgeRedisCreationOptsRedisCluster
  servers: string
  redis_type?: BridgeRedisPostClusterRedisType
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  type: BridgeRedisPostClusterType
  name: string
}

export type BridgeRabbitmqPutDeliveryMode =
  typeof BridgeRabbitmqPutDeliveryMode[keyof typeof BridgeRabbitmqPutDeliveryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqPutDeliveryMode = {
  non_persistent: 'non_persistent',
  persistent: 'persistent',
} as const

export interface BridgeRabbitmqPut {
  enable?: boolean
  local_topic?: string
  resource_opts?: BridgeRabbitmqCreationOpts
  server?: string
  port?: number
  username: string
  password: string
  pool_size?: number
  timeout?: string
  virtual_host?: string
  heartbeat?: string
  ssl?: EmqxSslClientOpts
  wait_for_publish_confirmations?: boolean
  publish_confirmation_timeout?: string
  exchange: string
  routing_key: string
  delivery_mode?: BridgeRabbitmqPutDeliveryMode
  payload_template?: string
}

export type BridgeRabbitmqPostDeliveryMode =
  typeof BridgeRabbitmqPostDeliveryMode[keyof typeof BridgeRabbitmqPostDeliveryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqPostDeliveryMode = {
  non_persistent: 'non_persistent',
  persistent: 'persistent',
} as const

export type BridgeRabbitmqPostType =
  typeof BridgeRabbitmqPostType[keyof typeof BridgeRabbitmqPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqPostType = {
  rabbitmq: 'rabbitmq',
} as const

export interface BridgeRabbitmqPost {
  type: BridgeRabbitmqPostType
  name: string
  enable?: boolean
  local_topic?: string
  resource_opts?: BridgeRabbitmqCreationOpts
  server?: string
  port?: number
  username: string
  password: string
  pool_size?: number
  timeout?: string
  virtual_host?: string
  heartbeat?: string
  ssl?: EmqxSslClientOpts
  wait_for_publish_confirmations?: boolean
  publish_confirmation_timeout?: string
  exchange: string
  routing_key: string
  delivery_mode?: BridgeRabbitmqPostDeliveryMode
  payload_template?: string
}

export type BridgeRabbitmqGetDeliveryMode =
  typeof BridgeRabbitmqGetDeliveryMode[keyof typeof BridgeRabbitmqGetDeliveryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqGetDeliveryMode = {
  non_persistent: 'non_persistent',
  persistent: 'persistent',
} as const

export type BridgeRabbitmqGetType = typeof BridgeRabbitmqGetType[keyof typeof BridgeRabbitmqGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqGetType = {
  rabbitmq: 'rabbitmq',
} as const

export type BridgeRabbitmqGetStatus =
  typeof BridgeRabbitmqGetStatus[keyof typeof BridgeRabbitmqGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeRabbitmqGet {
  status?: BridgeRabbitmqGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeRabbitmqGetType
  name: string
  enable?: boolean
  local_topic?: string
  resource_opts?: BridgeRabbitmqCreationOpts
  server?: string
  port?: number
  username: string
  password: string
  pool_size?: number
  timeout?: string
  virtual_host?: string
  heartbeat?: string
  ssl?: EmqxSslClientOpts
  wait_for_publish_confirmations?: boolean
  publish_confirmation_timeout?: string
  exchange: string
  routing_key: string
  delivery_mode?: BridgeRabbitmqGetDeliveryMode
  payload_template?: string
}

export type BridgeRabbitmqCreationOptsRequestTtl = 'infinity' | string

export type BridgeRabbitmqCreationOptsQueryMode =
  typeof BridgeRabbitmqCreationOptsQueryMode[keyof typeof BridgeRabbitmqCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeRabbitmqCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeRabbitmqCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeRabbitmqCreationOptsAutoRestartInterval
  query_mode?: BridgeRabbitmqCreationOptsQueryMode
  request_ttl?: BridgeRabbitmqCreationOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export type BridgePulsarPutProducerStrategy =
  typeof BridgePulsarPutProducerStrategy[keyof typeof BridgePulsarPutProducerStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarPutProducerStrategy = {
  random: 'random',
  roundrobin: 'roundrobin',
  key_dispatch: 'key_dispatch',
} as const

export type BridgePulsarPutProducerRetentionPeriod = string | 'infinity'

export type BridgePulsarPutProducerCompression =
  typeof BridgePulsarPutProducerCompression[keyof typeof BridgePulsarPutProducerCompression]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarPutProducerCompression = {
  no_compression: 'no_compression',
  snappy: 'snappy',
  zlib: 'zlib',
} as const

export type BridgePulsarPutProducerAuthentication =
  | BridgePulsarAuthToken
  | BridgePulsarAuthBasic
  | 'none'

export interface BridgePulsarProducerResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface BridgePulsarPutProducer {
  enable?: boolean
  servers: string
  authentication?: BridgePulsarPutProducerAuthentication
  connect_timeout?: string
  ssl?: EmqxSslClientOpts
  message?: PulsarProducerPulsarMessage
  sync_timeout?: string
  pulsar_topic: string
  batch_size?: number
  compression?: BridgePulsarPutProducerCompression
  send_buffer?: string
  retention_period?: BridgePulsarPutProducerRetentionPeriod
  max_batch_bytes?: string
  strategy?: BridgePulsarPutProducerStrategy
  buffer?: BridgePulsarProducerBuffer
  local_topic?: string
  resource_opts?: BridgePulsarProducerResourceOpts
}

export type BridgePulsarProducerBufferMode =
  typeof BridgePulsarProducerBufferMode[keyof typeof BridgePulsarProducerBufferMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarProducerBufferMode = {
  memory: 'memory',
  disk: 'disk',
  hybrid: 'hybrid',
} as const

export interface BridgePulsarProducerBuffer {
  mode?: BridgePulsarProducerBufferMode
  per_partition_limit?: string
  segment_bytes?: string
  memory_overload_protection?: boolean
}

export type BridgePulsarPostProducerStrategy =
  typeof BridgePulsarPostProducerStrategy[keyof typeof BridgePulsarPostProducerStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarPostProducerStrategy = {
  random: 'random',
  roundrobin: 'roundrobin',
  key_dispatch: 'key_dispatch',
} as const

export type BridgePulsarPostProducerRetentionPeriod = string | 'infinity'

export type BridgePulsarPostProducerCompression =
  typeof BridgePulsarPostProducerCompression[keyof typeof BridgePulsarPostProducerCompression]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarPostProducerCompression = {
  no_compression: 'no_compression',
  snappy: 'snappy',
  zlib: 'zlib',
} as const

export type BridgePulsarPostProducerAuthentication =
  | BridgePulsarAuthToken
  | BridgePulsarAuthBasic
  | 'none'

export type BridgePulsarPostProducerType =
  typeof BridgePulsarPostProducerType[keyof typeof BridgePulsarPostProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarPostProducerType = {
  pulsar_producer: 'pulsar_producer',
} as const

export interface BridgePulsarPostProducer {
  type: BridgePulsarPostProducerType
  name: string
  enable?: boolean
  servers: string
  authentication?: BridgePulsarPostProducerAuthentication
  connect_timeout?: string
  ssl?: EmqxSslClientOpts
  message?: PulsarProducerPulsarMessage
  sync_timeout?: string
  pulsar_topic: string
  batch_size?: number
  compression?: BridgePulsarPostProducerCompression
  send_buffer?: string
  retention_period?: BridgePulsarPostProducerRetentionPeriod
  max_batch_bytes?: string
  strategy?: BridgePulsarPostProducerStrategy
  buffer?: BridgePulsarProducerBuffer
  local_topic?: string
  resource_opts?: BridgePulsarProducerResourceOpts
}

export type BridgePulsarGetProducerStrategy =
  typeof BridgePulsarGetProducerStrategy[keyof typeof BridgePulsarGetProducerStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarGetProducerStrategy = {
  random: 'random',
  roundrobin: 'roundrobin',
  key_dispatch: 'key_dispatch',
} as const

export type BridgePulsarGetProducerRetentionPeriod = string | 'infinity'

export type BridgePulsarGetProducerCompression =
  typeof BridgePulsarGetProducerCompression[keyof typeof BridgePulsarGetProducerCompression]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarGetProducerCompression = {
  no_compression: 'no_compression',
  snappy: 'snappy',
  zlib: 'zlib',
} as const

export type BridgePulsarGetProducerAuthentication =
  | BridgePulsarAuthToken
  | BridgePulsarAuthBasic
  | 'none'

export type BridgePulsarGetProducerType =
  typeof BridgePulsarGetProducerType[keyof typeof BridgePulsarGetProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarGetProducerType = {
  pulsar_producer: 'pulsar_producer',
} as const

export type BridgePulsarGetProducerStatus =
  typeof BridgePulsarGetProducerStatus[keyof typeof BridgePulsarGetProducerStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePulsarGetProducerStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgePulsarGetProducer {
  status?: BridgePulsarGetProducerStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgePulsarGetProducerType
  name: string
  enable?: boolean
  servers: string
  authentication?: BridgePulsarGetProducerAuthentication
  connect_timeout?: string
  ssl?: EmqxSslClientOpts
  message?: PulsarProducerPulsarMessage
  sync_timeout?: string
  pulsar_topic: string
  batch_size?: number
  compression?: BridgePulsarGetProducerCompression
  send_buffer?: string
  retention_period?: BridgePulsarGetProducerRetentionPeriod
  max_batch_bytes?: string
  strategy?: BridgePulsarGetProducerStrategy
  buffer?: BridgePulsarProducerBuffer
  local_topic?: string
  resource_opts?: BridgePulsarProducerResourceOpts
}

export interface BridgePulsarAuthToken {
  jwt: string
}

export interface BridgePulsarAuthBasic {
  username: string
  password: string
}

export interface BridgePgsqlPut {
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgePgsqlPostType = typeof BridgePgsqlPostType[keyof typeof BridgePgsqlPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePgsqlPostType = {
  pgsql: 'pgsql',
} as const

export interface BridgePgsqlPost {
  type: BridgePgsqlPostType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgePgsqlGetType = typeof BridgePgsqlGetType[keyof typeof BridgePgsqlGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePgsqlGetType = {
  pgsql: 'pgsql',
} as const

export type BridgePgsqlGetStatus = typeof BridgePgsqlGetStatus[keyof typeof BridgePgsqlGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePgsqlGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgePgsqlGet {
  status?: BridgePgsqlGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgePgsqlGetType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export interface BridgeOraclePut {
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  sid?: string
  service_name?: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeOraclePostType = typeof BridgeOraclePostType[keyof typeof BridgeOraclePostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOraclePostType = {
  oracle: 'oracle',
} as const

export interface BridgeOraclePost {
  type: BridgeOraclePostType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  sid?: string
  service_name?: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeOracleGetType = typeof BridgeOracleGetType[keyof typeof BridgeOracleGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOracleGetType = {
  oracle: 'oracle',
} as const

export type BridgeOracleGetStatus = typeof BridgeOracleGetStatus[keyof typeof BridgeOracleGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOracleGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeOracleGet {
  status?: BridgeOracleGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeOracleGetType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  sid?: string
  service_name?: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export interface BridgeOpentsPut {
  enable?: boolean
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  pool_size?: number
  summary?: boolean
  details?: boolean
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeOpentsPostType = typeof BridgeOpentsPostType[keyof typeof BridgeOpentsPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOpentsPostType = {
  opents: 'opents',
} as const

export interface BridgeOpentsPost {
  type: BridgeOpentsPostType
  name: string
  enable?: boolean
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  pool_size?: number
  summary?: boolean
  details?: boolean
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeOpentsGetType = typeof BridgeOpentsGetType[keyof typeof BridgeOpentsGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOpentsGetType = {
  opents: 'opents',
} as const

export type BridgeOpentsGetStatus = typeof BridgeOpentsGetStatus[keyof typeof BridgeOpentsGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOpentsGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeOpentsGet {
  status?: BridgeOpentsGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeOpentsGetType
  name: string
  enable?: boolean
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  pool_size?: number
  summary?: boolean
  details?: boolean
  /** @deprecated */
  auto_reconnect?: boolean
}

export interface BridgeMysqlPut {
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeMysqlPostType = typeof BridgeMysqlPostType[keyof typeof BridgeMysqlPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlPostType = {
  mysql: 'mysql',
} as const

export interface BridgeMysqlPost {
  type: BridgeMysqlPostType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeMysqlGetType = typeof BridgeMysqlGetType[keyof typeof BridgeMysqlGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlGetType = {
  mysql: 'mysql',
} as const

export type BridgeMysqlGetStatus = typeof BridgeMysqlGetStatus[keyof typeof BridgeMysqlGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeMysqlGet {
  status?: BridgeMysqlGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeMysqlGetType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeMqttPutProtoVer = typeof BridgeMqttPutProtoVer[keyof typeof BridgeMqttPutProtoVer]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPutProtoVer = {
  v3: 'v3',
  v4: 'v4',
  v5: 'v5',
} as const

/**
 * @deprecated
 */
export type BridgeMqttPutMode = typeof BridgeMqttPutMode[keyof typeof BridgeMqttPutMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPutMode = {
  cluster_shareload: 'cluster_shareload',
} as const

export interface BridgeMqttPut {
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttCreationOpts
  /** @deprecated */
  mode?: BridgeMqttPutMode
  server: string
  clientid_prefix?: string
  /** @deprecated */
  reconnect_interval?: string
  proto_ver?: BridgeMqttPutProtoVer
  bridge_mode?: boolean
  username?: string
  password?: string
  clean_start?: boolean
  keepalive?: string
  retry_interval?: string
  max_inflight?: number
  ssl?: EmqxSslClientOpts
  ingress?: ConnectorMqttIngress
  egress?: ConnectorMqttEgress
}

export type BridgeMqttPostProtoVer =
  typeof BridgeMqttPostProtoVer[keyof typeof BridgeMqttPostProtoVer]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPostProtoVer = {
  v3: 'v3',
  v4: 'v4',
  v5: 'v5',
} as const

/**
 * @deprecated
 */
export type BridgeMqttPostMode = typeof BridgeMqttPostMode[keyof typeof BridgeMqttPostMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPostMode = {
  cluster_shareload: 'cluster_shareload',
} as const

export type BridgeMqttPostType = typeof BridgeMqttPostType[keyof typeof BridgeMqttPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPostType = {
  mqtt: 'mqtt',
} as const

export interface BridgeMqttPost {
  type: BridgeMqttPostType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttCreationOpts
  /** @deprecated */
  mode?: BridgeMqttPostMode
  server: string
  clientid_prefix?: string
  /** @deprecated */
  reconnect_interval?: string
  proto_ver?: BridgeMqttPostProtoVer
  bridge_mode?: boolean
  username?: string
  password?: string
  clean_start?: boolean
  keepalive?: string
  retry_interval?: string
  max_inflight?: number
  ssl?: EmqxSslClientOpts
  ingress?: ConnectorMqttIngress
  egress?: ConnectorMqttEgress
}

export type BridgeMqttGetProtoVer = typeof BridgeMqttGetProtoVer[keyof typeof BridgeMqttGetProtoVer]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttGetProtoVer = {
  v3: 'v3',
  v4: 'v4',
  v5: 'v5',
} as const

/**
 * @deprecated
 */
export type BridgeMqttGetMode = typeof BridgeMqttGetMode[keyof typeof BridgeMqttGetMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttGetMode = {
  cluster_shareload: 'cluster_shareload',
} as const

export type BridgeMqttGetStatus = typeof BridgeMqttGetStatus[keyof typeof BridgeMqttGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMqttCreationOptsRequestTtl = 'infinity' | string

export type BridgeMqttCreationOptsQueryMode =
  typeof BridgeMqttCreationOptsQueryMode[keyof typeof BridgeMqttCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeMqttCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeMqttCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeMqttCreationOptsAutoRestartInterval
  query_mode?: BridgeMqttCreationOptsQueryMode
  request_ttl?: BridgeMqttCreationOptsRequestTtl
  inflight_window?: number
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeMqttGet {
  status?: BridgeMqttGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttCreationOpts
  /** @deprecated */
  mode?: BridgeMqttGetMode
  server: string
  clientid_prefix?: string
  /** @deprecated */
  reconnect_interval?: string
  proto_ver?: BridgeMqttGetProtoVer
  bridge_mode?: boolean
  username?: string
  password?: string
  clean_start?: boolean
  keepalive?: string
  retry_interval?: string
  max_inflight?: number
  ssl?: EmqxSslClientOpts
  ingress?: ConnectorMqttIngress
  egress?: ConnectorMqttEgress
}

export type BridgeMongodbPutSingleUseLegacyProtocol =
  typeof BridgeMongodbPutSingleUseLegacyProtocol[keyof typeof BridgeMongodbPutSingleUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutSingleUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbPutSingleWMode =
  typeof BridgeMongodbPutSingleWMode[keyof typeof BridgeMongodbPutSingleWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutSingleWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbPutSingleMongoType =
  typeof BridgeMongodbPutSingleMongoType[keyof typeof BridgeMongodbPutSingleMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutSingleMongoType = {
  single: 'single',
} as const

export interface BridgeMongodbPutSingle {
  mongo_type: BridgeMongodbPutSingleMongoType
  server: string
  w_mode?: BridgeMongodbPutSingleWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbPutSingleUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
}

export type BridgeMongodbPutShardedUseLegacyProtocol =
  typeof BridgeMongodbPutShardedUseLegacyProtocol[keyof typeof BridgeMongodbPutShardedUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutShardedUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbPutShardedWMode =
  typeof BridgeMongodbPutShardedWMode[keyof typeof BridgeMongodbPutShardedWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutShardedWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbPutShardedMongoType =
  typeof BridgeMongodbPutShardedMongoType[keyof typeof BridgeMongodbPutShardedMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutShardedMongoType = {
  sharded: 'sharded',
} as const

export interface BridgeMongodbPutSharded {
  mongo_type: BridgeMongodbPutShardedMongoType
  servers: string
  w_mode?: BridgeMongodbPutShardedWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbPutShardedUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
}

export type BridgeMongodbPutRsUseLegacyProtocol =
  typeof BridgeMongodbPutRsUseLegacyProtocol[keyof typeof BridgeMongodbPutRsUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutRsUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbPutRsRMode =
  typeof BridgeMongodbPutRsRMode[keyof typeof BridgeMongodbPutRsRMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutRsRMode = {
  master: 'master',
  slave_ok: 'slave_ok',
} as const

export type BridgeMongodbPutRsWMode =
  typeof BridgeMongodbPutRsWMode[keyof typeof BridgeMongodbPutRsWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutRsWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbPutRsMongoType =
  typeof BridgeMongodbPutRsMongoType[keyof typeof BridgeMongodbPutRsMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutRsMongoType = {
  rs: 'rs',
} as const

export interface BridgeMongodbPutRs {
  mongo_type: BridgeMongodbPutRsMongoType
  servers: string
  w_mode?: BridgeMongodbPutRsWMode
  r_mode?: BridgeMongodbPutRsRMode
  replica_set_name: string
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbPutRsUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
}

export type BridgeMongodbPostSingleType =
  typeof BridgeMongodbPostSingleType[keyof typeof BridgeMongodbPostSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostSingleType = {
  mongodb_single: 'mongodb_single',
} as const

export type BridgeMongodbPostSingleUseLegacyProtocol =
  typeof BridgeMongodbPostSingleUseLegacyProtocol[keyof typeof BridgeMongodbPostSingleUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostSingleUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbPostSingleWMode =
  typeof BridgeMongodbPostSingleWMode[keyof typeof BridgeMongodbPostSingleWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostSingleWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbPostSingleMongoType =
  typeof BridgeMongodbPostSingleMongoType[keyof typeof BridgeMongodbPostSingleMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostSingleMongoType = {
  single: 'single',
} as const

export interface BridgeMongodbPostSingle {
  mongo_type: BridgeMongodbPostSingleMongoType
  server: string
  w_mode?: BridgeMongodbPostSingleWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbPostSingleUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
  type: BridgeMongodbPostSingleType
  name: string
}

export type BridgeMongodbPostShardedType =
  typeof BridgeMongodbPostShardedType[keyof typeof BridgeMongodbPostShardedType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostShardedType = {
  mongodb_sharded: 'mongodb_sharded',
} as const

export type BridgeMongodbPostShardedUseLegacyProtocol =
  typeof BridgeMongodbPostShardedUseLegacyProtocol[keyof typeof BridgeMongodbPostShardedUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostShardedUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbPostShardedWMode =
  typeof BridgeMongodbPostShardedWMode[keyof typeof BridgeMongodbPostShardedWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostShardedWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbPostShardedMongoType =
  typeof BridgeMongodbPostShardedMongoType[keyof typeof BridgeMongodbPostShardedMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostShardedMongoType = {
  sharded: 'sharded',
} as const

export interface BridgeMongodbPostSharded {
  mongo_type: BridgeMongodbPostShardedMongoType
  servers: string
  w_mode?: BridgeMongodbPostShardedWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbPostShardedUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
  type: BridgeMongodbPostShardedType
  name: string
}

export type BridgeMongodbPostRsType =
  typeof BridgeMongodbPostRsType[keyof typeof BridgeMongodbPostRsType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostRsType = {
  mongodb_rs: 'mongodb_rs',
} as const

export type BridgeMongodbPostRsUseLegacyProtocol =
  typeof BridgeMongodbPostRsUseLegacyProtocol[keyof typeof BridgeMongodbPostRsUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostRsUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbPostRsRMode =
  typeof BridgeMongodbPostRsRMode[keyof typeof BridgeMongodbPostRsRMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostRsRMode = {
  master: 'master',
  slave_ok: 'slave_ok',
} as const

export type BridgeMongodbPostRsWMode =
  typeof BridgeMongodbPostRsWMode[keyof typeof BridgeMongodbPostRsWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostRsWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbPostRsMongoType =
  typeof BridgeMongodbPostRsMongoType[keyof typeof BridgeMongodbPostRsMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostRsMongoType = {
  rs: 'rs',
} as const

export interface BridgeMongodbPostRs {
  mongo_type: BridgeMongodbPostRsMongoType
  servers: string
  w_mode?: BridgeMongodbPostRsWMode
  r_mode?: BridgeMongodbPostRsRMode
  replica_set_name: string
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbPostRsUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
  type: BridgeMongodbPostRsType
  name: string
}

export type BridgeMongodbGetSingleType =
  typeof BridgeMongodbGetSingleType[keyof typeof BridgeMongodbGetSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetSingleType = {
  mongodb_single: 'mongodb_single',
} as const

export type BridgeMongodbGetSingleUseLegacyProtocol =
  typeof BridgeMongodbGetSingleUseLegacyProtocol[keyof typeof BridgeMongodbGetSingleUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetSingleUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbGetSingleWMode =
  typeof BridgeMongodbGetSingleWMode[keyof typeof BridgeMongodbGetSingleWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetSingleWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbGetSingleMongoType =
  typeof BridgeMongodbGetSingleMongoType[keyof typeof BridgeMongodbGetSingleMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetSingleMongoType = {
  single: 'single',
} as const

export type BridgeMongodbGetSingleStatus =
  typeof BridgeMongodbGetSingleStatus[keyof typeof BridgeMongodbGetSingleStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetSingleStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeMongodbGetSingle {
  status?: BridgeMongodbGetSingleStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  mongo_type: BridgeMongodbGetSingleMongoType
  server: string
  w_mode?: BridgeMongodbGetSingleWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbGetSingleUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
  type: BridgeMongodbGetSingleType
  name: string
}

export type BridgeMongodbGetShardedType =
  typeof BridgeMongodbGetShardedType[keyof typeof BridgeMongodbGetShardedType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetShardedType = {
  mongodb_sharded: 'mongodb_sharded',
} as const

export type BridgeMongodbGetShardedUseLegacyProtocol =
  typeof BridgeMongodbGetShardedUseLegacyProtocol[keyof typeof BridgeMongodbGetShardedUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetShardedUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbGetShardedWMode =
  typeof BridgeMongodbGetShardedWMode[keyof typeof BridgeMongodbGetShardedWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetShardedWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbGetShardedMongoType =
  typeof BridgeMongodbGetShardedMongoType[keyof typeof BridgeMongodbGetShardedMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetShardedMongoType = {
  sharded: 'sharded',
} as const

export type BridgeMongodbGetShardedStatus =
  typeof BridgeMongodbGetShardedStatus[keyof typeof BridgeMongodbGetShardedStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetShardedStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeMongodbGetSharded {
  status?: BridgeMongodbGetShardedStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  mongo_type: BridgeMongodbGetShardedMongoType
  servers: string
  w_mode?: BridgeMongodbGetShardedWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbGetShardedUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
  type: BridgeMongodbGetShardedType
  name: string
}

export type BridgeMongodbGetRsType =
  typeof BridgeMongodbGetRsType[keyof typeof BridgeMongodbGetRsType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetRsType = {
  mongodb_rs: 'mongodb_rs',
} as const

export type BridgeMongodbGetRsUseLegacyProtocol =
  typeof BridgeMongodbGetRsUseLegacyProtocol[keyof typeof BridgeMongodbGetRsUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetRsUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbGetRsRMode =
  typeof BridgeMongodbGetRsRMode[keyof typeof BridgeMongodbGetRsRMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetRsRMode = {
  master: 'master',
  slave_ok: 'slave_ok',
} as const

export type BridgeMongodbGetRsWMode =
  typeof BridgeMongodbGetRsWMode[keyof typeof BridgeMongodbGetRsWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetRsWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type BridgeMongodbGetRsMongoType =
  typeof BridgeMongodbGetRsMongoType[keyof typeof BridgeMongodbGetRsMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetRsMongoType = {
  rs: 'rs',
} as const

export type BridgeMongodbGetRsStatus =
  typeof BridgeMongodbGetRsStatus[keyof typeof BridgeMongodbGetRsStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetRsStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMongodbCreationOptsRequestTtl = 'infinity' | string

export type BridgeMongodbCreationOptsQueryMode =
  typeof BridgeMongodbCreationOptsQueryMode[keyof typeof BridgeMongodbCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeMongodbCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeMongodbCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeMongodbCreationOptsAutoRestartInterval
  query_mode?: BridgeMongodbCreationOptsQueryMode
  request_ttl?: BridgeMongodbCreationOptsRequestTtl
  inflight_window?: number
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeMongodbGetRs {
  status?: BridgeMongodbGetRsStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  mongo_type: BridgeMongodbGetRsMongoType
  servers: string
  w_mode?: BridgeMongodbGetRsWMode
  r_mode?: BridgeMongodbGetRsRMode
  replica_set_name: string
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbGetRsUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
  enable?: boolean
  collection?: string
  payload_template?: string
  resource_opts: BridgeMongodbCreationOpts
  type: BridgeMongodbGetRsType
  name: string
}

export interface BridgeMatrixPut {
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeMatrixPostType = typeof BridgeMatrixPostType[keyof typeof BridgeMatrixPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMatrixPostType = {
  matrix: 'matrix',
} as const

export interface BridgeMatrixPost {
  type: BridgeMatrixPostType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeMatrixGetType = typeof BridgeMatrixGetType[keyof typeof BridgeMatrixGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMatrixGetType = {
  pgsql: 'pgsql',
} as const

export type BridgeMatrixGetStatus = typeof BridgeMatrixGetStatus[keyof typeof BridgeMatrixGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMatrixGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeMatrixGet {
  status?: BridgeMatrixGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeMatrixGetType
  name: string
  enable?: boolean
  sql?: string
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export interface BridgeKinesisPutProducer {
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: BridgeKinesisCreationOpts
  aws_access_key_id: string
  aws_secret_access_key: string
  endpoint: string
  max_retries?: number
  pool_size?: number
  payload_template?: string
  stream_name: string
  partition_key: string
  local_topic?: string
}

export type BridgeKinesisPostProducerType =
  typeof BridgeKinesisPostProducerType[keyof typeof BridgeKinesisPostProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisPostProducerType = {
  kinesis_producer: 'kinesis_producer',
} as const

export interface BridgeKinesisPostProducer {
  type: BridgeKinesisPostProducerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: BridgeKinesisCreationOpts
  aws_access_key_id: string
  aws_secret_access_key: string
  endpoint: string
  max_retries?: number
  pool_size?: number
  payload_template?: string
  stream_name: string
  partition_key: string
  local_topic?: string
}

export type BridgeKinesisGetProducerType =
  typeof BridgeKinesisGetProducerType[keyof typeof BridgeKinesisGetProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisGetProducerType = {
  kinesis_producer: 'kinesis_producer',
} as const

export type BridgeKinesisGetProducerStatus =
  typeof BridgeKinesisGetProducerStatus[keyof typeof BridgeKinesisGetProducerStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisGetProducerStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeKinesisGetProducer {
  status?: BridgeKinesisGetProducerStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeKinesisGetProducerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: BridgeKinesisCreationOpts
  aws_access_key_id: string
  aws_secret_access_key: string
  endpoint: string
  max_retries?: number
  pool_size?: number
  payload_template?: string
  stream_name: string
  partition_key: string
  local_topic?: string
}

export type BridgeKinesisCreationOptsRequestTtl = 'infinity' | string

export type BridgeKinesisCreationOptsQueryMode =
  typeof BridgeKinesisCreationOptsQueryMode[keyof typeof BridgeKinesisCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeKinesisCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeKinesisCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeKinesisCreationOptsAutoRestartInterval
  query_mode?: BridgeKinesisCreationOptsQueryMode
  request_ttl?: BridgeKinesisCreationOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export type BridgeKafkaSslClientOptsServerNameIndication = string | 'disable' | 'auto'

export type BridgeKafkaSslClientOptsPartialChain =
  typeof BridgeKafkaSslClientOptsPartialChain[keyof typeof BridgeKafkaSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaSslClientOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type BridgeKafkaSslClientOptsLogLevel =
  typeof BridgeKafkaSslClientOptsLogLevel[keyof typeof BridgeKafkaSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaSslClientOptsLogLevel = {
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

export type BridgeKafkaSslClientOptsVerify =
  typeof BridgeKafkaSslClientOptsVerify[keyof typeof BridgeKafkaSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface BridgeKafkaSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: BridgeKafkaSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: BridgeKafkaSslClientOptsLogLevel
  hibernate_after?: string
  partial_chain?: BridgeKafkaSslClientOptsPartialChain
  verify_peer_ext_key_usage?: string
  enable?: boolean
  server_name_indication?: BridgeKafkaSslClientOptsServerNameIndication
}

export interface BridgeKafkaSocketOpts {
  sndbuf?: string
  recbuf?: string
  nodelay?: boolean
  tcp_keepalive?: string
}

export type BridgeKafkaPutProducerAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export interface BridgeKafkaPutProducer {
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaPutProducerAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  local_topic?: string
  kafka: BridgeKafkaProducerKafkaOpts
}

export type BridgeKafkaPutConsumerValueEncodingMode =
  typeof BridgeKafkaPutConsumerValueEncodingMode[keyof typeof BridgeKafkaPutConsumerValueEncodingMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPutConsumerValueEncodingMode = {
  none: 'none',
  base64: 'base64',
} as const

export type BridgeKafkaPutConsumerKeyEncodingMode =
  typeof BridgeKafkaPutConsumerKeyEncodingMode[keyof typeof BridgeKafkaPutConsumerKeyEncodingMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPutConsumerKeyEncodingMode = {
  none: 'none',
  base64: 'base64',
} as const

export type BridgeKafkaPutConsumerAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export interface BridgeKafkaPutConsumer {
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaPutConsumerAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  kafka?: BridgeKafkaConsumerKafkaOpts
  topic_mapping: BridgeKafkaConsumerTopicMapping[]
  key_encoding_mode?: BridgeKafkaPutConsumerKeyEncodingMode
  value_encoding_mode?: BridgeKafkaPutConsumerValueEncodingMode
}

export type BridgeKafkaProducerKafkaOptsQueryMode =
  typeof BridgeKafkaProducerKafkaOptsQueryMode[keyof typeof BridgeKafkaProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export type BridgeKafkaProducerKafkaOptsPartitionsLimit = number | 'all_partitions'

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
  partitions_limit?: BridgeKafkaProducerKafkaOptsPartitionsLimit
  max_inflight?: number
  buffer?: BridgeKafkaProducerBuffer
  query_mode?: BridgeKafkaProducerKafkaOptsQueryMode
  sync_query_timeout?: string
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

export type BridgeKafkaPostProducerAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export type BridgeKafkaPostProducerType =
  typeof BridgeKafkaPostProducerType[keyof typeof BridgeKafkaPostProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPostProducerType = {
  kafka: 'kafka',
  kafka_producer: 'kafka_producer',
  kafka_consumer: 'kafka_consumer',
} as const

export interface BridgeKafkaPostProducer {
  type: BridgeKafkaPostProducerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaPostProducerAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  local_topic?: string
  kafka: BridgeKafkaProducerKafkaOpts
}

export type BridgeKafkaPostConsumerValueEncodingMode =
  typeof BridgeKafkaPostConsumerValueEncodingMode[keyof typeof BridgeKafkaPostConsumerValueEncodingMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPostConsumerValueEncodingMode = {
  none: 'none',
  base64: 'base64',
} as const

export type BridgeKafkaPostConsumerKeyEncodingMode =
  typeof BridgeKafkaPostConsumerKeyEncodingMode[keyof typeof BridgeKafkaPostConsumerKeyEncodingMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPostConsumerKeyEncodingMode = {
  none: 'none',
  base64: 'base64',
} as const

export type BridgeKafkaPostConsumerAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export type BridgeKafkaPostConsumerType =
  typeof BridgeKafkaPostConsumerType[keyof typeof BridgeKafkaPostConsumerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPostConsumerType = {
  kafka: 'kafka',
  kafka_producer: 'kafka_producer',
  kafka_consumer: 'kafka_consumer',
} as const

export interface BridgeKafkaPostConsumer {
  type: BridgeKafkaPostConsumerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaPostConsumerAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  kafka?: BridgeKafkaConsumerKafkaOpts
  topic_mapping: BridgeKafkaConsumerTopicMapping[]
  key_encoding_mode?: BridgeKafkaPostConsumerKeyEncodingMode
  value_encoding_mode?: BridgeKafkaPostConsumerValueEncodingMode
}

export interface BridgeKafkaKafkaMessage {
  key?: string
  value?: string
  timestamp?: string
}

export type BridgeKafkaGetProducerAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export type BridgeKafkaGetProducerType =
  typeof BridgeKafkaGetProducerType[keyof typeof BridgeKafkaGetProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetProducerType = {
  kafka: 'kafka',
  kafka_producer: 'kafka_producer',
  kafka_consumer: 'kafka_consumer',
} as const

export type BridgeKafkaGetProducerStatus =
  typeof BridgeKafkaGetProducerStatus[keyof typeof BridgeKafkaGetProducerStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetProducerStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeKafkaGetProducer {
  status?: BridgeKafkaGetProducerStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeKafkaGetProducerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaGetProducerAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  local_topic?: string
  kafka: BridgeKafkaProducerKafkaOpts
}

export type BridgeKafkaGetConsumerValueEncodingMode =
  typeof BridgeKafkaGetConsumerValueEncodingMode[keyof typeof BridgeKafkaGetConsumerValueEncodingMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetConsumerValueEncodingMode = {
  none: 'none',
  base64: 'base64',
} as const

export type BridgeKafkaGetConsumerKeyEncodingMode =
  typeof BridgeKafkaGetConsumerKeyEncodingMode[keyof typeof BridgeKafkaGetConsumerKeyEncodingMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetConsumerKeyEncodingMode = {
  none: 'none',
  base64: 'base64',
} as const

export type BridgeKafkaGetConsumerType =
  typeof BridgeKafkaGetConsumerType[keyof typeof BridgeKafkaGetConsumerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetConsumerType = {
  kafka: 'kafka',
  kafka_producer: 'kafka_producer',
  kafka_consumer: 'kafka_consumer',
} as const

export type BridgeKafkaGetConsumerStatus =
  typeof BridgeKafkaGetConsumerStatus[keyof typeof BridgeKafkaGetConsumerStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetConsumerStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeKafkaConsumerTopicMapping {
  kafka_topic: string
  mqtt_topic: string
  qos?: number
  payload_template?: string
}

export type BridgeKafkaConsumerKafkaOptsOffsetResetPolicy =
  typeof BridgeKafkaConsumerKafkaOptsOffsetResetPolicy[keyof typeof BridgeKafkaConsumerKafkaOptsOffsetResetPolicy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaConsumerKafkaOptsOffsetResetPolicy = {
  latest: 'latest',
  earliest: 'earliest',
} as const

export interface BridgeKafkaConsumerKafkaOpts {
  max_batch_bytes?: string
  offset_reset_policy?: BridgeKafkaConsumerKafkaOptsOffsetResetPolicy
  offset_commit_interval_seconds?: string
}

export interface BridgeKafkaConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface BridgeKafkaGetConsumer {
  status?: BridgeKafkaGetConsumerStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeKafkaGetConsumerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaGetConsumerAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  kafka?: BridgeKafkaConsumerKafkaOpts
  topic_mapping: BridgeKafkaConsumerTopicMapping[]
  key_encoding_mode?: BridgeKafkaGetConsumerKeyEncodingMode
  value_encoding_mode?: BridgeKafkaGetConsumerValueEncodingMode
}

export type BridgeKafkaAuthUsernamePasswordMechanism =
  typeof BridgeKafkaAuthUsernamePasswordMechanism[keyof typeof BridgeKafkaAuthUsernamePasswordMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaAuthUsernamePasswordMechanism = {
  plain: 'plain',
  scram_sha_256: 'scram_sha_256',
  scram_sha_512: 'scram_sha_512',
} as const

export interface BridgeKafkaAuthUsernamePassword {
  mechanism: BridgeKafkaAuthUsernamePasswordMechanism
  username: string
  password: string
}

export interface BridgeKafkaAuthGssapiKerberos {
  kerberos_principal: string
  kerberos_keytab_file: string
}

export type BridgeKafkaGetConsumerAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export type BridgeIotdbPutPoolType =
  typeof BridgeIotdbPutPoolType[keyof typeof BridgeIotdbPutPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbPutPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeIotdbPutIotdbVersion =
  typeof BridgeIotdbPutIotdbVersion[keyof typeof BridgeIotdbPutIotdbVersion]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbPutIotdbVersion = {
  v13x: 'v1.3.x',
  v11x: 'v1.1.x',
  v10x: 'v1.0.x',
  v013x: 'v0.13.x',
} as const

export interface BridgeIotdbPut {
  enable?: boolean
  authentication?: BridgeIotdbAuthBasic
  is_aligned?: boolean
  device_id?: string
  iotdb_version?: BridgeIotdbPutIotdbVersion
  resource_opts?: BridgeIotdbCreationOpts
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeIotdbPutPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: EmqxSslClientOpts
  base_url: string
  max_retries?: number
}

export type BridgeIotdbPostPoolType =
  typeof BridgeIotdbPostPoolType[keyof typeof BridgeIotdbPostPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbPostPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeIotdbPostIotdbVersion =
  typeof BridgeIotdbPostIotdbVersion[keyof typeof BridgeIotdbPostIotdbVersion]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbPostIotdbVersion = {
  v13x: 'v1.3.x',
  v11x: 'v1.1.x',
  v10x: 'v1.0.x',
  v013x: 'v0.13.x',
} as const

export type BridgeIotdbPostType = typeof BridgeIotdbPostType[keyof typeof BridgeIotdbPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbPostType = {
  iotdb: 'iotdb',
} as const

export interface BridgeIotdbPost {
  type: BridgeIotdbPostType
  name: string
  enable?: boolean
  authentication?: BridgeIotdbAuthBasic
  is_aligned?: boolean
  device_id?: string
  iotdb_version?: BridgeIotdbPostIotdbVersion
  resource_opts?: BridgeIotdbCreationOpts
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeIotdbPostPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: EmqxSslClientOpts
  base_url: string
  max_retries?: number
}

export type BridgeIotdbGetPoolType =
  typeof BridgeIotdbGetPoolType[keyof typeof BridgeIotdbGetPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbGetPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeIotdbGetIotdbVersion =
  typeof BridgeIotdbGetIotdbVersion[keyof typeof BridgeIotdbGetIotdbVersion]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbGetIotdbVersion = {
  v13x: 'v1.3.x',
  v11x: 'v1.1.x',
  v10x: 'v1.0.x',
  v013x: 'v0.13.x',
} as const

export type BridgeIotdbGetType = typeof BridgeIotdbGetType[keyof typeof BridgeIotdbGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbGetType = {
  iotdb: 'iotdb',
} as const

export type BridgeIotdbGetStatus = typeof BridgeIotdbGetStatus[keyof typeof BridgeIotdbGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeIotdbCreationOptsRequestTtl = 'infinity' | string

export type BridgeIotdbCreationOptsQueryMode =
  typeof BridgeIotdbCreationOptsQueryMode[keyof typeof BridgeIotdbCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeIotdbCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeIotdbCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeIotdbCreationOptsAutoRestartInterval
  query_mode?: BridgeIotdbCreationOptsQueryMode
  request_ttl?: BridgeIotdbCreationOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeIotdbAuthBasic {
  username: string
  password: string
}

export interface BridgeIotdbGet {
  status?: BridgeIotdbGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeIotdbGetType
  name: string
  enable?: boolean
  authentication?: BridgeIotdbAuthBasic
  is_aligned?: boolean
  device_id?: string
  iotdb_version?: BridgeIotdbGetIotdbVersion
  resource_opts?: BridgeIotdbCreationOpts
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeIotdbGetPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: EmqxSslClientOpts
  base_url: string
  max_retries?: number
}

export type BridgeInfluxdbPutApiV2Precision =
  typeof BridgeInfluxdbPutApiV2Precision[keyof typeof BridgeInfluxdbPutApiV2Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPutApiV2Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeInfluxdbPutApiV2 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeInfluxdbPutApiV2Precision
  ssl?: EmqxSslClientOpts
  bucket: string
  org: string
  token: string
}

export type BridgeInfluxdbPutApiV1Precision =
  typeof BridgeInfluxdbPutApiV1Precision[keyof typeof BridgeInfluxdbPutApiV1Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPutApiV1Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeInfluxdbPutApiV1 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeInfluxdbPutApiV1Precision
  ssl?: EmqxSslClientOpts
  database: string
  username?: string
  password?: string
}

export type BridgeInfluxdbPostApiV2Type =
  typeof BridgeInfluxdbPostApiV2Type[keyof typeof BridgeInfluxdbPostApiV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPostApiV2Type = {
  influxdb_api_v2: 'influxdb_api_v2',
} as const

export type BridgeInfluxdbPostApiV2Precision =
  typeof BridgeInfluxdbPostApiV2Precision[keyof typeof BridgeInfluxdbPostApiV2Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPostApiV2Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeInfluxdbPostApiV2 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeInfluxdbPostApiV2Precision
  ssl?: EmqxSslClientOpts
  bucket: string
  org: string
  token: string
  type: BridgeInfluxdbPostApiV2Type
  name: string
}

export type BridgeInfluxdbPostApiV1Type =
  typeof BridgeInfluxdbPostApiV1Type[keyof typeof BridgeInfluxdbPostApiV1Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPostApiV1Type = {
  influxdb_api_v1: 'influxdb_api_v1',
} as const

export type BridgeInfluxdbPostApiV1Precision =
  typeof BridgeInfluxdbPostApiV1Precision[keyof typeof BridgeInfluxdbPostApiV1Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPostApiV1Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeInfluxdbPostApiV1 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeInfluxdbPostApiV1Precision
  ssl?: EmqxSslClientOpts
  database: string
  username?: string
  password?: string
  type: BridgeInfluxdbPostApiV1Type
  name: string
}

export type BridgeInfluxdbGetApiV2Status =
  typeof BridgeInfluxdbGetApiV2Status[keyof typeof BridgeInfluxdbGetApiV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetApiV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeInfluxdbGetApiV2Type =
  typeof BridgeInfluxdbGetApiV2Type[keyof typeof BridgeInfluxdbGetApiV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetApiV2Type = {
  influxdb_api_v2: 'influxdb_api_v2',
} as const

export type BridgeInfluxdbGetApiV2Precision =
  typeof BridgeInfluxdbGetApiV2Precision[keyof typeof BridgeInfluxdbGetApiV2Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetApiV2Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeInfluxdbGetApiV2 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeInfluxdbGetApiV2Precision
  ssl?: EmqxSslClientOpts
  bucket: string
  org: string
  token: string
  type: BridgeInfluxdbGetApiV2Type
  name: string
  status?: BridgeInfluxdbGetApiV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
}

export type BridgeInfluxdbGetApiV1Status =
  typeof BridgeInfluxdbGetApiV1Status[keyof typeof BridgeInfluxdbGetApiV1Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetApiV1Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeInfluxdbGetApiV1Type =
  typeof BridgeInfluxdbGetApiV1Type[keyof typeof BridgeInfluxdbGetApiV1Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetApiV1Type = {
  influxdb_api_v1: 'influxdb_api_v1',
} as const

export type BridgeInfluxdbGetApiV1Precision =
  typeof BridgeInfluxdbGetApiV1Precision[keyof typeof BridgeInfluxdbGetApiV1Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetApiV1Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeInfluxdbGetApiV1 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeInfluxdbGetApiV1Precision
  ssl?: EmqxSslClientOpts
  database: string
  username?: string
  password?: string
  type: BridgeInfluxdbGetApiV1Type
  name: string
  status?: BridgeInfluxdbGetApiV1Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
}

export type BridgeHttpV1ResourceOptsRequestTtl = 'infinity' | string

export type BridgeHttpV1ResourceOptsQueryMode =
  typeof BridgeHttpV1ResourceOptsQueryMode[keyof typeof BridgeHttpV1ResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpV1ResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeHttpV1ResourceOptsAutoRestartInterval = string | 'infinity'

export interface BridgeHttpV1ResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeHttpV1ResourceOptsAutoRestartInterval
  query_mode?: BridgeHttpV1ResourceOptsQueryMode
  request_ttl?: BridgeHttpV1ResourceOptsRequestTtl
  inflight_window?: number
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export type BridgeHttpPutHeaders = { [key: string]: any }

export type BridgeHttpPutMethod = typeof BridgeHttpPutMethod[keyof typeof BridgeHttpPutMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPutMethod = {
  post: 'post',
  put: 'put',
  get: 'get',
  delete: 'delete',
} as const

/**
 * @deprecated
 */
export type BridgeHttpPutDirection =
  typeof BridgeHttpPutDirection[keyof typeof BridgeHttpPutDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPutDirection = {
  egress: 'egress',
} as const

/**
 * @deprecated
 */
export type BridgeHttpPutRequest = { [key: string]: any }

export type BridgeHttpPutPoolType = typeof BridgeHttpPutPoolType[keyof typeof BridgeHttpPutPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPutPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export interface BridgeHttpPut {
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeHttpPutPoolType
  pool_size?: number
  enable_pipelining?: number
  /** @deprecated */
  request?: BridgeHttpPutRequest
  ssl?: EmqxSslClientOpts
  url: string
  /** @deprecated */
  direction?: BridgeHttpPutDirection
  local_topic?: string
  method?: BridgeHttpPutMethod
  headers?: BridgeHttpPutHeaders
  body?: string
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  resource_opts?: BridgeHttpV1ResourceOpts
}

export type BridgeHttpPostHeaders = { [key: string]: any }

export type BridgeHttpPostMethod = typeof BridgeHttpPostMethod[keyof typeof BridgeHttpPostMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostMethod = {
  post: 'post',
  put: 'put',
  get: 'get',
  delete: 'delete',
} as const

/**
 * @deprecated
 */
export type BridgeHttpPostDirection =
  typeof BridgeHttpPostDirection[keyof typeof BridgeHttpPostDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostDirection = {
  egress: 'egress',
} as const

/**
 * @deprecated
 */
export type BridgeHttpPostRequest = { [key: string]: any }

export type BridgeHttpPostPoolType =
  typeof BridgeHttpPostPoolType[keyof typeof BridgeHttpPostPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeHttpPostType = typeof BridgeHttpPostType[keyof typeof BridgeHttpPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostType = {
  webhook: 'webhook',
  http: 'http',
} as const

export interface BridgeHttpPost {
  type: BridgeHttpPostType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeHttpPostPoolType
  pool_size?: number
  enable_pipelining?: number
  /** @deprecated */
  request?: BridgeHttpPostRequest
  ssl?: EmqxSslClientOpts
  url: string
  /** @deprecated */
  direction?: BridgeHttpPostDirection
  local_topic?: string
  method?: BridgeHttpPostMethod
  headers?: BridgeHttpPostHeaders
  body?: string
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  resource_opts?: BridgeHttpV1ResourceOpts
}

export type BridgeHttpGetHeaders = { [key: string]: any }

export type BridgeHttpGetMethod = typeof BridgeHttpGetMethod[keyof typeof BridgeHttpGetMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetMethod = {
  post: 'post',
  put: 'put',
  get: 'get',
  delete: 'delete',
} as const

/**
 * @deprecated
 */
export type BridgeHttpGetDirection =
  typeof BridgeHttpGetDirection[keyof typeof BridgeHttpGetDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetDirection = {
  egress: 'egress',
} as const

/**
 * @deprecated
 */
export type BridgeHttpGetRequest = { [key: string]: any }

export type BridgeHttpGetPoolType = typeof BridgeHttpGetPoolType[keyof typeof BridgeHttpGetPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeHttpGetType = typeof BridgeHttpGetType[keyof typeof BridgeHttpGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetType = {
  webhook: 'webhook',
  http: 'http',
} as const

export type BridgeHttpGetStatus = typeof BridgeHttpGetStatus[keyof typeof BridgeHttpGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeHttpGet {
  status?: BridgeHttpGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeHttpGetType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeHttpGetPoolType
  pool_size?: number
  enable_pipelining?: number
  /** @deprecated */
  request?: BridgeHttpGetRequest
  ssl?: EmqxSslClientOpts
  url: string
  /** @deprecated */
  direction?: BridgeHttpGetDirection
  local_topic?: string
  method?: BridgeHttpGetMethod
  headers?: BridgeHttpGetHeaders
  body?: string
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  resource_opts?: BridgeHttpV1ResourceOpts
}

export type BridgeHstreamdbPutDirection =
  typeof BridgeHstreamdbPutDirection[keyof typeof BridgeHstreamdbPutDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbPutDirection = {
  egress: 'egress',
} as const

export interface BridgeHstreamdbPut {
  enable?: boolean
  tags?: string[]
  description?: string
  direction?: BridgeHstreamdbPutDirection
  local_topic?: string
  record_template?: string
  resource_opts?: ResourceSchemaCreationOpts
  url: string
  stream: string
  partition_key?: string
  pool_size?: number
  grpc_timeout?: string
  ssl?: EmqxSslClientOpts
}

export type BridgeHstreamdbPostType =
  typeof BridgeHstreamdbPostType[keyof typeof BridgeHstreamdbPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbPostType = {
  hstreamdb: 'hstreamdb',
} as const

export type BridgeHstreamdbPostDirection =
  typeof BridgeHstreamdbPostDirection[keyof typeof BridgeHstreamdbPostDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbPostDirection = {
  egress: 'egress',
} as const

export interface BridgeHstreamdbPost {
  enable?: boolean
  tags?: string[]
  description?: string
  direction?: BridgeHstreamdbPostDirection
  local_topic?: string
  record_template?: string
  resource_opts?: ResourceSchemaCreationOpts
  url: string
  stream: string
  partition_key?: string
  pool_size?: number
  grpc_timeout?: string
  ssl?: EmqxSslClientOpts
  type: BridgeHstreamdbPostType
  name: string
}

export type BridgeHstreamdbGetStatus =
  typeof BridgeHstreamdbGetStatus[keyof typeof BridgeHstreamdbGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeHstreamdbGetType =
  typeof BridgeHstreamdbGetType[keyof typeof BridgeHstreamdbGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbGetType = {
  hstreamdb: 'hstreamdb',
} as const

export type BridgeHstreamdbGetDirection =
  typeof BridgeHstreamdbGetDirection[keyof typeof BridgeHstreamdbGetDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbGetDirection = {
  egress: 'egress',
} as const

export interface BridgeHstreamdbGet {
  enable?: boolean
  tags?: string[]
  description?: string
  direction?: BridgeHstreamdbGetDirection
  local_topic?: string
  record_template?: string
  resource_opts?: ResourceSchemaCreationOpts
  url: string
  stream: string
  partition_key?: string
  pool_size?: number
  grpc_timeout?: string
  ssl?: EmqxSslClientOpts
  type: BridgeHstreamdbGetType
  name: string
  status?: BridgeHstreamdbGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
}

export type BridgeGreptimedbPutGrpcV1Precision =
  typeof BridgeGreptimedbPutGrpcV1Precision[keyof typeof BridgeGreptimedbPutGrpcV1Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbPutGrpcV1Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeGreptimedbPutGrpcV1 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeGreptimedbPutGrpcV1Precision
  dbname: string
  username?: string
  password?: string
  ssl?: EmqxSslClientOpts
}

export type BridgeGreptimedbPostGrpcV1Type =
  typeof BridgeGreptimedbPostGrpcV1Type[keyof typeof BridgeGreptimedbPostGrpcV1Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbPostGrpcV1Type = {
  greptimedb: 'greptimedb',
} as const

export type BridgeGreptimedbPostGrpcV1Precision =
  typeof BridgeGreptimedbPostGrpcV1Precision[keyof typeof BridgeGreptimedbPostGrpcV1Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbPostGrpcV1Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeGreptimedbPostGrpcV1 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeGreptimedbPostGrpcV1Precision
  dbname: string
  username?: string
  password?: string
  ssl?: EmqxSslClientOpts
  type: BridgeGreptimedbPostGrpcV1Type
  name: string
}

export type BridgeGreptimedbGetGrpcV1Status =
  typeof BridgeGreptimedbGetGrpcV1Status[keyof typeof BridgeGreptimedbGetGrpcV1Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbGetGrpcV1Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeGreptimedbGetGrpcV1Type =
  typeof BridgeGreptimedbGetGrpcV1Type[keyof typeof BridgeGreptimedbGetGrpcV1Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbGetGrpcV1Type = {
  greptimedb: 'greptimedb',
} as const

export type BridgeGreptimedbGetGrpcV1Precision =
  typeof BridgeGreptimedbGetGrpcV1Precision[keyof typeof BridgeGreptimedbGetGrpcV1Precision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbGetGrpcV1Precision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeGreptimedbGetGrpcV1 {
  enable?: boolean
  tags?: string[]
  description?: string
  local_topic?: string
  write_syntax: string
  resource_opts?: ResourceSchemaCreationOpts
  server?: string
  precision?: BridgeGreptimedbGetGrpcV1Precision
  dbname: string
  username?: string
  password?: string
  ssl?: EmqxSslClientOpts
  type: BridgeGreptimedbGetGrpcV1Type
  name: string
  status?: BridgeGreptimedbGetGrpcV1Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
}

export interface BridgeGcpPubsubPutProducer {
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: ResourceSchemaCreationOpts
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: string
  attributes_template?: BridgeGcpPubsubKeyValuePair[]
  ordering_key_template?: string
  payload_template?: string
  local_topic?: string
  pubsub_topic: string
}

export interface BridgeGcpPubsubPutConsumer {
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts: BridgeGcpPubsubConsumerResourceOpts
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: string
  consumer: BridgeGcpPubsubConsumer
}

export type BridgeGcpPubsubPostProducerType =
  typeof BridgeGcpPubsubPostProducerType[keyof typeof BridgeGcpPubsubPostProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGcpPubsubPostProducerType = {
  gcp_pubsub: 'gcp_pubsub',
} as const

export interface BridgeGcpPubsubPostProducer {
  type: BridgeGcpPubsubPostProducerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: ResourceSchemaCreationOpts
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: string
  attributes_template?: BridgeGcpPubsubKeyValuePair[]
  ordering_key_template?: string
  payload_template?: string
  local_topic?: string
  pubsub_topic: string
}

export type BridgeGcpPubsubPostConsumerType =
  typeof BridgeGcpPubsubPostConsumerType[keyof typeof BridgeGcpPubsubPostConsumerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGcpPubsubPostConsumerType = {
  gcp_pubsub_consumer: 'gcp_pubsub_consumer',
} as const

export interface BridgeGcpPubsubPostConsumer {
  type: BridgeGcpPubsubPostConsumerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts: BridgeGcpPubsubConsumerResourceOpts
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: string
  consumer: BridgeGcpPubsubConsumer
}

export interface BridgeGcpPubsubKeyValuePair {
  key: string
  value: string
}

export type BridgeGcpPubsubGetProducerType =
  typeof BridgeGcpPubsubGetProducerType[keyof typeof BridgeGcpPubsubGetProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGcpPubsubGetProducerType = {
  gcp_pubsub: 'gcp_pubsub',
} as const

export type BridgeGcpPubsubGetProducerStatus =
  typeof BridgeGcpPubsubGetProducerStatus[keyof typeof BridgeGcpPubsubGetProducerStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGcpPubsubGetProducerStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeGcpPubsubGetProducer {
  status?: BridgeGcpPubsubGetProducerStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeGcpPubsubGetProducerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts?: ResourceSchemaCreationOpts
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: string
  attributes_template?: BridgeGcpPubsubKeyValuePair[]
  ordering_key_template?: string
  payload_template?: string
  local_topic?: string
  pubsub_topic: string
}

export type BridgeGcpPubsubGetConsumerType =
  typeof BridgeGcpPubsubGetConsumerType[keyof typeof BridgeGcpPubsubGetConsumerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGcpPubsubGetConsumerType = {
  gcp_pubsub_consumer: 'gcp_pubsub_consumer',
} as const

export type BridgeGcpPubsubGetConsumerStatus =
  typeof BridgeGcpPubsubGetConsumerStatus[keyof typeof BridgeGcpPubsubGetConsumerStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGcpPubsubGetConsumerStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeGcpPubsubGetConsumer {
  status?: BridgeGcpPubsubGetConsumerStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeGcpPubsubGetConsumerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  resource_opts: BridgeGcpPubsubConsumerResourceOpts
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: string
  consumer: BridgeGcpPubsubConsumer
}

export interface BridgeGcpPubsubConsumerTopicMapping {
  pubsub_topic: string
  mqtt_topic: string
  qos?: number
  payload_template?: string
}

export type BridgeGcpPubsubConsumerResourceOptsRequestTtl = 'infinity' | string

export interface BridgeGcpPubsubConsumerResourceOpts {
  health_check_interval?: string
  request_ttl?: BridgeGcpPubsubConsumerResourceOptsRequestTtl
}

export interface BridgeGcpPubsubConsumer {
  pull_max_messages?: number
  topic_mapping: BridgeGcpPubsubConsumerTopicMapping[]
}

export interface BridgeDynamoPut {
  enable?: boolean
  template?: string
  local_topic?: string
  hash_key: string
  range_key?: string
  resource_opts?: BridgeDynamoCreationOpts
  url: string
  region: string
  table: string
  aws_access_key_id: string
  aws_secret_access_key: string
  pool_size?: number
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeDynamoPostType = typeof BridgeDynamoPostType[keyof typeof BridgeDynamoPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoPostType = {
  dynamo: 'dynamo',
} as const

export interface BridgeDynamoPost {
  type: BridgeDynamoPostType
  name: string
  enable?: boolean
  template?: string
  local_topic?: string
  hash_key: string
  range_key?: string
  resource_opts?: BridgeDynamoCreationOpts
  url: string
  region: string
  table: string
  aws_access_key_id: string
  aws_secret_access_key: string
  pool_size?: number
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeDynamoGetType = typeof BridgeDynamoGetType[keyof typeof BridgeDynamoGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoGetType = {
  dynamo: 'dynamo',
} as const

export type BridgeDynamoGetStatus = typeof BridgeDynamoGetStatus[keyof typeof BridgeDynamoGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeDynamoCreationOptsRequestTtl = 'infinity' | string

export type BridgeDynamoCreationOptsQueryMode =
  typeof BridgeDynamoCreationOptsQueryMode[keyof typeof BridgeDynamoCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeDynamoCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeDynamoCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeDynamoCreationOptsAutoRestartInterval
  query_mode?: BridgeDynamoCreationOptsQueryMode
  request_ttl?: BridgeDynamoCreationOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeDynamoGet {
  status?: BridgeDynamoGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeDynamoGetType
  name: string
  enable?: boolean
  template?: string
  local_topic?: string
  hash_key: string
  range_key?: string
  resource_opts?: BridgeDynamoCreationOpts
  url: string
  region: string
  table: string
  aws_access_key_id: string
  aws_secret_access_key: string
  pool_size?: number
  /** @deprecated */
  auto_reconnect?: boolean
}

export interface BridgeClickhousePut {
  enable?: boolean
  sql?: string
  batch_value_separator?: string
  local_topic?: string
  resource_opts?: BridgeClickhouseCreationOpts
  url: string
  connect_timeout?: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeClickhousePostType =
  typeof BridgeClickhousePostType[keyof typeof BridgeClickhousePostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhousePostType = {
  clickhouse: 'clickhouse',
} as const

export interface BridgeClickhousePost {
  type: BridgeClickhousePostType
  name: string
  enable?: boolean
  sql?: string
  batch_value_separator?: string
  local_topic?: string
  resource_opts?: BridgeClickhouseCreationOpts
  url: string
  connect_timeout?: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeClickhouseGetType =
  typeof BridgeClickhouseGetType[keyof typeof BridgeClickhouseGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhouseGetType = {
  clickhouse: 'clickhouse',
} as const

export type BridgeClickhouseGetStatus =
  typeof BridgeClickhouseGetStatus[keyof typeof BridgeClickhouseGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhouseGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeClickhouseGet {
  status?: BridgeClickhouseGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeClickhouseGetType
  name: string
  enable?: boolean
  sql?: string
  batch_value_separator?: string
  local_topic?: string
  resource_opts?: BridgeClickhouseCreationOpts
  url: string
  connect_timeout?: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type BridgeClickhouseCreationOptsRequestTtl = 'infinity' | string

export type BridgeClickhouseCreationOptsQueryMode =
  typeof BridgeClickhouseCreationOptsQueryMode[keyof typeof BridgeClickhouseCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhouseCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeClickhouseCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeClickhouseCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeClickhouseCreationOptsAutoRestartInterval
  query_mode?: BridgeClickhouseCreationOptsQueryMode
  request_ttl?: BridgeClickhouseCreationOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeCassaPut {
  cql?: string
  enable?: boolean
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  servers: string
  keyspace: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeCassaPostType = typeof BridgeCassaPostType[keyof typeof BridgeCassaPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaPostType = {
  cassandra: 'cassandra',
} as const

export interface BridgeCassaPost {
  type: BridgeCassaPostType
  name: string
  cql?: string
  enable?: boolean
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  servers: string
  keyspace: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeCassaGetType = typeof BridgeCassaGetType[keyof typeof BridgeCassaGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaGetType = {
  cassandra: 'cassandra',
} as const

export type BridgeCassaGetStatus = typeof BridgeCassaGetStatus[keyof typeof BridgeCassaGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeCassaGet {
  status?: BridgeCassaGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeCassaGetType
  name: string
  cql?: string
  enable?: boolean
  local_topic?: string
  resource_opts?: ResourceSchemaCreationOpts
  servers: string
  keyspace: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
}

export type BridgeAzureEventHubSslClientOptsServerNameIndication = string | 'disable' | 'auto'

export type BridgeAzureEventHubSslClientOptsEnable =
  typeof BridgeAzureEventHubSslClientOptsEnable[keyof typeof BridgeAzureEventHubSslClientOptsEnable]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubSslClientOptsEnable = {
  true: 'true',
} as const

export type BridgeAzureEventHubSslClientOptsPartialChain =
  typeof BridgeAzureEventHubSslClientOptsPartialChain[keyof typeof BridgeAzureEventHubSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubSslClientOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type BridgeAzureEventHubSslClientOptsLogLevel =
  typeof BridgeAzureEventHubSslClientOptsLogLevel[keyof typeof BridgeAzureEventHubSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubSslClientOptsLogLevel = {
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

export type BridgeAzureEventHubSslClientOptsVerify =
  typeof BridgeAzureEventHubSslClientOptsVerify[keyof typeof BridgeAzureEventHubSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface BridgeAzureEventHubSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: BridgeAzureEventHubSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: BridgeAzureEventHubSslClientOptsLogLevel
  hibernate_after?: string
  partial_chain?: BridgeAzureEventHubSslClientOptsPartialChain
  verify_peer_ext_key_usage?: string
  enable?: BridgeAzureEventHubSslClientOptsEnable
  server_name_indication?: BridgeAzureEventHubSslClientOptsServerNameIndication
}

export type BridgeAzureEventHubPutProducerAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export interface BridgeAzureEventHubPutProducer {
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeAzureEventHubPutProducerAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  local_topic?: string
  kafka: BridgeKafkaProducerKafkaOpts
}

export type BridgeAzureEventHubProducerKafkaOptsQueryMode =
  typeof BridgeAzureEventHubProducerKafkaOptsQueryMode[keyof typeof BridgeAzureEventHubProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export type BridgeAzureEventHubProducerKafkaOptsPartitionsLimit = number | 'all_partitions'

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
  partitions_limit?: BridgeAzureEventHubProducerKafkaOptsPartitionsLimit
  max_inflight?: number
  buffer?: BridgeKafkaProducerBuffer
  query_mode?: BridgeAzureEventHubProducerKafkaOptsQueryMode
  sync_query_timeout?: string
}

export type BridgeAzureEventHubPostProducerType =
  typeof BridgeAzureEventHubPostProducerType[keyof typeof BridgeAzureEventHubPostProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubPostProducerType = {
  azure_event_hub_producer: 'azure_event_hub_producer',
} as const

export interface BridgeAzureEventHubPostProducer {
  type: BridgeAzureEventHubPostProducerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: BridgeAzureEventHubAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeAzureEventHubSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  local_topic?: string
  kafka: BridgeAzureEventHubProducerKafkaOpts
}

export interface BridgeAzureEventHubKafkaMessage {
  key?: string
  value?: string
}

export type BridgeAzureEventHubGetProducerAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export type BridgeAzureEventHubGetProducerType =
  typeof BridgeAzureEventHubGetProducerType[keyof typeof BridgeAzureEventHubGetProducerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetProducerType = {
  kafka: 'kafka',
  kafka_producer: 'kafka_producer',
  kafka_consumer: 'kafka_consumer',
} as const

export type BridgeAzureEventHubGetProducerStatus =
  typeof BridgeAzureEventHubGetProducerStatus[keyof typeof BridgeAzureEventHubGetProducerStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetProducerStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeAzureEventHubGetProducer {
  status?: BridgeAzureEventHubGetProducerStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeAzureEventHubGetProducerType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeAzureEventHubGetProducerAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
  local_topic?: string
  kafka: BridgeKafkaProducerKafkaOpts
}

export interface BridgeAzureEventHubAuthUsernamePassword {
  password: string
}
