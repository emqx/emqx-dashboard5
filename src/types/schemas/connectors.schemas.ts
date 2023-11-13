export type PostConnectors400Code = typeof PostConnectors400Code[keyof typeof PostConnectors400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConnectors400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostConnectors400 = {
  code?: PostConnectors400Code
  message?: string
}

export type PostConnectors201 = BridgeKafkaGetConnector | BridgeAzureEventHubGetConnector

export type PostConnectorsBody = BridgeKafkaPostConnector | BridgeAzureEventHubPostConnector

export type GetConnectors200Item = BridgeKafkaGetConnector | BridgeAzureEventHubGetConnector

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

export type PutConnectorsId200 = BridgeKafkaGetConnector | BridgeAzureEventHubGetConnector

export type PutConnectorsIdBody = BridgeKafkaPutConnector | BridgeAzureEventHubPutConnector

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

export type GetConnectorsId200 = BridgeKafkaGetConnector | BridgeAzureEventHubGetConnector

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

export type PostConnectorsProbeBody = BridgeKafkaPostConnector | BridgeAzureEventHubPostConnector

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

export type BridgeKafkaGetConnectorType =
  typeof BridgeKafkaGetConnectorType[keyof typeof BridgeKafkaGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetConnectorType = {
  kafka_producer: 'kafka_producer',
} as const

export type BridgeKafkaGetConnectorStatus =
  typeof BridgeKafkaGetConnectorStatus[keyof typeof BridgeKafkaGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeKafkaGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeKafkaGetConnector {
  status?: BridgeKafkaGetConnectorStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeKafkaGetConnectorType
  name: string
  enable?: boolean
  description?: string
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

export type BridgeAzureEventHubGetConnectorType =
  typeof BridgeAzureEventHubGetConnectorType[keyof typeof BridgeAzureEventHubGetConnectorType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetConnectorType = {
  azure_event_hub_producer: 'azure_event_hub_producer',
} as const

export type BridgeAzureEventHubGetConnectorStatus =
  typeof BridgeAzureEventHubGetConnectorStatus[keyof typeof BridgeAzureEventHubGetConnectorStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeAzureEventHubGetConnectorStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeAzureEventHubAuthUsernamePassword {
  password: string
}

export interface BridgeAzureEventHubGetConnector {
  status?: BridgeAzureEventHubGetConnectorStatus
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeAzureEventHubGetConnectorType
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
