export type GetGatewaysNameClients404Code =
  typeof GetGatewaysNameClients404Code[keyof typeof GetGatewaysNameClients404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysNameClients404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type GetGatewaysNameClients404 = {
  code?: GetGatewaysNameClients404Code
  message?: string
}

export type GetGatewaysNameClients400Code =
  typeof GetGatewaysNameClients400Code[keyof typeof GetGatewaysNameClients400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysNameClients400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetGatewaysNameClients400 = {
  code?: GetGatewaysNameClients400Code
  message?: string
}

export type GetGatewaysNameClients200Data =
  | EmqxGatewayApiClientsExprotoClient[]
  | EmqxGatewayApiClientsLwm2mClient[]
  | EmqxGatewayApiClientsCoapClient[]
  | EmqxGatewayApiClientsMqttsnClient[]
  | EmqxGatewayApiClientsStompClient[]

export type GetGatewaysNameClients200 = {
  data?: GetGatewaysNameClients200Data
  meta?: PublicMeta
}

export type GetGatewaysNameClientsParams = {
  node?: string
  clientid?: string
  username?: string
  ip_address?: string
  conn_state?: string
  proto_ver?: string
  clean_start?: boolean
  like_clientid?: string
  like_username?: string
  gte_created_at?: number | string
  lte_created_at?: number | string
  gte_connected_at?: number | string
  lte_connected_at?: number | string
  endpoint_name?: string
  like_endpoint_name?: string
  gte_lifetime?: string
  lte_lifetime?: string
  page?: number
  limit?: number
}

export type DeleteGatewaysNameClientsClientidSubscriptionsTopic404Code =
  typeof DeleteGatewaysNameClientsClientidSubscriptionsTopic404Code[keyof typeof DeleteGatewaysNameClientsClientidSubscriptionsTopic404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteGatewaysNameClientsClientidSubscriptionsTopic404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type DeleteGatewaysNameClientsClientidSubscriptionsTopic404 = {
  code?: DeleteGatewaysNameClientsClientidSubscriptionsTopic404Code
  message?: string
}

export type DeleteGatewaysNameClientsClientidSubscriptionsTopic400Code =
  typeof DeleteGatewaysNameClientsClientidSubscriptionsTopic400Code[keyof typeof DeleteGatewaysNameClientsClientidSubscriptionsTopic400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteGatewaysNameClientsClientidSubscriptionsTopic400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteGatewaysNameClientsClientidSubscriptionsTopic400 = {
  code?: DeleteGatewaysNameClientsClientidSubscriptionsTopic400Code
  message?: string
}

export type PostGatewaysNameClientsClientidSubscriptions404Code =
  typeof PostGatewaysNameClientsClientidSubscriptions404Code[keyof typeof PostGatewaysNameClientsClientidSubscriptions404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysNameClientsClientidSubscriptions404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type PostGatewaysNameClientsClientidSubscriptions404 = {
  code?: PostGatewaysNameClientsClientidSubscriptions404Code
  message?: string
}

export type PostGatewaysNameClientsClientidSubscriptions400Code =
  typeof PostGatewaysNameClientsClientidSubscriptions400Code[keyof typeof PostGatewaysNameClientsClientidSubscriptions400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysNameClientsClientidSubscriptions400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostGatewaysNameClientsClientidSubscriptions400 = {
  code?: PostGatewaysNameClientsClientidSubscriptions400Code
  message?: string
}

export type GetGatewaysNameClientsClientidSubscriptions404Code =
  typeof GetGatewaysNameClientsClientidSubscriptions404Code[keyof typeof GetGatewaysNameClientsClientidSubscriptions404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysNameClientsClientidSubscriptions404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type GetGatewaysNameClientsClientidSubscriptions404 = {
  code?: GetGatewaysNameClientsClientidSubscriptions404Code
  message?: string
}

export type GetGatewaysNameClientsClientidSubscriptions400Code =
  typeof GetGatewaysNameClientsClientidSubscriptions400Code[keyof typeof GetGatewaysNameClientsClientidSubscriptions400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysNameClientsClientidSubscriptions400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetGatewaysNameClientsClientidSubscriptions400 = {
  code?: GetGatewaysNameClientsClientidSubscriptions400Code
  message?: string
}

export type DeleteGatewaysNameClientsClientid404Code =
  typeof DeleteGatewaysNameClientsClientid404Code[keyof typeof DeleteGatewaysNameClientsClientid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteGatewaysNameClientsClientid404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type DeleteGatewaysNameClientsClientid404 = {
  code?: DeleteGatewaysNameClientsClientid404Code
  message?: string
}

export type DeleteGatewaysNameClientsClientid400Code =
  typeof DeleteGatewaysNameClientsClientid400Code[keyof typeof DeleteGatewaysNameClientsClientid400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteGatewaysNameClientsClientid400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteGatewaysNameClientsClientid400 = {
  code?: DeleteGatewaysNameClientsClientid400Code
  message?: string
}

export type GetGatewaysNameClientsClientid404Code =
  typeof GetGatewaysNameClientsClientid404Code[keyof typeof GetGatewaysNameClientsClientid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysNameClientsClientid404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type GetGatewaysNameClientsClientid404 = {
  code?: GetGatewaysNameClientsClientid404Code
  message?: string
}

export type GetGatewaysNameClientsClientid400Code =
  typeof GetGatewaysNameClientsClientid400Code[keyof typeof GetGatewaysNameClientsClientid400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysNameClientsClientid400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetGatewaysNameClientsClientid400 = {
  code?: GetGatewaysNameClientsClientid400Code
  message?: string
}

export interface PublicMeta {
  page?: number
  limit?: number
  count?: number
  hasnext: boolean
}

export interface EmqxGatewayApiClientsSubscription {
  topic?: string
  qos?: number
  nl?: number
  rap?: number
  rh?: number
  sub_props?: EmqxGatewayApiClientsExtraSubProps
}

export type EmqxGatewayApiClientsStompClientCreatedAt = number | string

export type EmqxGatewayApiClientsStompClientDisconnectedAt = number | string

export type EmqxGatewayApiClientsStompClientConnectedAt = number | string

export interface EmqxGatewayApiClientsStompClient {
  node?: string
  clientid?: string
  username?: string
  mountpoint?: string
  proto_name?: string
  proto_ver?: string
  ip_address?: string
  port?: number
  is_bridge?: boolean
  connected_at?: EmqxGatewayApiClientsStompClientConnectedAt
  disconnected_at?: EmqxGatewayApiClientsStompClientDisconnectedAt
  connected?: boolean
  keepalive?: number
  clean_start?: boolean
  expiry_interval?: number
  created_at?: EmqxGatewayApiClientsStompClientCreatedAt
  subscriptions_cnt?: number
  subscriptions_max?: number
  inflight_cnt?: number
  inflight_max?: number
  mqueue_len?: number
  mqueue_max?: number
  mqueue_dropped?: number
  awaiting_rel_cnt?: number
  awaiting_rel_max?: number
  recv_oct?: number
  recv_cnt?: number
  recv_pkt?: number
  recv_msg?: number
  send_oct?: number
  send_cnt?: number
  send_pkt?: number
  send_msg?: number
  mailbox_len?: number
  heap_size?: number
  reductions?: number
}

export type GetGatewaysNameClientsClientid200 =
  | EmqxGatewayApiClientsExprotoClient
  | EmqxGatewayApiClientsLwm2mClient
  | EmqxGatewayApiClientsCoapClient
  | EmqxGatewayApiClientsMqttsnClient
  | EmqxGatewayApiClientsStompClient

export type EmqxGatewayApiClientsMqttsnClientCreatedAt = number | string

export type EmqxGatewayApiClientsMqttsnClientDisconnectedAt = number | string

export type EmqxGatewayApiClientsMqttsnClientConnectedAt = number | string

export interface EmqxGatewayApiClientsMqttsnClient {
  node?: string
  clientid?: string
  username?: string
  mountpoint?: string
  proto_name?: string
  proto_ver?: string
  ip_address?: string
  port?: number
  is_bridge?: boolean
  connected_at?: EmqxGatewayApiClientsMqttsnClientConnectedAt
  disconnected_at?: EmqxGatewayApiClientsMqttsnClientDisconnectedAt
  connected?: boolean
  keepalive?: number
  clean_start?: boolean
  expiry_interval?: number
  created_at?: EmqxGatewayApiClientsMqttsnClientCreatedAt
  subscriptions_cnt?: number
  subscriptions_max?: number
  inflight_cnt?: number
  inflight_max?: number
  mqueue_len?: number
  mqueue_max?: number
  mqueue_dropped?: number
  awaiting_rel_cnt?: number
  awaiting_rel_max?: number
  recv_oct?: number
  recv_cnt?: number
  recv_pkt?: number
  recv_msg?: number
  send_oct?: number
  send_cnt?: number
  send_pkt?: number
  send_msg?: number
  mailbox_len?: number
  heap_size?: number
  reductions?: number
}

export type EmqxGatewayApiClientsLwm2mClientCreatedAt = number | string

export type EmqxGatewayApiClientsLwm2mClientDisconnectedAt = number | string

export type EmqxGatewayApiClientsLwm2mClientConnectedAt = number | string

export interface EmqxGatewayApiClientsLwm2mClient {
  endpoint_name?: string
  lifetime?: number
  node?: string
  clientid?: string
  username?: string
  mountpoint?: string
  proto_name?: string
  proto_ver?: string
  ip_address?: string
  port?: number
  is_bridge?: boolean
  connected_at?: EmqxGatewayApiClientsLwm2mClientConnectedAt
  disconnected_at?: EmqxGatewayApiClientsLwm2mClientDisconnectedAt
  connected?: boolean
  keepalive?: number
  clean_start?: boolean
  expiry_interval?: number
  created_at?: EmqxGatewayApiClientsLwm2mClientCreatedAt
  subscriptions_cnt?: number
  subscriptions_max?: number
  inflight_cnt?: number
  inflight_max?: number
  mqueue_len?: number
  mqueue_max?: number
  mqueue_dropped?: number
  awaiting_rel_cnt?: number
  awaiting_rel_max?: number
  recv_oct?: number
  recv_cnt?: number
  recv_pkt?: number
  recv_msg?: number
  send_oct?: number
  send_cnt?: number
  send_pkt?: number
  send_msg?: number
  mailbox_len?: number
  heap_size?: number
  reductions?: number
}

export interface EmqxGatewayApiClientsExtraSubProps {
  subid?: string
}

export type EmqxGatewayApiClientsExprotoClientCreatedAt = number | string

export type EmqxGatewayApiClientsExprotoClientDisconnectedAt = number | string

export type EmqxGatewayApiClientsExprotoClientConnectedAt = number | string

export interface EmqxGatewayApiClientsExprotoClient {
  node?: string
  clientid?: string
  username?: string
  mountpoint?: string
  proto_name?: string
  proto_ver?: string
  ip_address?: string
  port?: number
  is_bridge?: boolean
  connected_at?: EmqxGatewayApiClientsExprotoClientConnectedAt
  disconnected_at?: EmqxGatewayApiClientsExprotoClientDisconnectedAt
  connected?: boolean
  keepalive?: number
  clean_start?: boolean
  expiry_interval?: number
  created_at?: EmqxGatewayApiClientsExprotoClientCreatedAt
  subscriptions_cnt?: number
  subscriptions_max?: number
  inflight_cnt?: number
  inflight_max?: number
  mqueue_len?: number
  mqueue_max?: number
  mqueue_dropped?: number
  awaiting_rel_cnt?: number
  awaiting_rel_max?: number
  recv_oct?: number
  recv_cnt?: number
  recv_pkt?: number
  recv_msg?: number
  send_oct?: number
  send_cnt?: number
  send_pkt?: number
  send_msg?: number
  mailbox_len?: number
  heap_size?: number
  reductions?: number
}

export type EmqxGatewayApiClientsCoapClientCreatedAt = number | string

export type EmqxGatewayApiClientsCoapClientDisconnectedAt = number | string

export type EmqxGatewayApiClientsCoapClientConnectedAt = number | string

export interface EmqxGatewayApiClientsCoapClient {
  node?: string
  clientid?: string
  username?: string
  mountpoint?: string
  proto_name?: string
  proto_ver?: string
  ip_address?: string
  port?: number
  is_bridge?: boolean
  connected_at?: EmqxGatewayApiClientsCoapClientConnectedAt
  disconnected_at?: EmqxGatewayApiClientsCoapClientDisconnectedAt
  connected?: boolean
  keepalive?: number
  clean_start?: boolean
  expiry_interval?: number
  created_at?: EmqxGatewayApiClientsCoapClientCreatedAt
  subscriptions_cnt?: number
  subscriptions_max?: number
  inflight_cnt?: number
  inflight_max?: number
  mqueue_len?: number
  mqueue_max?: number
  mqueue_dropped?: number
  awaiting_rel_cnt?: number
  awaiting_rel_max?: number
  recv_oct?: number
  recv_cnt?: number
  recv_pkt?: number
  recv_msg?: number
  send_oct?: number
  send_cnt?: number
  send_pkt?: number
  send_msg?: number
  mailbox_len?: number
  heap_size?: number
  reductions?: number
}
