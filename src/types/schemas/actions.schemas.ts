export type PostNodesNodeActionsIdOperation503Code =
  (typeof PostNodesNodeActionsIdOperation503Code)[keyof typeof PostNodesNodeActionsIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostNodesNodeActionsIdOperation503 = {
  code?: PostNodesNodeActionsIdOperation503Code
  message?: string
}

export type PostNodesNodeActionsIdOperation501Code =
  (typeof PostNodesNodeActionsIdOperation501Code)[keyof typeof PostNodesNodeActionsIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostNodesNodeActionsIdOperation501 = {
  code?: PostNodesNodeActionsIdOperation501Code
  message?: string
}

export type PostNodesNodeActionsIdOperation404Code =
  (typeof PostNodesNodeActionsIdOperation404Code)[keyof typeof PostNodesNodeActionsIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostNodesNodeActionsIdOperation404 = {
  code?: PostNodesNodeActionsIdOperation404Code
  message?: string
}

export type PostNodesNodeActionsIdOperation400Code =
  (typeof PostNodesNodeActionsIdOperation400Code)[keyof typeof PostNodesNodeActionsIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostNodesNodeActionsIdOperation400 = {
  code?: PostNodesNodeActionsIdOperation400Code
  message?: string
}

export type GetActionsIdMetrics404Code =
  (typeof GetActionsIdMetrics404Code)[keyof typeof GetActionsIdMetrics404Code]

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

export type DeleteActionsId503Code =
  (typeof DeleteActionsId503Code)[keyof typeof DeleteActionsId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteActionsId503 = {
  code?: DeleteActionsId503Code
  message?: string
}

export type DeleteActionsId404Code =
  (typeof DeleteActionsId404Code)[keyof typeof DeleteActionsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteActionsId404 = {
  code?: DeleteActionsId404Code
  message?: string
}

export type DeleteActionsId400Code =
  (typeof DeleteActionsId400Code)[keyof typeof DeleteActionsId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteActionsId400 = {
  rules?: string[]
  code?: DeleteActionsId400Code
  message?: string
}

export type DeleteActionsIdParams = {
  also_delete_dep_actions?: boolean
}

export type PutActionsId503Code = (typeof PutActionsId503Code)[keyof typeof PutActionsId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutActionsId503 = {
  code?: PutActionsId503Code
  message?: string
}

export type PutActionsId404Code = (typeof PutActionsId404Code)[keyof typeof PutActionsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsId404 = {
  code?: PutActionsId404Code
  message?: string
}

export type PutActionsId400Code = (typeof PutActionsId400Code)[keyof typeof PutActionsId400Code]

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
  | BridgeMongodbGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | BridgeElasticsearchGetBridgeV2
  | ActionAzureBlobStorageGetBridgeV2
  | SyskeeperGetBridgeV2
  | PulsarGetBridgeV2
  | RocketmqGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeSqlserverGetBridgeV2
  | BridgeInfluxdbGetBridgeV2
  | BridgeClickhouseGetBridgeV2
  | BridgeCassaGetBridgeV2
  | BridgeTablestoreGetBridgeV2
  | BridgeHstreamdbGetBridgeV2
  | ActionSnowflakeGetBridgeV2
  | BridgeOracleGetBridgeV2
  | BridgeOpentsGetBridgeV2
  | BridgeGreptimedbGetBridgeV2
  | BridgeS3GetBridgeV2
  | BridgeTdengineGetBridgeV2
  | BridgeDynamoGetBridgeV2
  | RedisGetBridgeV2
  | BridgeRabbitmqGetBridgeV2
  | BridgeMqttPublisherGetBridgeV2
  | BridgeMysqlGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeKinesisGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2
  | BridgeDatalayersGetBridgeV2
  | ActionCouchbaseGetBridgeV2
  | BridgeIotdbGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeHttpGetBridgeV2

export type PutActionsIdBody =
  | BridgeTimescalePutBridgeV2
  | BridgeMongodbPutBridgeV2
  | GcpPubsubProducerPutBridgeV2
  | BridgeElasticsearchPutBridgeV2
  | ActionAzureBlobStoragePutBridgeV2
  | SyskeeperPutBridgeV2
  | PulsarPutBridgeV2
  | RocketmqPutBridgeV2
  | BridgeMatrixPutBridgeV2
  | BridgeSqlserverPutBridgeV2
  | BridgeInfluxdbPutBridgeV2
  | BridgeClickhousePutBridgeV2
  | BridgeCassaPutBridgeV2
  | BridgeTablestorePutBridgeV2
  | BridgeHstreamdbPutBridgeV2
  | ActionSnowflakePutBridgeV2
  | BridgeOraclePutBridgeV2
  | BridgeOpentsPutBridgeV2
  | BridgeGreptimedbPutBridgeV2
  | BridgeS3PutBridgeV2
  | BridgeTdenginePutBridgeV2
  | BridgeDynamoPutBridgeV2
  | RedisPutBridgeV2
  | BridgeRabbitmqPutBridgeV2
  | BridgeMqttPublisherPutBridgeV2
  | BridgeMysqlPutBridgeV2
  | BridgePgsqlPutBridgeV2
  | BridgeKinesisPutBridgeV2
  | BridgeKafkaPutBridgeV2
  | BridgeAzureEventHubPutBridgeV2
  | BridgeDatalayersPutBridgeV2
  | ActionCouchbasePutBridgeV2
  | BridgeIotdbPutBridgeV2
  | ConfluentPutBridgeV2
  | BridgeHttpPutBridgeV2

export type GetActionsId404Code = (typeof GetActionsId404Code)[keyof typeof GetActionsId404Code]

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
  | BridgeMongodbGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | BridgeElasticsearchGetBridgeV2
  | ActionAzureBlobStorageGetBridgeV2
  | SyskeeperGetBridgeV2
  | PulsarGetBridgeV2
  | RocketmqGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeSqlserverGetBridgeV2
  | BridgeInfluxdbGetBridgeV2
  | BridgeClickhouseGetBridgeV2
  | BridgeCassaGetBridgeV2
  | BridgeTablestoreGetBridgeV2
  | BridgeHstreamdbGetBridgeV2
  | ActionSnowflakeGetBridgeV2
  | BridgeOracleGetBridgeV2
  | BridgeOpentsGetBridgeV2
  | BridgeGreptimedbGetBridgeV2
  | BridgeS3GetBridgeV2
  | BridgeTdengineGetBridgeV2
  | BridgeDynamoGetBridgeV2
  | RedisGetBridgeV2
  | BridgeRabbitmqGetBridgeV2
  | BridgeMqttPublisherGetBridgeV2
  | BridgeMysqlGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeKinesisGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2
  | BridgeDatalayersGetBridgeV2
  | ActionCouchbaseGetBridgeV2
  | BridgeIotdbGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeHttpGetBridgeV2

export type GetActionTypes200Item =
  (typeof GetActionTypes200Item)[keyof typeof GetActionTypes200Item]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetActionTypes200Item = {
  azure_blob_storage: 'azure_blob_storage',
  azure_event_hub_producer: 'azure_event_hub_producer',
  cassandra: 'cassandra',
  clickhouse: 'clickhouse',
  confluent_producer: 'confluent_producer',
  couchbase: 'couchbase',
  datalayers: 'datalayers',
  dynamo: 'dynamo',
  elasticsearch: 'elasticsearch',
  gcp_pubsub_producer: 'gcp_pubsub_producer',
  greptimedb: 'greptimedb',
  hstreamdb: 'hstreamdb',
  http: 'http',
  influxdb: 'influxdb',
  iotdb: 'iotdb',
  kafka_producer: 'kafka_producer',
  kinesis: 'kinesis',
  matrix: 'matrix',
  mongodb: 'mongodb',
  mqtt: 'mqtt',
  mysql: 'mysql',
  opents: 'opents',
  oracle: 'oracle',
  pgsql: 'pgsql',
  pulsar: 'pulsar',
  rabbitmq: 'rabbitmq',
  redis: 'redis',
  rocketmq: 'rocketmq',
  s3: 's3',
  snowflake: 'snowflake',
  sqlserver: 'sqlserver',
  syskeeper_forwarder: 'syskeeper_forwarder',
  tablestore: 'tablestore',
  tdengine: 'tdengine',
  timescale: 'timescale',
} as const

export type PostActionsProbe400Code =
  (typeof PostActionsProbe400Code)[keyof typeof PostActionsProbe400Code]

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
  | BridgeMongodbPostBridgeV2
  | GcpPubsubProducerPostBridgeV2
  | BridgeElasticsearchPostBridgeV2
  | ActionAzureBlobStoragePostBridgeV2
  | SyskeeperPostBridgeV2
  | PulsarPostBridgeV2
  | RocketmqPostBridgeV2
  | BridgeMatrixPostBridgeV2
  | BridgeSqlserverPostBridgeV2
  | BridgeInfluxdbPostBridgeV2
  | BridgeClickhousePostBridgeV2
  | BridgeCassaPostBridgeV2
  | BridgeTablestorePostBridgeV2
  | BridgeHstreamdbPostBridgeV2
  | ActionSnowflakePostBridgeV2
  | BridgeOraclePostBridgeV2
  | BridgeOpentsPostBridgeV2
  | BridgeGreptimedbPostBridgeV2
  | BridgeS3PostBridgeV2
  | BridgeTdenginePostBridgeV2
  | BridgeDynamoPostBridgeV2
  | RedisPostBridgeV2
  | BridgeRabbitmqPostBridgeV2
  | BridgeMqttPublisherPostBridgeV2
  | BridgeMysqlPostBridgeV2
  | BridgePgsqlPostBridgeV2
  | BridgeKinesisPostBridgeV2
  | BridgeKafkaPostBridgeV2
  | BridgeAzureEventHubPostBridgeV2
  | BridgeDatalayersPostBridgeV2
  | ActionCouchbasePostBridgeV2
  | BridgeIotdbPostBridgeV2
  | ConfluentPostBridgeV2
  | BridgeHttpPostBridgeV2

export type PostActions400Code = (typeof PostActions400Code)[keyof typeof PostActions400Code]

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
  | BridgeMongodbGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | BridgeElasticsearchGetBridgeV2
  | ActionAzureBlobStorageGetBridgeV2
  | SyskeeperGetBridgeV2
  | PulsarGetBridgeV2
  | RocketmqGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeSqlserverGetBridgeV2
  | BridgeInfluxdbGetBridgeV2
  | BridgeClickhouseGetBridgeV2
  | BridgeCassaGetBridgeV2
  | BridgeTablestoreGetBridgeV2
  | BridgeHstreamdbGetBridgeV2
  | ActionSnowflakeGetBridgeV2
  | BridgeOracleGetBridgeV2
  | BridgeOpentsGetBridgeV2
  | BridgeGreptimedbGetBridgeV2
  | BridgeS3GetBridgeV2
  | BridgeTdengineGetBridgeV2
  | BridgeDynamoGetBridgeV2
  | RedisGetBridgeV2
  | BridgeRabbitmqGetBridgeV2
  | BridgeMqttPublisherGetBridgeV2
  | BridgeMysqlGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeKinesisGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2
  | BridgeDatalayersGetBridgeV2
  | ActionCouchbaseGetBridgeV2
  | BridgeIotdbGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeHttpGetBridgeV2

export type PostActionsBody =
  | BridgeTimescalePostBridgeV2
  | BridgeMongodbPostBridgeV2
  | GcpPubsubProducerPostBridgeV2
  | BridgeElasticsearchPostBridgeV2
  | ActionAzureBlobStoragePostBridgeV2
  | SyskeeperPostBridgeV2
  | PulsarPostBridgeV2
  | RocketmqPostBridgeV2
  | BridgeMatrixPostBridgeV2
  | BridgeSqlserverPostBridgeV2
  | BridgeInfluxdbPostBridgeV2
  | BridgeClickhousePostBridgeV2
  | BridgeCassaPostBridgeV2
  | BridgeTablestorePostBridgeV2
  | BridgeHstreamdbPostBridgeV2
  | ActionSnowflakePostBridgeV2
  | BridgeOraclePostBridgeV2
  | BridgeOpentsPostBridgeV2
  | BridgeGreptimedbPostBridgeV2
  | BridgeS3PostBridgeV2
  | BridgeTdenginePostBridgeV2
  | BridgeDynamoPostBridgeV2
  | RedisPostBridgeV2
  | BridgeRabbitmqPostBridgeV2
  | BridgeMqttPublisherPostBridgeV2
  | BridgeMysqlPostBridgeV2
  | BridgePgsqlPostBridgeV2
  | BridgeKinesisPostBridgeV2
  | BridgeKafkaPostBridgeV2
  | BridgeAzureEventHubPostBridgeV2
  | BridgeDatalayersPostBridgeV2
  | ActionCouchbasePostBridgeV2
  | BridgeIotdbPostBridgeV2
  | ConfluentPostBridgeV2
  | BridgeHttpPostBridgeV2

export type GetActions200Item =
  | BridgeTimescaleGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | BridgeElasticsearchGetBridgeV2
  | ActionAzureBlobStorageGetBridgeV2
  | SyskeeperGetBridgeV2
  | PulsarGetBridgeV2
  | RocketmqGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeSqlserverGetBridgeV2
  | BridgeInfluxdbGetBridgeV2
  | BridgeClickhouseGetBridgeV2
  | BridgeCassaGetBridgeV2
  | BridgeTablestoreGetBridgeV2
  | BridgeHstreamdbGetBridgeV2
  | ActionSnowflakeGetBridgeV2
  | BridgeOracleGetBridgeV2
  | BridgeOpentsGetBridgeV2
  | BridgeGreptimedbGetBridgeV2
  | BridgeS3GetBridgeV2
  | BridgeTdengineGetBridgeV2
  | BridgeDynamoGetBridgeV2
  | RedisGetBridgeV2
  | BridgeRabbitmqGetBridgeV2
  | BridgeMqttPublisherGetBridgeV2
  | BridgeMysqlGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeKinesisGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2
  | BridgeDatalayersGetBridgeV2
  | ActionCouchbaseGetBridgeV2
  | BridgeIotdbGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeHttpGetBridgeV2

export type PutActionsIdEnableEnable503Code =
  (typeof PutActionsIdEnableEnable503Code)[keyof typeof PutActionsIdEnableEnable503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdEnableEnable503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutActionsIdEnableEnable503 = {
  code?: PutActionsIdEnableEnable503Code
  message?: string
}

export type PutActionsIdEnableEnable404Code =
  (typeof PutActionsIdEnableEnable404Code)[keyof typeof PutActionsIdEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsIdEnableEnable404 = {
  code?: PutActionsIdEnableEnable404Code
  message?: string
}

export type PostActionsIdOperation503Code =
  (typeof PostActionsIdOperation503Code)[keyof typeof PostActionsIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostActionsIdOperation503 = {
  code?: PostActionsIdOperation503Code
  message?: string
}

export type PostActionsIdOperation501Code =
  (typeof PostActionsIdOperation501Code)[keyof typeof PostActionsIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostActionsIdOperation501 = {
  code?: PostActionsIdOperation501Code
  message?: string
}

export type PostActionsIdOperation404Code =
  (typeof PostActionsIdOperation404Code)[keyof typeof PostActionsIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostActionsIdOperation404 = {
  code?: PostActionsIdOperation404Code
  message?: string
}

export type PostActionsIdOperation400Code =
  (typeof PostActionsIdOperation400Code)[keyof typeof PostActionsIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostActionsIdOperation400 = {
  code?: PostActionsIdOperation400Code
  message?: string
}

export type PutActionsIdMetricsReset404Code =
  (typeof PutActionsIdMetricsReset404Code)[keyof typeof PutActionsIdMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsIdMetricsReset404 = {
  code?: PutActionsIdMetricsReset404Code
  message?: string
}

export type SyskeeperPostBridgeV2Type =
  (typeof SyskeeperPostBridgeV2Type)[keyof typeof SyskeeperPostBridgeV2Type]

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
  local_topic?: string
  parameters: SyskeeperParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: SyskeeperCreationOpts
}

export interface SyskeeperPostBridgeV2 {
  type: SyskeeperPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: SyskeeperParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: SyskeeperCreationOpts
}

export type SyskeeperGetBridgeV2Type =
  (typeof SyskeeperGetBridgeV2Type)[keyof typeof SyskeeperGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperGetBridgeV2Type = {
  syskeeper_forwarder: 'syskeeper_forwarder',
} as const

export type SyskeeperGetBridgeV2Status =
  (typeof SyskeeperGetBridgeV2Status)[keyof typeof SyskeeperGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyskeeperGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type SyskeeperCreationOptsRequestTtl = 'infinity' | string

export type SyskeeperCreationOptsQueryMode =
  (typeof SyskeeperCreationOptsQueryMode)[keyof typeof SyskeeperCreationOptsQueryMode]

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
  local_topic?: string
  parameters: SyskeeperParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: SyskeeperCreationOpts
}

export interface RocketmqPutBridgeV2 {
  local_topic?: string
  parameters: RocketmqActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type RocketmqPostBridgeV2Type =
  (typeof RocketmqPostBridgeV2Type)[keyof typeof RocketmqPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RocketmqPostBridgeV2Type = {
  rocketmq: 'rocketmq',
} as const

export interface RocketmqPostBridgeV2 {
  type: RocketmqPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: RocketmqActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type RocketmqGetBridgeV2Status =
  (typeof RocketmqGetBridgeV2Status)[keyof typeof RocketmqGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RocketmqGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type RocketmqGetBridgeV2Type =
  (typeof RocketmqGetBridgeV2Type)[keyof typeof RocketmqGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RocketmqGetBridgeV2Type = {
  rocketmq: 'rocketmq',
} as const

export interface RocketmqGetBridgeV2 {
  type: RocketmqGetBridgeV2Type
  name: string
  status?: RocketmqGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: RocketmqActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type RocketmqActionParametersStrategy = string | 'roundrobin'

export interface RocketmqActionParameters {
  template?: string
  strategy?: RocketmqActionParametersStrategy
  topic?: string
  sync_timeout?: string
  refresh_interval?: string
  send_buffer?: string
}

export interface RedisPutBridgeV2 {
  local_topic?: string
  parameters: BridgeRedisActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: RedisActionResourceOpts
}

export type RedisPostBridgeV2Type =
  (typeof RedisPostBridgeV2Type)[keyof typeof RedisPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisPostBridgeV2Type = {
  redis: 'redis',
} as const

export interface RedisPostBridgeV2 {
  type: RedisPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeRedisActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: RedisActionResourceOpts
}

export type RedisGetBridgeV2Type = (typeof RedisGetBridgeV2Type)[keyof typeof RedisGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisGetBridgeV2Type = {
  redis: 'redis',
} as const

export type RedisGetBridgeV2Status =
  (typeof RedisGetBridgeV2Status)[keyof typeof RedisGetBridgeV2Status]

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
  local_topic?: string
  parameters: BridgeRedisActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: RedisActionResourceOpts
}

export type RedisActionResourceOptsRequestTtl = 'infinity' | string

export type RedisActionResourceOptsQueryMode =
  (typeof RedisActionResourceOptsQueryMode)[keyof typeof RedisActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface RedisActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: RedisActionResourceOptsQueryMode
  request_ttl?: RedisActionResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  max_buffer_bytes?: string
}

export interface PulsarProducerPulsarMessage {
  key?: string
  value?: string
}

export type PulsarPostBridgeV2Type =
  (typeof PulsarPostBridgeV2Type)[keyof typeof PulsarPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarPostBridgeV2Type = {
  pulsar: 'pulsar',
} as const

export type PulsarGetBridgeV2Status =
  (typeof PulsarGetBridgeV2Status)[keyof typeof PulsarGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type PulsarGetBridgeV2Type =
  (typeof PulsarGetBridgeV2Type)[keyof typeof PulsarGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarGetBridgeV2Type = {
  pulsar: 'pulsar',
} as const

/**
 * @deprecated
 */
export type PulsarActionResourceOptsRequestTtl = 'infinity' | string

export type PulsarActionResourceOptsQueryMode =
  (typeof PulsarActionResourceOptsQueryMode)[keyof typeof PulsarActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface PulsarActionResourceOpts {
  health_check_interval?: string
  query_mode?: PulsarActionResourceOptsQueryMode
  /** @deprecated */
  request_ttl?: PulsarActionResourceOptsRequestTtl
}

export interface PulsarGetBridgeV2 {
  type: PulsarGetBridgeV2Type
  name: string
  status?: PulsarGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: PulsarActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: PulsarActionResourceOpts
}

export type PulsarActionParametersStrategy =
  (typeof PulsarActionParametersStrategy)[keyof typeof PulsarActionParametersStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarActionParametersStrategy = {
  random: 'random',
  roundrobin: 'roundrobin',
  key_dispatch: 'key_dispatch',
} as const

export type PulsarActionParametersRetentionPeriod = string | 'infinity'

export type PulsarActionParametersCompression =
  (typeof PulsarActionParametersCompression)[keyof typeof PulsarActionParametersCompression]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarActionParametersCompression = {
  no_compression: 'no_compression',
  snappy: 'snappy',
  zlib: 'zlib',
} as const

export interface PulsarActionParameters {
  message?: PulsarProducerPulsarMessage
  sync_timeout?: string
  pulsar_topic: string
  batch_size?: number
  compression?: PulsarActionParametersCompression
  send_buffer?: string
  retention_period?: PulsarActionParametersRetentionPeriod
  max_batch_bytes?: string
  strategy?: PulsarActionParametersStrategy
  buffer?: BridgePulsarProducerBuffer
}

export interface PulsarPutBridgeV2 {
  local_topic?: string
  parameters: PulsarActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: PulsarActionResourceOpts
}

export interface PulsarPostBridgeV2 {
  type: PulsarPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: PulsarActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: PulsarActionResourceOpts
}

export type GcpPubsubProducerPostBridgeV2Type =
  (typeof GcpPubsubProducerPostBridgeV2Type)[keyof typeof GcpPubsubProducerPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubProducerPostBridgeV2Type = {
  gcp_pubsub_producer: 'gcp_pubsub_producer',
} as const

export interface GcpPubsubProducerPostBridgeV2 {
  type: GcpPubsubProducerPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: GcpPubsubProducerActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type GcpPubsubProducerGetBridgeV2Type =
  (typeof GcpPubsubProducerGetBridgeV2Type)[keyof typeof GcpPubsubProducerGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GcpPubsubProducerGetBridgeV2Type = {
  gcp_pubsub_producer: 'gcp_pubsub_producer',
} as const

export type GcpPubsubProducerGetBridgeV2Status =
  (typeof GcpPubsubProducerGetBridgeV2Status)[keyof typeof GcpPubsubProducerGetBridgeV2Status]

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

export interface GcpPubsubProducerPutBridgeV2 {
  local_topic?: string
  parameters: GcpPubsubProducerActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface GcpPubsubProducerGetBridgeV2 {
  status?: GcpPubsubProducerGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: GcpPubsubProducerGetBridgeV2Type
  name: string
  local_topic?: string
  parameters: GcpPubsubProducerActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type ConnectorAggregatorContainerCsvType =
  (typeof ConnectorAggregatorContainerCsvType)[keyof typeof ConnectorAggregatorContainerCsvType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConnectorAggregatorContainerCsvType = {
  csv: 'csv',
} as const

export interface ConnectorAggregatorContainerCsv {
  type: ConnectorAggregatorContainerCsvType
  column_order?: string[]
}

export interface ConfluentPutBridgeV2 {
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: ConfluentProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type ConfluentProducerKafkaOptsQueryMode =
  (typeof ConfluentProducerKafkaOptsQueryMode)[keyof typeof ConfluentProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export type ConfluentProducerKafkaOptsPartitionsLimit = number | 'all_partitions'

export type ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode =
  (typeof ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode)[keyof typeof ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode = {
  none: 'none',
  json: 'json',
} as const

export type ConfluentProducerKafkaOptsRequiredAcks =
  (typeof ConfluentProducerKafkaOptsRequiredAcks)[keyof typeof ConfluentProducerKafkaOptsRequiredAcks]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsRequiredAcks = {
  all_isr: 'all_isr',
  leader_only: 'leader_only',
  none: 'none',
} as const

export type ConfluentProducerKafkaOptsPartitionStrategy =
  (typeof ConfluentProducerKafkaOptsPartitionStrategy)[keyof typeof ConfluentProducerKafkaOptsPartitionStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsPartitionStrategy = {
  random: 'random',
  key_dispatch: 'key_dispatch',
} as const

export type ConfluentProducerKafkaOptsCompression =
  (typeof ConfluentProducerKafkaOptsCompression)[keyof typeof ConfluentProducerKafkaOptsCompression]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsCompression = {
  no_compression: 'no_compression',
  snappy: 'snappy',
  gzip: 'gzip',
} as const

export interface ConfluentProducerKafkaOpts {
  topic: string
  message?: ConfluentKafkaMessage
  max_linger_time?: string
  max_linger_bytes?: string
  max_batch_bytes?: string
  compression?: ConfluentProducerKafkaOptsCompression
  partition_strategy?: ConfluentProducerKafkaOptsPartitionStrategy
  required_acks?: ConfluentProducerKafkaOptsRequiredAcks
  kafka_headers?: string
  kafka_ext_headers?: BridgeKafkaProducerKafkaExtHeaders[]
  kafka_header_value_encode_mode?: ConfluentProducerKafkaOptsKafkaHeaderValueEncodeMode
  partition_count_refresh_interval?: string
  partitions_limit?: ConfluentProducerKafkaOptsPartitionsLimit
  max_inflight?: number
  buffer?: BridgeKafkaProducerBuffer
  query_mode?: ConfluentProducerKafkaOptsQueryMode
  sync_query_timeout?: string
}

export type ConfluentPostBridgeV2Type =
  (typeof ConfluentPostBridgeV2Type)[keyof typeof ConfluentPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentPostBridgeV2Type = {
  confluent_producer: 'confluent_producer',
} as const

export interface ConfluentPostBridgeV2 {
  type: ConfluentPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: ConfluentProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export interface ConfluentKafkaMessage {
  key?: string
  value?: string
}

export type ConfluentGetBridgeV2Type =
  (typeof ConfluentGetBridgeV2Type)[keyof typeof ConfluentGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentGetBridgeV2Type = {
  confluent_producer: 'confluent_producer',
} as const

export type ConfluentGetBridgeV2Status =
  (typeof ConfluentGetBridgeV2Status)[keyof typeof ConfluentGetBridgeV2Status]

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
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: ConfluentProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

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

export interface BridgeTimescalePutBridgeV2 {
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeTimescalePostBridgeV2Type =
  (typeof BridgeTimescalePostBridgeV2Type)[keyof typeof BridgeTimescalePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTimescalePostBridgeV2Type = {
  timescale: 'timescale',
} as const

export interface BridgeTimescalePostBridgeV2 {
  type: BridgeTimescalePostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeTimescaleGetBridgeV2 {
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeTdenginePutBridgeV2 {
  local_topic?: string
  parameters: BridgeTdengineActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeTdenginePostBridgeV2Type =
  (typeof BridgeTdenginePostBridgeV2Type)[keyof typeof BridgeTdenginePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTdenginePostBridgeV2Type = {
  tdengine: 'tdengine',
} as const

export type BridgeTdengineGetBridgeV2Type =
  (typeof BridgeTdengineGetBridgeV2Type)[keyof typeof BridgeTdengineGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTdengineGetBridgeV2Type = {
  tdengine: 'tdengine',
} as const

export type BridgeTdengineGetBridgeV2Status =
  (typeof BridgeTdengineGetBridgeV2Status)[keyof typeof BridgeTdengineGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTdengineGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeTdengineActionParameters {
  database: string
  sql?: string
  undefined_vars_as_null?: boolean
}

export interface BridgeTdenginePostBridgeV2 {
  type: BridgeTdenginePostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeTdengineActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeTdengineGetBridgeV2 {
  status?: BridgeTdengineGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeTdengineGetBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeTdengineActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeTablestoreTablestoreFieldsIsbinary = string | boolean

export type BridgeTablestoreTablestoreFieldsIsint = string | boolean

export type BridgeTablestoreTablestoreFieldsValue = string | number | boolean

export interface BridgeTablestoreTablestoreFields {
  column: string
  value: BridgeTablestoreTablestoreFieldsValue
  isint?: BridgeTablestoreTablestoreFieldsIsint
  isbinary?: BridgeTablestoreTablestoreFieldsIsbinary
}

export interface BridgeTablestorePutBridgeV2 {
  local_topic?: string
  parameters: BridgeTablestoreActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeTablestorePostBridgeV2Type =
  (typeof BridgeTablestorePostBridgeV2Type)[keyof typeof BridgeTablestorePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTablestorePostBridgeV2Type = {
  tablestore: 'tablestore',
} as const

export interface BridgeTablestorePostBridgeV2 {
  type: BridgeTablestorePostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeTablestoreActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeTablestoreGetBridgeV2Status =
  (typeof BridgeTablestoreGetBridgeV2Status)[keyof typeof BridgeTablestoreGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTablestoreGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeTablestoreGetBridgeV2Type =
  (typeof BridgeTablestoreGetBridgeV2Type)[keyof typeof BridgeTablestoreGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTablestoreGetBridgeV2Type = {
  tablestore: 'tablestore',
} as const

export interface BridgeTablestoreGetBridgeV2 {
  type: BridgeTablestoreGetBridgeV2Type
  name: string
  status?: BridgeTablestoreGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeTablestoreActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeTablestoreActionParametersMetaUpdateModel =
  (typeof BridgeTablestoreActionParametersMetaUpdateModel)[keyof typeof BridgeTablestoreActionParametersMetaUpdateModel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTablestoreActionParametersMetaUpdateModel = {
  MUM_IGNORE: 'MUM_IGNORE',
  MUM_NORMAL: 'MUM_NORMAL',
} as const

export type BridgeTablestoreActionParametersTimestamp = string | number

export type BridgeTablestoreActionParametersTags = { [key: string]: any }

export type BridgeTablestoreActionParametersStorageModelType =
  (typeof BridgeTablestoreActionParametersStorageModelType)[keyof typeof BridgeTablestoreActionParametersStorageModelType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTablestoreActionParametersStorageModelType = {
  timeseries: 'timeseries',
} as const

export interface BridgeTablestoreActionParameters {
  storage_model_type?: BridgeTablestoreActionParametersStorageModelType
  table_name: string
  measurement: string
  tags?: BridgeTablestoreActionParametersTags
  fields: BridgeTablestoreTablestoreFields[]
  data_source?: string
  timestamp?: BridgeTablestoreActionParametersTimestamp
  meta_update_model?: BridgeTablestoreActionParametersMetaUpdateModel
}

export interface BridgeSqlserverPutBridgeV2 {
  local_topic?: string
  parameters: BridgeSqlserverActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeSqlserverPostBridgeV2Type =
  (typeof BridgeSqlserverPostBridgeV2Type)[keyof typeof BridgeSqlserverPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverPostBridgeV2Type = {
  sqlserver: 'sqlserver',
} as const

export interface BridgeSqlserverPostBridgeV2 {
  type: BridgeSqlserverPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeSqlserverActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeSqlserverGetBridgeV2Status =
  (typeof BridgeSqlserverGetBridgeV2Status)[keyof typeof BridgeSqlserverGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeSqlserverGetBridgeV2Type =
  (typeof BridgeSqlserverGetBridgeV2Type)[keyof typeof BridgeSqlserverGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverGetBridgeV2Type = {
  sqlserver: 'sqlserver',
} as const

export interface BridgeSqlserverActionParameters {
  sql?: string
  undefined_vars_as_null?: boolean
}

export interface BridgeSqlserverGetBridgeV2 {
  type: BridgeSqlserverGetBridgeV2Type
  name: string
  status?: BridgeSqlserverGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeSqlserverActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeS3S3UploadResourceOptsRequestTtl = 'infinity' | string

export type BridgeS3S3UploadResourceOptsQueryMode =
  (typeof BridgeS3S3UploadResourceOptsQueryMode)[keyof typeof BridgeS3S3UploadResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3S3UploadResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeS3S3UploadResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeS3S3UploadResourceOptsQueryMode
  request_ttl?: BridgeS3S3UploadResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  max_buffer_bytes?: string
}

export type BridgeS3S3DirectUploadParametersMode =
  (typeof BridgeS3S3DirectUploadParametersMode)[keyof typeof BridgeS3S3DirectUploadParametersMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3S3DirectUploadParametersMode = {
  direct: 'direct',
} as const

export type BridgeS3S3DirectUploadParametersHeaders = { [key: string]: any }

export type BridgeS3S3DirectUploadParametersAcl =
  (typeof BridgeS3S3DirectUploadParametersAcl)[keyof typeof BridgeS3S3DirectUploadParametersAcl]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3S3DirectUploadParametersAcl = {
  private: 'private',
  public_read: 'public_read',
  public_read_write: 'public_read_write',
  authenticated_read: 'authenticated_read',
  bucket_owner_read: 'bucket_owner_read',
  bucket_owner_full_control: 'bucket_owner_full_control',
} as const

export interface BridgeS3S3DirectUploadParameters {
  bucket: string
  key: string
  acl?: BridgeS3S3DirectUploadParametersAcl
  headers?: BridgeS3S3DirectUploadParametersHeaders
  mode?: BridgeS3S3DirectUploadParametersMode
  content?: string
}

export interface BridgeS3S3Aggregation {
  time_interval?: string
  max_records?: number
}

export type BridgeS3S3AggregatedUploadParametersHeaders = { [key: string]: any }

export type BridgeS3S3AggregatedUploadParametersAcl =
  (typeof BridgeS3S3AggregatedUploadParametersAcl)[keyof typeof BridgeS3S3AggregatedUploadParametersAcl]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3S3AggregatedUploadParametersAcl = {
  private: 'private',
  public_read: 'public_read',
  public_read_write: 'public_read_write',
  authenticated_read: 'authenticated_read',
  bucket_owner_read: 'bucket_owner_read',
  bucket_owner_full_control: 'bucket_owner_full_control',
} as const

export type BridgeS3S3AggregatedUploadParametersMode =
  (typeof BridgeS3S3AggregatedUploadParametersMode)[keyof typeof BridgeS3S3AggregatedUploadParametersMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3S3AggregatedUploadParametersMode = {
  aggregated: 'aggregated',
} as const

export interface BridgeS3S3AggregatedUploadParameters {
  mode: BridgeS3S3AggregatedUploadParametersMode
  container: BridgeS3S3AggregatedContainerCsv
  aggregation: BridgeS3S3Aggregation
  bucket: string
  key: string
  acl?: BridgeS3S3AggregatedUploadParametersAcl
  headers?: BridgeS3S3AggregatedUploadParametersHeaders
  min_part_size?: string
  max_part_size?: string
}

export type BridgeS3S3AggregatedContainerCsvType =
  (typeof BridgeS3S3AggregatedContainerCsvType)[keyof typeof BridgeS3S3AggregatedContainerCsvType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3S3AggregatedContainerCsvType = {
  csv: 'csv',
} as const

export interface BridgeS3S3AggregatedContainerCsv {
  type: BridgeS3S3AggregatedContainerCsvType
  column_order?: string[]
}

export type BridgeS3PutBridgeV2Parameters =
  | BridgeS3S3DirectUploadParameters
  | BridgeS3S3AggregatedUploadParameters

export interface BridgeS3PutBridgeV2 {
  local_topic?: string
  parameters: BridgeS3PutBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeS3S3UploadResourceOpts
}

export type BridgeS3PostBridgeV2Parameters =
  | BridgeS3S3DirectUploadParameters
  | BridgeS3S3AggregatedUploadParameters

export type BridgeS3PostBridgeV2Type =
  (typeof BridgeS3PostBridgeV2Type)[keyof typeof BridgeS3PostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3PostBridgeV2Type = {
  s3: 's3',
} as const

export interface BridgeS3PostBridgeV2 {
  type: BridgeS3PostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeS3PostBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeS3S3UploadResourceOpts
}

export type BridgeS3GetBridgeV2Parameters =
  | BridgeS3S3DirectUploadParameters
  | BridgeS3S3AggregatedUploadParameters

export type BridgeS3GetBridgeV2Status =
  (typeof BridgeS3GetBridgeV2Status)[keyof typeof BridgeS3GetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3GetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeS3GetBridgeV2Type =
  (typeof BridgeS3GetBridgeV2Type)[keyof typeof BridgeS3GetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3GetBridgeV2Type = {
  s3: 's3',
} as const

export interface BridgeS3GetBridgeV2 {
  type: BridgeS3GetBridgeV2Type
  name: string
  status?: BridgeS3GetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeS3GetBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeS3S3UploadResourceOpts
}

export interface BridgeRedisActionParameters {
  command_template: string[]
}

export type BridgeRabbitmqPostBridgeV2Type =
  (typeof BridgeRabbitmqPostBridgeV2Type)[keyof typeof BridgeRabbitmqPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqPostBridgeV2Type = {
  rabbitmq: 'rabbitmq',
} as const

export type BridgeRabbitmqGetBridgeV2Status =
  (typeof BridgeRabbitmqGetBridgeV2Status)[keyof typeof BridgeRabbitmqGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeRabbitmqGetBridgeV2Type =
  (typeof BridgeRabbitmqGetBridgeV2Type)[keyof typeof BridgeRabbitmqGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqGetBridgeV2Type = {
  rabbitmq: 'rabbitmq',
} as const

export interface BridgeRabbitmqGetBridgeV2 {
  type: BridgeRabbitmqGetBridgeV2Type
  name: string
  status?: BridgeRabbitmqGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeRabbitmqActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeRabbitmqActionResourceOpts
}

export type BridgeRabbitmqActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeRabbitmqActionResourceOptsQueryMode =
  (typeof BridgeRabbitmqActionResourceOptsQueryMode)[keyof typeof BridgeRabbitmqActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeRabbitmqActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeRabbitmqActionResourceOptsQueryMode
  request_ttl?: BridgeRabbitmqActionResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  max_buffer_bytes?: string
}

export type BridgeRabbitmqActionParametersDeliveryMode =
  (typeof BridgeRabbitmqActionParametersDeliveryMode)[keyof typeof BridgeRabbitmqActionParametersDeliveryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqActionParametersDeliveryMode = {
  non_persistent: 'non_persistent',
  persistent: 'persistent',
} as const

export interface BridgeRabbitmqActionParameters {
  wait_for_publish_confirmations?: boolean
  publish_confirmation_timeout?: string
  exchange: string
  routing_key: string
  delivery_mode?: BridgeRabbitmqActionParametersDeliveryMode
  payload_template?: string
}

export interface BridgeRabbitmqPutBridgeV2 {
  local_topic?: string
  parameters: BridgeRabbitmqActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeRabbitmqActionResourceOpts
}

export interface BridgeRabbitmqPostBridgeV2 {
  type: BridgeRabbitmqPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeRabbitmqActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeRabbitmqActionResourceOpts
}

export type BridgePulsarProducerBufferMode =
  (typeof BridgePulsarProducerBufferMode)[keyof typeof BridgePulsarProducerBufferMode]

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

export type BridgePgsqlPostBridgeV2Type =
  (typeof BridgePgsqlPostBridgeV2Type)[keyof typeof BridgePgsqlPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePgsqlPostBridgeV2Type = {
  pgsql: 'pgsql',
} as const

export interface BridgePgsqlActionParameters {
  sql?: string
}

export interface BridgePgsqlPutBridgeV2 {
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgePgsqlPostBridgeV2 {
  type: BridgePgsqlPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgePgsqlGetBridgeV2 {
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOraclePostBridgeV2Type =
  (typeof BridgeOraclePostBridgeV2Type)[keyof typeof BridgeOraclePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOraclePostBridgeV2Type = {
  oracle: 'oracle',
} as const

export type BridgeOracleGetBridgeV2Status =
  (typeof BridgeOracleGetBridgeV2Status)[keyof typeof BridgeOracleGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOracleGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeOracleGetBridgeV2Type =
  (typeof BridgeOracleGetBridgeV2Type)[keyof typeof BridgeOracleGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOracleGetBridgeV2Type = {
  oracle: 'oracle',
} as const

export interface BridgeOracleActionParameters {
  sql?: string
}

export interface BridgeOraclePutBridgeV2 {
  local_topic?: string
  parameters: BridgeOracleActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeOraclePostBridgeV2 {
  type: BridgeOraclePostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeOracleActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeOracleGetBridgeV2 {
  type: BridgeOracleGetBridgeV2Type
  name: string
  status?: BridgeOracleGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeOracleActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeOpentsPutBridgeV2 {
  local_topic?: string
  parameters: BridgeOpentsActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOpentsPostBridgeV2Type =
  (typeof BridgeOpentsPostBridgeV2Type)[keyof typeof BridgeOpentsPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOpentsPostBridgeV2Type = {
  opents: 'opents',
} as const

export interface BridgeOpentsPostBridgeV2 {
  type: BridgeOpentsPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeOpentsActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOpentsGetBridgeV2Type =
  (typeof BridgeOpentsGetBridgeV2Type)[keyof typeof BridgeOpentsGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOpentsGetBridgeV2Type = {
  opents: 'opents',
} as const

export type BridgeOpentsGetBridgeV2Status =
  (typeof BridgeOpentsGetBridgeV2Status)[keyof typeof BridgeOpentsGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOpentsGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeOpentsGetBridgeV2 {
  status?: BridgeOpentsGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeOpentsGetBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeOpentsActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOpentsActionParametersDataValue = string | number | number

export type BridgeOpentsActionParametersDataTags =
  | string
  | BridgeOpentsActionParametersDataTagsOneOf

export interface BridgeOpentsActionParametersData {
  timestamp?: string
  metric: string
  tags: BridgeOpentsActionParametersDataTags
  value: BridgeOpentsActionParametersDataValue
}

export type BridgeOpentsActionParametersDataTagsOneOf = { [key: string]: any }

export interface BridgeOpentsActionParameters {
  data?: BridgeOpentsActionParametersData[]
}

export type BridgeMysqlPostBridgeV2Type =
  (typeof BridgeMysqlPostBridgeV2Type)[keyof typeof BridgeMysqlPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlPostBridgeV2Type = {
  mysql: 'mysql',
} as const

export type BridgeMysqlGetBridgeV2Status =
  (typeof BridgeMysqlGetBridgeV2Status)[keyof typeof BridgeMysqlGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMysqlGetBridgeV2Type =
  (typeof BridgeMysqlGetBridgeV2Type)[keyof typeof BridgeMysqlGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlGetBridgeV2Type = {
  mysql: 'mysql',
} as const

export interface BridgeMysqlActionParameters {
  sql?: string
  undefined_vars_as_null?: boolean
}

export interface BridgeMysqlPutBridgeV2 {
  local_topic?: string
  parameters: BridgeMysqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeMysqlPostBridgeV2 {
  type: BridgeMysqlPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeMysqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeMysqlGetBridgeV2 {
  type: BridgeMysqlGetBridgeV2Type
  name: string
  status?: BridgeMysqlGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeMysqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeMqttPublisherPutBridgeV2 {
  local_topic?: string
  parameters: BridgeMqttPublisherActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export type BridgeMqttPublisherPostBridgeV2Type =
  (typeof BridgeMqttPublisherPostBridgeV2Type)[keyof typeof BridgeMqttPublisherPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherPostBridgeV2Type = {
  mqtt: 'mqtt',
} as const

export type BridgeMqttPublisherGetBridgeV2Status =
  (typeof BridgeMqttPublisherGetBridgeV2Status)[keyof typeof BridgeMqttPublisherGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMqttPublisherGetBridgeV2Type =
  (typeof BridgeMqttPublisherGetBridgeV2Type)[keyof typeof BridgeMqttPublisherGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherGetBridgeV2Type = {
  mqtt: 'mqtt',
} as const

export interface BridgeMqttPublisherGetBridgeV2 {
  type: BridgeMqttPublisherGetBridgeV2Type
  name: string
  status?: BridgeMqttPublisherGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeMqttPublisherActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export type BridgeMqttPublisherActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeMqttPublisherActionResourceOptsQueryMode =
  (typeof BridgeMqttPublisherActionResourceOptsQueryMode)[keyof typeof BridgeMqttPublisherActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeMqttPublisherActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeMqttPublisherActionResourceOptsQueryMode
  request_ttl?: BridgeMqttPublisherActionResourceOptsRequestTtl
  inflight_window?: number
  max_buffer_bytes?: string
}

export type BridgeMqttPublisherActionParametersRetain = string | boolean

export type BridgeMqttPublisherActionParametersQos = string | number

export interface BridgeMqttPublisherActionParameters {
  topic: string
  qos?: BridgeMqttPublisherActionParametersQos
  retain?: BridgeMqttPublisherActionParametersRetain
  payload?: string
}

export interface BridgeMongodbPutBridgeV2 {
  local_topic?: string
  parameters: BridgeMongodbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMongodbActionResourceOpts
}

export type BridgeMongodbPostBridgeV2Type =
  (typeof BridgeMongodbPostBridgeV2Type)[keyof typeof BridgeMongodbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostBridgeV2Type = {
  mongodb: 'mongodb',
} as const

export type BridgeMongodbGetBridgeV2Status =
  (typeof BridgeMongodbGetBridgeV2Status)[keyof typeof BridgeMongodbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMongodbGetBridgeV2Type =
  (typeof BridgeMongodbGetBridgeV2Type)[keyof typeof BridgeMongodbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetBridgeV2Type = {
  mongodb: 'mongodb',
} as const

export interface BridgeMongodbGetBridgeV2 {
  type: BridgeMongodbGetBridgeV2Type
  name: string
  status?: BridgeMongodbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeMongodbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMongodbActionResourceOpts
}

export type BridgeMongodbActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeMongodbActionResourceOptsQueryMode =
  (typeof BridgeMongodbActionResourceOptsQueryMode)[keyof typeof BridgeMongodbActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeMongodbActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeMongodbActionResourceOptsQueryMode
  request_ttl?: BridgeMongodbActionResourceOptsRequestTtl
  inflight_window?: number
  max_buffer_bytes?: string
}

export interface BridgeMongodbActionParameters {
  collection?: string
  payload_template?: string
}

export interface BridgeMongodbPostBridgeV2 {
  type: BridgeMongodbPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeMongodbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMongodbActionResourceOpts
}

export interface BridgeMatrixPutBridgeV2 {
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeMatrixPostBridgeV2Type =
  (typeof BridgeMatrixPostBridgeV2Type)[keyof typeof BridgeMatrixPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMatrixPostBridgeV2Type = {
  matrix: 'matrix',
} as const

export interface BridgeMatrixPostBridgeV2 {
  type: BridgeMatrixPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeMatrixGetBridgeV2 {
  local_topic?: string
  parameters: BridgePgsqlActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeKinesisPutBridgeV2 {
  local_topic?: string
  parameters: BridgeKinesisActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeKinesisActionResourceOpts
}

export type BridgeKinesisPostBridgeV2Type =
  (typeof BridgeKinesisPostBridgeV2Type)[keyof typeof BridgeKinesisPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisPostBridgeV2Type = {
  kinesis: 'kinesis',
} as const

export interface BridgeKinesisPostBridgeV2 {
  type: BridgeKinesisPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeKinesisActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeKinesisActionResourceOpts
}

export type BridgeKinesisGetBridgeV2Status =
  (typeof BridgeKinesisGetBridgeV2Status)[keyof typeof BridgeKinesisGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeKinesisGetBridgeV2Type =
  (typeof BridgeKinesisGetBridgeV2Type)[keyof typeof BridgeKinesisGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisGetBridgeV2Type = {
  kinesis: 'kinesis',
} as const

export interface BridgeKinesisGetBridgeV2 {
  type: BridgeKinesisGetBridgeV2Type
  name: string
  status?: BridgeKinesisGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeKinesisActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeKinesisActionResourceOpts
}

export type BridgeKinesisActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeKinesisActionResourceOptsQueryMode =
  (typeof BridgeKinesisActionResourceOptsQueryMode)[keyof typeof BridgeKinesisActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeKinesisActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeKinesisActionResourceOptsQueryMode
  request_ttl?: BridgeKinesisActionResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  max_buffer_bytes?: string
}

export interface BridgeKinesisActionParameters {
  payload_template?: string
  stream_name: string
  partition_key: string
}

export interface BridgeKafkaResourceOpts {
  health_check_interval?: string
}

export interface BridgeKafkaPutBridgeV2 {
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: BridgeKafkaProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type BridgeKafkaProducerKafkaOptsQueryMode =
  (typeof BridgeKafkaProducerKafkaOptsQueryMode)[keyof typeof BridgeKafkaProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export type BridgeKafkaProducerKafkaOptsPartitionsLimit = number | 'all_partitions'

export type BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode =
  (typeof BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode)[keyof typeof BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsKafkaHeaderValueEncodeMode = {
  none: 'none',
  json: 'json',
} as const

export type BridgeKafkaProducerKafkaOptsRequiredAcks =
  (typeof BridgeKafkaProducerKafkaOptsRequiredAcks)[keyof typeof BridgeKafkaProducerKafkaOptsRequiredAcks]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsRequiredAcks = {
  all_isr: 'all_isr',
  leader_only: 'leader_only',
  none: 'none',
} as const

export type BridgeKafkaProducerKafkaOptsPartitionStrategy =
  (typeof BridgeKafkaProducerKafkaOptsPartitionStrategy)[keyof typeof BridgeKafkaProducerKafkaOptsPartitionStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaProducerKafkaOptsPartitionStrategy = {
  random: 'random',
  key_dispatch: 'key_dispatch',
} as const

export type BridgeKafkaProducerKafkaOptsCompression =
  (typeof BridgeKafkaProducerKafkaOptsCompression)[keyof typeof BridgeKafkaProducerKafkaOptsCompression]

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
  max_linger_time?: string
  max_linger_bytes?: string
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
  (typeof BridgeKafkaProducerBufferMode)[keyof typeof BridgeKafkaProducerBufferMode]

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

export type BridgeKafkaPostBridgeV2Type =
  (typeof BridgeKafkaPostBridgeV2Type)[keyof typeof BridgeKafkaPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaPostBridgeV2Type = {
  kafka_producer: 'kafka_producer',
} as const

export interface BridgeKafkaPostBridgeV2 {
  type: BridgeKafkaPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
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
  (typeof BridgeKafkaGetBridgeV2Type)[keyof typeof BridgeKafkaGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetBridgeV2Type = {
  kafka_producer: 'kafka_producer',
} as const

export type BridgeKafkaGetBridgeV2Status =
  (typeof BridgeKafkaGetBridgeV2Status)[keyof typeof BridgeKafkaGetBridgeV2Status]

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
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: BridgeKafkaProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export interface BridgeIotdbPutBridgeV2 {
  local_topic?: string
  parameters: BridgeIotdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeIotdbActionResourceOpts
}

export type BridgeIotdbPostBridgeV2Type =
  (typeof BridgeIotdbPostBridgeV2Type)[keyof typeof BridgeIotdbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbPostBridgeV2Type = {
  iotdb: 'iotdb',
} as const

export type BridgeIotdbGetBridgeV2Type =
  (typeof BridgeIotdbGetBridgeV2Type)[keyof typeof BridgeIotdbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbGetBridgeV2Type = {
  iotdb: 'iotdb',
} as const

export type BridgeIotdbGetBridgeV2Status =
  (typeof BridgeIotdbGetBridgeV2Status)[keyof typeof BridgeIotdbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeIotdbGetBridgeV2 {
  status?: BridgeIotdbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeIotdbGetBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeIotdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeIotdbActionResourceOpts
}

export type BridgeIotdbActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeIotdbActionResourceOptsQueryMode =
  (typeof BridgeIotdbActionResourceOptsQueryMode)[keyof typeof BridgeIotdbActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeIotdbActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeIotdbActionResourceOptsQueryMode
  request_ttl?: BridgeIotdbActionResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  max_buffer_bytes?: string
}

export type BridgeIotdbActionParametersDataDataType =
  (typeof BridgeIotdbActionParametersDataDataType)[keyof typeof BridgeIotdbActionParametersDataDataType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbActionParametersDataDataType = {
  text: 'text',
  boolean: 'boolean',
  int32: 'int32',
  int64: 'int64',
  float: 'float',
  double: 'double',
} as const

export type BridgeIotdbActionParametersDataTimestamp =
  | string
  | 'now'
  | 'now_ms'
  | 'now_ns'
  | 'now_us'

export interface BridgeIotdbActionParametersData {
  timestamp?: BridgeIotdbActionParametersDataTimestamp
  measurement: string
  data_type: BridgeIotdbActionParametersDataDataType
  value: string
}

export interface BridgeIotdbActionParameters {
  is_aligned?: boolean
  device_id?: string
  data: BridgeIotdbActionParametersData[]
  max_retries?: number
}

export interface BridgeIotdbPostBridgeV2 {
  type: BridgeIotdbPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeIotdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeIotdbActionResourceOpts
}

export interface BridgeInfluxdbPutBridgeV2 {
  local_topic?: string
  parameters: BridgeInfluxdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeInfluxdbPostBridgeV2Type =
  (typeof BridgeInfluxdbPostBridgeV2Type)[keyof typeof BridgeInfluxdbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPostBridgeV2Type = {
  influxdb: 'influxdb',
} as const

export interface BridgeInfluxdbPostBridgeV2 {
  type: BridgeInfluxdbPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeInfluxdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeInfluxdbGetBridgeV2Status =
  (typeof BridgeInfluxdbGetBridgeV2Status)[keyof typeof BridgeInfluxdbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeInfluxdbGetBridgeV2Type =
  (typeof BridgeInfluxdbGetBridgeV2Type)[keyof typeof BridgeInfluxdbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetBridgeV2Type = {
  influxdb: 'influxdb',
} as const

export type BridgeInfluxdbActionParametersPrecision =
  (typeof BridgeInfluxdbActionParametersPrecision)[keyof typeof BridgeInfluxdbActionParametersPrecision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbActionParametersPrecision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeInfluxdbActionParameters {
  write_syntax: string
  precision?: BridgeInfluxdbActionParametersPrecision
}

export interface BridgeInfluxdbGetBridgeV2 {
  type: BridgeInfluxdbGetBridgeV2Type
  name: string
  status?: BridgeInfluxdbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeInfluxdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeHttpPutBridgeV2 {
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export interface BridgeMqttPublisherPostBridgeV2 {
  type: BridgeMqttPublisherPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeMqttPublisherActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export type BridgeHttpPostBridgeV2Type =
  (typeof BridgeHttpPostBridgeV2Type)[keyof typeof BridgeHttpPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostBridgeV2Type = {
  http: 'http',
} as const

export type BridgeHttpParametersOptsHeaders = { [key: string]: any }

export type BridgeHttpParametersOptsMethod =
  (typeof BridgeHttpParametersOptsMethod)[keyof typeof BridgeHttpParametersOptsMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpParametersOptsMethod = {
  post: 'post',
  put: 'put',
  get: 'get',
  delete: 'delete',
} as const

export interface BridgeHttpParametersOpts {
  path?: string
  method?: BridgeHttpParametersOptsMethod
  headers?: BridgeHttpParametersOptsHeaders
  body?: string
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
}

export interface BridgeHttpPutBridgeV2 {
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHttpParametersOpts
  resource_opts?: BridgeHttpActionResourceOpts
}

export interface BridgeHttpPostBridgeV2 {
  type: BridgeHttpPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHttpParametersOpts
  resource_opts?: BridgeHttpActionResourceOpts
}

export type BridgeHttpGetBridgeV2Type =
  (typeof BridgeHttpGetBridgeV2Type)[keyof typeof BridgeHttpGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetBridgeV2Type = {
  http: 'http',
} as const

export type BridgeHttpGetBridgeV2Status =
  (typeof BridgeHttpGetBridgeV2Status)[keyof typeof BridgeHttpGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeHttpActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeHttpActionResourceOptsQueryMode =
  (typeof BridgeHttpActionResourceOptsQueryMode)[keyof typeof BridgeHttpActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeHttpActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeHttpActionResourceOptsQueryMode
  request_ttl?: BridgeHttpActionResourceOptsRequestTtl
  inflight_window?: number
  max_buffer_bytes?: string
}

export interface BridgeHttpGetBridgeV2 {
  status?: BridgeHttpGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeHttpGetBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHttpParametersOpts
  resource_opts?: BridgeHttpActionResourceOpts
}

export interface BridgeHstreamdbPutBridgeV2 {
  local_topic?: string
  parameters: BridgeHstreamdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeHstreamdbPostBridgeV2Type =
  (typeof BridgeHstreamdbPostBridgeV2Type)[keyof typeof BridgeHstreamdbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbPostBridgeV2Type = {
  hstreamdb: 'hstreamdb',
} as const

export interface BridgeHstreamdbPostBridgeV2 {
  type: BridgeHstreamdbPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeHstreamdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeHstreamdbGetBridgeV2Status =
  (typeof BridgeHstreamdbGetBridgeV2Status)[keyof typeof BridgeHstreamdbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeHstreamdbGetBridgeV2Type =
  (typeof BridgeHstreamdbGetBridgeV2Type)[keyof typeof BridgeHstreamdbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbGetBridgeV2Type = {
  hstreamdb: 'hstreamdb',
} as const

export interface BridgeHstreamdbActionParameters {
  stream: string
  partition_key?: string
  grpc_flush_timeout?: string
  record_template?: string
  aggregation_pool_size?: number
  max_batches?: number
  writer_pool_size?: number
  batch_size?: number
  batch_interval?: string
}

export interface BridgeHstreamdbGetBridgeV2 {
  type: BridgeHstreamdbGetBridgeV2Type
  name: string
  status?: BridgeHstreamdbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeHstreamdbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeGreptimedbPutBridgeV2 {
  local_topic?: string
  parameters: BridgeGreptimedbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeGreptimedbPostBridgeV2Type =
  (typeof BridgeGreptimedbPostBridgeV2Type)[keyof typeof BridgeGreptimedbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbPostBridgeV2Type = {
  greptimedb: 'greptimedb',
} as const

export interface BridgeGreptimedbPostBridgeV2 {
  type: BridgeGreptimedbPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeGreptimedbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeGreptimedbGetBridgeV2Status =
  (typeof BridgeGreptimedbGetBridgeV2Status)[keyof typeof BridgeGreptimedbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeGreptimedbGetBridgeV2Type =
  (typeof BridgeGreptimedbGetBridgeV2Type)[keyof typeof BridgeGreptimedbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbGetBridgeV2Type = {
  greptimedb: 'greptimedb',
} as const

export interface BridgeGreptimedbGetBridgeV2 {
  type: BridgeGreptimedbGetBridgeV2Type
  name: string
  status?: BridgeGreptimedbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeGreptimedbActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeGreptimedbActionParametersPrecision =
  (typeof BridgeGreptimedbActionParametersPrecision)[keyof typeof BridgeGreptimedbActionParametersPrecision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbActionParametersPrecision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeGreptimedbActionParameters {
  write_syntax: string
  precision?: BridgeGreptimedbActionParametersPrecision
}

export interface BridgeGcpPubsubKeyValuePair {
  key: string
  value: string
}

export interface BridgeElasticsearchPutBridgeV2 {
  parameters: BridgeElasticsearchPutBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeElasticsearchActionResourceOpts
}

export type BridgeElasticsearchPostBridgeV2Type =
  (typeof BridgeElasticsearchPostBridgeV2Type)[keyof typeof BridgeElasticsearchPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchPostBridgeV2Type = {
  elasticsearch: 'elasticsearch',
} as const

export interface BridgeElasticsearchPostBridgeV2 {
  type: BridgeElasticsearchPostBridgeV2Type
  name: string
  parameters: BridgeElasticsearchPostBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeElasticsearchActionResourceOpts
}

export type BridgeElasticsearchGetBridgeV2Type =
  (typeof BridgeElasticsearchGetBridgeV2Type)[keyof typeof BridgeElasticsearchGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchGetBridgeV2Type = {
  elasticsearch: 'elasticsearch',
} as const

export type BridgeElasticsearchGetBridgeV2Status =
  (typeof BridgeElasticsearchGetBridgeV2Status)[keyof typeof BridgeElasticsearchGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeElasticsearchActionUpdateAction =
  (typeof BridgeElasticsearchActionUpdateAction)[keyof typeof BridgeElasticsearchActionUpdateAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchActionUpdateAction = {
  update: 'update',
} as const

export interface BridgeElasticsearchActionUpdate {
  action: BridgeElasticsearchActionUpdateAction
  index: string
  id: string
  doc?: string
  doc_as_upsert?: boolean
  routing?: string
  require_alias?: boolean
  max_retries?: number
}

export type BridgeElasticsearchActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeElasticsearchActionResourceOptsQueryMode =
  (typeof BridgeElasticsearchActionResourceOptsQueryMode)[keyof typeof BridgeElasticsearchActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeElasticsearchActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeElasticsearchActionResourceOptsQueryMode
  request_ttl?: BridgeElasticsearchActionResourceOptsRequestTtl
  inflight_window?: number
  max_buffer_bytes?: string
}

export type BridgeElasticsearchActionDeleteAction =
  (typeof BridgeElasticsearchActionDeleteAction)[keyof typeof BridgeElasticsearchActionDeleteAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchActionDeleteAction = {
  delete: 'delete',
} as const

export interface BridgeElasticsearchActionDelete {
  action: BridgeElasticsearchActionDeleteAction
  index: string
  id: string
  routing?: string
  max_retries?: number
}

export type BridgeElasticsearchActionCreateAction =
  (typeof BridgeElasticsearchActionCreateAction)[keyof typeof BridgeElasticsearchActionCreateAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchActionCreateAction = {
  create: 'create',
} as const

export interface BridgeElasticsearchActionCreate {
  action: BridgeElasticsearchActionCreateAction
  index: string
  id?: string
  doc?: string
  routing?: string
  require_alias?: boolean
  overwrite?: boolean
  max_retries?: number
}

export type BridgeElasticsearchPutBridgeV2Parameters =
  | BridgeElasticsearchActionUpdate
  | BridgeElasticsearchActionDelete
  | BridgeElasticsearchActionCreate

export type BridgeElasticsearchPostBridgeV2Parameters =
  | BridgeElasticsearchActionUpdate
  | BridgeElasticsearchActionDelete
  | BridgeElasticsearchActionCreate

export type BridgeElasticsearchGetBridgeV2Parameters =
  | BridgeElasticsearchActionUpdate
  | BridgeElasticsearchActionDelete
  | BridgeElasticsearchActionCreate

export interface BridgeElasticsearchGetBridgeV2 {
  status?: BridgeElasticsearchGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeElasticsearchGetBridgeV2Type
  name: string
  parameters: BridgeElasticsearchGetBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeElasticsearchActionResourceOpts
}

export type BridgeDynamoPostBridgeV2Type =
  (typeof BridgeDynamoPostBridgeV2Type)[keyof typeof BridgeDynamoPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoPostBridgeV2Type = {
  dynamo: 'dynamo',
} as const

export type BridgeDynamoGetBridgeV2Status =
  (typeof BridgeDynamoGetBridgeV2Status)[keyof typeof BridgeDynamoGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeDynamoGetBridgeV2Type =
  (typeof BridgeDynamoGetBridgeV2Type)[keyof typeof BridgeDynamoGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoGetBridgeV2Type = {
  dynamo: 'dynamo',
} as const

export interface BridgeDynamoActionParameters {
  template?: string
  hash_key: string
  range_key?: string
  table: string
  undefined_vars_as_null?: boolean
}

export interface BridgeDynamoPutBridgeV2 {
  local_topic?: string
  parameters: BridgeDynamoActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeDynamoPostBridgeV2 {
  type: BridgeDynamoPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeDynamoActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeDynamoGetBridgeV2 {
  type: BridgeDynamoGetBridgeV2Type
  name: string
  status?: BridgeDynamoGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeDynamoActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeDatalayersPutBridgeV2 {
  local_topic?: string
  parameters: BridgeDatalayersActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeDatalayersPostBridgeV2Type =
  (typeof BridgeDatalayersPostBridgeV2Type)[keyof typeof BridgeDatalayersPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDatalayersPostBridgeV2Type = {
  datalayers: 'datalayers',
} as const

export type BridgeDatalayersGetBridgeV2Status =
  (typeof BridgeDatalayersGetBridgeV2Status)[keyof typeof BridgeDatalayersGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDatalayersGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeDatalayersGetBridgeV2Type =
  (typeof BridgeDatalayersGetBridgeV2Type)[keyof typeof BridgeDatalayersGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDatalayersGetBridgeV2Type = {
  datalayers: 'datalayers',
} as const

export interface BridgeDatalayersGetBridgeV2 {
  type: BridgeDatalayersGetBridgeV2Type
  name: string
  status?: BridgeDatalayersGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeDatalayersActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeDatalayersActionParametersPrecision =
  (typeof BridgeDatalayersActionParametersPrecision)[keyof typeof BridgeDatalayersActionParametersPrecision]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDatalayersActionParametersPrecision = {
  ns: 'ns',
  us: 'us',
  ms: 'ms',
  s: 's',
} as const

export interface BridgeDatalayersActionParameters {
  write_syntax: string
  precision?: BridgeDatalayersActionParametersPrecision
}

export interface BridgeDatalayersPostBridgeV2 {
  type: BridgeDatalayersPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeDatalayersActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeClickhousePutBridgeV2 {
  local_topic?: string
  parameters: BridgeClickhouseActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeClickhousePostBridgeV2Type =
  (typeof BridgeClickhousePostBridgeV2Type)[keyof typeof BridgeClickhousePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhousePostBridgeV2Type = {
  clickhouse: 'clickhouse',
} as const

export type BridgeClickhouseGetBridgeV2Status =
  (typeof BridgeClickhouseGetBridgeV2Status)[keyof typeof BridgeClickhouseGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhouseGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeClickhouseGetBridgeV2Type =
  (typeof BridgeClickhouseGetBridgeV2Type)[keyof typeof BridgeClickhouseGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhouseGetBridgeV2Type = {
  clickhouse: 'clickhouse',
} as const

export interface BridgeClickhouseActionParameters {
  sql?: string
  undefined_vars_as_null?: boolean
  batch_value_separator?: string
}

export interface BridgeClickhousePostBridgeV2 {
  type: BridgeClickhousePostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeClickhouseActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeClickhouseGetBridgeV2 {
  type: BridgeClickhouseGetBridgeV2Type
  name: string
  status?: BridgeClickhouseGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeClickhouseActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeCassaPostBridgeV2Type =
  (typeof BridgeCassaPostBridgeV2Type)[keyof typeof BridgeCassaPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaPostBridgeV2Type = {
  cassandra: 'cassandra',
} as const

export interface BridgeCassaPostBridgeV2 {
  type: BridgeCassaPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeCassaActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeCassaGetBridgeV2Status =
  (typeof BridgeCassaGetBridgeV2Status)[keyof typeof BridgeCassaGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeCassaGetBridgeV2Type =
  (typeof BridgeCassaGetBridgeV2Type)[keyof typeof BridgeCassaGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaGetBridgeV2Type = {
  cassandra: 'cassandra',
} as const

export interface BridgeCassaActionParameters {
  cql?: string
}

export interface BridgeCassaPutBridgeV2 {
  local_topic?: string
  parameters: BridgeCassaActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeCassaGetBridgeV2 {
  type: BridgeCassaGetBridgeV2Type
  name: string
  status?: BridgeCassaGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeCassaActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeAzureEventHubProducerKafkaOptsQueryMode =
  (typeof BridgeAzureEventHubProducerKafkaOptsQueryMode)[keyof typeof BridgeAzureEventHubProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export interface BridgeAzureEventHubProducerKafkaOpts {
  topic: string
  message?: BridgeAzureEventHubKafkaMessage
  max_linger_time?: string
  max_linger_bytes?: string
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

export interface BridgeAzureEventHubPutBridgeV2 {
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: BridgeAzureEventHubProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type BridgeAzureEventHubProducerKafkaOptsPartitionsLimit = number | 'all_partitions'

export type BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode =
  (typeof BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode)[keyof typeof BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsKafkaHeaderValueEncodeMode = {
  none: 'none',
  json: 'json',
} as const

export type BridgeAzureEventHubProducerKafkaOptsRequiredAcks =
  (typeof BridgeAzureEventHubProducerKafkaOptsRequiredAcks)[keyof typeof BridgeAzureEventHubProducerKafkaOptsRequiredAcks]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsRequiredAcks = {
  all_isr: 'all_isr',
  leader_only: 'leader_only',
} as const

export type BridgeAzureEventHubProducerKafkaOptsPartitionStrategy =
  (typeof BridgeAzureEventHubProducerKafkaOptsPartitionStrategy)[keyof typeof BridgeAzureEventHubProducerKafkaOptsPartitionStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubProducerKafkaOptsPartitionStrategy = {
  random: 'random',
  key_dispatch: 'key_dispatch',
} as const

export type BridgeAzureEventHubPostBridgeV2Type =
  (typeof BridgeAzureEventHubPostBridgeV2Type)[keyof typeof BridgeAzureEventHubPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubPostBridgeV2Type = {
  azure_event_hub_producer: 'azure_event_hub_producer',
} as const

export interface BridgeAzureEventHubPostBridgeV2 {
  type: BridgeAzureEventHubPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
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
  (typeof BridgeAzureEventHubGetBridgeV2Type)[keyof typeof BridgeAzureEventHubGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetBridgeV2Type = {
  azure_event_hub_producer: 'azure_event_hub_producer',
} as const

export type BridgeAzureEventHubGetBridgeV2Status =
  (typeof BridgeAzureEventHubGetBridgeV2Status)[keyof typeof BridgeAzureEventHubGetBridgeV2Status]

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
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: BridgeAzureEventHubProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type ActionsAndSourcesActionResourceOptsRequestTtl = 'infinity' | string

export type ActionsAndSourcesActionResourceOptsQueryMode =
  (typeof ActionsAndSourcesActionResourceOptsQueryMode)[keyof typeof ActionsAndSourcesActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionsAndSourcesActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface ActionsAndSourcesActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: ActionsAndSourcesActionResourceOptsQueryMode
  request_ttl?: ActionsAndSourcesActionResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  max_buffer_bytes?: string
}

export interface ActionSnowflakePutBridgeV2 {
  local_topic?: string
  parameters: ActionSnowflakeAggregParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionSnowflakeActionResourceOpts
}

export interface ActionSnowflakeProxyConfig {
  host: string
  port: number
}

export type ActionSnowflakePostBridgeV2Type =
  (typeof ActionSnowflakePostBridgeV2Type)[keyof typeof ActionSnowflakePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionSnowflakePostBridgeV2Type = {
  snowflake: 'snowflake',
} as const

export interface ActionSnowflakePostBridgeV2 {
  type: ActionSnowflakePostBridgeV2Type
  name: string
  local_topic?: string
  parameters: ActionSnowflakeAggregParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionSnowflakeActionResourceOpts
}

export type ActionSnowflakeGetBridgeV2Status =
  (typeof ActionSnowflakeGetBridgeV2Status)[keyof typeof ActionSnowflakeGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionSnowflakeGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type ActionSnowflakeGetBridgeV2Type =
  (typeof ActionSnowflakeGetBridgeV2Type)[keyof typeof ActionSnowflakeGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionSnowflakeGetBridgeV2Type = {
  snowflake: 'snowflake',
} as const

export interface ActionSnowflakeGetBridgeV2 {
  type: ActionSnowflakeGetBridgeV2Type
  name: string
  status?: ActionSnowflakeGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: ActionSnowflakeAggregParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionSnowflakeActionResourceOpts
}

export interface ActionSnowflakeAggregation {
  container: ConnectorAggregatorContainerCsv
  time_interval?: string
  max_records?: number
}

export type ActionSnowflakeAggregParametersProxy = ActionSnowflakeProxyConfig | 'none'

export type ActionSnowflakeAggregParametersMode =
  (typeof ActionSnowflakeAggregParametersMode)[keyof typeof ActionSnowflakeAggregParametersMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionSnowflakeAggregParametersMode = {
  aggregated: 'aggregated',
} as const

export interface ActionSnowflakeAggregParameters {
  mode: ActionSnowflakeAggregParametersMode
  aggregation: ActionSnowflakeAggregation
  private_key: string
  database: string
  schema: string
  stage: string
  pipe: string
  pipe_user: string
  connect_timeout?: string
  pipelining?: number
  pool_size?: number
  max_retries?: number
  proxy?: ActionSnowflakeAggregParametersProxy
}

export type ActionSnowflakeActionResourceOptsRequestTtl = 'infinity' | string

export type ActionSnowflakeActionResourceOptsQueryMode =
  (typeof ActionSnowflakeActionResourceOptsQueryMode)[keyof typeof ActionSnowflakeActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionSnowflakeActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface ActionSnowflakeActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: ActionSnowflakeActionResourceOptsQueryMode
  request_ttl?: ActionSnowflakeActionResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  max_buffer_bytes?: string
}

export type ActionCouchbasePostBridgeV2Type =
  (typeof ActionCouchbasePostBridgeV2Type)[keyof typeof ActionCouchbasePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionCouchbasePostBridgeV2Type = {
  couchbase: 'couchbase',
} as const

export interface ActionCouchbaseParameters {
  sql: string
  max_retries?: number
}

export interface ActionCouchbasePutBridgeV2 {
  local_topic?: string
  parameters: ActionCouchbaseParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionCouchbaseActionResourceOpts
}

export interface ActionCouchbasePostBridgeV2 {
  type: ActionCouchbasePostBridgeV2Type
  name: string
  local_topic?: string
  parameters: ActionCouchbaseParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionCouchbaseActionResourceOpts
}

export type ActionCouchbaseGetBridgeV2Status =
  (typeof ActionCouchbaseGetBridgeV2Status)[keyof typeof ActionCouchbaseGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionCouchbaseGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type ActionCouchbaseGetBridgeV2Type =
  (typeof ActionCouchbaseGetBridgeV2Type)[keyof typeof ActionCouchbaseGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionCouchbaseGetBridgeV2Type = {
  couchbase: 'couchbase',
} as const

export interface ActionCouchbaseGetBridgeV2 {
  type: ActionCouchbaseGetBridgeV2Type
  name: string
  status?: ActionCouchbaseGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: ActionCouchbaseParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionCouchbaseActionResourceOpts
}

export type ActionCouchbaseActionResourceOptsRequestTtl = 'infinity' | string

export type ActionCouchbaseActionResourceOptsQueryMode =
  (typeof ActionCouchbaseActionResourceOptsQueryMode)[keyof typeof ActionCouchbaseActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionCouchbaseActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface ActionCouchbaseActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: ActionCouchbaseActionResourceOptsQueryMode
  request_ttl?: ActionCouchbaseActionResourceOptsRequestTtl
  inflight_window?: number
  max_buffer_bytes?: string
}

export type ActionAzureBlobStoragePutBridgeV2Parameters =
  | ActionAzureBlobStorageDirectParameters
  | ActionAzureBlobStorageAggregParameters

export interface ActionAzureBlobStoragePutBridgeV2 {
  local_topic?: string
  parameters: ActionAzureBlobStoragePutBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionAzureBlobStorageActionResourceOpts
}

export type ActionAzureBlobStoragePostBridgeV2Type =
  (typeof ActionAzureBlobStoragePostBridgeV2Type)[keyof typeof ActionAzureBlobStoragePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionAzureBlobStoragePostBridgeV2Type = {
  azure_blob_storage: 'azure_blob_storage',
} as const

export type ActionAzureBlobStorageGetBridgeV2Parameters =
  | ActionAzureBlobStorageDirectParameters
  | ActionAzureBlobStorageAggregParameters

export type ActionAzureBlobStorageGetBridgeV2Status =
  (typeof ActionAzureBlobStorageGetBridgeV2Status)[keyof typeof ActionAzureBlobStorageGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionAzureBlobStorageGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type ActionAzureBlobStorageGetBridgeV2Type =
  (typeof ActionAzureBlobStorageGetBridgeV2Type)[keyof typeof ActionAzureBlobStorageGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionAzureBlobStorageGetBridgeV2Type = {
  azure_blob_storage: 'azure_blob_storage',
} as const

export interface ActionAzureBlobStorageGetBridgeV2 {
  type: ActionAzureBlobStorageGetBridgeV2Type
  name: string
  status?: ActionAzureBlobStorageGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: ActionAzureBlobStorageGetBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionAzureBlobStorageActionResourceOpts
}

export type ActionAzureBlobStorageDirectParametersMode =
  (typeof ActionAzureBlobStorageDirectParametersMode)[keyof typeof ActionAzureBlobStorageDirectParametersMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionAzureBlobStorageDirectParametersMode = {
  direct: 'direct',
} as const

export interface ActionAzureBlobStorageDirectParameters {
  mode: ActionAzureBlobStorageDirectParametersMode
  container: string
  blob: string
  content?: string
}

export type ActionAzureBlobStoragePostBridgeV2Parameters =
  | ActionAzureBlobStorageDirectParameters
  | ActionAzureBlobStorageAggregParameters

export interface ActionAzureBlobStoragePostBridgeV2 {
  type: ActionAzureBlobStoragePostBridgeV2Type
  name: string
  local_topic?: string
  parameters: ActionAzureBlobStoragePostBridgeV2Parameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: ActionAzureBlobStorageActionResourceOpts
}

export interface ActionAzureBlobStorageAggregation {
  container: ConnectorAggregatorContainerCsv
  time_interval?: string
  max_records?: number
}

export type ActionAzureBlobStorageAggregParametersMode =
  (typeof ActionAzureBlobStorageAggregParametersMode)[keyof typeof ActionAzureBlobStorageAggregParametersMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionAzureBlobStorageAggregParametersMode = {
  aggregated: 'aggregated',
} as const

export interface ActionAzureBlobStorageAggregParameters {
  mode: ActionAzureBlobStorageAggregParametersMode
  aggregation: ActionAzureBlobStorageAggregation
  container: string
  blob: string
}

export type ActionAzureBlobStorageActionResourceOptsRequestTtl = 'infinity' | string

export type ActionAzureBlobStorageActionResourceOptsQueryMode =
  (typeof ActionAzureBlobStorageActionResourceOptsQueryMode)[keyof typeof ActionAzureBlobStorageActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionAzureBlobStorageActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface ActionAzureBlobStorageActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: ActionAzureBlobStorageActionResourceOptsQueryMode
  request_ttl?: ActionAzureBlobStorageActionResourceOptsRequestTtl
  inflight_window?: number
  batch_size?: number
  batch_time?: string
  max_buffer_bytes?: string
}
