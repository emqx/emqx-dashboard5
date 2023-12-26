export type GetClients400Code = typeof GetClients400Code[keyof typeof GetClients400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClients400Code = {
  INVALID_PARAMETER: 'INVALID_PARAMETER',
} as const

export type GetClients400 = {
  code?: GetClients400Code
  message?: string
}

export type GetClientsConnState = typeof GetClientsConnState[keyof typeof GetClientsConnState]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsConnState = {
  connected: 'connected',
  idle: 'idle',
  disconnected: 'disconnected',
} as const

export type GetClientsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  node?: string
  username?: string
  ip_address?: string
  conn_state?: GetClientsConnState
  clean_start?: boolean
  proto_ver?: string
  like_clientid?: string
  like_username?: string
  gte_created_at?: number | string
  lte_created_at?: number | string
  gte_connected_at?: number | string
  lte_connected_at?: number | string
}

export type GetClientsClientidSubscriptions404Code =
  typeof GetClientsClientidSubscriptions404Code[keyof typeof GetClientsClientidSubscriptions404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidSubscriptions404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type GetClientsClientidSubscriptions404 = {
  code?: GetClientsClientidSubscriptions404Code
  message?: string
}

export type PostClientsClientidUnsubscribe404Code =
  typeof PostClientsClientidUnsubscribe404Code[keyof typeof PostClientsClientidUnsubscribe404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostClientsClientidUnsubscribe404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type PostClientsClientidUnsubscribe404 = {
  code?: PostClientsClientidUnsubscribe404Code
  message?: string
}

export type PostClientsClientidSubscribe404Code =
  typeof PostClientsClientidSubscribe404Code[keyof typeof PostClientsClientidSubscribe404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostClientsClientidSubscribe404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type PostClientsClientidSubscribe404 = {
  code?: PostClientsClientidSubscribe404Code
  message?: string
}

export type PostClientsClientidSubscribeBulk404Code =
  typeof PostClientsClientidSubscribeBulk404Code[keyof typeof PostClientsClientidSubscribeBulk404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostClientsClientidSubscribeBulk404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type PostClientsClientidSubscribeBulk404 = {
  code?: PostClientsClientidSubscribeBulk404Code
  message?: string
}

export type PostClientsClientidUnsubscribeBulk404Code =
  typeof PostClientsClientidUnsubscribeBulk404Code[keyof typeof PostClientsClientidUnsubscribeBulk404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostClientsClientidUnsubscribeBulk404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type PostClientsClientidUnsubscribeBulk404 = {
  code?: PostClientsClientidUnsubscribeBulk404Code
  message?: string
}

export type DeleteClientsClientid404Code =
  typeof DeleteClientsClientid404Code[keyof typeof DeleteClientsClientid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteClientsClientid404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type DeleteClientsClientid404 = {
  code?: DeleteClientsClientid404Code
  message?: string
}

export type GetClientsClientid404Code =
  typeof GetClientsClientid404Code[keyof typeof GetClientsClientid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientid404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type GetClientsClientid404 = {
  code?: GetClientsClientid404Code
  message?: string
}

export type DeleteClientsClientidAuthorizationCache404Code =
  typeof DeleteClientsClientidAuthorizationCache404Code[keyof typeof DeleteClientsClientidAuthorizationCache404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteClientsClientidAuthorizationCache404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type DeleteClientsClientidAuthorizationCache404 = {
  code?: DeleteClientsClientidAuthorizationCache404Code
  message?: string
}

export type GetClientsClientidAuthorizationCache404Code =
  typeof GetClientsClientidAuthorizationCache404Code[keyof typeof GetClientsClientidAuthorizationCache404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidAuthorizationCache404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
} as const

export type GetClientsClientidAuthorizationCache404 = {
  code?: GetClientsClientidAuthorizationCache404Code
  message?: string
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export interface PublicMeta {
  page?: number
  limit?: number
  count?: number
  hasnext: boolean
}

export interface EmqxMgmtApiSubscriptionsSubscription {
  node?: string
  topic?: string
  clientid?: string
  qos?: number
  nl?: number
  rap?: number
  rh?: number
}

export interface EmqxMgmtApiClientsUnsubscribe {
  topic?: string
}

export interface EmqxMgmtApiClientsSubscribe {
  topic: string
  qos?: number
  nl?: number
  rap?: number
  rh?: number
}

export type EmqxMgmtApiClientsClientDisconnectedAt = number | string

export type EmqxMgmtApiClientsClientCreatedAt = number | string

export type EmqxMgmtApiClientsClientConnectedAt = number | string

export interface EmqxMgmtApiClientsClient {
  awaiting_rel_cnt?: number
  awaiting_rel_max?: number
  clean_start?: boolean
  clientid?: string
  connected?: boolean
  connected_at?: EmqxMgmtApiClientsClientConnectedAt
  created_at?: EmqxMgmtApiClientsClientCreatedAt
  disconnected_at?: EmqxMgmtApiClientsClientDisconnectedAt
  expiry_interval?: number
  heap_size?: number
  inflight_cnt?: number
  inflight_max?: number
  ip_address?: string
  is_bridge?: boolean
  keepalive?: number
  mailbox_len?: number
  mqueue_dropped?: number
  mqueue_len?: number
  mqueue_max?: number
  node?: string
  port?: number
  proto_name?: string
  proto_ver?: number
  recv_cnt?: number
  recv_msg?: number
  'recv_msg.dropped'?: number
  'recv_msg.dropped.await_pubrel_timeout'?: number
  'recv_msg.qos0'?: number
  'recv_msg.qos1'?: number
  'recv_msg.qos2'?: number
  recv_oct?: number
  recv_pkt?: number
  reductions?: number
  send_cnt?: number
  send_msg?: number
  'send_msg.dropped'?: number
  'send_msg.dropped.expired'?: number
  'send_msg.dropped.queue_full'?: number
  'send_msg.dropped.too_large'?: number
  'send_msg.qos0'?: number
  'send_msg.qos1'?: number
  'send_msg.qos2'?: number
  send_oct?: number
  send_pkt?: number
  subscriptions_cnt?: number
  subscriptions_max?: number
  username?: string
  mountpoint?: string
}

export interface EmqxMgmtApiClientsClients {
  data?: EmqxMgmtApiClientsClient[]
  meta?: PublicMeta
}

export type EmqxMgmtApiClientsAuthzCacheResult =
  typeof EmqxMgmtApiClientsAuthzCacheResult[keyof typeof EmqxMgmtApiClientsAuthzCacheResult]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiClientsAuthzCacheResult = {
  allow: 'allow',
  denny: 'denny',
} as const

export interface EmqxMgmtApiClientsAuthzCache {
  access?: string
  result?: EmqxMgmtApiClientsAuthzCacheResult
  topic?: string
  updated_time?: number
}
