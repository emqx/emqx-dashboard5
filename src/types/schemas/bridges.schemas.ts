export type PostBridges400Code = typeof PostBridges400Code[keyof typeof PostBridges400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBridges400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostBridges400 = {
  code?: PostBridges400Code
  message?: string
}

export type PostBridges201 = BridgeWebhookGet | BridgeMqttGet

export type PostBridgesBody = BridgeWebhookPost | BridgeMqttPost

export type GetBridges200Item = BridgeWebhookGet | BridgeMqttGet

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

export type PutBridgesId200 = BridgeWebhookGet | BridgeMqttGet

export type PutBridgesIdBody = BridgeWebhookPut | BridgeMqttPut

export type GetBridgesId404Code = typeof GetBridgesId404Code[keyof typeof GetBridgesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBridgesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetBridgesId404 = {
  code?: GetBridgesId404Code
  message?: string
}

export type GetBridgesId200 = BridgeWebhookGet | BridgeMqttGet

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
  code?: DeleteBridgesId400Code
  message?: string
}

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

export type PostBridgesProbeBody = BridgeWebhookPost | BridgeMqttPost

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

export type ConnectorHttpRequestHeaders = { [key: string]: any }

export interface ConnectorHttpRequest {
  method?: string
  path?: string
  body?: string
  headers?: ConnectorHttpRequestHeaders
  max_retries?: number
  request_timeout?: string
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

export type BridgeWebhookPutHeaders = { [key: string]: any }

export type BridgeWebhookPutMethod =
  typeof BridgeWebhookPutMethod[keyof typeof BridgeWebhookPutMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookPutMethod = {
  post: 'post',
  put: 'put',
  get: 'get',
  delete: 'delete',
} as const

/**
 * @deprecated
 */
export type BridgeWebhookPutDirection =
  typeof BridgeWebhookPutDirection[keyof typeof BridgeWebhookPutDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookPutDirection = {
  egress: 'egress',
} as const

export type BridgeWebhookPutPoolType =
  typeof BridgeWebhookPutPoolType[keyof typeof BridgeWebhookPutPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookPutPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export interface BridgeWebhookPut {
  enable?: boolean
  resource_opts?: BridgeWebhookCreationOpts
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeWebhookPutPoolType
  pool_size?: number
  enable_pipelining?: number
  request?: ConnectorHttpRequest
  ssl?: BrokerSslClientOpts
  url: string
  /** @deprecated */
  direction?: BridgeWebhookPutDirection
  local_topic?: string
  method?: BridgeWebhookPutMethod
  headers?: BridgeWebhookPutHeaders
  body?: string
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
}

export type BridgeWebhookPostHeaders = { [key: string]: any }

export type BridgeWebhookPostMethod =
  typeof BridgeWebhookPostMethod[keyof typeof BridgeWebhookPostMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookPostMethod = {
  post: 'post',
  put: 'put',
  get: 'get',
  delete: 'delete',
} as const

/**
 * @deprecated
 */
export type BridgeWebhookPostDirection =
  typeof BridgeWebhookPostDirection[keyof typeof BridgeWebhookPostDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookPostDirection = {
  egress: 'egress',
} as const

export type BridgeWebhookPostPoolType =
  typeof BridgeWebhookPostPoolType[keyof typeof BridgeWebhookPostPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookPostPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeWebhookPostType = typeof BridgeWebhookPostType[keyof typeof BridgeWebhookPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookPostType = {
  webhook: 'webhook',
} as const

export type BridgeWebhookGetHeaders = { [key: string]: any }

export type BridgeWebhookGetMethod =
  typeof BridgeWebhookGetMethod[keyof typeof BridgeWebhookGetMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookGetMethod = {
  post: 'post',
  put: 'put',
  get: 'get',
  delete: 'delete',
} as const

/**
 * @deprecated
 */
export type BridgeWebhookGetDirection =
  typeof BridgeWebhookGetDirection[keyof typeof BridgeWebhookGetDirection]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookGetDirection = {
  egress: 'egress',
} as const

export type BridgeWebhookGetPoolType =
  typeof BridgeWebhookGetPoolType[keyof typeof BridgeWebhookGetPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookGetPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export type BridgeWebhookGetType = typeof BridgeWebhookGetType[keyof typeof BridgeWebhookGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookGetType = {
  webhook: 'webhook',
} as const

export type BridgeWebhookGetStatus =
  typeof BridgeWebhookGetStatus[keyof typeof BridgeWebhookGetStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookGetStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeWebhookGet {
  status?: BridgeWebhookGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeWebhookGetType
  name: string
  enable?: boolean
  resource_opts?: BridgeWebhookCreationOpts
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeWebhookGetPoolType
  pool_size?: number
  enable_pipelining?: number
  request?: ConnectorHttpRequest
  ssl?: BrokerSslClientOpts
  url: string
  /** @deprecated */
  direction?: BridgeWebhookGetDirection
  local_topic?: string
  method?: BridgeWebhookGetMethod
  headers?: BridgeWebhookGetHeaders
  body?: string
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
}

export type BridgeWebhookCreationOptsRequestTtl = 'infinity' | string

export type BridgeWebhookCreationOptsQueryMode =
  typeof BridgeWebhookCreationOptsQueryMode[keyof typeof BridgeWebhookCreationOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeWebhookCreationOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

/**
 * @deprecated
 */
export type BridgeWebhookCreationOptsAutoRestartInterval = string | 'infinity'

export interface BridgeWebhookCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_after_created?: boolean
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: BridgeWebhookCreationOptsAutoRestartInterval
  query_mode?: BridgeWebhookCreationOptsQueryMode
  request_ttl?: BridgeWebhookCreationOptsRequestTtl
  inflight_window?: number
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface BridgeWebhookPost {
  type: BridgeWebhookPostType
  name: string
  enable?: boolean
  resource_opts?: BridgeWebhookCreationOpts
  connect_timeout?: string
  /** @deprecated */
  retry_interval?: string
  pool_type?: BridgeWebhookPostPoolType
  pool_size?: number
  enable_pipelining?: number
  request?: ConnectorHttpRequest
  ssl?: BrokerSslClientOpts
  url: string
  /** @deprecated */
  direction?: BridgeWebhookPostDirection
  local_topic?: string
  method?: BridgeWebhookPostMethod
  headers?: BridgeWebhookPostHeaders
  body?: string
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
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
  ssl?: BrokerSslClientOpts
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
  ssl?: BrokerSslClientOpts
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

export interface BridgeMqttGet {
  status?: BridgeMqttGetStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  enable?: boolean
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
  ssl?: BrokerSslClientOpts
  ingress?: ConnectorMqttIngress
  egress?: ConnectorMqttEgress
}

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
