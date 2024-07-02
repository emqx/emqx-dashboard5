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

export type PutClusterLinks400Code =
  typeof PutClusterLinks400Code[keyof typeof PutClusterLinks400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterLinks400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterLinks400 = {
  code?: PutClusterLinks400Code
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
  partial_chain?: EmqxSslClientOptsPartialChain
  verify_peer_ext_key_usage?: string
  enable?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
}

export interface ClusterTimeout {
  timeout?: number
}

export interface ClusterReplicantInfo {
  node?: string
  streams?: number
}

export interface ClusterNodeInvitationSucceed {
  node?: string
  started_at?: string
  finished_at?: string
}

export interface ClusterNodeInvitationInProgress {
  node?: string
  started_at?: string
}

export interface ClusterNodeInvitationFailed {
  node?: string
  started_at?: string
  finished_at?: string
  reason?: string
}

export interface ClusterLink {
  enable?: boolean
  name: string
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

export interface ClusterInvitationStatus {
  succeed?: ClusterNodeInvitationSucceed[]
  in_progress?: ClusterNodeInvitationInProgress[]
  failed?: ClusterNodeInvitationFailed[]
}

export type ClusterCreationOptsRequestTtl = 'infinity' | string

/**
 * @deprecated
 */
export type ClusterCreationOptsAutoRestartInterval = string | 'infinity'

export interface ClusterCreationOpts {
  worker_pool_size?: number
  health_check_interval?: string
  start_timeout?: string
  /** @deprecated */
  auto_restart_interval?: ClusterCreationOptsAutoRestartInterval
  request_ttl?: ClusterCreationOptsRequestTtl
  inflight_window?: number
  /** @deprecated */
  enable_queue?: boolean
  max_buffer_bytes?: string
}

export interface ClusterCoreReplicants {
  core_node?: string
  replicant_nodes?: ClusterReplicantInfo[]
}
