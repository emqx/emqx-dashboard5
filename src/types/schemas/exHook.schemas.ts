export type GetExhooksNameHooks400Code =
  typeof GetExhooksNameHooks400Code[keyof typeof GetExhooksNameHooks400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetExhooksNameHooks400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetExhooksNameHooks400 = {
  code?: GetExhooksNameHooks400Code
  message?: string
}

export type PostExhooks500Code = typeof PostExhooks500Code[keyof typeof PostExhooks500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostExhooks500Code = {
  BAD_RPC: 'BAD_RPC',
} as const

export type PostExhooks500 = {
  code?: PostExhooks500Code
  message?: string
}

export type PostExhooks400Code = typeof PostExhooks400Code[keyof typeof PostExhooks400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostExhooks400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostExhooks400 = {
  code?: PostExhooks400Code
  message?: string
}

export type PostExhooksNameMove500Code =
  typeof PostExhooksNameMove500Code[keyof typeof PostExhooksNameMove500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostExhooksNameMove500Code = {
  BAD_RPC: 'BAD_RPC',
} as const

export type PostExhooksNameMove500 = {
  code?: PostExhooksNameMove500Code
  message?: string
}

export type PostExhooksNameMove400Code =
  typeof PostExhooksNameMove400Code[keyof typeof PostExhooksNameMove400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostExhooksNameMove400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostExhooksNameMove400 = {
  code?: PostExhooksNameMove400Code
  message?: string
}

export type DeleteExhooksName500Code =
  typeof DeleteExhooksName500Code[keyof typeof DeleteExhooksName500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteExhooksName500Code = {
  BAD_RPC: 'BAD_RPC',
} as const

export type DeleteExhooksName500 = {
  code?: DeleteExhooksName500Code
  message?: string
}

export type DeleteExhooksName404Code =
  typeof DeleteExhooksName404Code[keyof typeof DeleteExhooksName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteExhooksName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteExhooksName404 = {
  code?: DeleteExhooksName404Code
  message?: string
}

export type PutExhooksName500Code = typeof PutExhooksName500Code[keyof typeof PutExhooksName500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutExhooksName500Code = {
  BAD_RPC: 'BAD_RPC',
} as const

export type PutExhooksName500 = {
  code?: PutExhooksName500Code
  message?: string
}

export type PutExhooksName404Code = typeof PutExhooksName404Code[keyof typeof PutExhooksName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutExhooksName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutExhooksName404 = {
  code?: PutExhooksName404Code
  message?: string
}

export type PutExhooksName400Code = typeof PutExhooksName400Code[keyof typeof PutExhooksName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutExhooksName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutExhooksName400 = {
  code?: PutExhooksName400Code
  message?: string
}

export type GetExhooksName404Code = typeof GetExhooksName404Code[keyof typeof GetExhooksName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetExhooksName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetExhooksName404 = {
  code?: GetExhooksName404Code
  message?: string
}

export type ExhookSslConfServerNameIndication = string | 'disable'

export type ExhookSslConfLogLevel = typeof ExhookSslConfLogLevel[keyof typeof ExhookSslConfLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ExhookSslConfLogLevel = {
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

export type ExhookSslConfVerify = typeof ExhookSslConfVerify[keyof typeof ExhookSslConfVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ExhookSslConfVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface ExhookSslConf {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: ExhookSslConfVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: ExhookSslConfLogLevel
  hibernate_after?: string
  enable?: boolean
  server_name_indication?: ExhookSslConfServerNameIndication
}

export interface ExhookSocketOptions {
  keepalive?: boolean
  nodelay?: boolean
  recbuf?: string
  sndbuf?: string
}

export type ExhookServerConfigAutoReconnect = string | 'false'

export type ExhookServerConfigFailedAction =
  typeof ExhookServerConfigFailedAction[keyof typeof ExhookServerConfigFailedAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ExhookServerConfigFailedAction = {
  deny: 'deny',
  ignore: 'ignore',
} as const

export interface ExhookServerConfig {
  name: string
  enable?: boolean
  url: string
  request_timeout?: string
  failed_action?: ExhookServerConfigFailedAction
  ssl?: ExhookSslConf
  socket_options?: ExhookSocketOptions
  auto_reconnect?: ExhookServerConfigAutoReconnect
  pool_size?: number
}

export type ExhookNodeStatusStatus =
  typeof ExhookNodeStatusStatus[keyof typeof ExhookNodeStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ExhookNodeStatusStatus = {
  connected: 'connected',
  connecting: 'connecting',
  disconnected: 'disconnected',
  disabled: 'disabled',
  error: 'error',
} as const

export interface ExhookNodeStatus {
  node?: string
  status?: ExhookNodeStatusStatus
}

export interface ExhookMoveReq {
  position: string
}

export interface ExhookMetrics {
  succeed?: number
  failed?: number
  rate?: number
  max_rate?: number
}

export interface ExhookNodeMetrics {
  node?: string
  metrics?: ExhookMetrics
}

export type ExhookListHookInfoParams = {
  $name?: string
}

export interface ExhookListHookInfo {
  name?: string
  params?: ExhookListHookInfoParams
  metrics?: ExhookMetrics
  node_metrics?: ExhookNodeMetrics[]
}

export type ExhookHookInfoParams = {
  $name?: string
}

export interface ExhookHookInfo {
  name?: string
  params?: ExhookHookInfoParams
}

export type ExhookDetailServerInfoAutoReconnect = string | 'false'

export type ExhookDetailServerInfoFailedAction =
  typeof ExhookDetailServerInfoFailedAction[keyof typeof ExhookDetailServerInfoFailedAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ExhookDetailServerInfoFailedAction = {
  deny: 'deny',
  ignore: 'ignore',
} as const

export interface ExhookDetailServerInfo {
  metrics?: ExhookMetrics
  node_metrics?: ExhookNodeMetrics[]
  node_status?: ExhookNodeStatus[]
  hooks?: ExhookHookInfo[]
  name: string
  enable?: boolean
  url: string
  request_timeout?: string
  failed_action?: ExhookDetailServerInfoFailedAction
  ssl?: ExhookSslConf
  socket_options?: ExhookSocketOptions
  auto_reconnect?: ExhookDetailServerInfoAutoReconnect
  pool_size?: number
}
