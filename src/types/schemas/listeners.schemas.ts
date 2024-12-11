export type PostListenersId400Code =
  (typeof PostListenersId400Code)[keyof typeof PostListenersId400Code]

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

export type DeleteListenersId404Code =
  (typeof DeleteListenersId404Code)[keyof typeof DeleteListenersId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteListenersId404Code = {
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
} as const

export type DeleteListenersId404 = {
  code?: DeleteListenersId404Code
  message?: string
}

export type PutListenersId404Code =
  (typeof PutListenersId404Code)[keyof typeof PutListenersId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutListenersId404Code = {
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutListenersId404 = {
  code?: PutListenersId404Code
  message?: string
}

export type PutListenersId400Code =
  (typeof PutListenersId400Code)[keyof typeof PutListenersId400Code]

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

export type GetListenersId404Code =
  (typeof GetListenersId404Code)[keyof typeof GetListenersId404Code]

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

export type PostListenersIdRestart400Code =
  (typeof PostListenersIdRestart400Code)[keyof typeof PostListenersIdRestart400Code]

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
  (typeof PostListenersIdStart400Code)[keyof typeof PostListenersIdStart400Code]

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
  (typeof PostListenersIdStop400Code)[keyof typeof PostListenersIdStop400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostListenersIdStop400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  BAD_LISTENER_ID: 'BAD_LISTENER_ID',
} as const

export type PostListenersIdStop400 = {
  code?: PostListenersIdStop400Code
  message?: string
}

export type PostListeners400Code = (typeof PostListeners400Code)[keyof typeof PostListeners400Code]

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
  | ListenersWithNameQuicRequiredBind
  | ListenersWithNameWssRequiredBind
  | ListenersWithNameWsRequiredBind
  | ListenersWithNameSslRequiredBind
  | ListenersWithNameTcpRequiredBind

export type GetListenersType = (typeof GetListenersType)[keyof typeof GetListenersType]

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

export type ListenersWssRequiredBindEnableAuthn =
  (typeof ListenersWssRequiredBindEnableAuthn)[keyof typeof ListenersWssRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWssRequiredBindMaxConnections = number | 'infinity'

export type ListenersWssRequiredBindType =
  (typeof ListenersWssRequiredBindType)[keyof typeof ListenersWssRequiredBindType]

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
  zone?: string
  enable_authn?: ListenersWssRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  ssl_options?: EmqxListenerWssOpts
  websocket?: EmqxWsOpts
}

export type ListenersWssNotRequiredBindEnableAuthn =
  (typeof ListenersWssNotRequiredBindEnableAuthn)[keyof typeof ListenersWssNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWssNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersWssNotRequiredBindType =
  (typeof ListenersWssNotRequiredBindType)[keyof typeof ListenersWssNotRequiredBindType]

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
  zone?: string
  enable_authn?: ListenersWssNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  ssl_options?: EmqxListenerWssOpts
  websocket?: EmqxWsOpts
}

export type PutListenersIdBody =
  | ListenersWssNotRequiredBind
  | ListenersWsNotRequiredBind
  | ListenersTcpNotRequiredBind
  | ListenersSslNotRequiredBind
  | ListenersQuicNotRequiredBind

export type ListenersWsRequiredBindEnableAuthn =
  (typeof ListenersWsRequiredBindEnableAuthn)[keyof typeof ListenersWsRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWsRequiredBindMaxConnections = number | 'infinity'

export type ListenersWsRequiredBindType =
  (typeof ListenersWsRequiredBindType)[keyof typeof ListenersWsRequiredBindType]

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
  zone?: string
  enable_authn?: ListenersWsRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  websocket?: EmqxWsOpts
}

export type ListenersWsNotRequiredBindEnableAuthn =
  (typeof ListenersWsNotRequiredBindEnableAuthn)[keyof typeof ListenersWsNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWsNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersWsNotRequiredBindType =
  (typeof ListenersWsNotRequiredBindType)[keyof typeof ListenersWsNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsNotRequiredBindType = {
  ws: 'ws',
} as const

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
  zone?: string
  enable_authn?: ListenersWsNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  websocket?: EmqxWsOpts
}

export type ListenersWithNameWssRequiredBindEnableAuthn =
  (typeof ListenersWithNameWssRequiredBindEnableAuthn)[keyof typeof ListenersWithNameWssRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameWssRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWithNameWssRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameWssRequiredBindType =
  (typeof ListenersWithNameWssRequiredBindType)[keyof typeof ListenersWithNameWssRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameWssRequiredBindType = {
  wss: 'wss',
} as const

export interface ListenersWithNameWssRequiredBind {
  type: ListenersWithNameWssRequiredBindType
  running?: boolean
  name: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWithNameWssRequiredBindMaxConnections
  mountpoint?: string
  zone?: string
  enable_authn?: ListenersWithNameWssRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  ssl_options?: EmqxListenerWssOpts
  websocket?: EmqxWsOpts
}

export type ListenersWithNameWsRequiredBindEnableAuthn =
  (typeof ListenersWithNameWsRequiredBindEnableAuthn)[keyof typeof ListenersWithNameWsRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameWsRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWithNameWsRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameWsRequiredBindType =
  (typeof ListenersWithNameWsRequiredBindType)[keyof typeof ListenersWithNameWsRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameWsRequiredBindType = {
  ws: 'ws',
} as const

export interface ListenersWithNameWsRequiredBind {
  type: ListenersWithNameWsRequiredBindType
  running?: boolean
  name: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWithNameWsRequiredBindMaxConnections
  mountpoint?: string
  zone?: string
  enable_authn?: ListenersWithNameWsRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  websocket?: EmqxWsOpts
}

export type ListenersWithNameTcpRequiredBindEnableAuthn =
  (typeof ListenersWithNameTcpRequiredBindEnableAuthn)[keyof typeof ListenersWithNameTcpRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameTcpRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWithNameTcpRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameTcpRequiredBindType =
  (typeof ListenersWithNameTcpRequiredBindType)[keyof typeof ListenersWithNameTcpRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameTcpRequiredBindType = {
  tcp: 'tcp',
} as const

export interface ListenersWithNameTcpRequiredBind {
  type: ListenersWithNameTcpRequiredBindType
  running?: boolean
  name: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWithNameTcpRequiredBindMaxConnections
  mountpoint?: string
  zone?: string
  enable_authn?: ListenersWithNameTcpRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
}

export type ListenersWithNameSslRequiredBindEnableAuthn =
  (typeof ListenersWithNameSslRequiredBindEnableAuthn)[keyof typeof ListenersWithNameSslRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameSslRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWithNameSslRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameSslRequiredBindType =
  (typeof ListenersWithNameSslRequiredBindType)[keyof typeof ListenersWithNameSslRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameSslRequiredBindType = {
  ssl: 'ssl',
} as const

export type ListenersWithNameQuicRequiredBindEnableAuthn =
  (typeof ListenersWithNameQuicRequiredBindEnableAuthn)[keyof typeof ListenersWithNameQuicRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameQuicRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWithNameQuicRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameQuicRequiredBindType =
  (typeof ListenersWithNameQuicRequiredBindType)[keyof typeof ListenersWithNameQuicRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameQuicRequiredBindType = {
  quic: 'quic',
} as const

export interface ListenersWithNameQuicRequiredBind {
  type: ListenersWithNameQuicRequiredBindType
  running?: boolean
  name: string
  current_connections?: number
  ciphers?: string[]
  ssl_options?: EmqxListenerQuicSslOpts
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWithNameQuicRequiredBindMaxConnections
  mountpoint?: string
  zone?: string
  enable_authn?: ListenersWithNameQuicRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
}

export type ListenersTcpRequiredBindEnableAuthn =
  (typeof ListenersTcpRequiredBindEnableAuthn)[keyof typeof ListenersTcpRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersTcpRequiredBindMaxConnections = number | 'infinity'

export type ListenersTcpRequiredBindType =
  (typeof ListenersTcpRequiredBindType)[keyof typeof ListenersTcpRequiredBindType]

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
  zone?: string
  enable_authn?: ListenersTcpRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
}

export type ListenersTcpNotRequiredBindEnableAuthn =
  (typeof ListenersTcpNotRequiredBindEnableAuthn)[keyof typeof ListenersTcpNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersTcpNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersTcpNotRequiredBindType =
  (typeof ListenersTcpNotRequiredBindType)[keyof typeof ListenersTcpNotRequiredBindType]

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
  zone?: string
  enable_authn?: ListenersTcpNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
}

export type ListenersStatusMaxConnections = number | 'infinity'

export type ListenersStatusRunning = boolean | 'inconsistent'

export interface ListenersStatus {
  running: ListenersStatusRunning
  max_connections?: ListenersStatusMaxConnections
  current_connections?: number
}

export type ListenersSslRequiredBindEnableAuthn =
  (typeof ListenersSslRequiredBindEnableAuthn)[keyof typeof ListenersSslRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersSslRequiredBindMaxConnections = number | 'infinity'

export type ListenersSslRequiredBindType =
  (typeof ListenersSslRequiredBindType)[keyof typeof ListenersSslRequiredBindType]

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
  zone?: string
  enable_authn?: ListenersSslRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  ssl_options?: EmqxListenerSslOpts
}

export type ListenersSslNotRequiredBindEnableAuthn =
  (typeof ListenersSslNotRequiredBindEnableAuthn)[keyof typeof ListenersSslNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersSslNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersSslNotRequiredBindType =
  (typeof ListenersSslNotRequiredBindType)[keyof typeof ListenersSslNotRequiredBindType]

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
  zone?: string
  enable_authn?: ListenersSslNotRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  ssl_options?: EmqxListenerSslOpts
}

export type ListenersQuicRequiredBindEnableAuthn =
  (typeof ListenersQuicRequiredBindEnableAuthn)[keyof typeof ListenersQuicRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersQuicRequiredBindMaxConnections = number | 'infinity'

export type ListenersQuicRequiredBindType =
  (typeof ListenersQuicRequiredBindType)[keyof typeof ListenersQuicRequiredBindType]

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
  ssl_options?: EmqxListenerQuicSslOpts
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersQuicRequiredBindMaxConnections
  mountpoint?: string
  zone?: string
  enable_authn?: ListenersQuicRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
}

export type ListenersQuicNotRequiredBindEnableAuthn =
  (typeof ListenersQuicNotRequiredBindEnableAuthn)[keyof typeof ListenersQuicNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersQuicNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersQuicNotRequiredBindType =
  (typeof ListenersQuicNotRequiredBindType)[keyof typeof ListenersQuicNotRequiredBindType]

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
  ssl_options?: EmqxListenerQuicSslOpts
  enable?: boolean
  acceptors?: number
  max_connections?: ListenersQuicNotRequiredBindMaxConnections
  mountpoint?: string
  zone?: string
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
  (typeof ListenersListenerTypeStatusType)[keyof typeof ListenersListenerTypeStatusType]

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
  (typeof ListenersListenerIdStatusType)[keyof typeof ListenersListenerIdStatusType]

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

export type EmqxWsOptsMaxFrameSize = number | 'infinity'

export type EmqxWsOptsMqttPiggyback =
  (typeof EmqxWsOptsMqttPiggyback)[keyof typeof EmqxWsOptsMqttPiggyback]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxWsOptsMqttPiggyback = {
  single: 'single',
  multiple: 'multiple',
} as const

export interface EmqxWsOpts {
  mqtt_path?: string
  mqtt_piggyback?: EmqxWsOptsMqttPiggyback
  compress?: boolean
  idle_timeout?: string
  max_frame_size?: EmqxWsOptsMaxFrameSize
  fail_if_no_subprotocol?: boolean
  supported_subprotocols?: string
  check_origin_enable?: boolean
  allow_origin_absence?: boolean
  check_origins?: string
  proxy_address_header?: string
  proxy_port_header?: string
  deflate_opts?: EmqxDeflateOpts
  validate_utf8?: boolean
}

export interface EmqxTcpOpts {
  active_n?: number
  backlog?: number
  send_timeout?: string
  send_timeout_close?: boolean
  recbuf?: string
  sndbuf?: string
  buffer?: string
  high_watermark?: string
  nodelay?: boolean
  nolinger?: boolean
  reuseaddr?: boolean
  keepalive?: string
}

export interface EmqxOcsp {
  enable_ocsp_stapling?: boolean
  responder_url?: string
  issuer_pem?: string
  refresh_interval?: string
  refresh_http_timeout?: string
}

export type EmqxListenerWssOptsPartialChain =
  (typeof EmqxListenerWssOptsPartialChain)[keyof typeof EmqxListenerWssOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxListenerWssOptsLogLevel =
  (typeof EmqxListenerWssOptsLogLevel)[keyof typeof EmqxListenerWssOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsLogLevel = {
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

export type EmqxListenerWssOptsVerify =
  (typeof EmqxListenerWssOptsVerify)[keyof typeof EmqxListenerWssOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxListenerWssOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxListenerWssOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxListenerWssOptsLogLevel
  hibernate_after?: string
  partial_chain?: EmqxListenerWssOptsPartialChain
  verify_peer_ext_key_usage?: string
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
}

export type EmqxListenerSslOptsPartialChain =
  (typeof EmqxListenerSslOptsPartialChain)[keyof typeof EmqxListenerSslOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxListenerSslOptsLogLevel =
  (typeof EmqxListenerSslOptsLogLevel)[keyof typeof EmqxListenerSslOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsLogLevel = {
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

export type EmqxListenerSslOptsVerify =
  (typeof EmqxListenerSslOptsVerify)[keyof typeof EmqxListenerSslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxListenerSslOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxListenerSslOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxListenerSslOptsLogLevel
  hibernate_after?: string
  partial_chain?: EmqxListenerSslOptsPartialChain
  verify_peer_ext_key_usage?: string
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
  gc_after_handshake?: boolean
  ocsp?: EmqxOcsp
  enable_crl_check?: boolean
}

export interface ListenersWithNameSslRequiredBind {
  type: ListenersWithNameSslRequiredBindType
  running?: boolean
  name: string
  current_connections?: number
  enable?: boolean
  bind: string
  acceptors?: number
  max_connections?: ListenersWithNameSslRequiredBindMaxConnections
  mountpoint?: string
  zone?: string
  enable_authn?: ListenersWithNameSslRequiredBindEnableAuthn
  max_conn_rate?: string
  messages_rate?: string
  bytes_rate?: string
  access_rules?: string[]
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp_options?: EmqxTcpOpts
  ssl_options?: EmqxListenerSslOpts
}

export type EmqxListenerQuicSslOptsVerify =
  (typeof EmqxListenerQuicSslOptsVerify)[keyof typeof EmqxListenerQuicSslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerQuicSslOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxListenerQuicSslOpts {
  cacertfile?: string
  certfile?: string
  keyfile?: string
  verify?: EmqxListenerQuicSslOptsVerify
  password?: string
  hibernate_after?: string
}

export type EmqxDeflateOptsClientContextTakeover =
  (typeof EmqxDeflateOptsClientContextTakeover)[keyof typeof EmqxDeflateOptsClientContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsClientContextTakeover = {
  takeover: 'takeover',
  no_takeover: 'no_takeover',
} as const

export type EmqxDeflateOptsServerContextTakeover =
  (typeof EmqxDeflateOptsServerContextTakeover)[keyof typeof EmqxDeflateOptsServerContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsServerContextTakeover = {
  takeover: 'takeover',
  no_takeover: 'no_takeover',
} as const

export type EmqxDeflateOptsStrategy =
  (typeof EmqxDeflateOptsStrategy)[keyof typeof EmqxDeflateOptsStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsStrategy = {
  default: 'default',
  filtered: 'filtered',
  huffman_only: 'huffman_only',
  rle: 'rle',
} as const

export type EmqxDeflateOptsLevel = (typeof EmqxDeflateOptsLevel)[keyof typeof EmqxDeflateOptsLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsLevel = {
  none: 'none',
  default: 'default',
  best_compression: 'best_compression',
  best_speed: 'best_speed',
} as const

export interface EmqxDeflateOpts {
  level?: EmqxDeflateOptsLevel
  mem_level?: number
  strategy?: EmqxDeflateOptsStrategy
  server_context_takeover?: EmqxDeflateOptsServerContextTakeover
  client_context_takeover?: EmqxDeflateOptsClientContextTakeover
  server_max_window_bits?: number
  client_max_window_bits?: number
}
