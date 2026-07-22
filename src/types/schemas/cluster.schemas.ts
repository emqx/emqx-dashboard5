export type PutClusterNodeInviteAsync400Code =
  (typeof PutClusterNodeInviteAsync400Code)[keyof typeof PutClusterNodeInviteAsync400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterNodeInviteAsync400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterNodeInviteAsync400 = {
  code?: PutClusterNodeInviteAsync400Code
  message?: string
}

export type PutClusterNodeInvite400Code =
  (typeof PutClusterNodeInvite400Code)[keyof typeof PutClusterNodeInvite400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterNodeInvite400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterNodeInvite400 = {
  code?: PutClusterNodeInvite400Code
  message?: string
}

export type DeleteClusterNodeForceLeave404Code =
  (typeof DeleteClusterNodeForceLeave404Code)[keyof typeof DeleteClusterNodeForceLeave404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteClusterNodeForceLeave404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteClusterNodeForceLeave404 = {
  code?: DeleteClusterNodeForceLeave404Code
  message?: string
}

export type PutClusterLinksLinkNameMetricsReset404Code =
  (typeof PutClusterLinksLinkNameMetricsReset404Code)[keyof typeof PutClusterLinksLinkNameMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterLinksLinkNameMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutClusterLinksLinkNameMetricsReset404 = {
  code?: PutClusterLinksLinkNameMetricsReset404Code
  message?: string
}

export type GetClusterLinksLinkNameMetrics404Code =
  (typeof GetClusterLinksLinkNameMetrics404Code)[keyof typeof GetClusterLinksLinkNameMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClusterLinksLinkNameMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetClusterLinksLinkNameMetrics404 = {
  code?: GetClusterLinksLinkNameMetrics404Code
  message?: string
}

export type PutClusterLinksLinkName404Code =
  (typeof PutClusterLinksLinkName404Code)[keyof typeof PutClusterLinksLinkName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterLinksLinkName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutClusterLinksLinkName404 = {
  code?: PutClusterLinksLinkName404Code
  message?: string
}

export type PutClusterLinksLinkName400Code =
  (typeof PutClusterLinksLinkName400Code)[keyof typeof PutClusterLinksLinkName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterLinksLinkName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterLinksLinkName400 = {
  code?: PutClusterLinksLinkName400Code
  message?: string
}

export type PutClusterLinksLinkNameBody = {
  clientid?: string
  enable?: boolean
  /** @minimum 0 */
  max_inflight?: number
  password?: string
  /** @minimum 1 */
  pool_size?: number
  resource_opts?: ClusterCreationOpts
  retry_interval?: string
  server: string
  ssl?: EmqxSslClientOpts
  tcp_opts?: EmqxClientTcpOpts
  topics: string[]
  username?: string
}

export type GetClusterLinksLinkName404Code =
  (typeof GetClusterLinksLinkName404Code)[keyof typeof GetClusterLinksLinkName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClusterLinksLinkName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetClusterLinksLinkName404 = {
  code?: GetClusterLinksLinkName404Code
  message?: string
}

export type DeleteClusterLinksLinkName404Code =
  (typeof DeleteClusterLinksLinkName404Code)[keyof typeof DeleteClusterLinksLinkName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteClusterLinksLinkName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteClusterLinksLinkName404 = {
  code?: DeleteClusterLinksLinkName404Code
  message?: string
}

export type PostClusterLinks400Code =
  (typeof PostClusterLinks400Code)[keyof typeof PostClusterLinks400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostClusterLinks400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostClusterLinks400 = {
  code?: PostClusterLinks400Code
  message?: string
}

export type PutCluster400Code = (typeof PutCluster400Code)[keyof typeof PutCluster400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutCluster400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutCluster400 = {
  code?: PutCluster400Code
  message?: string
}

export type PutCluster200 = {
  description?: string
  name?: string
  nodes?: string[]
  self?: string
}

export type GetCluster200 = {
  description?: string
  name?: string
  nodes?: string[]
  self?: string
}

export type EmqxSslClientOptsVerify =
  (typeof EmqxSslClientOptsVerify)[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_none: 'verify_none',
  verify_peer: 'verify_peer',
} as const

export type EmqxSslClientOptsServerNameIndication = 'disable' | string

export type EmqxSslClientOptsPartialChain =
  (typeof EmqxSslClientOptsPartialChain)[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  false: false,
  true: true,
  cacert_from_cacertfile: 'cacert_from_cacertfile',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
} as const

export type EmqxSslClientOptsLogLevel =
  (typeof EmqxSslClientOptsLogLevel)[keyof typeof EmqxSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsLogLevel = {
  alert: 'alert',
  all: 'all',
  critical: 'critical',
  debug: 'debug',
  emergency: 'emergency',
  error: 'error',
  info: 'info',
  none: 'none',
  notice: 'notice',
  warning: 'warning',
} as const

export interface EmqxManagedCerts {
  bundle_name: string
  namespace?: string
}

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  /** @minimum 0 */
  depth?: number
  enable?: boolean
  hibernate_after?: string
  keyfile?: string
  log_level?: EmqxSslClientOptsLogLevel
  managed_certs?: EmqxManagedCerts
  middlebox_comp_mode?: boolean
  partial_chain?: EmqxSslClientOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
  verify?: EmqxSslClientOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export interface EmqxClientTcpOpts {
  /** @minimum 0 */
  active_n?: number
  buffer?: string
  delay_send?: boolean
  keepalive?: boolean
  nodelay?: boolean
  recbuf?: string
  sndbuf?: string
}

export type ClusterLinkNodeMetricsMetrics = { [key: string]: unknown }

export interface ClusterLinkNodeMetrics {
  metrics?: ClusterLinkNodeMetricsMetrics
  node?: string
}

export type ClusterLinkLinkMetricsResponseMetrics = { [key: string]: unknown }

export interface ClusterLinkLinkMetricsResponse {
  metrics?: ClusterLinkLinkMetricsResponseMetrics
  node_metrics?: ClusterLinkNodeMetrics[]
}

export type ClusterLinkLinkConfigResponseStatus =
  (typeof ClusterLinkLinkConfigResponseStatus)[keyof typeof ClusterLinkLinkConfigResponseStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ClusterLinkLinkConfigResponseStatus = {
  connected: 'connected',
  connecting: 'connecting',
  disconnected: 'disconnected',
  inconsistent: 'inconsistent',
} as const

export interface ClusterLinkLinkConfigResponse {
  clientid?: string
  enable?: boolean
  /** @minimum 0 */
  max_inflight?: number
  name: string
  node?: string
  password?: string
  /** @minimum 1 */
  pool_size?: number
  resource_opts?: ClusterCreationOpts
  retry_interval?: string
  server: string
  ssl?: EmqxSslClientOpts
  status?: ClusterLinkLinkConfigResponseStatus
  tcp_opts?: EmqxClientTcpOpts
  topics: string[]
  username?: string
}

export interface ClusterTimeout {
  /** @minimum 0 */
  timeout?: number
}

export interface ClusterReplicantInfo {
  node?: string
  /** @minimum 0 */
  streams?: number
}

export interface ClusterNodeInvitationSucceed {
  finished_at?: string
  node?: string
  started_at?: string
}

export interface ClusterNodeInvitationInProgress {
  node?: string
  started_at?: string
}

export interface ClusterNodeInvitationFailed {
  finished_at?: string
  node?: string
  reason?: string
  started_at?: string
}

export interface ClusterLink {
  clientid?: string
  enable?: boolean
  /** @minimum 0 */
  max_inflight?: number
  name: string
  password?: string
  /** @minimum 1 */
  pool_size?: number
  resource_opts?: ClusterCreationOpts
  retry_interval?: string
  server: string
  ssl?: EmqxSslClientOpts
  tcp_opts?: EmqxClientTcpOpts
  topics: string[]
  username?: string
}

export interface ClusterInvitationStatus {
  failed?: ClusterNodeInvitationFailed[]
  in_progress?: ClusterNodeInvitationInProgress[]
  succeed?: ClusterNodeInvitationSucceed[]
}

export type ClusterCreationOptsRequestTtl = 'infinity' | string

export type ClusterCreationOptsHealthCheckTimeout = 'infinity' | string

export type ClusterCreationOptsDispatchStrategy =
  (typeof ClusterCreationOptsDispatchStrategy)[keyof typeof ClusterCreationOptsDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ClusterCreationOptsDispatchStrategy = {
  per_clientid: 'per_clientid',
  random: 'random',
} as const

/**
 * @deprecated
 */
export type ClusterCreationOptsAutoRestartInterval = 'infinity' | string

export interface ClusterCreationOpts {
  /** @deprecated */
  auto_restart_interval?: ClusterCreationOptsAutoRestartInterval
  dispatch_strategy?: ClusterCreationOptsDispatchStrategy
  /** @deprecated */
  enable_queue?: boolean
  health_check_interval?: string
  health_check_interval_jitter?: string
  health_check_timeout?: ClusterCreationOptsHealthCheckTimeout
  /** @minimum 1 */
  inflight_window?: number
  max_buffer_bytes?: string
  request_ttl?: ClusterCreationOptsRequestTtl
  start_timeout?: string
  /**
   * @minimum 1
   * @maximum 1024
   */
  worker_pool_size?: number
}

export interface ClusterCoreReplicants {
  core_node?: string
  replicant_nodes?: ClusterReplicantInfo[]
}

export interface ClusterClusterInfoRequest {
  description?: string
}
