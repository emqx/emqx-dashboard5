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
  | BridgeTdengineGetBridgeV2
  | SyskeeperGetBridgeV2
  | BridgeSqlserverGetBridgeV2
  | BridgeS3GetBridgeV2
  | BridgeS3GetBridgeV2
  | RocketmqGetBridgeV2
  | RedisGetBridgeV2
  | BridgeRabbitmqGetBridgeV2
  | PulsarGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeOracleGetBridgeV2
  | BridgeOpentsGetBridgeV2
  | BridgeMysqlGetBridgeV2
  | BridgeMqttPublisherGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeKinesisGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | BridgeIotdbGetBridgeV2
  | BridgeInfluxdbGetBridgeV2
  | BridgeHttpGetBridgeV2
  | BridgeHstreamdbGetBridgeV2
  | BridgeGreptimedbGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | BridgeElasticsearchGetBridgeV2
  | BridgeDynamoGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeClickhouseGetBridgeV2
  | BridgeCassaGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2

export type PutActionsIdBody =
  | BridgeTimescalePutBridgeV2
  | BridgeTdenginePutBridgeV2
  | SyskeeperPutBridgeV2
  | BridgeSqlserverPutBridgeV2
  | BridgeS3PutBridgeV2
  | BridgeS3PutBridgeV2
  | RocketmqPutBridgeV2
  | RedisPutBridgeV2
  | BridgeRabbitmqPutBridgeV2
  | PulsarPutBridgeV2
  | BridgePgsqlPutBridgeV2
  | BridgeOraclePutBridgeV2
  | BridgeOpentsPutBridgeV2
  | BridgeMysqlPutBridgeV2
  | BridgeMqttPublisherPutBridgeV2
  | BridgeMongodbPutBridgeV2
  | BridgeMatrixPutBridgeV2
  | BridgeKinesisPutBridgeV2
  | BridgeKafkaPutBridgeV2
  | BridgeIotdbPutBridgeV2
  | BridgeInfluxdbPutBridgeV2
  | BridgeHttpPutBridgeV2
  | BridgeHstreamdbPutBridgeV2
  | BridgeGreptimedbPutBridgeV2
  | GcpPubsubProducerPutBridgeV2
  | BridgeElasticsearchPutBridgeV2
  | BridgeDynamoPutBridgeV2
  | ConfluentPutBridgeV2
  | BridgeClickhousePutBridgeV2
  | BridgeCassaPutBridgeV2
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
  | BridgeTdengineGetBridgeV2
  | SyskeeperGetBridgeV2
  | BridgeSqlserverGetBridgeV2
  | BridgeS3GetBridgeV2
  | BridgeS3GetBridgeV2
  | RocketmqGetBridgeV2
  | RedisGetBridgeV2
  | BridgeRabbitmqGetBridgeV2
  | PulsarGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeOracleGetBridgeV2
  | BridgeOpentsGetBridgeV2
  | BridgeMysqlGetBridgeV2
  | BridgeMqttPublisherGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeKinesisGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | BridgeIotdbGetBridgeV2
  | BridgeInfluxdbGetBridgeV2
  | BridgeHttpGetBridgeV2
  | BridgeHstreamdbGetBridgeV2
  | BridgeGreptimedbGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | BridgeElasticsearchGetBridgeV2
  | BridgeDynamoGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeClickhouseGetBridgeV2
  | BridgeCassaGetBridgeV2
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
  rules?: string[]
  code?: DeleteActionsId400Code
  message?: string
}

export type DeleteActionsIdParams = {
  also_delete_dep_actions?: boolean
}

export type GetActionTypes200Item = typeof GetActionTypes200Item[keyof typeof GetActionTypes200Item]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetActionTypes200Item = {
  http: 'http',
  rabbitmq: 'rabbitmq',
  rocketmq: 'rocketmq',
  cassandra: 'cassandra',
  influxdb: 'influxdb',
  pulsar: 'pulsar',
  syskeeper_forwarder: 'syskeeper_forwarder',
  azure_event_hub_producer: 'azure_event_hub_producer',
  confluent_producer: 'confluent_producer',
  hstreamdb: 'hstreamdb',
  greptimedb: 'greptimedb',
  gcp_pubsub_producer: 'gcp_pubsub_producer',
  iotdb: 'iotdb',
  sqlserver: 'sqlserver',
  kafka_producer: 'kafka_producer',
  mongodb: 'mongodb',
  kinesis: 'kinesis',
  opents: 'opents',
  redis: 'redis',
  s3: 's3',
  mqtt: 'mqtt',
  s3_aggregated_upload: 's3_aggregated_upload',
  clickhouse: 'clickhouse',
  tdengine: 'tdengine',
  oracle: 'oracle',
  timescale: 'timescale',
  elasticsearch: 'elasticsearch',
  matrix: 'matrix',
  mysql: 'mysql',
  pgsql: 'pgsql',
  dynamo: 'dynamo',
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
  | BridgeTdenginePostBridgeV2
  | SyskeeperPostBridgeV2
  | BridgeSqlserverPostBridgeV2
  | BridgeS3PostBridgeV2
  | BridgeS3PostBridgeV2
  | RocketmqPostBridgeV2
  | RedisPostBridgeV2
  | BridgeRabbitmqPostBridgeV2
  | PulsarPostBridgeV2
  | BridgePgsqlPostBridgeV2
  | BridgeOraclePostBridgeV2
  | BridgeOpentsPostBridgeV2
  | BridgeMysqlPostBridgeV2
  | BridgeMqttPublisherPostBridgeV2
  | BridgeMongodbPostBridgeV2
  | BridgeMatrixPostBridgeV2
  | BridgeKinesisPostBridgeV2
  | BridgeKafkaPostBridgeV2
  | BridgeIotdbPostBridgeV2
  | BridgeInfluxdbPostBridgeV2
  | BridgeHttpPostBridgeV2
  | BridgeHstreamdbPostBridgeV2
  | BridgeGreptimedbPostBridgeV2
  | GcpPubsubProducerPostBridgeV2
  | BridgeElasticsearchPostBridgeV2
  | BridgeDynamoPostBridgeV2
  | ConfluentPostBridgeV2
  | BridgeClickhousePostBridgeV2
  | BridgeCassaPostBridgeV2
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
  | BridgeTdengineGetBridgeV2
  | SyskeeperGetBridgeV2
  | BridgeSqlserverGetBridgeV2
  | BridgeS3GetBridgeV2
  | BridgeS3GetBridgeV2
  | RocketmqGetBridgeV2
  | RedisGetBridgeV2
  | BridgeRabbitmqGetBridgeV2
  | PulsarGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeOracleGetBridgeV2
  | BridgeOpentsGetBridgeV2
  | BridgeMysqlGetBridgeV2
  | BridgeMqttPublisherGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeKinesisGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | BridgeIotdbGetBridgeV2
  | BridgeInfluxdbGetBridgeV2
  | BridgeHttpGetBridgeV2
  | BridgeHstreamdbGetBridgeV2
  | BridgeGreptimedbGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | BridgeElasticsearchGetBridgeV2
  | BridgeDynamoGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeClickhouseGetBridgeV2
  | BridgeCassaGetBridgeV2
  | BridgeAzureEventHubGetBridgeV2

export type PostActionsBody =
  | BridgeTimescalePostBridgeV2
  | BridgeTdenginePostBridgeV2
  | SyskeeperPostBridgeV2
  | BridgeSqlserverPostBridgeV2
  | BridgeS3PostBridgeV2
  | BridgeS3PostBridgeV2
  | RocketmqPostBridgeV2
  | RedisPostBridgeV2
  | BridgeRabbitmqPostBridgeV2
  | PulsarPostBridgeV2
  | BridgePgsqlPostBridgeV2
  | BridgeOraclePostBridgeV2
  | BridgeOpentsPostBridgeV2
  | BridgeMysqlPostBridgeV2
  | BridgeMqttPublisherPostBridgeV2
  | BridgeMongodbPostBridgeV2
  | BridgeMatrixPostBridgeV2
  | BridgeKinesisPostBridgeV2
  | BridgeKafkaPostBridgeV2
  | BridgeIotdbPostBridgeV2
  | BridgeInfluxdbPostBridgeV2
  | BridgeHttpPostBridgeV2
  | BridgeHstreamdbPostBridgeV2
  | BridgeGreptimedbPostBridgeV2
  | GcpPubsubProducerPostBridgeV2
  | BridgeElasticsearchPostBridgeV2
  | BridgeDynamoPostBridgeV2
  | ConfluentPostBridgeV2
  | BridgeClickhousePostBridgeV2
  | BridgeCassaPostBridgeV2
  | BridgeAzureEventHubPostBridgeV2

export type GetActions200Item =
  | BridgeTimescaleGetBridgeV2
  | BridgeTdengineGetBridgeV2
  | SyskeeperGetBridgeV2
  | BridgeSqlserverGetBridgeV2
  | BridgeS3GetBridgeV2
  | BridgeS3GetBridgeV2
  | RocketmqGetBridgeV2
  | RedisGetBridgeV2
  | BridgeRabbitmqGetBridgeV2
  | PulsarGetBridgeV2
  | BridgePgsqlGetBridgeV2
  | BridgeOracleGetBridgeV2
  | BridgeOpentsGetBridgeV2
  | BridgeMysqlGetBridgeV2
  | BridgeMqttPublisherGetBridgeV2
  | BridgeMongodbGetBridgeV2
  | BridgeMatrixGetBridgeV2
  | BridgeKinesisGetBridgeV2
  | BridgeKafkaGetBridgeV2
  | BridgeIotdbGetBridgeV2
  | BridgeInfluxdbGetBridgeV2
  | BridgeHttpGetBridgeV2
  | BridgeHstreamdbGetBridgeV2
  | BridgeGreptimedbGetBridgeV2
  | GcpPubsubProducerGetBridgeV2
  | BridgeElasticsearchGetBridgeV2
  | BridgeDynamoGetBridgeV2
  | ConfluentGetBridgeV2
  | BridgeClickhouseGetBridgeV2
  | BridgeCassaGetBridgeV2
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
  tags?: string[]
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
  tags?: string[]
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

export interface SyskeeperGetBridgeV2 {
  status?: SyskeeperGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: SyskeeperGetBridgeV2Type
  name: string
  enable?: boolean
  tags?: string[]
  description?: string
  connector: string
  parameters: SyskeeperParameters
  local_topic?: string
  resource_opts?: SyskeeperCreationOpts
}

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

export type RocketmqPostBridgeV2Type =
  typeof RocketmqPostBridgeV2Type[keyof typeof RocketmqPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RocketmqPostBridgeV2Type = {
  rocketmq: 'rocketmq',
} as const

export type RocketmqGetBridgeV2Status =
  typeof RocketmqGetBridgeV2Status[keyof typeof RocketmqGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RocketmqGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type RocketmqGetBridgeV2Type =
  typeof RocketmqGetBridgeV2Type[keyof typeof RocketmqGetBridgeV2Type]

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
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: RocketmqActionParameters
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

export interface RocketmqPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: RocketmqActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface RocketmqPostBridgeV2 {
  type: RocketmqPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: RocketmqActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type RedisPostBridgeV2Type = typeof RedisPostBridgeV2Type[keyof typeof RedisPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RedisPostBridgeV2Type = {
  redis: 'redis',
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
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeRedisActionParameters
  resource_opts?: RedisActionResourceOpts
}

export type RedisActionResourceOptsRequestTtl = 'infinity' | string

export type RedisActionResourceOptsQueryMode =
  typeof RedisActionResourceOptsQueryMode[keyof typeof RedisActionResourceOptsQueryMode]

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

export interface RedisPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeRedisActionParameters
  resource_opts?: RedisActionResourceOpts
}

export interface RedisPostBridgeV2 {
  type: RedisPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeRedisActionParameters
  resource_opts?: RedisActionResourceOpts
}

export interface PulsarPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: PulsarActionParameters
  resource_opts?: PulsarActionResourceOpts
}

export interface PulsarProducerPulsarMessage {
  key?: string
  value?: string
}

export type PulsarPostBridgeV2Type =
  typeof PulsarPostBridgeV2Type[keyof typeof PulsarPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarPostBridgeV2Type = {
  pulsar: 'pulsar',
} as const

export type PulsarGetBridgeV2Status =
  typeof PulsarGetBridgeV2Status[keyof typeof PulsarGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type PulsarGetBridgeV2Type = typeof PulsarGetBridgeV2Type[keyof typeof PulsarGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarGetBridgeV2Type = {
  pulsar: 'pulsar',
} as const

export interface PulsarActionResourceOpts {
  health_check_interval?: string
}

export interface PulsarPostBridgeV2 {
  type: PulsarPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: PulsarActionParameters
  resource_opts?: PulsarActionResourceOpts
}

export interface PulsarGetBridgeV2 {
  type: PulsarGetBridgeV2Type
  name: string
  status?: PulsarGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: PulsarActionParameters
  resource_opts?: PulsarActionResourceOpts
}

export type PulsarActionParametersStrategy =
  typeof PulsarActionParametersStrategy[keyof typeof PulsarActionParametersStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PulsarActionParametersStrategy = {
  random: 'random',
  roundrobin: 'roundrobin',
  key_dispatch: 'key_dispatch',
} as const

export type PulsarActionParametersRetentionPeriod = string | 'infinity'

export type PulsarActionParametersCompression =
  typeof PulsarActionParametersCompression[keyof typeof PulsarActionParametersCompression]

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
  tags?: string[]
  description?: string
  parameters: GcpPubsubProducerActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
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

export interface GcpPubsubProducerPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: GcpPubsubProducerActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
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
  tags?: string[]
  description?: string
  parameters: GcpPubsubProducerActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
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
  typeof ConfluentProducerKafkaOptsQueryMode[keyof typeof ConfluentProducerKafkaOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfluentProducerKafkaOptsQueryMode = {
  async: 'async',
  sync: 'sync',
} as const

export type ConfluentProducerKafkaOptsPartitionsLimit = number | 'all_partitions'

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
  partitions_limit?: ConfluentProducerKafkaOptsPartitionsLimit
  max_inflight?: number
  buffer?: BridgeKafkaProducerBuffer
  query_mode?: ConfluentProducerKafkaOptsQueryMode
  sync_query_timeout?: string
}

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
  tags?: string[]
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
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeTimescalePostBridgeV2Type =
  typeof BridgeTimescalePostBridgeV2Type[keyof typeof BridgeTimescalePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTimescalePostBridgeV2Type = {
  timescale: 'timescale',
} as const

export interface BridgeTimescalePostBridgeV2 {
  type: BridgeTimescalePostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeTimescaleGetBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeTdenginePostBridgeV2Type =
  typeof BridgeTdenginePostBridgeV2Type[keyof typeof BridgeTdenginePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTdenginePostBridgeV2Type = {
  tdengine: 'tdengine',
} as const

export type BridgeTdengineGetBridgeV2Type =
  typeof BridgeTdengineGetBridgeV2Type[keyof typeof BridgeTdengineGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeTdengineGetBridgeV2Type = {
  tdengine: 'tdengine',
} as const

export type BridgeTdengineGetBridgeV2Status =
  typeof BridgeTdengineGetBridgeV2Status[keyof typeof BridgeTdengineGetBridgeV2Status]

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
}

export interface BridgeTdenginePutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeTdengineActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeTdenginePostBridgeV2 {
  type: BridgeTdenginePostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeTdengineActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeTdengineGetBridgeV2 {
  status?: BridgeTdengineGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeTdengineGetBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeTdengineActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeSqlserverPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeSqlserverActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeSqlserverPostBridgeV2Type =
  typeof BridgeSqlserverPostBridgeV2Type[keyof typeof BridgeSqlserverPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverPostBridgeV2Type = {
  sqlserver: 'sqlserver',
} as const

export interface BridgeSqlserverPostBridgeV2 {
  type: BridgeSqlserverPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeSqlserverActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeSqlserverGetBridgeV2Status =
  typeof BridgeSqlserverGetBridgeV2Status[keyof typeof BridgeSqlserverGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeSqlserverGetBridgeV2Type =
  typeof BridgeSqlserverGetBridgeV2Type[keyof typeof BridgeSqlserverGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeSqlserverGetBridgeV2Type = {
  sqlserver: 'sqlserver',
} as const

export interface BridgeSqlserverActionParameters {
  sql?: string
}

export interface BridgeSqlserverGetBridgeV2 {
  type: BridgeSqlserverGetBridgeV2Type
  name: string
  status?: BridgeSqlserverGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeSqlserverActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeS3S3UploadParametersHeaders = { [key: string]: any }

export type BridgeS3S3UploadParametersAcl =
  typeof BridgeS3S3UploadParametersAcl[keyof typeof BridgeS3S3UploadParametersAcl]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3S3UploadParametersAcl = {
  private: 'private',
  public_read: 'public_read',
  public_read_write: 'public_read_write',
  authenticated_read: 'authenticated_read',
  bucket_owner_read: 'bucket_owner_read',
  bucket_owner_full_control: 'bucket_owner_full_control',
} as const

export interface BridgeS3S3UploadParameters {
  bucket: string
  key: string
  acl?: BridgeS3S3UploadParametersAcl
  headers?: BridgeS3S3UploadParametersHeaders
  content?: string
}

export type BridgeS3S3ActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeS3S3ActionResourceOptsQueryMode =
  typeof BridgeS3S3ActionResourceOptsQueryMode[keyof typeof BridgeS3S3ActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3S3ActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeS3S3ActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeS3S3ActionResourceOptsQueryMode
  request_ttl?: BridgeS3S3ActionResourceOptsRequestTtl
  inflight_window?: number
  max_buffer_bytes?: string
}

export interface BridgeS3PutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeS3S3UploadParameters
  resource_opts?: BridgeS3S3ActionResourceOpts
}

export type BridgeS3PostBridgeV2Type =
  typeof BridgeS3PostBridgeV2Type[keyof typeof BridgeS3PostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3PostBridgeV2Type = {
  s3: 's3',
} as const

export interface BridgeS3PostBridgeV2 {
  type: BridgeS3PostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeS3S3UploadParameters
  resource_opts?: BridgeS3S3ActionResourceOpts
}

export type BridgeS3GetBridgeV2Status =
  typeof BridgeS3GetBridgeV2Status[keyof typeof BridgeS3GetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeS3GetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeS3GetBridgeV2Type =
  typeof BridgeS3GetBridgeV2Type[keyof typeof BridgeS3GetBridgeV2Type]

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
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeS3S3UploadParameters
  resource_opts?: BridgeS3S3ActionResourceOpts
}

export interface BridgeRedisActionParameters {
  command_template: string[]
}

export interface BridgeRabbitmqPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeRabbitmqActionParameters
  resource_opts?: BridgeRabbitmqActionResourceOpts
}

export type BridgeRabbitmqPostBridgeV2Type =
  typeof BridgeRabbitmqPostBridgeV2Type[keyof typeof BridgeRabbitmqPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqPostBridgeV2Type = {
  rabbitmq: 'rabbitmq',
} as const

export interface BridgeRabbitmqPostBridgeV2 {
  type: BridgeRabbitmqPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeRabbitmqActionParameters
  resource_opts?: BridgeRabbitmqActionResourceOpts
}

export type BridgeRabbitmqGetBridgeV2Status =
  typeof BridgeRabbitmqGetBridgeV2Status[keyof typeof BridgeRabbitmqGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeRabbitmqGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeRabbitmqGetBridgeV2Type =
  typeof BridgeRabbitmqGetBridgeV2Type[keyof typeof BridgeRabbitmqGetBridgeV2Type]

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
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeRabbitmqActionParameters
  resource_opts?: BridgeRabbitmqActionResourceOpts
}

export type BridgeRabbitmqActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeRabbitmqActionResourceOptsQueryMode =
  typeof BridgeRabbitmqActionResourceOptsQueryMode[keyof typeof BridgeRabbitmqActionResourceOptsQueryMode]

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
  typeof BridgeRabbitmqActionParametersDeliveryMode[keyof typeof BridgeRabbitmqActionParametersDeliveryMode]

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

export type BridgePgsqlPostBridgeV2Type =
  typeof BridgePgsqlPostBridgeV2Type[keyof typeof BridgePgsqlPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgePgsqlPostBridgeV2Type = {
  pgsql: 'pgsql',
} as const

export interface BridgePgsqlActionParameters {
  sql?: string
}

export interface BridgePgsqlPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgePgsqlPostBridgeV2 {
  type: BridgePgsqlPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgePgsqlGetBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeOraclePutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeOracleActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOraclePostBridgeV2Type =
  typeof BridgeOraclePostBridgeV2Type[keyof typeof BridgeOraclePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOraclePostBridgeV2Type = {
  oracle: 'oracle',
} as const

export interface BridgeOraclePostBridgeV2 {
  type: BridgeOraclePostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeOracleActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOracleGetBridgeV2Status =
  typeof BridgeOracleGetBridgeV2Status[keyof typeof BridgeOracleGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOracleGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeOracleGetBridgeV2Type =
  typeof BridgeOracleGetBridgeV2Type[keyof typeof BridgeOracleGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOracleGetBridgeV2Type = {
  oracle: 'oracle',
} as const

export interface BridgeOracleActionParameters {
  sql?: string
}

export interface BridgeOpentsPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeOpentsActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOpentsPostBridgeV2Type =
  typeof BridgeOpentsPostBridgeV2Type[keyof typeof BridgeOpentsPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOpentsPostBridgeV2Type = {
  opents: 'opents',
} as const

export interface BridgeOpentsPostBridgeV2 {
  type: BridgeOpentsPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeOpentsActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOpentsGetBridgeV2Type =
  typeof BridgeOpentsGetBridgeV2Type[keyof typeof BridgeOpentsGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeOpentsGetBridgeV2Type = {
  opents: 'opents',
} as const

export type BridgeOpentsGetBridgeV2Status =
  typeof BridgeOpentsGetBridgeV2Status[keyof typeof BridgeOpentsGetBridgeV2Status]

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
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeOpentsActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeOpentsActionParametersDataValue = string | number | number

export type BridgeOpentsActionParametersDataTagsOneOf = { [key: string]: any }

export type BridgeOpentsActionParametersDataTags =
  | string
  | BridgeOpentsActionParametersDataTagsOneOf

export interface BridgeOpentsActionParametersData {
  timestamp?: string
  metric: string
  tags: BridgeOpentsActionParametersDataTags
  value: BridgeOpentsActionParametersDataValue
}

export interface BridgeOpentsActionParameters {
  data?: BridgeOpentsActionParametersData[]
}

export interface BridgeMysqlPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMysqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeMysqlPostBridgeV2Type =
  typeof BridgeMysqlPostBridgeV2Type[keyof typeof BridgeMysqlPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlPostBridgeV2Type = {
  mysql: 'mysql',
} as const

export type BridgeMysqlGetBridgeV2Status =
  typeof BridgeMysqlGetBridgeV2Status[keyof typeof BridgeMysqlGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMysqlGetBridgeV2Type =
  typeof BridgeMysqlGetBridgeV2Type[keyof typeof BridgeMysqlGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMysqlGetBridgeV2Type = {
  mysql: 'mysql',
} as const

export interface BridgeMysqlActionParameters {
  sql?: string
}

export interface BridgeMysqlPostBridgeV2 {
  type: BridgeMysqlPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMysqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeMysqlGetBridgeV2 {
  type: BridgeMysqlGetBridgeV2Type
  name: string
  status?: BridgeMysqlGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMysqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeMqttPublisherPostBridgeV2Type =
  typeof BridgeMqttPublisherPostBridgeV2Type[keyof typeof BridgeMqttPublisherPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherPostBridgeV2Type = {
  mqtt: 'mqtt',
} as const

export type BridgeMqttPublisherGetBridgeV2Status =
  typeof BridgeMqttPublisherGetBridgeV2Status[keyof typeof BridgeMqttPublisherGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMqttPublisherGetBridgeV2Type =
  typeof BridgeMqttPublisherGetBridgeV2Type[keyof typeof BridgeMqttPublisherGetBridgeV2Type]

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
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMqttPublisherActionParameters
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export type BridgeMqttPublisherActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeMqttPublisherActionResourceOptsQueryMode =
  typeof BridgeMqttPublisherActionResourceOptsQueryMode[keyof typeof BridgeMqttPublisherActionResourceOptsQueryMode]

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

export interface BridgeMqttPublisherPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMqttPublisherActionParameters
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export interface BridgeMqttPublisherPostBridgeV2 {
  type: BridgeMqttPublisherPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMqttPublisherActionParameters
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export type BridgeMongodbPostBridgeV2Type =
  typeof BridgeMongodbPostBridgeV2Type[keyof typeof BridgeMongodbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbPostBridgeV2Type = {
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

export type BridgeMongodbGetBridgeV2Type =
  typeof BridgeMongodbGetBridgeV2Type[keyof typeof BridgeMongodbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMongodbGetBridgeV2Type = {
  mongodb: 'mongodb',
} as const

export type BridgeMongodbActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeMongodbActionResourceOptsQueryMode =
  typeof BridgeMongodbActionResourceOptsQueryMode[keyof typeof BridgeMongodbActionResourceOptsQueryMode]

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

export interface BridgeMongodbPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMongodbActionParameters
  resource_opts?: BridgeMongodbActionResourceOpts
}

export interface BridgeMongodbPostBridgeV2 {
  type: BridgeMongodbPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMongodbActionParameters
  resource_opts?: BridgeMongodbActionResourceOpts
}

export interface BridgeMongodbGetBridgeV2 {
  type: BridgeMongodbGetBridgeV2Type
  name: string
  status?: BridgeMongodbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeMongodbActionParameters
  resource_opts?: BridgeMongodbActionResourceOpts
}

export interface BridgeMatrixPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeMatrixPostBridgeV2Type =
  typeof BridgeMatrixPostBridgeV2Type[keyof typeof BridgeMatrixPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMatrixPostBridgeV2Type = {
  matrix: 'matrix',
} as const

export interface BridgeMatrixPostBridgeV2 {
  type: BridgeMatrixPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeMatrixGetBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgePgsqlActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeKinesisPostBridgeV2Type =
  typeof BridgeKinesisPostBridgeV2Type[keyof typeof BridgeKinesisPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisPostBridgeV2Type = {
  kinesis: 'kinesis',
} as const

export type BridgeKinesisGetBridgeV2Status =
  typeof BridgeKinesisGetBridgeV2Status[keyof typeof BridgeKinesisGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeKinesisGetBridgeV2Type =
  typeof BridgeKinesisGetBridgeV2Type[keyof typeof BridgeKinesisGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKinesisGetBridgeV2Type = {
  kinesis: 'kinesis',
} as const

export type BridgeKinesisActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeKinesisActionResourceOptsQueryMode =
  typeof BridgeKinesisActionResourceOptsQueryMode[keyof typeof BridgeKinesisActionResourceOptsQueryMode]

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

export interface BridgeKinesisPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeKinesisActionParameters
  resource_opts?: BridgeKinesisActionResourceOpts
}

export interface BridgeKinesisPostBridgeV2 {
  type: BridgeKinesisPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeKinesisActionParameters
  resource_opts?: BridgeKinesisActionResourceOpts
}

export interface BridgeKinesisGetBridgeV2 {
  type: BridgeKinesisGetBridgeV2Type
  name: string
  status?: BridgeKinesisGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeKinesisActionParameters
  resource_opts?: BridgeKinesisActionResourceOpts
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
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: BridgeKafkaProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type BridgeIotdbPostBridgeV2Type =
  typeof BridgeIotdbPostBridgeV2Type[keyof typeof BridgeIotdbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbPostBridgeV2Type = {
  iotdb: 'iotdb',
} as const

export interface BridgeIotdbPostBridgeV2 {
  type: BridgeIotdbPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeIotdbActionParameters
  resource_opts?: BridgeIotdbActionResourceOpts
}

export type BridgeIotdbGetBridgeV2Type =
  typeof BridgeIotdbGetBridgeV2Type[keyof typeof BridgeIotdbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeIotdbGetBridgeV2Type = {
  iotdb: 'iotdb',
} as const

export type BridgeIotdbGetBridgeV2Status =
  typeof BridgeIotdbGetBridgeV2Status[keyof typeof BridgeIotdbGetBridgeV2Status]

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
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeIotdbActionParameters
  resource_opts?: BridgeIotdbActionResourceOpts
}

export type BridgeIotdbActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeIotdbActionResourceOptsQueryMode =
  typeof BridgeIotdbActionResourceOptsQueryMode[keyof typeof BridgeIotdbActionResourceOptsQueryMode]

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
  | string
  | 'text'
  | 'boolean'
  | 'int32'
  | 'int64'
  | 'float'
  | 'double'

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
  data?: BridgeIotdbActionParametersData[]
  max_retries?: number
}

export interface BridgeIotdbPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeIotdbActionParameters
  resource_opts?: BridgeIotdbActionResourceOpts
}

export interface BridgeInfluxdbPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeInfluxdbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeInfluxdbPostBridgeV2Type =
  typeof BridgeInfluxdbPostBridgeV2Type[keyof typeof BridgeInfluxdbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbPostBridgeV2Type = {
  influxdb: 'influxdb',
} as const

export type BridgeInfluxdbGetBridgeV2Status =
  typeof BridgeInfluxdbGetBridgeV2Status[keyof typeof BridgeInfluxdbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeInfluxdbGetBridgeV2Type =
  typeof BridgeInfluxdbGetBridgeV2Type[keyof typeof BridgeInfluxdbGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeInfluxdbGetBridgeV2Type = {
  influxdb: 'influxdb',
} as const

export interface BridgeInfluxdbGetBridgeV2 {
  type: BridgeInfluxdbGetBridgeV2Type
  name: string
  status?: BridgeInfluxdbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeInfluxdbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeInfluxdbActionParametersPrecision =
  typeof BridgeInfluxdbActionParametersPrecision[keyof typeof BridgeInfluxdbActionParametersPrecision]

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

export type BridgeHttpPostBridgeV2Type =
  typeof BridgeHttpPostBridgeV2Type[keyof typeof BridgeHttpPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostBridgeV2Type = {
  http: 'http',
} as const

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

export type BridgeHttpParametersOptsHeaders = { [key: string]: any }

export type BridgeHttpParametersOptsMethod =
  typeof BridgeHttpParametersOptsMethod[keyof typeof BridgeHttpParametersOptsMethod]

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

export type BridgeHttpGetBridgeV2Type =
  typeof BridgeHttpGetBridgeV2Type[keyof typeof BridgeHttpGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetBridgeV2Type = {
  http: 'http',
} as const

export type BridgeHttpGetBridgeV2Status =
  typeof BridgeHttpGetBridgeV2Status[keyof typeof BridgeHttpGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeHttpActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeHttpActionResourceOptsQueryMode =
  typeof BridgeHttpActionResourceOptsQueryMode[keyof typeof BridgeHttpActionResourceOptsQueryMode]

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

export interface BridgeHttpPutBridgeV2 {
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHttpParametersOpts
  resource_opts?: BridgeHttpActionResourceOpts
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

export type BridgeHstreamdbPostBridgeV2Type =
  typeof BridgeHstreamdbPostBridgeV2Type[keyof typeof BridgeHstreamdbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbPostBridgeV2Type = {
  hstreamdb: 'hstreamdb',
} as const

export type BridgeHstreamdbGetBridgeV2Status =
  typeof BridgeHstreamdbGetBridgeV2Status[keyof typeof BridgeHstreamdbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHstreamdbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeHstreamdbGetBridgeV2Type =
  typeof BridgeHstreamdbGetBridgeV2Type[keyof typeof BridgeHstreamdbGetBridgeV2Type]

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

export interface BridgeHstreamdbPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHstreamdbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeHstreamdbPostBridgeV2 {
  type: BridgeHstreamdbPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHstreamdbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeHstreamdbGetBridgeV2 {
  type: BridgeHstreamdbGetBridgeV2Type
  name: string
  status?: BridgeHstreamdbGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHstreamdbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeGreptimedbPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeGreptimedbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeGreptimedbPostBridgeV2Type =
  typeof BridgeGreptimedbPostBridgeV2Type[keyof typeof BridgeGreptimedbPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbPostBridgeV2Type = {
  greptimedb: 'greptimedb',
} as const

export interface BridgeGreptimedbPostBridgeV2 {
  type: BridgeGreptimedbPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeGreptimedbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeGreptimedbGetBridgeV2Status =
  typeof BridgeGreptimedbGetBridgeV2Status[keyof typeof BridgeGreptimedbGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeGreptimedbGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeGreptimedbGetBridgeV2Type =
  typeof BridgeGreptimedbGetBridgeV2Type[keyof typeof BridgeGreptimedbGetBridgeV2Type]

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
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeGreptimedbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeGreptimedbActionParametersPrecision =
  typeof BridgeGreptimedbActionParametersPrecision[keyof typeof BridgeGreptimedbActionParametersPrecision]

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

export type BridgeElasticsearchPutBridgeV2Parameters =
  | BridgeElasticsearchActionUpdate
  | BridgeElasticsearchActionDelete
  | BridgeElasticsearchActionCreate

export interface BridgeElasticsearchPutBridgeV2 {
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeElasticsearchPutBridgeV2Parameters
  resource_opts?: BridgeElasticsearchActionResourceOpts
}

export type BridgeElasticsearchPostBridgeV2Parameters =
  | BridgeElasticsearchActionUpdate
  | BridgeElasticsearchActionDelete
  | BridgeElasticsearchActionCreate

export type BridgeElasticsearchPostBridgeV2Type =
  typeof BridgeElasticsearchPostBridgeV2Type[keyof typeof BridgeElasticsearchPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchPostBridgeV2Type = {
  elasticsearch: 'elasticsearch',
} as const

export interface BridgeElasticsearchPostBridgeV2 {
  type: BridgeElasticsearchPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeElasticsearchPostBridgeV2Parameters
  resource_opts?: BridgeElasticsearchActionResourceOpts
}

export type BridgeElasticsearchGetBridgeV2Parameters =
  | BridgeElasticsearchActionUpdate
  | BridgeElasticsearchActionDelete
  | BridgeElasticsearchActionCreate

export type BridgeElasticsearchGetBridgeV2Type =
  typeof BridgeElasticsearchGetBridgeV2Type[keyof typeof BridgeElasticsearchGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchGetBridgeV2Type = {
  elasticsearch: 'elasticsearch',
} as const

export type BridgeElasticsearchGetBridgeV2Status =
  typeof BridgeElasticsearchGetBridgeV2Status[keyof typeof BridgeElasticsearchGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeElasticsearchGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeElasticsearchGetBridgeV2 {
  status?: BridgeElasticsearchGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeElasticsearchGetBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeElasticsearchGetBridgeV2Parameters
  resource_opts?: BridgeElasticsearchActionResourceOpts
}

export type BridgeElasticsearchActionUpdateAction =
  typeof BridgeElasticsearchActionUpdateAction[keyof typeof BridgeElasticsearchActionUpdateAction]

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
  typeof BridgeElasticsearchActionResourceOptsQueryMode[keyof typeof BridgeElasticsearchActionResourceOptsQueryMode]

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
  typeof BridgeElasticsearchActionDeleteAction[keyof typeof BridgeElasticsearchActionDeleteAction]

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
  typeof BridgeElasticsearchActionCreateAction[keyof typeof BridgeElasticsearchActionCreateAction]

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

export type BridgeDynamoPostBridgeV2Type =
  typeof BridgeDynamoPostBridgeV2Type[keyof typeof BridgeDynamoPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoPostBridgeV2Type = {
  dynamo: 'dynamo',
} as const

export interface BridgeDynamoPostBridgeV2 {
  type: BridgeDynamoPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeDynamoActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeDynamoGetBridgeV2Status =
  typeof BridgeDynamoGetBridgeV2Status[keyof typeof BridgeDynamoGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeDynamoGetBridgeV2Type =
  typeof BridgeDynamoGetBridgeV2Type[keyof typeof BridgeDynamoGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeDynamoGetBridgeV2Type = {
  dynamo: 'dynamo',
} as const

export interface BridgeDynamoActionParameters {
  template?: string
  hash_key: string
  range_key?: string
  table: string
}

export interface BridgeDynamoPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeDynamoActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeDynamoGetBridgeV2 {
  type: BridgeDynamoGetBridgeV2Type
  name: string
  status?: BridgeDynamoGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeDynamoActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeClickhousePostBridgeV2Type =
  typeof BridgeClickhousePostBridgeV2Type[keyof typeof BridgeClickhousePostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhousePostBridgeV2Type = {
  clickhouse: 'clickhouse',
} as const

export type BridgeClickhouseGetBridgeV2Status =
  typeof BridgeClickhouseGetBridgeV2Status[keyof typeof BridgeClickhouseGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhouseGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeClickhouseGetBridgeV2Type =
  typeof BridgeClickhouseGetBridgeV2Type[keyof typeof BridgeClickhouseGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeClickhouseGetBridgeV2Type = {
  clickhouse: 'clickhouse',
} as const

export interface BridgeClickhouseActionParameters {
  sql?: string
  batch_value_separator?: string
}

export interface BridgeClickhousePutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeClickhouseActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeClickhousePostBridgeV2 {
  type: BridgeClickhousePostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeClickhouseActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeClickhouseGetBridgeV2 {
  type: BridgeClickhouseGetBridgeV2Type
  name: string
  status?: BridgeClickhouseGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeClickhouseActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeCassaPutBridgeV2 {
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeCassaActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeCassaPostBridgeV2Type =
  typeof BridgeCassaPostBridgeV2Type[keyof typeof BridgeCassaPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaPostBridgeV2Type = {
  cassandra: 'cassandra',
} as const

export interface BridgeCassaPostBridgeV2 {
  type: BridgeCassaPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeCassaActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export type BridgeCassaGetBridgeV2Status =
  typeof BridgeCassaGetBridgeV2Status[keyof typeof BridgeCassaGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeCassaGetBridgeV2Type =
  typeof BridgeCassaGetBridgeV2Type[keyof typeof BridgeCassaGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeCassaGetBridgeV2Type = {
  cassandra: 'cassandra',
} as const

export interface BridgeCassaActionParameters {
  cql?: string
}

export interface BridgeCassaGetBridgeV2 {
  type: BridgeCassaGetBridgeV2Type
  name: string
  status?: BridgeCassaGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeCassaActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
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
  tags?: string[]
  description?: string
  local_topic?: string
  parameters: BridgeAzureEventHubProducerKafkaOpts
  resource_opts?: BridgeKafkaResourceOpts
}

export type ActionsAndSourcesActionResourceOptsRequestTtl = 'infinity' | string

export type ActionsAndSourcesActionResourceOptsQueryMode =
  typeof ActionsAndSourcesActionResourceOptsQueryMode[keyof typeof ActionsAndSourcesActionResourceOptsQueryMode]

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

export interface BridgeOracleGetBridgeV2 {
  type: BridgeOracleGetBridgeV2Type
  name: string
  status?: BridgeOracleGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeOracleActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}

export interface BridgeInfluxdbPostBridgeV2 {
  type: BridgeInfluxdbPostBridgeV2Type
  name: string
  local_topic?: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeInfluxdbActionParameters
  resource_opts?: ActionsAndSourcesActionResourceOpts
}
