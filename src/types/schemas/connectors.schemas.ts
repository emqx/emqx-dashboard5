export type PostConnectors400Code = typeof PostConnectors400Code[keyof typeof PostConnectors400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConnectors400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostConnectors400 = {
  code?: PostConnectors400Code
  message?: string
}

export type PostConnectors201 =
  | BridgeTimescaleGetConnector
  | ConnectorSyskeeperProxyGet
  | EmqxBridgeSyskeeperConnectorGet
  | RedisGetConnector
  | EmqxPostgresqlConnectorSchemaGetConnector
  | BridgeMongodbGetConnector
  | BridgeMatrixGetConnector
  | BridgeKafkaGetConnector
  | GcpPubsubProducerGetConnector
  | ConfluentGetConnector
  | BridgeAzureEventHubGetConnector

export type PostConnectorsBody =
  | BridgeTimescalePostConnector
  | ConnectorSyskeeperProxyPost
  | EmqxBridgeSyskeeperConnectorPost
  | RedisPostConnector
  | EmqxPostgresqlConnectorSchemaPostConnector
  | BridgeMongodbPostConnector
  | BridgeMatrixPostConnector
  | BridgeKafkaPostConnector
  | GcpPubsubProducerPostConnector
  | ConfluentPostConnector
  | BridgeAzureEventHubPostConnector

export type GetConnectors200Item =
  | BridgeTimescaleGetConnector
  | ConnectorSyskeeperProxyGet
  | EmqxBridgeSyskeeperConnectorGet
  | RedisGetConnector
  | EmqxPostgresqlConnectorSchemaGetConnector
  | BridgeMongodbGetConnector
  | BridgeMatrixGetConnector
  | BridgeKafkaGetConnector
  | GcpPubsubProducerGetConnector
  | ConfluentGetConnector
  | BridgeAzureEventHubGetConnector

export type PutConnectorsIdEnableEnable503Code =
  typeof PutConnectorsIdEnableEnable503Code[keyof typeof PutConnectorsIdEnableEnable503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConnectorsIdEnableEnable503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutConnectorsIdEnableEnable503 = {
  code?: PutConnectorsIdEnableEnable503Code
  message?: string
}

export type PutConnectorsIdEnableEnable404Code =
  typeof PutConnectorsIdEnableEnable404Code[keyof typeof PutConnectorsIdEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConnectorsIdEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutConnectorsIdEnableEnable404 = {
  code?: PutConnectorsIdEnableEnable404Code
  message?: string
}

export type PostNodesNodeConnectorsIdOperation503Code =
  typeof PostNodesNodeConnectorsIdOperation503Code[keyof typeof PostNodesNodeConnectorsIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeConnectorsIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostNodesNodeConnectorsIdOperation503 = {
  code?: PostNodesNodeConnectorsIdOperation503Code
  message?: string
}

export type PostNodesNodeConnectorsIdOperation501Code =
  typeof PostNodesNodeConnectorsIdOperation501Code[keyof typeof PostNodesNodeConnectorsIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeConnectorsIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostNodesNodeConnectorsIdOperation501 = {
  code?: PostNodesNodeConnectorsIdOperation501Code
  message?: string
}

export type PostNodesNodeConnectorsIdOperation404Code =
  typeof PostNodesNodeConnectorsIdOperation404Code[keyof typeof PostNodesNodeConnectorsIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeConnectorsIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostNodesNodeConnectorsIdOperation404 = {
  code?: PostNodesNodeConnectorsIdOperation404Code
  message?: string
}

export type PostNodesNodeConnectorsIdOperation400Code =
  typeof PostNodesNodeConnectorsIdOperation400Code[keyof typeof PostNodesNodeConnectorsIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeConnectorsIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostNodesNodeConnectorsIdOperation400 = {
  code?: PostNodesNodeConnectorsIdOperation400Code
  message?: string
}

export type PostConnectorsIdOperation503Code =
  typeof PostConnectorsIdOperation503Code[keyof typeof PostConnectorsIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConnectorsIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostConnectorsIdOperation503 = {
  code?: PostConnectorsIdOperation503Code
  message?: string
}

export type PostConnectorsIdOperation501Code =
  typeof PostConnectorsIdOperation501Code[keyof typeof PostConnectorsIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConnectorsIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostConnectorsIdOperation501 = {
  code?: PostConnectorsIdOperation501Code
  message?: string
}

export type PostConnectorsIdOperation404Code =
  typeof PostConnectorsIdOperation404Code[keyof typeof PostConnectorsIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConnectorsIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostConnectorsIdOperation404 = {
  code?: PostConnectorsIdOperation404Code
  message?: string
}

export type PostConnectorsIdOperation400Code =
  typeof PostConnectorsIdOperation400Code[keyof typeof PostConnectorsIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConnectorsIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostConnectorsIdOperation400 = {
  code?: PostConnectorsIdOperation400Code
  message?: string
}

export type PutConnectorsId404Code =
  typeof PutConnectorsId404Code[keyof typeof PutConnectorsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConnectorsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutConnectorsId404 = {
  code?: PutConnectorsId404Code
  message?: string
}

export type PutConnectorsId400Code =
  typeof PutConnectorsId400Code[keyof typeof PutConnectorsId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConnectorsId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutConnectorsId400 = {
  code?: PutConnectorsId400Code
  message?: string
}

export type PutConnectorsId200 =
  | BridgeTimescaleGetConnector
  | ConnectorSyskeeperProxyGet
  | EmqxBridgeSyskeeperConnectorGet
  | RedisGetConnector
  | EmqxPostgresqlConnectorSchemaGetConnector
  | BridgeMongodbGetConnector
  | BridgeMatrixGetConnector
  | BridgeKafkaGetConnector
  | GcpPubsubProducerGetConnector
  | ConfluentGetConnector
  | BridgeAzureEventHubGetConnector

export type PutConnectorsIdBody =
  | BridgeTimescalePutConnector
  | ConnectorSyskeeperProxyPut
  | EmqxBridgeSyskeeperConnectorPut
  | RedisPutConnector
  | EmqxPostgresqlConnectorSchemaPutConnector
  | BridgeMongodbPutConnector
  | BridgeMatrixPutConnector
  | BridgeKafkaPutConnector
  | GcpPubsubProducerPutConnector
  | ConfluentPutConnector
  | BridgeAzureEventHubPutConnector

export type GetConnectorsId404Code =
  typeof GetConnectorsId404Code[keyof typeof GetConnectorsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConnectorsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConnectorsId404 = {
  code?: GetConnectorsId404Code
  message?: string
}

export type GetConnectorsId200 =
  | BridgeTimescaleGetConnector
  | ConnectorSyskeeperProxyGet
  | EmqxBridgeSyskeeperConnectorGet
  | RedisGetConnector
  | EmqxPostgresqlConnectorSchemaGetConnector
  | BridgeMongodbGetConnector
  | BridgeMatrixGetConnector
  | BridgeKafkaGetConnector
  | GcpPubsubProducerGetConnector
  | ConfluentGetConnector
  | BridgeAzureEventHubGetConnector

export type DeleteConnectorsId503Code =
  typeof DeleteConnectorsId503Code[keyof typeof DeleteConnectorsId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteConnectorsId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteConnectorsId503 = {
  code?: DeleteConnectorsId503Code
  message?: string
}

export type DeleteConnectorsId404Code =
  typeof DeleteConnectorsId404Code[keyof typeof DeleteConnectorsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteConnectorsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteConnectorsId404 = {
  code?: DeleteConnectorsId404Code
  message?: string
}

export type DeleteConnectorsId400Code =
  typeof DeleteConnectorsId400Code[keyof typeof DeleteConnectorsId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteConnectorsId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteConnectorsId400 = {
  code?: DeleteConnectorsId400Code
  message?: string
}

export type PostConnectorsProbe400Code =
  typeof PostConnectorsProbe400Code[keyof typeof PostConnectorsProbe400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConnectorsProbe400Code = {
  TEST_FAILED: 'TEST_FAILED',
} as const

export type PostConnectorsProbe400 = {
  code?: PostConnectorsProbe400Code
  message?: string
}

export type PostConnectorsProbeBody =
  | BridgeTimescalePostConnector
  | ConnectorSyskeeperProxyPost
  | EmqxBridgeSyskeeperConnectorPost
  | RedisPostConnector
  | EmqxPostgresqlConnectorSchemaPostConnector
  | BridgeMongodbPostConnector
  | BridgeMatrixPostConnector
  | BridgeKafkaPostConnector
  | GcpPubsubProducerPostConnector
  | ConfluentPostConnector
  | BridgeAzureEventHubPostConnector

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

export type RedisPutConnectorParameters =
  | EmqxRedisRedisClusterConnector
  | EmqxRedisRedisSentinelConnector
  | EmqxRedisRedisSingleConnector

export interface RedisPutConnector {
  enable?: boolean
  description?: string
  parameters: RedisPutConnectorParameters
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type RedisPostConnectorParameters =
  | EmqxRedisRedisClusterConnector
  | EmqxRedisRedisSentinelConnector
  | EmqxRedisRedisSingleConnector

export type RedisPostConnectorType =
  typeof RedisPostConnectorType[keyof typeof RedisPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisPostConnectorType = {
  redis: 'redis',
} as const

export interface RedisPostConnector {
  type: RedisPostConnectorType
  name: string
  enable?: boolean
  description?: string
  parameters: RedisPostConnectorParameters
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type RedisGetConnectorParameters =
  | EmqxRedisRedisClusterConnector
  | EmqxRedisRedisSentinelConnector
  | EmqxRedisRedisSingleConnector

export type RedisGetConnectorType = typeof RedisGetConnectorType[keyof typeof RedisGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisGetConnectorType = {
  redis: 'redis',
} as const

export type RedisGetConnectorStatus =
  typeof RedisGetConnectorStatus[keyof typeof RedisGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface RedisGetConnector {
  status?: RedisGetConnectorStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: RedisGetConnectorType
  name: string
  enable?: boolean
  description?: string
  parameters: RedisGetConnectorParameters
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
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

export type MongoConnectorSingleWMode =
  typeof MongoConnectorSingleWMode[keyof typeof MongoConnectorSingleWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MongoConnectorSingleWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type MongoConnectorSingleMongoType =
  typeof MongoConnectorSingleMongoType[keyof typeof MongoConnectorSingleMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MongoConnectorSingleMongoType = {
  single: 'single',
} as const

export interface MongoConnectorSingle {
  mongo_type: MongoConnectorSingleMongoType
  server: string
  w_mode?: MongoConnectorSingleWMode
}

export type MongoConnectorShardedWMode =
  typeof MongoConnectorShardedWMode[keyof typeof MongoConnectorShardedWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MongoConnectorShardedWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type MongoConnectorShardedMongoType =
  typeof MongoConnectorShardedMongoType[keyof typeof MongoConnectorShardedMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MongoConnectorShardedMongoType = {
  sharded: 'sharded',
} as const

export interface MongoConnectorSharded {
  mongo_type: MongoConnectorShardedMongoType
  servers: string
  w_mode?: MongoConnectorShardedWMode
}

export type MongoConnectorRsRMode = typeof MongoConnectorRsRMode[keyof typeof MongoConnectorRsRMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MongoConnectorRsRMode = {
  master: 'master',
  slave_ok: 'slave_ok',
} as const

export type MongoConnectorRsWMode = typeof MongoConnectorRsWMode[keyof typeof MongoConnectorRsWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MongoConnectorRsWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type MongoConnectorRsMongoType =
  typeof MongoConnectorRsMongoType[keyof typeof MongoConnectorRsMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MongoConnectorRsMongoType = {
  rs: 'rs',
} as const

export interface MongoConnectorRs {
  mongo_type: MongoConnectorRsMongoType
  servers: string
  w_mode?: MongoConnectorRsWMode
  r_mode?: MongoConnectorRsRMode
  replica_set_name: string
}

export type GcpPubsubProducerPutConnectorServiceAccountJson = { [key: string]: any }

export interface GcpPubsubProducerPutConnector {
  enable?: boolean
  description?: string
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: GcpPubsubProducerPutConnectorServiceAccountJson
  resource_opts?: ResourceSchemaCreationOpts
}

export type GcpPubsubProducerPostConnectorServiceAccountJson = { [key: string]: any }

export type GcpPubsubProducerPostConnectorType =
  typeof GcpPubsubProducerPostConnectorType[keyof typeof GcpPubsubProducerPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubProducerPostConnectorType = {
  gcp_pubsub_producer: 'gcp_pubsub_producer',
} as const

export interface GcpPubsubProducerPostConnector {
  type: GcpPubsubProducerPostConnectorType
  name: string
  enable?: boolean
  description?: string
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: GcpPubsubProducerPostConnectorServiceAccountJson
  resource_opts?: ResourceSchemaCreationOpts
}

export type GcpPubsubProducerGetConnectorServiceAccountJson = { [key: string]: any }

export type GcpPubsubProducerGetConnectorStatus =
  typeof GcpPubsubProducerGetConnectorStatus[keyof typeof GcpPubsubProducerGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubProducerGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type GcpPubsubProducerGetConnectorType =
  typeof GcpPubsubProducerGetConnectorType[keyof typeof GcpPubsubProducerGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubProducerGetConnectorType = {
  gcp_pubsub_producer: 'gcp_pubsub_producer',
} as const

export interface GcpPubsubProducerGetConnector {
  type: GcpPubsubProducerGetConnectorType
  name: string
  enable?: boolean
  description?: string
  status?: GcpPubsubProducerGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: GcpPubsubProducerGetConnectorServiceAccountJson
  resource_opts?: ResourceSchemaCreationOpts
}

export type EmqxRedisRedisSingleConnectorRedisType =
  typeof EmqxRedisRedisSingleConnectorRedisType[keyof typeof EmqxRedisRedisSingleConnectorRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRedisRedisSingleConnectorRedisType = {
  single: 'single',
} as const

export interface EmqxRedisRedisSingleConnector {
  server: string
  redis_type?: EmqxRedisRedisSingleConnectorRedisType
}

export type EmqxRedisRedisSentinelConnectorRedisType =
  typeof EmqxRedisRedisSentinelConnectorRedisType[keyof typeof EmqxRedisRedisSentinelConnectorRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRedisRedisSentinelConnectorRedisType = {
  sentinel: 'sentinel',
} as const

export interface EmqxRedisRedisSentinelConnector {
  servers: string
  redis_type?: EmqxRedisRedisSentinelConnectorRedisType
  sentinel: string
}

export type EmqxRedisRedisClusterConnectorRedisType =
  typeof EmqxRedisRedisClusterConnectorRedisType[keyof typeof EmqxRedisRedisClusterConnectorRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxRedisRedisClusterConnectorRedisType = {
  cluster: 'cluster',
} as const

export interface EmqxRedisRedisClusterConnector {
  servers: string
  redis_type?: EmqxRedisRedisClusterConnectorRedisType
}

export interface EmqxPostgresqlConnectorSchemaPutConnector {
  enable?: boolean
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type EmqxPostgresqlConnectorSchemaPostConnectorType =
  typeof EmqxPostgresqlConnectorSchemaPostConnectorType[keyof typeof EmqxPostgresqlConnectorSchemaPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxPostgresqlConnectorSchemaPostConnectorType = {
  pgsql: 'pgsql',
} as const

export interface EmqxPostgresqlConnectorSchemaPostConnector {
  type: EmqxPostgresqlConnectorSchemaPostConnectorType
  name: string
  enable?: boolean
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type EmqxPostgresqlConnectorSchemaGetConnectorStatus =
  typeof EmqxPostgresqlConnectorSchemaGetConnectorStatus[keyof typeof EmqxPostgresqlConnectorSchemaGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxPostgresqlConnectorSchemaGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type EmqxPostgresqlConnectorSchemaGetConnectorType =
  typeof EmqxPostgresqlConnectorSchemaGetConnectorType[keyof typeof EmqxPostgresqlConnectorSchemaGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxPostgresqlConnectorSchemaGetConnectorType = {
  pgsql: 'pgsql',
} as const

export interface EmqxPostgresqlConnectorSchemaGetConnector {
  type: EmqxPostgresqlConnectorSchemaGetConnectorType
  name: string
  enable?: boolean
  description?: string
  status?: EmqxPostgresqlConnectorSchemaGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type EmqxBridgeSyskeeperConnectorPutAckMode =
  typeof EmqxBridgeSyskeeperConnectorPutAckMode[keyof typeof EmqxBridgeSyskeeperConnectorPutAckMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxBridgeSyskeeperConnectorPutAckMode = {
  need_ack: 'need_ack',
  no_ack: 'no_ack',
} as const

export interface EmqxBridgeSyskeeperConnectorPut {
  enable?: boolean
  description?: string
  server: string
  ack_mode?: EmqxBridgeSyskeeperConnectorPutAckMode
  ack_timeout?: string
  pool_size?: number
}

export type EmqxBridgeSyskeeperConnectorPostAckMode =
  typeof EmqxBridgeSyskeeperConnectorPostAckMode[keyof typeof EmqxBridgeSyskeeperConnectorPostAckMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxBridgeSyskeeperConnectorPostAckMode = {
  need_ack: 'need_ack',
  no_ack: 'no_ack',
} as const

export type EmqxBridgeSyskeeperConnectorPostType =
  typeof EmqxBridgeSyskeeperConnectorPostType[keyof typeof EmqxBridgeSyskeeperConnectorPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxBridgeSyskeeperConnectorPostType = {
  syskeeper_forwarder: 'syskeeper_forwarder',
} as const

export interface EmqxBridgeSyskeeperConnectorPost {
  type: EmqxBridgeSyskeeperConnectorPostType
  name: string
  enable?: boolean
  description?: string
  server: string
  ack_mode?: EmqxBridgeSyskeeperConnectorPostAckMode
  ack_timeout?: string
  pool_size?: number
}

export type EmqxBridgeSyskeeperConnectorGetAckMode =
  typeof EmqxBridgeSyskeeperConnectorGetAckMode[keyof typeof EmqxBridgeSyskeeperConnectorGetAckMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxBridgeSyskeeperConnectorGetAckMode = {
  need_ack: 'need_ack',
  no_ack: 'no_ack',
} as const

export type EmqxBridgeSyskeeperConnectorGetStatus =
  typeof EmqxBridgeSyskeeperConnectorGetStatus[keyof typeof EmqxBridgeSyskeeperConnectorGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxBridgeSyskeeperConnectorGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type EmqxBridgeSyskeeperConnectorGetType =
  typeof EmqxBridgeSyskeeperConnectorGetType[keyof typeof EmqxBridgeSyskeeperConnectorGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxBridgeSyskeeperConnectorGetType = {
  syskeeper_forwarder: 'syskeeper_forwarder',
} as const

export type ConnectorNodeStatusStatus =
  typeof ConnectorNodeStatusStatus[keyof typeof ConnectorNodeStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorNodeStatusStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface ConnectorNodeStatus {
  node?: string
  status?: ConnectorNodeStatusStatus
  status_reason?: string
}

export interface EmqxBridgeSyskeeperConnectorGet {
  type: EmqxBridgeSyskeeperConnectorGetType
  name: string
  enable?: boolean
  description?: string
  status?: EmqxBridgeSyskeeperConnectorGetStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  server: string
  ack_mode?: EmqxBridgeSyskeeperConnectorGetAckMode
  ack_timeout?: string
  pool_size?: number
}

export interface ConnectorSyskeeperProxyPut {
  enable?: boolean
  description?: string
  listen: string
  acceptors?: number
  handshake_timeout?: string
}

export type ConnectorSyskeeperProxyPostType =
  typeof ConnectorSyskeeperProxyPostType[keyof typeof ConnectorSyskeeperProxyPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorSyskeeperProxyPostType = {
  syskeeper_proxy: 'syskeeper_proxy',
} as const

export interface ConnectorSyskeeperProxyPost {
  type: ConnectorSyskeeperProxyPostType
  name: string
  enable?: boolean
  description?: string
  listen: string
  acceptors?: number
  handshake_timeout?: string
}

export type ConnectorSyskeeperProxyGetStatus =
  typeof ConnectorSyskeeperProxyGetStatus[keyof typeof ConnectorSyskeeperProxyGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorSyskeeperProxyGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type ConnectorSyskeeperProxyGetType =
  typeof ConnectorSyskeeperProxyGetType[keyof typeof ConnectorSyskeeperProxyGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorSyskeeperProxyGetType = {
  syskeeper_proxy: 'syskeeper_proxy',
} as const

export interface ConnectorSyskeeperProxyGet {
  type: ConnectorSyskeeperProxyGetType
  name: string
  enable?: boolean
  description?: string
  status?: ConnectorSyskeeperProxyGetStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  listen: string
  acceptors?: number
  handshake_timeout?: string
}

export type ConfluentSslClientOptsServerNameIndication = string | 'disable' | 'auto'

export type ConfluentSslClientOptsLogLevel =
  typeof ConfluentSslClientOptsLogLevel[keyof typeof ConfluentSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentSslClientOptsLogLevel = {
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

export interface ConfluentSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: ConfluentSslClientOptsLogLevel
  hibernate_after?: string
  server_name_indication?: ConfluentSslClientOptsServerNameIndication
}

export interface ConfluentPutConnector {
  enable?: boolean
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: ConfluentAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: ConfluentSslClientOpts
}

export type ConfluentPostConnectorType =
  typeof ConfluentPostConnectorType[keyof typeof ConfluentPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentPostConnectorType = {
  confluent_producer: 'confluent_producer',
} as const

export interface ConfluentPostConnector {
  type: ConfluentPostConnectorType
  name: string
  enable?: boolean
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: ConfluentAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: ConfluentSslClientOpts
}

export type ConfluentGetConnectorStatus =
  typeof ConfluentGetConnectorStatus[keyof typeof ConfluentGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type ConfluentGetConnectorType =
  typeof ConfluentGetConnectorType[keyof typeof ConfluentGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentGetConnectorType = {
  confluent_producer: 'confluent_producer',
} as const

export interface ConfluentAuthUsernamePassword {
  username: string
  password: string
}

export interface ConfluentGetConnector {
  type: ConfluentGetConnectorType
  name: string
  enable?: boolean
  description?: string
  status?: ConfluentGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: ConfluentAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: ConfluentSslClientOpts
}

export type BrokerSslClientOptsServerNameIndication = string | 'disable'

export type BrokerSslClientOptsLogLevel =
  typeof BrokerSslClientOptsLogLevel[keyof typeof BrokerSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerSslClientOptsLogLevel = {
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

export type BrokerSslClientOptsVerify =
  typeof BrokerSslClientOptsVerify[keyof typeof BrokerSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface BrokerSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: BrokerSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: BrokerSslClientOptsLogLevel
  hibernate_after?: string
  enable?: boolean
  server_name_indication?: BrokerSslClientOptsServerNameIndication
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

export interface BridgeTimescalePutConnector {
  enable?: boolean
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type BridgeTimescalePostConnectorType =
  typeof BridgeTimescalePostConnectorType[keyof typeof BridgeTimescalePostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTimescalePostConnectorType = {
  timescale: 'timescale',
} as const

export interface BridgeTimescalePostConnector {
  type: BridgeTimescalePostConnectorType
  name: string
  enable?: boolean
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type BridgeTimescaleGetConnectorStatus =
  typeof BridgeTimescaleGetConnectorStatus[keyof typeof BridgeTimescaleGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTimescaleGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeTimescaleGetConnectorType =
  typeof BridgeTimescaleGetConnectorType[keyof typeof BridgeTimescaleGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTimescaleGetConnectorType = {
  timescale: 'timescale',
} as const

export interface BridgeTimescaleGetConnector {
  type: BridgeTimescaleGetConnectorType
  name: string
  enable?: boolean
  description?: string
  status?: BridgeTimescaleGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type BridgeMongodbPutConnectorUseLegacyProtocol =
  typeof BridgeMongodbPutConnectorUseLegacyProtocol[keyof typeof BridgeMongodbPutConnectorUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPutConnectorUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbPutConnectorParameters =
  | MongoConnectorRs
  | MongoConnectorSharded
  | MongoConnectorSingle

export interface BridgeMongodbPutConnector {
  enable?: boolean
  description?: string
  parameters: BridgeMongodbPutConnectorParameters
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbPutConnectorUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: BrokerSslClientOpts
}

export type BridgeMongodbPostConnectorUseLegacyProtocol =
  typeof BridgeMongodbPostConnectorUseLegacyProtocol[keyof typeof BridgeMongodbPostConnectorUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostConnectorUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbPostConnectorParameters =
  | MongoConnectorRs
  | MongoConnectorSharded
  | MongoConnectorSingle

export type BridgeMongodbPostConnectorType =
  typeof BridgeMongodbPostConnectorType[keyof typeof BridgeMongodbPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostConnectorType = {
  mongodb: 'mongodb',
} as const

export interface BridgeMongodbPostConnector {
  type: BridgeMongodbPostConnectorType
  name: string
  enable?: boolean
  description?: string
  parameters: BridgeMongodbPostConnectorParameters
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbPostConnectorUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: BrokerSslClientOpts
}

export type BridgeMongodbGetConnectorUseLegacyProtocol =
  typeof BridgeMongodbGetConnectorUseLegacyProtocol[keyof typeof BridgeMongodbGetConnectorUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetConnectorUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type BridgeMongodbGetConnectorParameters =
  | MongoConnectorRs
  | MongoConnectorSharded
  | MongoConnectorSingle

export type BridgeMongodbGetConnectorStatus =
  typeof BridgeMongodbGetConnectorStatus[keyof typeof BridgeMongodbGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMongodbGetConnectorType =
  typeof BridgeMongodbGetConnectorType[keyof typeof BridgeMongodbGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetConnectorType = {
  mongodb: 'mongodb',
} as const

export interface BridgeMongodbGetConnector {
  type: BridgeMongodbGetConnectorType
  name: string
  enable?: boolean
  description?: string
  status?: BridgeMongodbGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  parameters: BridgeMongodbGetConnectorParameters
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: BridgeMongodbGetConnectorUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: BrokerSslClientOpts
}

export interface BridgeMatrixPutConnector {
  enable?: boolean
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type BridgeMatrixPostConnectorType =
  typeof BridgeMatrixPostConnectorType[keyof typeof BridgeMatrixPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMatrixPostConnectorType = {
  matrix: 'matrix',
} as const

export interface BridgeMatrixPostConnector {
  type: BridgeMatrixPostConnectorType
  name: string
  enable?: boolean
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type BridgeMatrixGetConnectorStatus =
  typeof BridgeMatrixGetConnectorStatus[keyof typeof BridgeMatrixGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMatrixGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMatrixGetConnectorType =
  typeof BridgeMatrixGetConnectorType[keyof typeof BridgeMatrixGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMatrixGetConnectorType = {
  matrix: 'matrix',
} as const

export interface BridgeMatrixGetConnector {
  type: BridgeMatrixGetConnectorType
  name: string
  enable?: boolean
  description?: string
  status?: BridgeMatrixGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type BridgeKafkaSslClientOptsServerNameIndication = string | 'disable' | 'auto'

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
  enable?: boolean
  server_name_indication?: BridgeKafkaSslClientOptsServerNameIndication
}

export interface BridgeKafkaSocketOpts {
  sndbuf?: string
  recbuf?: string
  nodelay?: boolean
  tcp_keepalive?: string
}

export type BridgeKafkaPutConnectorAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export interface BridgeKafkaPutConnector {
  enable?: boolean
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaPutConnectorAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
}

export type BridgeKafkaPostConnectorType =
  typeof BridgeKafkaPostConnectorType[keyof typeof BridgeKafkaPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPostConnectorType = {
  kafka_producer: 'kafka_producer',
} as const

export interface BridgeKafkaPostConnector {
  type: BridgeKafkaPostConnectorType
  name: string
  enable?: boolean
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaPostConnectorAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
}

export type BridgeKafkaGetConnectorStatus =
  typeof BridgeKafkaGetConnectorStatus[keyof typeof BridgeKafkaGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeKafkaGetConnectorType =
  typeof BridgeKafkaGetConnectorType[keyof typeof BridgeKafkaGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetConnectorType = {
  kafka_producer: 'kafka_producer',
} as const

export interface BridgeKafkaGetConnector {
  type: BridgeKafkaGetConnectorType
  name: string
  enable?: boolean
  description?: string
  status?: BridgeKafkaGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaGetConnectorAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
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

export type BridgeKafkaPostConnectorAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export type BridgeKafkaGetConnectorAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export type BridgeAzureEventHubSslClientOptsServerNameIndication = string | 'disable' | 'auto'

export type BridgeAzureEventHubSslClientOptsEnable =
  typeof BridgeAzureEventHubSslClientOptsEnable[keyof typeof BridgeAzureEventHubSslClientOptsEnable]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubSslClientOptsEnable = {
  true: 'true',
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
  enable?: BridgeAzureEventHubSslClientOptsEnable
  server_name_indication?: BridgeAzureEventHubSslClientOptsServerNameIndication
}

export interface BridgeAzureEventHubPutConnector {
  enable?: boolean
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: BridgeAzureEventHubAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: BridgeAzureEventHubSslClientOpts
}

export type BridgeAzureEventHubPostConnectorType =
  typeof BridgeAzureEventHubPostConnectorType[keyof typeof BridgeAzureEventHubPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubPostConnectorType = {
  azure_event_hub_producer: 'azure_event_hub_producer',
} as const

export interface BridgeAzureEventHubPostConnector {
  type: BridgeAzureEventHubPostConnectorType
  name: string
  enable?: boolean
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: BridgeAzureEventHubAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: BridgeAzureEventHubSslClientOpts
}

export type BridgeAzureEventHubGetConnectorStatus =
  typeof BridgeAzureEventHubGetConnectorStatus[keyof typeof BridgeAzureEventHubGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeAzureEventHubGetConnectorType =
  typeof BridgeAzureEventHubGetConnectorType[keyof typeof BridgeAzureEventHubGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetConnectorType = {
  azure_event_hub_producer: 'azure_event_hub_producer',
} as const

export interface BridgeAzureEventHubAuthUsernamePassword {
  password: string
}

export interface BridgeAzureEventHubGetConnector {
  type: BridgeAzureEventHubGetConnectorType
  name: string
  enable?: boolean
  description?: string
  status?: BridgeAzureEventHubGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: BridgeAzureEventHubAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: BridgeAzureEventHubSslClientOpts
}
