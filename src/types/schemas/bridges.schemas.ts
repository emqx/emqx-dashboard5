export type PostBridges400Code = typeof PostBridges400Code[keyof typeof PostBridges400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBridges400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostBridges400 = {
  code?: PostBridges400Code
  message?: string
}

export type PostBridges201 = BridgeHttpGet | BridgeMqttGet

export type PostBridgesBody = BridgeHttpPost | BridgeMqttPost

export type GetBridges200Item = BridgeHttpGet | BridgeMqttGet

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

export type PutBridgesId200 = BridgeHttpGet | BridgeMqttGet

export type PutBridgesIdBody = BridgeHttpPut | BridgeMqttPut

export type GetBridgesId404Code = typeof GetBridgesId404Code[keyof typeof GetBridgesId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBridgesId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetBridgesId404 = {
  code?: GetBridgesId404Code
  message?: string
}

export type GetBridgesId200 = BridgeHttpGet | BridgeMqttGet

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

export type PostBridgesProbeBody = BridgeHttpPost | BridgeMqttPost

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

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

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
