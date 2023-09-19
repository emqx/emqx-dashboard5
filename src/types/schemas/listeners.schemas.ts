export type PutListenersId404Code = typeof PutListenersId404Code[keyof typeof PutListenersId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutListenersId404Code = {
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutListenersId404 = {
  code?: PutListenersId404Code
  message?: string
}

export type PutListenersId400Code = typeof PutListenersId400Code[keyof typeof PutListenersId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutListenersId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutListenersId400 = {
  code?: PutListenersId400Code
  message?: string
}

export type PutListenersId200 =
  | ListenersWssRequiredBind
  | ListenersWsRequiredBind
  | ListenersTcpRequiredBind
  | ListenersSslRequiredBind
  | ListenersQuicRequiredBind

export type PutListenersIdBody =
  | ListenersWssNotRequiredBind
  | ListenersWsNotRequiredBind
  | ListenersTcpNotRequiredBind
  | ListenersSslNotRequiredBind
  | ListenersQuicNotRequiredBind

export type PostListenersId400Code =
  typeof PostListenersId400Code[keyof typeof PostListenersId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostListenersId400Code = {
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostListenersId400 = {
  code?: PostListenersId400Code
  message?: string
}

export type PostListenersId200 =
  | ListenersWssRequiredBind
  | ListenersWsRequiredBind
  | ListenersTcpRequiredBind
  | ListenersSslRequiredBind
  | ListenersQuicRequiredBind

export type PostListenersIdBody =
  | ListenersWssRequiredBind
  | ListenersWsRequiredBind
  | ListenersTcpRequiredBind
  | ListenersSslRequiredBind
  | ListenersQuicRequiredBind

export type GetListenersId404Code = typeof GetListenersId404Code[keyof typeof GetListenersId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetListenersId404Code = {
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetListenersId404 = {
  code?: GetListenersId404Code
  message?: string
}

export type GetListenersId200 =
  | ListenersWssRequiredBind
  | ListenersWsRequiredBind
  | ListenersTcpRequiredBind
  | ListenersSslRequiredBind
  | ListenersQuicRequiredBind

export type DeleteListenersId404Code =
  typeof DeleteListenersId404Code[keyof typeof DeleteListenersId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteListenersId404Code = {
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
} as const

export type DeleteListenersId404 = {
  code?: DeleteListenersId404Code
  message?: string
}

export type PostListenersIdRestart400Code =
  typeof PostListenersIdRestart400Code[keyof typeof PostListenersIdRestart400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostListenersIdRestart400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
} as const

export type PostListenersIdRestart400 = {
  code?: PostListenersIdRestart400Code
  message?: string
}

export type PostListenersIdStart400Code =
  typeof PostListenersIdStart400Code[keyof typeof PostListenersIdStart400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostListenersIdStart400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
} as const

export type PostListenersIdStart400 = {
  code?: PostListenersIdStart400Code
  message?: string
}

export type PostListenersIdStop400Code =
  typeof PostListenersIdStop400Code[keyof typeof PostListenersIdStop400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostListenersIdStop400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
} as const

export type PostListenersIdStop400 = {
  code?: PostListenersIdStop400Code
  message?: string
}

export type PostListeners400Code = typeof PostListeners400Code[keyof typeof PostListeners400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostListeners400Code = {
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostListeners400 = {
  code?: PostListeners400Code
  message?: string
}

export type PostListeners200 =
  | ListenersWssRequiredBind
  | ListenersWsRequiredBind
  | ListenersTcpRequiredBind
  | ListenersSslRequiredBind
  | ListenersQuicRequiredBind

export type PostListenersBody =
  | ListenersQuicRequiredBindWithName
  | ListenersWssRequiredBindWithName
  | ListenersWsRequiredBindWithName
  | ListenersSslRequiredBindWithName
  | ListenersTcpRequiredBindWithName

export type GetListenersType = typeof GetListenersType[keyof typeof GetListenersType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetListenersType = {
  tcp: 'tcp',
  ssl: 'ssl',
  ws: 'ws',
  wss: 'wss',
  quic: 'quic',
} as const

export type GetListenersParams = {
  type?: GetListenersType
}

export type ListenersWssRequiredBindWithNameAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersWssRequiredBindWithNameEnableAuthn =
  typeof ListenersWssRequiredBindWithNameEnableAuthn[keyof typeof ListenersWssRequiredBindWithNameEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssRequiredBindWithNameEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWssRequiredBindWithNameMaxConnections = number | 'infinity'

export type ListenersWssRequiredBindWithNameType =
  typeof ListenersWssRequiredBindWithNameType[keyof typeof ListenersWssRequiredBindWithNameType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssRequiredBindWithNameType = {
  wss: 'wss',
} as const

export interface ListenersWssRequiredBindWithName {
  type: ListenersWssRequiredBindWithNameType
  running?: boolean
  name: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWssRequiredBindWithNameMaxConnections
  mountpoint?: string
  enable_authn?: ListenersWssRequiredBindWithNameEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersWssRequiredBindWithNameAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  ssl_options?: BrokerListenerWssOpts
  websocket?: BrokerWsOpts
}

export type ListenersWssRequiredBindAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersWssRequiredBindEnableAuthn =
  typeof ListenersWssRequiredBindEnableAuthn[keyof typeof ListenersWssRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWssRequiredBindMaxConnections = number | 'infinity'

export type ListenersWssRequiredBindType =
  typeof ListenersWssRequiredBindType[keyof typeof ListenersWssRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssRequiredBindType = {
  wss: 'wss',
} as const

export interface ListenersWssRequiredBind {
  type: ListenersWssRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWssRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersWssRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersWssRequiredBindAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  ssl_options?: BrokerListenerWssOpts
  websocket?: BrokerWsOpts
}

export type ListenersWssNotRequiredBindAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersWssNotRequiredBindEnableAuthn =
  typeof ListenersWssNotRequiredBindEnableAuthn[keyof typeof ListenersWssNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWssNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersWssNotRequiredBindType =
  typeof ListenersWssNotRequiredBindType[keyof typeof ListenersWssNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssNotRequiredBindType = {
  wss: 'wss',
} as const

export interface ListenersWssNotRequiredBind {
  type: ListenersWssNotRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  bind?: string
  enable?: boolean
  acceptors?: number
  max_connections?: ListenersWssNotRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersWssNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersWssNotRequiredBindAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  ssl_options?: BrokerListenerWssOpts
  websocket?: BrokerWsOpts
}

export type ListenersWsRequiredBindWithNameAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersWsRequiredBindWithNameEnableAuthn =
  typeof ListenersWsRequiredBindWithNameEnableAuthn[keyof typeof ListenersWsRequiredBindWithNameEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsRequiredBindWithNameEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWsRequiredBindWithNameMaxConnections = number | 'infinity'

export type ListenersWsRequiredBindWithNameType =
  typeof ListenersWsRequiredBindWithNameType[keyof typeof ListenersWsRequiredBindWithNameType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsRequiredBindWithNameType = {
  ws: 'ws',
} as const

export interface ListenersWsRequiredBindWithName {
  type: ListenersWsRequiredBindWithNameType
  running?: boolean
  name: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWsRequiredBindWithNameMaxConnections
  mountpoint?: string
  enable_authn?: ListenersWsRequiredBindWithNameEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersWsRequiredBindWithNameAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  websocket?: BrokerWsOpts
}

export type ListenersWsRequiredBindAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersWsRequiredBindEnableAuthn =
  typeof ListenersWsRequiredBindEnableAuthn[keyof typeof ListenersWsRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWsRequiredBindMaxConnections = number | 'infinity'

export type ListenersWsRequiredBindType =
  typeof ListenersWsRequiredBindType[keyof typeof ListenersWsRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsRequiredBindType = {
  ws: 'ws',
} as const

export interface ListenersWsRequiredBind {
  type: ListenersWsRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWsRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersWsRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersWsRequiredBindAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  websocket?: BrokerWsOpts
}

export type ListenersWsNotRequiredBindAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersWsNotRequiredBindEnableAuthn =
  typeof ListenersWsNotRequiredBindEnableAuthn[keyof typeof ListenersWsNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWsNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersWsNotRequiredBindType =
  typeof ListenersWsNotRequiredBindType[keyof typeof ListenersWsNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsNotRequiredBindType = {
  ws: 'ws',
} as const

export type ListenersTcpRequiredBindWithNameAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersTcpRequiredBindWithNameEnableAuthn =
  typeof ListenersTcpRequiredBindWithNameEnableAuthn[keyof typeof ListenersTcpRequiredBindWithNameEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpRequiredBindWithNameEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersTcpRequiredBindWithNameMaxConnections = number | 'infinity'

export type ListenersTcpRequiredBindWithNameType =
  typeof ListenersTcpRequiredBindWithNameType[keyof typeof ListenersTcpRequiredBindWithNameType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpRequiredBindWithNameType = {
  tcp: 'tcp',
} as const

export interface ListenersTcpRequiredBindWithName {
  type: ListenersTcpRequiredBindWithNameType
  running?: boolean
  name: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersTcpRequiredBindWithNameMaxConnections
  mountpoint?: string
  enable_authn?: ListenersTcpRequiredBindWithNameEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersTcpRequiredBindWithNameAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
}

export type ListenersTcpRequiredBindAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersTcpRequiredBindEnableAuthn =
  typeof ListenersTcpRequiredBindEnableAuthn[keyof typeof ListenersTcpRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersTcpRequiredBindMaxConnections = number | 'infinity'

export type ListenersTcpRequiredBindType =
  typeof ListenersTcpRequiredBindType[keyof typeof ListenersTcpRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpRequiredBindType = {
  tcp: 'tcp',
} as const

export interface ListenersTcpRequiredBind {
  type: ListenersTcpRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersTcpRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersTcpRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersTcpRequiredBindAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
}

export type ListenersTcpNotRequiredBindAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersTcpNotRequiredBindEnableAuthn =
  typeof ListenersTcpNotRequiredBindEnableAuthn[keyof typeof ListenersTcpNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersTcpNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersTcpNotRequiredBindType =
  typeof ListenersTcpNotRequiredBindType[keyof typeof ListenersTcpNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpNotRequiredBindType = {
  tcp: 'tcp',
} as const

export interface ListenersTcpNotRequiredBind {
  type: ListenersTcpNotRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  bind?: string
  enable?: boolean
  acceptors?: number
  max_connections?: ListenersTcpNotRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersTcpNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersTcpNotRequiredBindAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
}

export type ListenersStatusMaxConnections = number | 'infinity'

export type ListenersStatusRunning = boolean | 'inconsistent'

export interface ListenersStatus {
  running: ListenersStatusRunning
  max_connections?: ListenersStatusMaxConnections
  current_connections?: number
}

export type ListenersSslRequiredBindWithNameAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersSslRequiredBindWithNameEnableAuthn =
  typeof ListenersSslRequiredBindWithNameEnableAuthn[keyof typeof ListenersSslRequiredBindWithNameEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslRequiredBindWithNameEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersSslRequiredBindWithNameMaxConnections = number | 'infinity'

export type ListenersSslRequiredBindWithNameType =
  typeof ListenersSslRequiredBindWithNameType[keyof typeof ListenersSslRequiredBindWithNameType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslRequiredBindWithNameType = {
  ssl: 'ssl',
} as const

export interface ListenersSslRequiredBindWithName {
  type: ListenersSslRequiredBindWithNameType
  running?: boolean
  name: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersSslRequiredBindWithNameMaxConnections
  mountpoint?: string
  enable_authn?: ListenersSslRequiredBindWithNameEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersSslRequiredBindWithNameAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  ssl_options?: BrokerListenerSslOpts
}

export type ListenersSslRequiredBindAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersSslRequiredBindEnableAuthn =
  typeof ListenersSslRequiredBindEnableAuthn[keyof typeof ListenersSslRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersSslRequiredBindMaxConnections = number | 'infinity'

export type ListenersSslRequiredBindType =
  typeof ListenersSslRequiredBindType[keyof typeof ListenersSslRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslRequiredBindType = {
  ssl: 'ssl',
} as const

export interface ListenersSslRequiredBind {
  type: ListenersSslRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersSslRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersSslRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersSslRequiredBindAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  ssl_options?: BrokerListenerSslOpts
}

export type ListenersSslNotRequiredBindAuthenticationItem =
  | AuthnGcpDevice
  | AuthnLdapBind
  | AuthnLdap
  | AuthnScram
  | AuthnJwtJwks
  | AuthnJwtPublicKey
  | AuthnJwtHmac
  | AuthnHttpPost
  | AuthnHttpGet
  | AuthnRedisSentinel
  | AuthnRedisCluster
  | AuthnRedisSingle
  | AuthnMongoSharded
  | AuthnMongoRs
  | AuthnMongoSingle
  | AuthnPostgresql
  | AuthnMysql
  | AuthnBuiltinDb

export type ListenersSslNotRequiredBindEnableAuthn =
  typeof ListenersSslNotRequiredBindEnableAuthn[keyof typeof ListenersSslNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersSslNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersSslNotRequiredBindType =
  typeof ListenersSslNotRequiredBindType[keyof typeof ListenersSslNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslNotRequiredBindType = {
  ssl: 'ssl',
} as const

export interface ListenersSslNotRequiredBind {
  type: ListenersSslNotRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  bind?: string
  enable?: boolean
  acceptors?: number
  max_connections?: ListenersSslNotRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersSslNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersSslNotRequiredBindAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  ssl_options?: BrokerListenerSslOpts
}

export type ListenersQuicRequiredBindWithNameEnableAuthn =
  typeof ListenersQuicRequiredBindWithNameEnableAuthn[keyof typeof ListenersQuicRequiredBindWithNameEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicRequiredBindWithNameEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersQuicRequiredBindWithNameMaxConnections = number | 'infinity'

export type ListenersQuicRequiredBindWithNameType =
  typeof ListenersQuicRequiredBindWithNameType[keyof typeof ListenersQuicRequiredBindWithNameType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicRequiredBindWithNameType = {
  quic: 'quic',
} as const

export interface ListenersQuicRequiredBindWithName {
  type: ListenersQuicRequiredBindWithNameType
  running?: boolean
  name: string
  current_connections?: number
  ciphers?: string[]
  ssl_options?: BrokerListenerQuicSslOpts
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersQuicRequiredBindWithNameMaxConnections
  mountpoint?: string
  enable_authn?: ListenersQuicRequiredBindWithNameEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
}

export type ListenersQuicRequiredBindEnableAuthn =
  typeof ListenersQuicRequiredBindEnableAuthn[keyof typeof ListenersQuicRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersQuicRequiredBindMaxConnections = number | 'infinity'

export type ListenersQuicRequiredBindType =
  typeof ListenersQuicRequiredBindType[keyof typeof ListenersQuicRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicRequiredBindType = {
  quic: 'quic',
} as const

export interface ListenersQuicRequiredBind {
  type: ListenersQuicRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  ciphers?: string[]
  ssl_options?: BrokerListenerQuicSslOpts
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersQuicRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersQuicRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
}

export type ListenersQuicNotRequiredBindEnableAuthn =
  typeof ListenersQuicNotRequiredBindEnableAuthn[keyof typeof ListenersQuicNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersQuicNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersQuicNotRequiredBindType =
  typeof ListenersQuicNotRequiredBindType[keyof typeof ListenersQuicNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicNotRequiredBindType = {
  quic: 'quic',
} as const

export interface ListenersQuicNotRequiredBind {
  type: ListenersQuicNotRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  bind?: string
  ciphers?: string[]
  ssl_options?: BrokerListenerQuicSslOpts
  enable?: boolean
  acceptors?: number
  max_connections?: ListenersQuicNotRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersQuicNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
}

export interface ListenersNodeStatus {
  node?: string
  status?: ListenersStatus
}

export type ListenersListenerTypeStatusType =
  typeof ListenersListenerTypeStatusType[keyof typeof ListenersListenerTypeStatusType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersListenerTypeStatusType = {
  tcp: 'tcp',
  ssl: 'ssl',
  ws: 'ws',
  wss: 'wss',
  quic: 'quic',
} as const

export interface ListenersListenerTypeStatus {
  type: ListenersListenerTypeStatusType
  enable: boolean
  ids: string[]
  status?: ListenersStatus
  node_status?: ListenersNodeStatus[]
}

export type ListenersListenerIdStatusType =
  typeof ListenersListenerIdStatusType[keyof typeof ListenersListenerIdStatusType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersListenerIdStatusType = {
  tcp: 'tcp',
  ssl: 'ssl',
  ws: 'ws',
  wss: 'wss',
  quic: 'quic',
} as const

export interface ListenersListenerIdStatus {
  id: string
  type: ListenersListenerIdStatusType
  name: string
  enable: boolean
  number?: number
  bind: string
  acceptors?: number
  status?: ListenersStatus
  node_status?: ListenersNodeStatus[]
}

export interface EmqxMongodbTopology {
  max_overflow?: number
  overflow_ttl?: string
  overflow_check_period?: string
  local_threshold_ms?: string
  connect_timeout_ms?: string
  socket_timeout_ms?: string
  server_selection_timeout_ms?: string
  wait_queue_timeout_ms?: string
  heartbeat_frequency_ms?: string
  min_heartbeat_frequency_ms?: string
}

export type ConnectorHttpRequestHeaders = { [key: string]: any }

export interface ConnectorHttpRequest {
  method?: string
  path?: string
  body?: string
  headers?: ConnectorHttpRequestHeaders
  max_retries?: number
  request_timeout?: string
}

export type BrokerWsOptsMaxFrameSize = number | 'infinity'

export type BrokerWsOptsMqttPiggyback =
  typeof BrokerWsOptsMqttPiggyback[keyof typeof BrokerWsOptsMqttPiggyback]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerWsOptsMqttPiggyback = {
  single: 'single',
  multiple: 'multiple',
} as const

export interface BrokerWsOpts {
  mqtt_path?: string
  mqtt_piggyback?: BrokerWsOptsMqttPiggyback
  compress?: boolean
  idle_timeout?: string
  max_frame_size?: BrokerWsOptsMaxFrameSize
  fail_if_no_subprotocol?: boolean
  supported_subprotocols?: string
  check_origin_enable?: boolean
  allow_origin_absence?: boolean
  check_origins?: string
  proxy_address_header?: string
  proxy_port_header?: string
  deflate_opts?: BrokerDeflateOpts
}

export interface BrokerTcpOpts {
  active_n?: number
  backlog?: number
  send_timeout?: string
  send_timeout_close?: boolean
  recbuf?: string
  sndbuf?: string
  buffer?: string
  high_watermark?: string
  nodelay?: boolean
  reuseaddr?: boolean
  keepalive?: string
}

export interface ListenersWsNotRequiredBind {
  type: ListenersWsNotRequiredBindType
  running?: boolean
  id: string
  current_connections?: number
  bind?: string
  enable?: boolean
  acceptors?: number
  max_connections?: ListenersWsNotRequiredBindMaxConnections
  mountpoint?: string
  enable_authn?: ListenersWsNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  authentication?: ListenersWsNotRequiredBindAuthenticationItem[]
  tcp_options?: BrokerTcpOpts
  websocket?: BrokerWsOpts
}

export type BrokerSslClientOptsServerNameIndication = string | 'disable'

export type BrokerSslClientOptsLogLevel =
  typeof BrokerSslClientOptsLogLevel[keyof typeof BrokerSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerSslClientOptsLogLevel = {
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

export type BrokerSslClientOptsVerify =
  typeof BrokerSslClientOptsVerify[keyof typeof BrokerSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface BrokerSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: BrokerSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: BrokerSslClientOptsLogLevel
  hibernate_after?: string
  enable?: boolean
  server_name_indication?: BrokerSslClientOptsServerNameIndication
}

export interface BrokerOcsp {
  enable_ocsp_stapling?: boolean
  responder_url?: string
  issuer_pem?: string
  refresh_interval?: string
  refresh_http_timeout?: string
}

export type BrokerListenerWssOptsLogLevel =
  typeof BrokerListenerWssOptsLogLevel[keyof typeof BrokerListenerWssOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerListenerWssOptsLogLevel = {
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

export type BrokerListenerWssOptsVerify =
  typeof BrokerListenerWssOptsVerify[keyof typeof BrokerListenerWssOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerListenerWssOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface BrokerListenerWssOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: BrokerListenerWssOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: BrokerListenerWssOptsLogLevel
  hibernate_after?: string
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
}

export type BrokerListenerSslOptsLogLevel =
  typeof BrokerListenerSslOptsLogLevel[keyof typeof BrokerListenerSslOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerListenerSslOptsLogLevel = {
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

export type BrokerListenerSslOptsVerify =
  typeof BrokerListenerSslOptsVerify[keyof typeof BrokerListenerSslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerListenerSslOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface BrokerListenerSslOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: BrokerListenerSslOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: BrokerListenerSslOptsLogLevel
  hibernate_after?: string
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
  gc_after_handshake?: boolean
  ocsp?: BrokerOcsp
  enable_crl_check?: boolean
}

export type BrokerListenerQuicSslOptsVerify =
  typeof BrokerListenerQuicSslOptsVerify[keyof typeof BrokerListenerQuicSslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerListenerQuicSslOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface BrokerListenerQuicSslOpts {
  cacertfile?: string
  certfile?: string
  keyfile?: string
  verify?: BrokerListenerQuicSslOptsVerify
  password?: string
}

export type BrokerDeflateOptsClientContextTakeover =
  typeof BrokerDeflateOptsClientContextTakeover[keyof typeof BrokerDeflateOptsClientContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerDeflateOptsClientContextTakeover = {
  takeover: 'takeover',
  no_takeover: 'no_takeover',
} as const

export type BrokerDeflateOptsServerContextTakeover =
  typeof BrokerDeflateOptsServerContextTakeover[keyof typeof BrokerDeflateOptsServerContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerDeflateOptsServerContextTakeover = {
  takeover: 'takeover',
  no_takeover: 'no_takeover',
} as const

export type BrokerDeflateOptsStrategy =
  typeof BrokerDeflateOptsStrategy[keyof typeof BrokerDeflateOptsStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerDeflateOptsStrategy = {
  default: 'default',
  filtered: 'filtered',
  huffman_only: 'huffman_only',
  rle: 'rle',
} as const

export type BrokerDeflateOptsLevel =
  typeof BrokerDeflateOptsLevel[keyof typeof BrokerDeflateOptsLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerDeflateOptsLevel = {
  none: 'none',
  default: 'default',
  best_compression: 'best_compression',
  best_speed: 'best_speed',
} as const

export interface BrokerDeflateOpts {
  level?: BrokerDeflateOptsLevel
  mem_level?: number
  strategy?: BrokerDeflateOptsStrategy
  server_context_takeover?: BrokerDeflateOptsServerContextTakeover
  client_context_takeover?: BrokerDeflateOptsClientContextTakeover
  server_max_window_bits?: number
  client_max_window_bits?: number
}

export type AuthnScramAlgorithm = typeof AuthnScramAlgorithm[keyof typeof AuthnScramAlgorithm]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnScramAlgorithm = {
  sha256: 'sha256',
  sha512: 'sha512',
} as const

export type AuthnScramBackend = typeof AuthnScramBackend[keyof typeof AuthnScramBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnScramBackend = {
  built_in_database: 'built_in_database',
} as const

export type AuthnScramMechanism = typeof AuthnScramMechanism[keyof typeof AuthnScramMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnScramMechanism = {
  scram: 'scram',
} as const

export interface AuthnScram {
  mechanism: AuthnScramMechanism
  backend: AuthnScramBackend
  algorithm?: AuthnScramAlgorithm
  iteration_count?: number
  enable?: boolean
}

export type AuthnRedisSingleRedisType =
  typeof AuthnRedisSingleRedisType[keyof typeof AuthnRedisSingleRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisSingleRedisType = {
  single: 'single',
} as const

export type AuthnRedisSinglePasswordHashAlgorithm =
  | AuthnHashSimple
  | AuthnHashPbkdf2
  | AuthnHashBcrypt

export type AuthnRedisSingleBackend =
  typeof AuthnRedisSingleBackend[keyof typeof AuthnRedisSingleBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisSingleBackend = {
  redis: 'redis',
} as const

export type AuthnRedisSingleMechanism =
  typeof AuthnRedisSingleMechanism[keyof typeof AuthnRedisSingleMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisSingleMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnRedisSingle {
  mechanism: AuthnRedisSingleMechanism
  backend: AuthnRedisSingleBackend
  cmd: string
  password_hash_algorithm?: AuthnRedisSinglePasswordHashAlgorithm
  enable?: boolean
  server: string
  redis_type?: AuthnRedisSingleRedisType
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type AuthnRedisSentinelRedisType =
  typeof AuthnRedisSentinelRedisType[keyof typeof AuthnRedisSentinelRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisSentinelRedisType = {
  sentinel: 'sentinel',
} as const

export type AuthnRedisSentinelPasswordHashAlgorithm =
  | AuthnHashSimple
  | AuthnHashPbkdf2
  | AuthnHashBcrypt

export type AuthnRedisSentinelBackend =
  typeof AuthnRedisSentinelBackend[keyof typeof AuthnRedisSentinelBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisSentinelBackend = {
  redis: 'redis',
} as const

export type AuthnRedisSentinelMechanism =
  typeof AuthnRedisSentinelMechanism[keyof typeof AuthnRedisSentinelMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisSentinelMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnRedisSentinel {
  mechanism: AuthnRedisSentinelMechanism
  backend: AuthnRedisSentinelBackend
  cmd: string
  password_hash_algorithm?: AuthnRedisSentinelPasswordHashAlgorithm
  enable?: boolean
  servers: string
  redis_type?: AuthnRedisSentinelRedisType
  sentinel: string
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type AuthnRedisClusterRedisType =
  typeof AuthnRedisClusterRedisType[keyof typeof AuthnRedisClusterRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisClusterRedisType = {
  cluster: 'cluster',
} as const

export type AuthnRedisClusterPasswordHashAlgorithm =
  | AuthnHashSimple
  | AuthnHashPbkdf2
  | AuthnHashBcrypt

export type AuthnRedisClusterBackend =
  typeof AuthnRedisClusterBackend[keyof typeof AuthnRedisClusterBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisClusterBackend = {
  redis: 'redis',
} as const

export type AuthnRedisClusterMechanism =
  typeof AuthnRedisClusterMechanism[keyof typeof AuthnRedisClusterMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnRedisClusterMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnRedisCluster {
  mechanism: AuthnRedisClusterMechanism
  backend: AuthnRedisClusterBackend
  cmd: string
  password_hash_algorithm?: AuthnRedisClusterPasswordHashAlgorithm
  enable?: boolean
  servers: string
  redis_type?: AuthnRedisClusterRedisType
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type AuthnPostgresqlPasswordHashAlgorithm =
  | AuthnHashSimple
  | AuthnHashPbkdf2
  | AuthnHashBcrypt

export type AuthnPostgresqlBackend =
  typeof AuthnPostgresqlBackend[keyof typeof AuthnPostgresqlBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnPostgresqlBackend = {
  postgresql: 'postgresql',
} as const

export type AuthnPostgresqlMechanism =
  typeof AuthnPostgresqlMechanism[keyof typeof AuthnPostgresqlMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnPostgresqlMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnPostgresql {
  mechanism: AuthnPostgresqlMechanism
  backend: AuthnPostgresqlBackend
  password_hash_algorithm?: AuthnPostgresqlPasswordHashAlgorithm
  query: string
  enable?: boolean
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type AuthnMysqlPasswordHashAlgorithm = AuthnHashSimple | AuthnHashPbkdf2 | AuthnHashBcrypt

export type AuthnMysqlBackend = typeof AuthnMysqlBackend[keyof typeof AuthnMysqlBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMysqlBackend = {
  mysql: 'mysql',
} as const

export type AuthnMysqlMechanism = typeof AuthnMysqlMechanism[keyof typeof AuthnMysqlMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMysqlMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnMysql {
  mechanism: AuthnMysqlMechanism
  backend: AuthnMysqlBackend
  password_hash_algorithm?: AuthnMysqlPasswordHashAlgorithm
  query: string
  query_timeout?: string
  enable?: boolean
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type AuthnMongoSingleUseLegacyProtocol =
  typeof AuthnMongoSingleUseLegacyProtocol[keyof typeof AuthnMongoSingleUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoSingleUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type AuthnMongoSingleWMode = typeof AuthnMongoSingleWMode[keyof typeof AuthnMongoSingleWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoSingleWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type AuthnMongoSingleMongoType =
  typeof AuthnMongoSingleMongoType[keyof typeof AuthnMongoSingleMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoSingleMongoType = {
  single: 'single',
} as const

export type AuthnMongoSinglePasswordHashAlgorithm =
  | AuthnHashSimple
  | AuthnHashPbkdf2
  | AuthnHashBcrypt

export type AuthnMongoSingleFilter = { [key: string]: any }

export type AuthnMongoSingleBackend =
  typeof AuthnMongoSingleBackend[keyof typeof AuthnMongoSingleBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoSingleBackend = {
  mongodb: 'mongodb',
} as const

export type AuthnMongoSingleMechanism =
  typeof AuthnMongoSingleMechanism[keyof typeof AuthnMongoSingleMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoSingleMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnMongoSingle {
  mechanism: AuthnMongoSingleMechanism
  backend: AuthnMongoSingleBackend
  collection: string
  filter?: AuthnMongoSingleFilter
  password_hash_field?: string
  salt_field?: string
  is_superuser_field?: string
  password_hash_algorithm?: AuthnMongoSinglePasswordHashAlgorithm
  enable?: boolean
  mongo_type?: AuthnMongoSingleMongoType
  server: string
  w_mode?: AuthnMongoSingleWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: AuthnMongoSingleUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type AuthnMongoShardedUseLegacyProtocol =
  typeof AuthnMongoShardedUseLegacyProtocol[keyof typeof AuthnMongoShardedUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoShardedUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type AuthnMongoShardedWMode =
  typeof AuthnMongoShardedWMode[keyof typeof AuthnMongoShardedWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoShardedWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type AuthnMongoShardedMongoType =
  typeof AuthnMongoShardedMongoType[keyof typeof AuthnMongoShardedMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoShardedMongoType = {
  sharded: 'sharded',
} as const

export type AuthnMongoShardedPasswordHashAlgorithm =
  | AuthnHashSimple
  | AuthnHashPbkdf2
  | AuthnHashBcrypt

export type AuthnMongoShardedFilter = { [key: string]: any }

export type AuthnMongoShardedBackend =
  typeof AuthnMongoShardedBackend[keyof typeof AuthnMongoShardedBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoShardedBackend = {
  mongodb: 'mongodb',
} as const

export type AuthnMongoShardedMechanism =
  typeof AuthnMongoShardedMechanism[keyof typeof AuthnMongoShardedMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoShardedMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnMongoSharded {
  mechanism: AuthnMongoShardedMechanism
  backend: AuthnMongoShardedBackend
  collection: string
  filter?: AuthnMongoShardedFilter
  password_hash_field?: string
  salt_field?: string
  is_superuser_field?: string
  password_hash_algorithm?: AuthnMongoShardedPasswordHashAlgorithm
  enable?: boolean
  mongo_type?: AuthnMongoShardedMongoType
  servers: string
  w_mode?: AuthnMongoShardedWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: AuthnMongoShardedUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type AuthnMongoRsUseLegacyProtocol =
  typeof AuthnMongoRsUseLegacyProtocol[keyof typeof AuthnMongoRsUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoRsUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type AuthnMongoRsRMode = typeof AuthnMongoRsRMode[keyof typeof AuthnMongoRsRMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoRsRMode = {
  master: 'master',
  slave_ok: 'slave_ok',
} as const

export type AuthnMongoRsWMode = typeof AuthnMongoRsWMode[keyof typeof AuthnMongoRsWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoRsWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type AuthnMongoRsMongoType = typeof AuthnMongoRsMongoType[keyof typeof AuthnMongoRsMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoRsMongoType = {
  rs: 'rs',
} as const

export type AuthnMongoRsPasswordHashAlgorithm = AuthnHashSimple | AuthnHashPbkdf2 | AuthnHashBcrypt

export type AuthnMongoRsFilter = { [key: string]: any }

export type AuthnMongoRsBackend = typeof AuthnMongoRsBackend[keyof typeof AuthnMongoRsBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoRsBackend = {
  mongodb: 'mongodb',
} as const

export type AuthnMongoRsMechanism = typeof AuthnMongoRsMechanism[keyof typeof AuthnMongoRsMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnMongoRsMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnMongoRs {
  mechanism: AuthnMongoRsMechanism
  backend: AuthnMongoRsBackend
  collection: string
  filter?: AuthnMongoRsFilter
  password_hash_field?: string
  salt_field?: string
  is_superuser_field?: string
  password_hash_algorithm?: AuthnMongoRsPasswordHashAlgorithm
  enable?: boolean
  mongo_type?: AuthnMongoRsMongoType
  servers: string
  w_mode?: AuthnMongoRsWMode
  r_mode?: AuthnMongoRsRMode
  replica_set_name: string
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: AuthnMongoRsUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type AuthnLdapBindBackend = typeof AuthnLdapBindBackend[keyof typeof AuthnLdapBindBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnLdapBindBackend = {
  ldap_bind: 'ldap_bind',
} as const

export type AuthnLdapBindMechanism =
  typeof AuthnLdapBindMechanism[keyof typeof AuthnLdapBindMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnLdapBindMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnLdapBind {
  mechanism: AuthnLdapBindMechanism
  backend: AuthnLdapBindBackend
  query_timeout?: string
  enable?: boolean
  server: string
  pool_size?: number
  username: string
  password?: string
  base_dn: string
  filter?: string
  request_timeout?: string
  ssl?: BrokerSslClientOpts
  bind_password?: string
}

export type AuthnLdapBackend = typeof AuthnLdapBackend[keyof typeof AuthnLdapBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnLdapBackend = {
  ldap: 'ldap',
} as const

export type AuthnLdapMechanism = typeof AuthnLdapMechanism[keyof typeof AuthnLdapMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnLdapMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnLdap {
  mechanism: AuthnLdapMechanism
  backend: AuthnLdapBackend
  password_attribute?: string
  is_superuser_attribute?: string
  query_timeout?: string
  enable?: boolean
  server: string
  pool_size?: number
  username: string
  password?: string
  base_dn: string
  filter?: string
  request_timeout?: string
  ssl?: BrokerSslClientOpts
}

export type AuthnJwtPublicKeyFrom = typeof AuthnJwtPublicKeyFrom[keyof typeof AuthnJwtPublicKeyFrom]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtPublicKeyFrom = {
  username: 'username',
  password: 'password',
} as const

export type AuthnJwtPublicKeyMechanism =
  typeof AuthnJwtPublicKeyMechanism[keyof typeof AuthnJwtPublicKeyMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtPublicKeyMechanism = {
  jwt: 'jwt',
} as const

export type AuthnJwtPublicKeyAlgorithm =
  typeof AuthnJwtPublicKeyAlgorithm[keyof typeof AuthnJwtPublicKeyAlgorithm]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtPublicKeyAlgorithm = {
  'public-key': 'public-key',
} as const

export interface AuthnJwtPublicKey {
  algorithm: AuthnJwtPublicKeyAlgorithm
  public_key?: string
  mechanism: AuthnJwtPublicKeyMechanism
  acl_claim_name?: string
  verify_claims?: string[]
  from?: AuthnJwtPublicKeyFrom
  enable?: boolean
}

export type AuthnJwtJwksFrom = typeof AuthnJwtJwksFrom[keyof typeof AuthnJwtJwksFrom]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtJwksFrom = {
  username: 'username',
  password: 'password',
} as const

export type AuthnJwtJwksMechanism = typeof AuthnJwtJwksMechanism[keyof typeof AuthnJwtJwksMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtJwksMechanism = {
  jwt: 'jwt',
} as const

export type AuthnJwtJwksUseJwks = typeof AuthnJwtJwksUseJwks[keyof typeof AuthnJwtJwksUseJwks]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtJwksUseJwks = {
  true: 'true',
} as const

export interface AuthnJwtJwks {
  use_jwks: AuthnJwtJwksUseJwks
  endpoint: string
  pool_size?: number
  refresh_interval?: number
  ssl?: BrokerSslClientOpts
  mechanism: AuthnJwtJwksMechanism
  acl_claim_name?: string
  verify_claims?: string[]
  from?: AuthnJwtJwksFrom
  enable?: boolean
}

export type AuthnJwtHmacFrom = typeof AuthnJwtHmacFrom[keyof typeof AuthnJwtHmacFrom]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtHmacFrom = {
  username: 'username',
  password: 'password',
} as const

export type AuthnJwtHmacMechanism = typeof AuthnJwtHmacMechanism[keyof typeof AuthnJwtHmacMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtHmacMechanism = {
  jwt: 'jwt',
} as const

export type AuthnJwtHmacAlgorithm = typeof AuthnJwtHmacAlgorithm[keyof typeof AuthnJwtHmacAlgorithm]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnJwtHmacAlgorithm = {
  'hmac-based': 'hmac-based',
} as const

export interface AuthnJwtHmac {
  algorithm: AuthnJwtHmacAlgorithm
  secret: string
  secret_base64_encoded?: boolean
  mechanism: AuthnJwtHmacMechanism
  acl_claim_name?: string
  verify_claims?: string[]
  from?: AuthnJwtHmacFrom
  enable?: boolean
}

export type AuthnHttpPostBody = { [key: string]: any }

export type AuthnHttpPostBackend = typeof AuthnHttpPostBackend[keyof typeof AuthnHttpPostBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHttpPostBackend = {
  http: 'http',
} as const

export type AuthnHttpPostMechanism =
  typeof AuthnHttpPostMechanism[keyof typeof AuthnHttpPostMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHttpPostMechanism = {
  password_based: 'password_based',
} as const

export type AuthnHttpPostHeaders = { [key: string]: any }

export type AuthnHttpPostMethod = typeof AuthnHttpPostMethod[keyof typeof AuthnHttpPostMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHttpPostMethod = {
  post: 'post',
} as const

export interface AuthnHttpPost {
  method: AuthnHttpPostMethod
  headers?: AuthnHttpPostHeaders
  mechanism: AuthnHttpPostMechanism
  backend: AuthnHttpPostBackend
  url: string
  body?: AuthnHttpPostBody
  request_timeout?: string
  enable?: boolean
  connect_timeout?: string
  enable_pipelining?: number
  /** @deprecated */
  max_retries?: number
  pool_size?: number
  request?: ConnectorHttpRequest
  /** @deprecated */
  retry_interval?: string
  ssl?: BrokerSslClientOpts
}

export type AuthnHttpGetBody = { [key: string]: any }

export type AuthnHttpGetBackend = typeof AuthnHttpGetBackend[keyof typeof AuthnHttpGetBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHttpGetBackend = {
  http: 'http',
} as const

export type AuthnHttpGetMechanism = typeof AuthnHttpGetMechanism[keyof typeof AuthnHttpGetMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHttpGetMechanism = {
  password_based: 'password_based',
} as const

export type AuthnHttpGetHeaders = { [key: string]: any }

export type AuthnHttpGetMethod = typeof AuthnHttpGetMethod[keyof typeof AuthnHttpGetMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHttpGetMethod = {
  get: 'get',
} as const

export interface AuthnHttpGet {
  method: AuthnHttpGetMethod
  headers?: AuthnHttpGetHeaders
  mechanism: AuthnHttpGetMechanism
  backend: AuthnHttpGetBackend
  url: string
  body?: AuthnHttpGetBody
  request_timeout?: string
  enable?: boolean
  connect_timeout?: string
  enable_pipelining?: number
  /** @deprecated */
  max_retries?: number
  pool_size?: number
  request?: ConnectorHttpRequest
  /** @deprecated */
  retry_interval?: string
  ssl?: BrokerSslClientOpts
}

export type AuthnGcpDeviceMechanism =
  typeof AuthnGcpDeviceMechanism[keyof typeof AuthnGcpDeviceMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnGcpDeviceMechanism = {
  gcp_device: 'gcp_device',
} as const

export interface AuthnGcpDevice {
  mechanism: AuthnGcpDeviceMechanism
  enable?: boolean
}

export type AuthnBuiltinDbPasswordHashAlgorithm =
  | AuthnHashSimple
  | AuthnHashPbkdf2
  | AuthnHashBcryptRw

export type AuthnBuiltinDbUserIdType =
  typeof AuthnBuiltinDbUserIdType[keyof typeof AuthnBuiltinDbUserIdType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnBuiltinDbUserIdType = {
  clientid: 'clientid',
  username: 'username',
} as const

export type AuthnBuiltinDbBackend = typeof AuthnBuiltinDbBackend[keyof typeof AuthnBuiltinDbBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnBuiltinDbBackend = {
  built_in_database: 'built_in_database',
} as const

export type AuthnBuiltinDbMechanism =
  typeof AuthnBuiltinDbMechanism[keyof typeof AuthnBuiltinDbMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnBuiltinDbMechanism = {
  password_based: 'password_based',
} as const

export interface AuthnBuiltinDb {
  mechanism: AuthnBuiltinDbMechanism
  backend: AuthnBuiltinDbBackend
  user_id_type: AuthnBuiltinDbUserIdType
  password_hash_algorithm?: AuthnBuiltinDbPasswordHashAlgorithm
  enable?: boolean
}

export type AuthnHashSimpleSaltPosition =
  typeof AuthnHashSimpleSaltPosition[keyof typeof AuthnHashSimpleSaltPosition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHashSimpleSaltPosition = {
  disable: 'disable',
  prefix: 'prefix',
  suffix: 'suffix',
} as const

export type AuthnHashSimpleName = typeof AuthnHashSimpleName[keyof typeof AuthnHashSimpleName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHashSimpleName = {
  plain: 'plain',
  md5: 'md5',
  sha: 'sha',
  sha256: 'sha256',
  sha512: 'sha512',
} as const

export interface AuthnHashSimple {
  name: AuthnHashSimpleName
  salt_position?: AuthnHashSimpleSaltPosition
}

export type AuthnHashPbkdf2MacFun = typeof AuthnHashPbkdf2MacFun[keyof typeof AuthnHashPbkdf2MacFun]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHashPbkdf2MacFun = {
  md4: 'md4',
  md5: 'md5',
  ripemd160: 'ripemd160',
  sha: 'sha',
  sha224: 'sha224',
  sha256: 'sha256',
  sha384: 'sha384',
  sha512: 'sha512',
} as const

export type AuthnHashPbkdf2Name = typeof AuthnHashPbkdf2Name[keyof typeof AuthnHashPbkdf2Name]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHashPbkdf2Name = {
  pbkdf2: 'pbkdf2',
} as const

export interface AuthnHashPbkdf2 {
  name: AuthnHashPbkdf2Name
  mac_fun: AuthnHashPbkdf2MacFun
  iterations: number
  dk_length?: number
}

export type AuthnHashBcryptRwName = typeof AuthnHashBcryptRwName[keyof typeof AuthnHashBcryptRwName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHashBcryptRwName = {
  bcrypt: 'bcrypt',
} as const

export interface AuthnHashBcryptRw {
  name: AuthnHashBcryptRwName
  salt_rounds?: number
}

export type AuthnHashBcryptName = typeof AuthnHashBcryptName[keyof typeof AuthnHashBcryptName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthnHashBcryptName = {
  bcrypt: 'bcrypt',
} as const

export interface AuthnHashBcrypt {
  name: AuthnHashBcryptName
}
