export type PostConnectors400Code = typeof PostConnectors400Code[keyof typeof PostConnectors400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConnectors400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostConnectors400 = {
  code?: PostConnectors400Code
  message?: string
}

export type PostConnectors201 = ConnectorMqttGetConnector | BridgeHttpGetConnector

export type PostConnectorsBody = ConnectorMqttPostConnector | BridgeHttpPostConnector

export type GetConnectors200Item = ConnectorMqttGetConnector | BridgeHttpGetConnector

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

export type PutConnectorsId200 = ConnectorMqttGetConnector | BridgeHttpGetConnector

export type PutConnectorsIdBody = ConnectorMqttPutConnector | BridgeHttpPutConnector

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

export type PostConnectorsProbeBody = ConnectorMqttPostConnector | BridgeHttpPostConnector

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

export interface ConnectorMqttStaticClientidEntry {
  node: string
  ids: string[]
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
  static_clientids?: ConnectorMqttStaticClientidEntry[]
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
  ssl?: EmqxSslClientOpts
}

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
  static_clientids?: ConnectorMqttStaticClientidEntry[]
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
  static_clientids?: ConnectorMqttStaticClientidEntry[]
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
  ssl?: EmqxSslClientOpts
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
  ssl?: EmqxSslClientOpts
  resource_opts?: BridgeHttpConnectorResourceOpts
}

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

export type GetConnectorsId200 = ConnectorMqttGetConnector | BridgeHttpGetConnector
