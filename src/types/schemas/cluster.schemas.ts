export type PutClusterLinksLinkNameMetricsReset404Code =
  typeof PutClusterLinksLinkNameMetricsReset404Code[keyof typeof PutClusterLinksLinkNameMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterLinksLinkNameMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutClusterLinksLinkNameMetricsReset404 = {
  code?: PutClusterLinksLinkNameMetricsReset404Code
  message?: string
}

export type GetClusterLinksLinkNameMetrics404Code =
  typeof GetClusterLinksLinkNameMetrics404Code[keyof typeof GetClusterLinksLinkNameMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClusterLinksLinkNameMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetClusterLinksLinkNameMetrics404 = {
  code?: GetClusterLinksLinkNameMetrics404Code
  message?: string
}

export type DeleteClusterLinksLinkName404Code =
  typeof DeleteClusterLinksLinkName404Code[keyof typeof DeleteClusterLinksLinkName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteClusterLinksLinkName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteClusterLinksLinkName404 = {
  code?: DeleteClusterLinksLinkName404Code
  message?: string
}

export type PutClusterLinksLinkName404Code =
  typeof PutClusterLinksLinkName404Code[keyof typeof PutClusterLinksLinkName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterLinksLinkName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutClusterLinksLinkName404 = {
  code?: PutClusterLinksLinkName404Code
  message?: string
}

export type PutClusterLinksLinkName400Code =
  typeof PutClusterLinksLinkName400Code[keyof typeof PutClusterLinksLinkName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterLinksLinkName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterLinksLinkName400 = {
  code?: PutClusterLinksLinkName400Code
  message?: string
}

export type PutClusterLinksLinkNameBody = {
  enable?: boolean
  server: string
  clientid?: string
  username?: string
  password?: string
  ssl?: EmqxSslClientOpts
  topics: string[]
  pool_size?: number
  retry_interval?: string
  max_inflight?: number
  resource_opts?: ClusterCreationOpts
}

export type GetClusterLinksLinkName404Code =
  typeof GetClusterLinksLinkName404Code[keyof typeof GetClusterLinksLinkName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClusterLinksLinkName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetClusterLinksLinkName404 = {
  code?: GetClusterLinksLinkName404Code
  message?: string
}

export type PostClusterLinks400Code =
  typeof PostClusterLinks400Code[keyof typeof PostClusterLinks400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostClusterLinks400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostClusterLinks400 = {
  code?: PostClusterLinks400Code
  message?: string
}

export type PutClusterNodeInviteAsync400Code =
  typeof PutClusterNodeInviteAsync400Code[keyof typeof PutClusterNodeInviteAsync400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterNodeInviteAsync400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterNodeInviteAsync400 = {
  code?: PutClusterNodeInviteAsync400Code
  message?: string
}

export type PutClusterNodeInvite400Code =
  typeof PutClusterNodeInvite400Code[keyof typeof PutClusterNodeInvite400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterNodeInvite400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterNodeInvite400 = {
  code?: PutClusterNodeInvite400Code
  message?: string
}

export type DeleteClusterNodeForceLeave404Code =
  typeof DeleteClusterNodeForceLeave404Code[keyof typeof DeleteClusterNodeForceLeave404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteClusterNodeForceLeave404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteClusterNodeForceLeave404 = {
  code?: DeleteClusterNodeForceLeave404Code
  message?: string
}

export type GetCluster200 = {
  name?: string
  nodes?: string[]
  self?: string
}

export type EmqxSslClientOptsVerify =
  typeof EmqxSslClientOptsVerify[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

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

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  depth?: number
  enable?: boolean
  hibernate_after?: string
  keyfile?: string
  log_level?: EmqxSslClientOptsLogLevel
  partial_chain?: EmqxSslClientOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
  verify?: EmqxSslClientOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export interface ClusterTimeout {
  timeout?: number
}

export interface ClusterReplicantInfo {
  node?: string
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
  max_inflight?: number
  name: string
  password?: string
  pool_size?: number
  resource_opts?: ClusterCreationOpts
  retry_interval?: string
  server: string
  ssl?: EmqxSslClientOpts
  topics: string[]
  username?: string
}

export interface ClusterInvitationStatus {
  failed?: ClusterNodeInvitationFailed[]
  in_progress?: ClusterNodeInvitationInProgress[]
  succeed?: ClusterNodeInvitationSucceed[]
}

export type ClusterCreationOptsRequestTtl = 'infinity' | string

/**
 * @deprecated
 */
export type ClusterCreationOptsAutoRestartInterval = string | 'infinity'

export interface ClusterCreationOpts {
  /** @deprecated */
  auto_restart_interval?: ClusterCreationOptsAutoRestartInterval
  /** @deprecated */
  enable_queue?: boolean
  health_check_interval?: string
  inflight_window?: number
  max_buffer_bytes?: string
  request_ttl?: ClusterCreationOptsRequestTtl
  start_timeout?: string
  worker_pool_size?: number
}

export interface ClusterCoreReplicants {
  core_node?: string
  replicant_nodes?: ClusterReplicantInfo[]
}

export type ClusterLinkNodeMetricsMetrics = { [key: string]: any }

export interface ClusterLinkNodeMetrics {
  metrics?: ClusterLinkNodeMetricsMetrics
  node?: string
}

export type ClusterLinkLinkMetricsResponseMetrics = { [key: string]: any }

export interface ClusterLinkLinkMetricsResponse {
  metrics?: ClusterLinkLinkMetricsResponseMetrics
  node_metrics?: ClusterLinkNodeMetrics[]
}

export type ClusterLinkLinkConfigResponseStatus =
  typeof ClusterLinkLinkConfigResponseStatus[keyof typeof ClusterLinkLinkConfigResponseStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ClusterLinkLinkConfigResponseStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface ClusterLinkLinkConfigResponse {
  clientid?: string
  enable?: boolean
  max_inflight?: number
  name: string
  node?: string
  password?: string
  pool_size?: number
  resource_opts?: ClusterCreationOpts
  retry_interval?: string
  server: string
  ssl?: EmqxSslClientOpts
  status?: ClusterLinkLinkConfigResponseStatus
  topics: string[]
  username?: string
}
