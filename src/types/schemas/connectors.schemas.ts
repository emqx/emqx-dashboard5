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
  | SyskeeperForwarderGet
  | RedisGetConnector
  | ConnectorPostgresGetConnector
  | BridgeMysqlGetConnector
  | ConnectorMqttGetConnector
  | BridgeMongodbGetConnector
  | BridgeMatrixGetConnector
  | BridgeKafkaGetConnector
  | IotdbGet
  | BridgeInfluxdbGetConnector
  | BridgeHttpGetConnector
  | GcpPubsubProducerGetConnector
  | ElasticsearchGet
  | ConfluentGetConnector
  | BridgeAzureEventHubGetConnector

export type PostConnectorsBody =
  | BridgeTimescalePostConnector
  | ConnectorSyskeeperProxyPost
  | SyskeeperForwarderPost
  | RedisPostConnector
  | ConnectorPostgresPostConnector
  | BridgeMysqlPostConnector
  | ConnectorMqttPostConnector
  | BridgeMongodbPostConnector
  | BridgeMatrixPostConnector
  | BridgeKafkaPostConnector
  | IotdbPost
  | BridgeInfluxdbPostConnector
  | BridgeHttpPostConnector
  | GcpPubsubProducerPostConnector
  | ElasticsearchPost
  | ConfluentPostConnector
  | BridgeAzureEventHubPostConnector

export type GetConnectors200Item =
  | BridgeTimescaleGetConnector
  | ConnectorSyskeeperProxyGet
  | SyskeeperForwarderGet
  | RedisGetConnector
  | ConnectorPostgresGetConnector
  | BridgeMysqlGetConnector
  | ConnectorMqttGetConnector
  | BridgeMongodbGetConnector
  | BridgeMatrixGetConnector
  | BridgeKafkaGetConnector
  | IotdbGet
  | BridgeInfluxdbGetConnector
  | BridgeHttpGetConnector
  | GcpPubsubProducerGetConnector
  | ElasticsearchGet
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
  | SyskeeperForwarderGet
  | RedisGetConnector
  | ConnectorPostgresGetConnector
  | BridgeMysqlGetConnector
  | ConnectorMqttGetConnector
  | BridgeMongodbGetConnector
  | BridgeMatrixGetConnector
  | BridgeKafkaGetConnector
  | IotdbGet
  | BridgeInfluxdbGetConnector
  | BridgeHttpGetConnector
  | GcpPubsubProducerGetConnector
  | ElasticsearchGet
  | ConfluentGetConnector
  | BridgeAzureEventHubGetConnector

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
  | SyskeeperForwarderGet
  | RedisGetConnector
  | ConnectorPostgresGetConnector
  | BridgeMysqlGetConnector
  | ConnectorMqttGetConnector
  | BridgeMongodbGetConnector
  | BridgeMatrixGetConnector
  | BridgeKafkaGetConnector
  | IotdbGet
  | BridgeInfluxdbGetConnector
  | BridgeHttpGetConnector
  | GcpPubsubProducerGetConnector
  | ElasticsearchGet
  | ConfluentGetConnector
  | BridgeAzureEventHubGetConnector

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

export type SyskeeperForwarderPutAckMode =
  typeof SyskeeperForwarderPutAckMode[keyof typeof SyskeeperForwarderPutAckMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperForwarderPutAckMode = {
  need_ack: 'need_ack',
  no_ack: 'no_ack',
} as const

export interface SyskeeperForwarderPut {
  enable?: boolean
  tags?: string[]
  description?: string
  server: string
  ack_mode?: SyskeeperForwarderPutAckMode
  ack_timeout?: string
  pool_size?: number
  resource_opts?: SyskeeperForwarderConnectorResourceOpts
}

export type PutConnectorsIdBody =
  | BridgeTimescalePutConnector
  | ConnectorSyskeeperProxyPut
  | SyskeeperForwarderPut
  | RedisPutConnector
  | ConnectorPostgresPutConnector
  | BridgeMysqlPutConnector
  | ConnectorMqttPutConnector
  | BridgeMongodbPutConnector
  | BridgeMatrixPutConnector
  | BridgeKafkaPutConnector
  | IotdbPut
  | BridgeInfluxdbPutConnector
  | BridgeHttpPutConnector
  | GcpPubsubProducerPutConnector
  | ElasticsearchPut
  | ConfluentPutConnector
  | BridgeAzureEventHubPutConnector

export type SyskeeperForwarderPostAckMode =
  typeof SyskeeperForwarderPostAckMode[keyof typeof SyskeeperForwarderPostAckMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperForwarderPostAckMode = {
  need_ack: 'need_ack',
  no_ack: 'no_ack',
} as const

export type SyskeeperForwarderPostType =
  typeof SyskeeperForwarderPostType[keyof typeof SyskeeperForwarderPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperForwarderPostType = {
  syskeeper_forwarder: 'syskeeper_forwarder',
} as const

export interface SyskeeperForwarderPost {
  type: SyskeeperForwarderPostType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  server: string
  ack_mode?: SyskeeperForwarderPostAckMode
  ack_timeout?: string
  pool_size?: number
  resource_opts?: SyskeeperForwarderConnectorResourceOpts
}

export type PostConnectorsProbeBody =
  | BridgeTimescalePostConnector
  | ConnectorSyskeeperProxyPost
  | SyskeeperForwarderPost
  | RedisPostConnector
  | ConnectorPostgresPostConnector
  | BridgeMysqlPostConnector
  | ConnectorMqttPostConnector
  | BridgeMongodbPostConnector
  | BridgeMatrixPostConnector
  | BridgeKafkaPostConnector
  | IotdbPost
  | BridgeInfluxdbPostConnector
  | BridgeHttpPostConnector
  | GcpPubsubProducerPostConnector
  | ElasticsearchPost
  | ConfluentPostConnector
  | BridgeAzureEventHubPostConnector

export type SyskeeperForwarderGetAckMode =
  typeof SyskeeperForwarderGetAckMode[keyof typeof SyskeeperForwarderGetAckMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperForwarderGetAckMode = {
  need_ack: 'need_ack',
  no_ack: 'no_ack',
} as const

export type SyskeeperForwarderGetStatus =
  typeof SyskeeperForwarderGetStatus[keyof typeof SyskeeperForwarderGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperForwarderGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type SyskeeperForwarderGetType =
  typeof SyskeeperForwarderGetType[keyof typeof SyskeeperForwarderGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperForwarderGetType = {
  syskeeper_forwarder: 'syskeeper_forwarder',
} as const

export interface SyskeeperForwarderConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface SyskeeperForwarderGet {
  type: SyskeeperForwarderGetType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  status?: SyskeeperForwarderGetStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  server: string
  ack_mode?: SyskeeperForwarderGetAckMode
  ack_timeout?: string
  pool_size?: number
  resource_opts?: SyskeeperForwarderConnectorResourceOpts
}

export type RedisRedisSingleConnectorRedisType =
  typeof RedisRedisSingleConnectorRedisType[keyof typeof RedisRedisSingleConnectorRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisRedisSingleConnectorRedisType = {
  single: 'single',
} as const

export interface RedisRedisSingleConnector {
  server: string
  redis_type?: RedisRedisSingleConnectorRedisType
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
}

export type RedisRedisSentinelConnectorRedisType =
  typeof RedisRedisSentinelConnectorRedisType[keyof typeof RedisRedisSentinelConnectorRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisRedisSentinelConnectorRedisType = {
  sentinel: 'sentinel',
} as const

export interface RedisRedisSentinelConnector {
  servers: string
  redis_type?: RedisRedisSentinelConnectorRedisType
  sentinel: string
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
}

export type RedisRedisClusterConnectorRedisType =
  typeof RedisRedisClusterConnectorRedisType[keyof typeof RedisRedisClusterConnectorRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisRedisClusterConnectorRedisType = {
  cluster: 'cluster',
} as const

export interface RedisRedisClusterConnector {
  servers: string
  redis_type?: RedisRedisClusterConnectorRedisType
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
}

export type RedisPutConnectorParameters =
  | RedisRedisClusterConnector
  | RedisRedisSentinelConnector
  | RedisRedisSingleConnector

export type RedisPostConnectorParameters =
  | RedisRedisClusterConnector
  | RedisRedisSentinelConnector
  | RedisRedisSingleConnector

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
  tags?: string[]
  description?: string
  parameters: RedisPostConnectorParameters
  resource_opts?: RedisConnectorResourceOpts
  ssl?: BrokerSslClientOpts
}

export type RedisGetConnectorParameters =
  | RedisRedisClusterConnector
  | RedisRedisSentinelConnector
  | RedisRedisSingleConnector

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

export interface RedisConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface RedisPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  parameters: RedisPutConnectorParameters
  resource_opts?: RedisConnectorResourceOpts
  ssl?: BrokerSslClientOpts
}

export interface RedisGetConnector {
  status?: RedisGetConnectorStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: RedisGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  parameters: RedisGetConnectorParameters
  resource_opts?: RedisConnectorResourceOpts
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

export type IotdbPutIotdbVersion = typeof IotdbPutIotdbVersion[keyof typeof IotdbPutIotdbVersion]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbPutIotdbVersion = {
  v11x: 'v1.1.x',
  v10x: 'v1.0.x',
  v013x: 'v0.13.x',
} as const

export type IotdbPutPoolType = typeof IotdbPutPoolType[keyof typeof IotdbPutPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbPutPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type IotdbPostIotdbVersion = typeof IotdbPostIotdbVersion[keyof typeof IotdbPostIotdbVersion]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbPostIotdbVersion = {
  v11x: 'v1.1.x',
  v10x: 'v1.0.x',
  v013x: 'v0.13.x',
} as const

export type IotdbPostPoolType = typeof IotdbPostPoolType[keyof typeof IotdbPostPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbPostPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type IotdbPostType = typeof IotdbPostType[keyof typeof IotdbPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbPostType = {
  iotdb: 'iotdb',
} as const

export interface IotdbPost {
  type: IotdbPostType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  pool_type?: IotdbPostPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
  base_url: string
  iotdb_version?: IotdbPostIotdbVersion
  authentication?: IotdbAuthBasic
}

export type IotdbGetIotdbVersion = typeof IotdbGetIotdbVersion[keyof typeof IotdbGetIotdbVersion]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbGetIotdbVersion = {
  v11x: 'v1.1.x',
  v10x: 'v1.0.x',
  v013x: 'v0.13.x',
} as const

export type IotdbGetPoolType = typeof IotdbGetPoolType[keyof typeof IotdbGetPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbGetPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type IotdbGetType = typeof IotdbGetType[keyof typeof IotdbGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbGetType = {
  iotdb: 'iotdb',
} as const

export type IotdbGetStatus = typeof IotdbGetStatus[keyof typeof IotdbGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IotdbGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface IotdbAuthBasic {
  username: string
  password: string
}

export interface IotdbPut {
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  pool_type?: IotdbPutPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
  base_url: string
  iotdb_version?: IotdbPutIotdbVersion
  authentication?: IotdbAuthBasic
}

export interface IotdbGet {
  status?: IotdbGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: IotdbGetType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  pool_type?: IotdbGetPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
  base_url: string
  iotdb_version?: IotdbGetIotdbVersion
  authentication?: IotdbAuthBasic
}

export type GcpPubsubProducerPutConnectorServiceAccountJson = { [key: string]: any }

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
  tags?: string[]
  description?: string
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: GcpPubsubProducerPostConnectorServiceAccountJson
  resource_opts?: GcpPubsubProducerConnectorResourceOpts
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

export interface GcpPubsubProducerConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface GcpPubsubProducerPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  pool_size?: number
  pipelining?: number
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
  service_account_json: GcpPubsubProducerPutConnectorServiceAccountJson
  resource_opts?: GcpPubsubProducerConnectorResourceOpts
}

export interface GcpPubsubProducerGetConnector {
  type: GcpPubsubProducerGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
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
  resource_opts?: GcpPubsubProducerConnectorResourceOpts
}

export type ElasticsearchPutPoolType =
  typeof ElasticsearchPutPoolType[keyof typeof ElasticsearchPutPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ElasticsearchPutPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export interface ElasticsearchPut {
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  pool_type?: ElasticsearchPutPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
  base_url: string
  authentication?: ElasticsearchAuthBasic
}

export type ElasticsearchPostPoolType =
  typeof ElasticsearchPostPoolType[keyof typeof ElasticsearchPostPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ElasticsearchPostPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type ElasticsearchPostType = typeof ElasticsearchPostType[keyof typeof ElasticsearchPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ElasticsearchPostType = {
  elasticsearch: 'elasticsearch',
} as const

export interface ElasticsearchPost {
  type: ElasticsearchPostType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  pool_type?: ElasticsearchPostPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
  base_url: string
  authentication?: ElasticsearchAuthBasic
}

export type ElasticsearchGetPoolType =
  typeof ElasticsearchGetPoolType[keyof typeof ElasticsearchGetPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ElasticsearchGetPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type ElasticsearchGetType = typeof ElasticsearchGetType[keyof typeof ElasticsearchGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ElasticsearchGetType = {
  elasticsearch: 'elasticsearch',
} as const

export type ElasticsearchGetStatus =
  typeof ElasticsearchGetStatus[keyof typeof ElasticsearchGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ElasticsearchGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface ElasticsearchAuthBasic {
  username: string
  password: string
}

export interface ElasticsearchGet {
  status?: ElasticsearchGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: ElasticsearchGetType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  connect_timeout?: string
  pool_type?: ElasticsearchGetPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
  base_url: string
  authentication?: ElasticsearchAuthBasic
}

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

export interface ConnectorSyskeeperProxyPut {
  enable?: boolean
  tags?: string[]
  description?: string
  listen: string
  acceptors?: number
  handshake_timeout?: string
  resource_opts?: ConnectorSyskeeperProxyConnectorResourceOpts
}

export type ConnectorSyskeeperProxyPostType =
  typeof ConnectorSyskeeperProxyPostType[keyof typeof ConnectorSyskeeperProxyPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorSyskeeperProxyPostType = {
  syskeeper_proxy: 'syskeeper_proxy',
} as const

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

export interface ConnectorSyskeeperProxyConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface ConnectorSyskeeperProxyPost {
  type: ConnectorSyskeeperProxyPostType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  listen: string
  acceptors?: number
  handshake_timeout?: string
  resource_opts?: ConnectorSyskeeperProxyConnectorResourceOpts
}

export interface ConnectorSyskeeperProxyGet {
  type: ConnectorSyskeeperProxyGetType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  status?: ConnectorSyskeeperProxyGetStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  listen: string
  acceptors?: number
  handshake_timeout?: string
  resource_opts?: ConnectorSyskeeperProxyConnectorResourceOpts
}

export interface ConnectorPostgresResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface ConnectorPostgresPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: ConnectorPostgresResourceOpts
}

export type ConnectorPostgresPostConnectorType =
  typeof ConnectorPostgresPostConnectorType[keyof typeof ConnectorPostgresPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorPostgresPostConnectorType = {
  pgsql: 'pgsql',
} as const

export interface ConnectorPostgresPostConnector {
  type: ConnectorPostgresPostConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: ConnectorPostgresResourceOpts
}

export type ConnectorPostgresGetConnectorStatus =
  typeof ConnectorPostgresGetConnectorStatus[keyof typeof ConnectorPostgresGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorPostgresGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type ConnectorPostgresGetConnectorType =
  typeof ConnectorPostgresGetConnectorType[keyof typeof ConnectorPostgresGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorPostgresGetConnectorType = {
  pgsql: 'pgsql',
} as const

export interface ConnectorPostgresGetConnector {
  type: ConnectorPostgresGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  status?: ConnectorPostgresGetConnectorStatus
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
  resource_opts?: ConnectorPostgresResourceOpts
}

export interface ConnectorMqttResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export type ConnectorMqttPutConnectorProtoVer =
  typeof ConnectorMqttPutConnectorProtoVer[keyof typeof ConnectorMqttPutConnectorProtoVer]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttPutConnectorProtoVer = {
  v3: 'v3',
  v4: 'v4',
  v5: 'v5',
} as const

/**
 * @deprecated
 */
export type ConnectorMqttPutConnectorMode =
  typeof ConnectorMqttPutConnectorMode[keyof typeof ConnectorMqttPutConnectorMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttPutConnectorMode = {
  cluster_shareload: 'cluster_shareload',
} as const

export type ConnectorMqttPostConnectorProtoVer =
  typeof ConnectorMqttPostConnectorProtoVer[keyof typeof ConnectorMqttPostConnectorProtoVer]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttPostConnectorProtoVer = {
  v3: 'v3',
  v4: 'v4',
  v5: 'v5',
} as const

/**
 * @deprecated
 */
export type ConnectorMqttPostConnectorMode =
  typeof ConnectorMqttPostConnectorMode[keyof typeof ConnectorMqttPostConnectorMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttPostConnectorMode = {
  cluster_shareload: 'cluster_shareload',
} as const

export type ConnectorMqttPostConnectorType =
  typeof ConnectorMqttPostConnectorType[keyof typeof ConnectorMqttPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttPostConnectorType = {
  mqtt: 'mqtt',
} as const

export interface ConnectorMqttPostConnector {
  type: ConnectorMqttPostConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  pool_size?: number
  resource_opts?: ConnectorMqttResourceOpts
  /** @deprecated */
  mode?: ConnectorMqttPostConnectorMode
  server: string
  clientid_prefix?: string
  /** @deprecated */
  reconnect_interval?: string
  proto_ver?: ConnectorMqttPostConnectorProtoVer
  bridge_mode?: boolean
  username?: string
  password?: string
  clean_start?: boolean
  keepalive?: string
  retry_interval?: string
  max_inflight?: number
  ssl?: EmqxSslClientOpts
}

export type ConnectorMqttGetConnectorProtoVer =
  typeof ConnectorMqttGetConnectorProtoVer[keyof typeof ConnectorMqttGetConnectorProtoVer]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttGetConnectorProtoVer = {
  v3: 'v3',
  v4: 'v4',
  v5: 'v5',
} as const

/**
 * @deprecated
 */
export type ConnectorMqttGetConnectorMode =
  typeof ConnectorMqttGetConnectorMode[keyof typeof ConnectorMqttGetConnectorMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttGetConnectorMode = {
  cluster_shareload: 'cluster_shareload',
} as const

export type ConnectorMqttGetConnectorStatus =
  typeof ConnectorMqttGetConnectorStatus[keyof typeof ConnectorMqttGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type ConnectorMqttGetConnectorType =
  typeof ConnectorMqttGetConnectorType[keyof typeof ConnectorMqttGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorMqttGetConnectorType = {
  mqtt: 'mqtt',
} as const

export interface ConnectorMqttGetConnector {
  type: ConnectorMqttGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  status?: ConnectorMqttGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  pool_size?: number
  resource_opts?: ConnectorMqttResourceOpts
  /** @deprecated */
  mode?: ConnectorMqttGetConnectorMode
  server: string
  clientid_prefix?: string
  /** @deprecated */
  reconnect_interval?: string
  proto_ver?: ConnectorMqttGetConnectorProtoVer
  bridge_mode?: boolean
  username?: string
  password?: string
  clean_start?: boolean
  keepalive?: string
  retry_interval?: string
  max_inflight?: number
  ssl?: BrokerSslClientOpts
}

export type ConnectorInfluxdbConnectorInfluxdbApiV2InfluxdbType =
  typeof ConnectorInfluxdbConnectorInfluxdbApiV2InfluxdbType[keyof typeof ConnectorInfluxdbConnectorInfluxdbApiV2InfluxdbType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorInfluxdbConnectorInfluxdbApiV2InfluxdbType = {
  influxdb_api_v2: 'influxdb_api_v2',
} as const

export interface ConnectorInfluxdbConnectorInfluxdbApiV2 {
  influxdb_type: ConnectorInfluxdbConnectorInfluxdbApiV2InfluxdbType
  bucket: string
  org: string
  token: string
}

export type ConnectorInfluxdbConnectorInfluxdbApiV1InfluxdbType =
  typeof ConnectorInfluxdbConnectorInfluxdbApiV1InfluxdbType[keyof typeof ConnectorInfluxdbConnectorInfluxdbApiV1InfluxdbType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorInfluxdbConnectorInfluxdbApiV1InfluxdbType = {
  influxdb_api_v1: 'influxdb_api_v1',
} as const

export interface ConnectorInfluxdbConnectorInfluxdbApiV1 {
  influxdb_type: ConnectorInfluxdbConnectorInfluxdbApiV1InfluxdbType
  database: string
  username?: string
  password?: string
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
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: ConfluentAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: ConfluentSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
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

export interface ConfluentPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: ConfluentAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: ConfluentSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
}

export interface ConfluentGetConnector {
  type: ConfluentGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
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
  resource_opts?: BridgeKafkaConnectorResourceOpts
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

export interface ConnectorMqttPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  pool_size?: number
  resource_opts?: ConnectorMqttResourceOpts
  /** @deprecated */
  mode?: ConnectorMqttPutConnectorMode
  server: string
  clientid_prefix?: string
  /** @deprecated */
  reconnect_interval?: string
  proto_ver?: ConnectorMqttPutConnectorProtoVer
  bridge_mode?: boolean
  username?: string
  password?: string
  clean_start?: boolean
  keepalive?: string
  retry_interval?: string
  max_inflight?: number
  ssl?: BrokerSslClientOpts
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
  tags?: string[]
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: ConnectorPostgresResourceOpts
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
  tags?: string[]
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: ConnectorPostgresResourceOpts
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
  tags?: string[]
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
  resource_opts?: ConnectorPostgresResourceOpts
}

export type BridgeMysqlPostConnectorType =
  typeof BridgeMysqlPostConnectorType[keyof typeof BridgeMysqlPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlPostConnectorType = {
  mysql: 'mysql',
} as const

export interface BridgeMysqlPostConnector {
  type: BridgeMysqlPostConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeMysqlConnectorResourceOpts
}

export type BridgeMysqlGetConnectorStatus =
  typeof BridgeMysqlGetConnectorStatus[keyof typeof BridgeMysqlGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMysqlGetConnectorType =
  typeof BridgeMysqlGetConnectorType[keyof typeof BridgeMysqlGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlGetConnectorType = {
  mysql: 'mysql',
} as const

export interface BridgeMysqlConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface BridgeMysqlPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeMysqlConnectorResourceOpts
}

export interface BridgeMysqlGetConnector {
  type: BridgeMysqlGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  status?: BridgeMysqlGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeMysqlConnectorResourceOpts
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
  tags?: string[]
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
  resource_opts?: BridgeMongodbConnectorResourceOpts
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
  tags?: string[]
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
  resource_opts?: BridgeMongodbConnectorResourceOpts
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

export interface BridgeMongodbConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface BridgeMongodbGetConnector {
  type: BridgeMongodbGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
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
  resource_opts?: BridgeMongodbConnectorResourceOpts
}

export interface BridgeMatrixPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: ConnectorPostgresResourceOpts
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
  tags?: string[]
  description?: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  resource_opts?: ConnectorPostgresResourceOpts
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
  tags?: string[]
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
  resource_opts?: ConnectorPostgresResourceOpts
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

export type BridgeKafkaPostConnectorAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

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
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaPostConnectorAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
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

export interface BridgeKafkaConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface BridgeKafkaPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication?: BridgeKafkaPutConnectorAuthentication
  socket_opts?: BridgeKafkaSocketOpts
  ssl?: BridgeKafkaSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
}

export interface BridgeKafkaGetConnector {
  type: BridgeKafkaGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
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
  resource_opts?: BridgeKafkaConnectorResourceOpts
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

export type BridgeKafkaGetConnectorAuthentication =
  | BridgeKafkaAuthGssapiKerberos
  | BridgeKafkaAuthUsernamePassword
  | 'none'

export type BridgeInfluxdbPutConnectorParameters =
  | ConnectorInfluxdbConnectorInfluxdbApiV2
  | ConnectorInfluxdbConnectorInfluxdbApiV1

export interface BridgeInfluxdbPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  server?: string
  parameters: BridgeInfluxdbPutConnectorParameters
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeInfluxdbConnectorResourceOpts
}

export type BridgeInfluxdbPostConnectorParameters =
  | ConnectorInfluxdbConnectorInfluxdbApiV2
  | ConnectorInfluxdbConnectorInfluxdbApiV1

export type BridgeInfluxdbPostConnectorType =
  typeof BridgeInfluxdbPostConnectorType[keyof typeof BridgeInfluxdbPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPostConnectorType = {
  influxdb: 'influxdb',
} as const

export interface BridgeInfluxdbPostConnector {
  type: BridgeInfluxdbPostConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  server?: string
  parameters: BridgeInfluxdbPostConnectorParameters
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeInfluxdbConnectorResourceOpts
}

export type BridgeInfluxdbGetConnectorParameters =
  | ConnectorInfluxdbConnectorInfluxdbApiV2
  | ConnectorInfluxdbConnectorInfluxdbApiV1

export type BridgeInfluxdbGetConnectorStatus =
  typeof BridgeInfluxdbGetConnectorStatus[keyof typeof BridgeInfluxdbGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeInfluxdbGetConnectorType =
  typeof BridgeInfluxdbGetConnectorType[keyof typeof BridgeInfluxdbGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetConnectorType = {
  influxdb: 'influxdb',
} as const

export interface BridgeInfluxdbConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface BridgeInfluxdbGetConnector {
  type: BridgeInfluxdbGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  status?: BridgeInfluxdbGetConnectorStatus
  status_reason?: string
  node_status?: ConnectorNodeStatus[]
  actions?: string[]
  server?: string
  parameters: BridgeInfluxdbGetConnectorParameters
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeInfluxdbConnectorResourceOpts
}

/**
 * @deprecated
 */
export type BridgeHttpPutConnectorRequest = { [key: string]: any }

export type BridgeHttpPutConnectorPoolType =
  typeof BridgeHttpPutConnectorPoolType[keyof typeof BridgeHttpPutConnectorPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPutConnectorPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeHttpPutConnectorHeaders = { [key: string]: any }

/**
 * @deprecated
 */
export type BridgeHttpPostConnectorRequest = { [key: string]: any }

export type BridgeHttpPostConnectorPoolType =
  typeof BridgeHttpPostConnectorPoolType[keyof typeof BridgeHttpPostConnectorPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostConnectorPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeHttpPostConnectorHeaders = { [key: string]: any }

export type BridgeHttpPostConnectorType =
  typeof BridgeHttpPostConnectorType[keyof typeof BridgeHttpPostConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostConnectorType = {
  http: 'http',
} as const

export interface BridgeHttpPostConnector {
  type: BridgeHttpPostConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  url: string
  headers?: BridgeHttpPostConnectorHeaders
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeHttpPostConnectorPoolType
  pool_size?: number
  enable_pipelining?: number
  /** @deprecated */
  request?: BridgeHttpPostConnectorRequest
  ssl?: EmqxSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
}

/**
 * @deprecated
 */
export type BridgeHttpGetConnectorRequest = { [key: string]: any }

export type BridgeHttpGetConnectorPoolType =
  typeof BridgeHttpGetConnectorPoolType[keyof typeof BridgeHttpGetConnectorPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetConnectorPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeHttpGetConnectorHeaders = { [key: string]: any }

export type BridgeHttpGetConnectorType =
  typeof BridgeHttpGetConnectorType[keyof typeof BridgeHttpGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetConnectorType = {
  http: 'http',
} as const

export type BridgeHttpGetConnectorStatus =
  typeof BridgeHttpGetConnectorStatus[keyof typeof BridgeHttpGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeHttpConnectorResourceOpts {
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
}

export interface BridgeHttpPutConnector {
  enable?: boolean
  tags?: string[]
  description?: string
  url: string
  headers?: BridgeHttpPutConnectorHeaders
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeHttpPutConnectorPoolType
  pool_size?: number
  enable_pipelining?: number
  /** @deprecated */
  request?: BridgeHttpPutConnectorRequest
  ssl?: BrokerSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
}

export interface BridgeHttpGetConnector {
  status?: BridgeHttpGetConnectorStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeHttpGetConnectorType
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  url: string
  headers?: BridgeHttpGetConnectorHeaders
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeHttpGetConnectorPoolType
  pool_size?: number
  enable_pipelining?: number
  /** @deprecated */
  request?: BridgeHttpGetConnectorRequest
  ssl?: EmqxSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
}

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
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: BridgeAzureEventHubAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: BridgeAzureEventHubSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
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
  tags?: string[]
  description?: string
  bootstrap_hosts: string
  connect_timeout?: string
  min_metadata_refresh_interval?: string
  metadata_request_timeout?: string
  authentication: BridgeAzureEventHubAuthUsernamePassword
  socket_opts?: BridgeKafkaSocketOpts
  ssl: BridgeAzureEventHubSslClientOpts
  resource_opts?: BridgeKafkaConnectorResourceOpts
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
  tags?: string[]
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
  resource_opts?: BridgeKafkaConnectorResourceOpts
}
