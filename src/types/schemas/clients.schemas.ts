export type GetSessionsCount400Code =
  typeof GetSessionsCount400Code[keyof typeof GetSessionsCount400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSessionsCount400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetSessionsCount400 = {
  code?: GetSessionsCount400Code
  message?: string
}

export type GetSessionsCountParams = {
  since?: number
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

export type GetClientsClientidMqueueMessages501Code =
  typeof GetClientsClientidMqueueMessages501Code[keyof typeof GetClientsClientidMqueueMessages501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidMqueueMessages501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type GetClientsClientidMqueueMessages501 = {
  code?: GetClientsClientidMqueueMessages501Code
  message?: string
}

export type GetClientsClientidMqueueMessages404Code =
  typeof GetClientsClientidMqueueMessages404Code[keyof typeof GetClientsClientidMqueueMessages404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidMqueueMessages404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
  CLIENT_SHUTDOWN: 'CLIENT_SHUTDOWN',
} as const

export type GetClientsClientidMqueueMessages404 = {
  code?: GetClientsClientidMqueueMessages404Code
  message?: string
}

export type GetClientsClientidMqueueMessages400Code =
  typeof GetClientsClientidMqueueMessages400Code[keyof typeof GetClientsClientidMqueueMessages400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidMqueueMessages400Code = {
  INVALID_PARAMETER: 'INVALID_PARAMETER',
} as const

export type GetClientsClientidMqueueMessages400 = {
  code?: GetClientsClientidMqueueMessages400Code
  message?: string
}

export type GetClientsClientidMqueueMessagesPayload =
  typeof GetClientsClientidMqueueMessagesPayload[keyof typeof GetClientsClientidMqueueMessagesPayload]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidMqueueMessagesPayload = {
  none: 'none',
  base64: 'base64',
  plain: 'plain',
} as const

export type GetClientsClientidMqueueMessagesParams = {
  payload?: GetClientsClientidMqueueMessagesPayload
  max_payload_bytes?: string
  position?: PublicPositionParameter
  limit?: PublicLimitParameter
}

export type GetClientsClientidInflightMessages501Code =
  typeof GetClientsClientidInflightMessages501Code[keyof typeof GetClientsClientidInflightMessages501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidInflightMessages501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type GetClientsClientidInflightMessages501 = {
  code?: GetClientsClientidInflightMessages501Code
  message?: string
}

export type GetClientsClientidInflightMessages404Code =
  typeof GetClientsClientidInflightMessages404Code[keyof typeof GetClientsClientidInflightMessages404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidInflightMessages404Code = {
  CLIENTID_NOT_FOUND: 'CLIENTID_NOT_FOUND',
  CLIENT_SHUTDOWN: 'CLIENT_SHUTDOWN',
} as const

export type GetClientsClientidInflightMessages404 = {
  code?: GetClientsClientidInflightMessages404Code
  message?: string
}

export type GetClientsClientidInflightMessages400Code =
  typeof GetClientsClientidInflightMessages400Code[keyof typeof GetClientsClientidInflightMessages400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidInflightMessages400Code = {
  INVALID_PARAMETER: 'INVALID_PARAMETER',
} as const

export type GetClientsClientidInflightMessages400 = {
  code?: GetClientsClientidInflightMessages400Code
  message?: string
}

export type GetClientsClientidInflightMessagesPayload =
  typeof GetClientsClientidInflightMessagesPayload[keyof typeof GetClientsClientidInflightMessagesPayload]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetClientsClientidInflightMessagesPayload = {
  none: 'none',
  base64: 'base64',
  plain: 'plain',
} as const

export type GetClientsClientidInflightMessagesParams = {
  payload?: GetClientsClientidInflightMessagesPayload
  max_payload_bytes?: string
  position?: PublicPositionParameter
  limit?: PublicLimitParameter
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

export type PublicPositionParameter = string | 'end_of_data' | 'none'

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetClientsParams = {
  page?: PublicPageParameter
  node?: string
  limit?: PublicLimitParameter
  username?: string[]
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
  clientid?: string[]
  fields?: EmqxMgmtApiClientsRequestedClientFieldsParameter
}

export type EmqxMgmtApiClientsRequestedClientFieldsParameterOneOfItem =
  typeof EmqxMgmtApiClientsRequestedClientFieldsParameterOneOfItem[keyof typeof EmqxMgmtApiClientsRequestedClientFieldsParameterOneOfItem]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiClientsRequestedClientFieldsParameterOneOfItem = {
  client_attrs: 'client_attrs',
  awaiting_rel_cnt: 'awaiting_rel_cnt',
  awaiting_rel_max: 'awaiting_rel_max',
  clean_start: 'clean_start',
  clientid: 'clientid',
  connected: 'connected',
  connected_at: 'connected_at',
  created_at: 'created_at',
  disconnected_at: 'disconnected_at',
  expiry_interval: 'expiry_interval',
  heap_size: 'heap_size',
  inflight_cnt: 'inflight_cnt',
  inflight_max: 'inflight_max',
  ip_address: 'ip_address',
  is_bridge: 'is_bridge',
  is_expired: 'is_expired',
  keepalive: 'keepalive',
  mailbox_len: 'mailbox_len',
  mqueue_dropped: 'mqueue_dropped',
  mqueue_len: 'mqueue_len',
  mqueue_max: 'mqueue_max',
  node: 'node',
  port: 'port',
  proto_name: 'proto_name',
  proto_ver: 'proto_ver',
  recv_cnt: 'recv_cnt',
  recv_msg: 'recv_msg',
  recv_msgdropped: 'recv_msg.dropped',
  recv_msgdroppedawait_pubrel_timeout: 'recv_msg.dropped.await_pubrel_timeout',
  recv_msgqos0: 'recv_msg.qos0',
  recv_msgqos1: 'recv_msg.qos1',
  recv_msgqos2: 'recv_msg.qos2',
  recv_oct: 'recv_oct',
  recv_pkt: 'recv_pkt',
  reductions: 'reductions',
  send_cnt: 'send_cnt',
  send_msg: 'send_msg',
  send_msgdropped: 'send_msg.dropped',
  send_msgdroppedexpired: 'send_msg.dropped.expired',
  send_msgdroppedqueue_full: 'send_msg.dropped.queue_full',
  send_msgdroppedtoo_large: 'send_msg.dropped.too_large',
  send_msgqos0: 'send_msg.qos0',
  send_msgqos1: 'send_msg.qos1',
  send_msgqos2: 'send_msg.qos2',
  send_oct: 'send_oct',
  send_pkt: 'send_pkt',
  subscriptions_cnt: 'subscriptions_cnt',
  subscriptions_max: 'subscriptions_max',
  username: 'username',
  mountpoint: 'mountpoint',
  durable: 'durable',
  n_streams: 'n_streams',
  seqno_q1_comm: 'seqno_q1_comm',
  seqno_q1_dup: 'seqno_q1_dup',
  seqno_q1_next: 'seqno_q1_next',
  seqno_q2_comm: 'seqno_q2_comm',
  seqno_q2_dup: 'seqno_q2_dup',
  seqno_q2_rec: 'seqno_q2_rec',
  seqno_q2_next: 'seqno_q2_next',
} as const

export type EmqxMgmtApiClientsRequestedClientFieldsParameter =
  | EmqxMgmtApiClientsRequestedClientFieldsParameterOneOfItem[]
  | 'all'

export interface PublicMeta {
  count?: number
  hasnext: boolean
  limit?: number
  page?: number
}

export type PublicContinuationMetaStart = string | 'none'

export type PublicContinuationMetaPosition = string | 'end_of_data' | 'none'

export interface PublicContinuationMeta {
  position?: PublicContinuationMetaPosition
  start: PublicContinuationMetaStart
}

export interface EmqxMgmtApiSubscriptionsSubscription {
  clientid?: string
  durable?: boolean
  nl?: number
  node?: string
  qos?: number
  rap?: number
  rh?: number
  topic?: string
}

export interface EmqxMgmtApiClientsUnsubscribe {
  topic?: string
}

export interface EmqxMgmtApiClientsSubscribe {
  nl?: number
  qos?: number
  rap?: number
  rh?: number
  topic: string
}

export type EmqxMgmtApiClientsMqueueMessageMqueuePriority = 'infinity' | number

export interface EmqxMgmtApiClientsMqueueMessage {
  from_clientid?: string
  from_username?: string
  inserted_at?: string
  mqueue_priority?: EmqxMgmtApiClientsMqueueMessageMqueuePriority
  msgid?: string
  payload?: string
  publish_at?: number
  qos?: number
  topic?: string
}

export interface EmqxMgmtApiClientsMqueueMessages {
  data?: EmqxMgmtApiClientsMqueueMessage[]
  meta?: PublicContinuationMeta
}

export interface EmqxMgmtApiClientsMessage {
  from_clientid?: string
  from_username?: string
  inserted_at?: string
  msgid?: string
  payload?: string
  publish_at?: number
  qos?: number
  topic?: string
}

export interface EmqxMgmtApiClientsInflightMessages {
  data?: EmqxMgmtApiClientsMessage[]
  meta?: PublicContinuationMeta
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
  durable?: boolean
  expiry_interval?: number
  heap_size?: number
  inflight_cnt?: number
  inflight_max?: number
  ip_address?: string
  is_bridge?: boolean
  is_expired?: boolean
  keepalive?: number
  mailbox_len?: number
  mountpoint?: string
  mqueue_dropped?: number
  mqueue_len?: number
  mqueue_max?: number
  n_streams?: number
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
  seqno_q1_comm?: number
  seqno_q1_dup?: number
  seqno_q1_next?: number
  seqno_q2_comm?: number
  seqno_q2_dup?: number
  seqno_q2_next?: number
  seqno_q2_rec?: number
  subscriptions_cnt?: number
  subscriptions_max?: number
  username?: string
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
