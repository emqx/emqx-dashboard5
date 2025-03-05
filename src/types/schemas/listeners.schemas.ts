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
  | ListenersQuicRequiredBind
  | ListenersSslRequiredBind
  | ListenersTcpRequiredBind
  | ListenersWsRequiredBind
  | ListenersWssRequiredBind

export type PostListenersIdBody =
  | ListenersQuicRequiredBind
  | ListenersSslRequiredBind
  | ListenersTcpRequiredBind
  | ListenersWsRequiredBind
  | ListenersWssRequiredBind

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
  | ListenersQuicRequiredBind
  | ListenersSslRequiredBind
  | ListenersTcpRequiredBind
  | ListenersWsRequiredBind
  | ListenersWssRequiredBind

export type PutListenersIdBody =
  | ListenersQuicNotRequiredBind
  | ListenersSslNotRequiredBind
  | ListenersTcpNotRequiredBind
  | ListenersWsNotRequiredBind
  | ListenersWssNotRequiredBind

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
  | ListenersQuicRequiredBind
  | ListenersSslRequiredBind
  | ListenersTcpRequiredBind
  | ListenersWsRequiredBind
  | ListenersWssRequiredBind

export type PostListenersBody =
  | ListenersWithNameQuicRequiredBind
  | ListenersWithNameSslRequiredBind
  | ListenersWithNameTcpRequiredBind
  | ListenersWithNameWsRequiredBind
  | ListenersWithNameWssRequiredBind

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

export type ListenersWssRequiredBindType =
  typeof ListenersWssRequiredBindType[keyof typeof ListenersWssRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssRequiredBindType = {
  wss: 'wss',
} as const

export type ListenersWssRequiredBindMaxConnections = number | 'infinity'

export type ListenersWssRequiredBindEnableAuthn =
  typeof ListenersWssRequiredBindEnableAuthn[keyof typeof ListenersWssRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersWssRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWssRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersWssRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  ssl_options?: EmqxListenerWssOpts
  tcp_options?: EmqxTcpOpts
  type: ListenersWssRequiredBindType
  websocket?: EmqxWsOpts
  zone?: string
}

export type GetListenersId200 =
  | ListenersQuicRequiredBind
  | ListenersSslRequiredBind
  | ListenersTcpRequiredBind
  | ListenersWsRequiredBind
  | ListenersWssRequiredBind

export type ListenersWssNotRequiredBindType =
  typeof ListenersWssNotRequiredBindType[keyof typeof ListenersWssNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssNotRequiredBindType = {
  wss: 'wss',
} as const

export type ListenersWssNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersWssNotRequiredBindEnableAuthn =
  typeof ListenersWssNotRequiredBindEnableAuthn[keyof typeof ListenersWssNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWssNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersWssNotRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWssNotRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersWssNotRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  ssl_options?: EmqxListenerWssOpts
  tcp_options?: EmqxTcpOpts
  type: ListenersWssNotRequiredBindType
  websocket?: EmqxWsOpts
  zone?: string
}

export type ListenersWsRequiredBindType =
  typeof ListenersWsRequiredBindType[keyof typeof ListenersWsRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsRequiredBindType = {
  ws: 'ws',
} as const

export type ListenersWsRequiredBindMaxConnections = number | 'infinity'

export type ListenersWsRequiredBindEnableAuthn =
  typeof ListenersWsRequiredBindEnableAuthn[keyof typeof ListenersWsRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersWsRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWsRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersWsRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  tcp_options?: EmqxTcpOpts
  type: ListenersWsRequiredBindType
  websocket?: EmqxWsOpts
  zone?: string
}

export type ListenersWsNotRequiredBindType =
  typeof ListenersWsNotRequiredBindType[keyof typeof ListenersWsNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsNotRequiredBindType = {
  ws: 'ws',
} as const

export type ListenersWsNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersWsNotRequiredBindEnableAuthn =
  typeof ListenersWsNotRequiredBindEnableAuthn[keyof typeof ListenersWsNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWsNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersWsNotRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWsNotRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersWsNotRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  tcp_options?: EmqxTcpOpts
  type: ListenersWsNotRequiredBindType
  websocket?: EmqxWsOpts
  zone?: string
}

export type ListenersWithNameWssRequiredBindType =
  typeof ListenersWithNameWssRequiredBindType[keyof typeof ListenersWithNameWssRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameWssRequiredBindType = {
  wss: 'wss',
} as const

export type ListenersWithNameWssRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameWssRequiredBindEnableAuthn =
  typeof ListenersWithNameWssRequiredBindEnableAuthn[keyof typeof ListenersWithNameWssRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameWssRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersWithNameWssRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWithNameWssRequiredBindEnableAuthn
  max_conn_rate?: string
  max_connections?: ListenersWithNameWssRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  name: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  ssl_options?: EmqxListenerWssOpts
  tcp_options?: EmqxTcpOpts
  type: ListenersWithNameWssRequiredBindType
  websocket?: EmqxWsOpts
  zone?: string
}

export type ListenersWithNameWsRequiredBindType =
  typeof ListenersWithNameWsRequiredBindType[keyof typeof ListenersWithNameWsRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameWsRequiredBindType = {
  ws: 'ws',
} as const

export type ListenersWithNameWsRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameWsRequiredBindEnableAuthn =
  typeof ListenersWithNameWsRequiredBindEnableAuthn[keyof typeof ListenersWithNameWsRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameWsRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersWithNameWsRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWithNameWsRequiredBindEnableAuthn
  max_conn_rate?: string
  max_connections?: ListenersWithNameWsRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  name: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  tcp_options?: EmqxTcpOpts
  type: ListenersWithNameWsRequiredBindType
  websocket?: EmqxWsOpts
  zone?: string
}

export type ListenersWithNameTcpRequiredBindType =
  typeof ListenersWithNameTcpRequiredBindType[keyof typeof ListenersWithNameTcpRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameTcpRequiredBindType = {
  tcp: 'tcp',
} as const

export type ListenersWithNameTcpRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameTcpRequiredBindEnableAuthn =
  typeof ListenersWithNameTcpRequiredBindEnableAuthn[keyof typeof ListenersWithNameTcpRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameTcpRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersWithNameTcpRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWithNameTcpRequiredBindEnableAuthn
  max_conn_rate?: string
  max_connections?: ListenersWithNameTcpRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  name: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  tcp_options?: EmqxTcpOpts
  type: ListenersWithNameTcpRequiredBindType
  zone?: string
}

export type ListenersWithNameSslRequiredBindType =
  typeof ListenersWithNameSslRequiredBindType[keyof typeof ListenersWithNameSslRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameSslRequiredBindType = {
  ssl: 'ssl',
} as const

export type ListenersWithNameSslRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameSslRequiredBindEnableAuthn =
  typeof ListenersWithNameSslRequiredBindEnableAuthn[keyof typeof ListenersWithNameSslRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameSslRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export type ListenersWithNameQuicRequiredBindType =
  typeof ListenersWithNameQuicRequiredBindType[keyof typeof ListenersWithNameQuicRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameQuicRequiredBindType = {
  quic: 'quic',
} as const

export type ListenersWithNameQuicRequiredBindMaxConnections = number | 'infinity'

export type ListenersWithNameQuicRequiredBindEnableAuthn =
  typeof ListenersWithNameQuicRequiredBindEnableAuthn[keyof typeof ListenersWithNameQuicRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersWithNameQuicRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersWithNameQuicRequiredBind {
  acceptors?: number
  bind: string
  bytes_rate?: string
  ciphers?: string[]
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWithNameQuicRequiredBindEnableAuthn
  max_conn_rate?: string
  max_connections?: ListenersWithNameQuicRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  name: string
  running?: boolean
  ssl_options?: EmqxListenerQuicSslOpts
  type: ListenersWithNameQuicRequiredBindType
  zone?: string
}

export type ListenersTcpRequiredBindType =
  typeof ListenersTcpRequiredBindType[keyof typeof ListenersTcpRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpRequiredBindType = {
  tcp: 'tcp',
} as const

export type ListenersTcpRequiredBindMaxConnections = number | 'infinity'

export type ListenersTcpRequiredBindEnableAuthn =
  typeof ListenersTcpRequiredBindEnableAuthn[keyof typeof ListenersTcpRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersTcpRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersTcpRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersTcpRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  tcp_options?: EmqxTcpOpts
  type: ListenersTcpRequiredBindType
  zone?: string
}

export type ListenersTcpNotRequiredBindType =
  typeof ListenersTcpNotRequiredBindType[keyof typeof ListenersTcpNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpNotRequiredBindType = {
  tcp: 'tcp',
} as const

export type ListenersTcpNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersTcpNotRequiredBindEnableAuthn =
  typeof ListenersTcpNotRequiredBindEnableAuthn[keyof typeof ListenersTcpNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersTcpNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersTcpNotRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersTcpNotRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersTcpNotRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  tcp_options?: EmqxTcpOpts
  type: ListenersTcpNotRequiredBindType
  zone?: string
}

export type ListenersStatusRunning = boolean | 'inconsistent'

export type ListenersStatusMaxConnections = number | 'infinity'

export interface ListenersStatus {
  current_connections?: number
  max_connections?: ListenersStatusMaxConnections
  running: ListenersStatusRunning
}

export type ListenersSslRequiredBindType =
  typeof ListenersSslRequiredBindType[keyof typeof ListenersSslRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslRequiredBindType = {
  ssl: 'ssl',
} as const

export type ListenersSslRequiredBindMaxConnections = number | 'infinity'

export type ListenersSslRequiredBindEnableAuthn =
  typeof ListenersSslRequiredBindEnableAuthn[keyof typeof ListenersSslRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersSslRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersSslRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersSslRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  ssl_options?: EmqxListenerSslOpts
  tcp_options?: EmqxTcpOpts
  type: ListenersSslRequiredBindType
  zone?: string
}

export type ListenersSslNotRequiredBindType =
  typeof ListenersSslNotRequiredBindType[keyof typeof ListenersSslNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslNotRequiredBindType = {
  ssl: 'ssl',
} as const

export type ListenersSslNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersSslNotRequiredBindEnableAuthn =
  typeof ListenersSslNotRequiredBindEnableAuthn[keyof typeof ListenersSslNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersSslNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersSslNotRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersSslNotRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersSslNotRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  ssl_options?: EmqxListenerSslOpts
  tcp_options?: EmqxTcpOpts
  type: ListenersSslNotRequiredBindType
  zone?: string
}

export type ListenersQuicRequiredBindType =
  typeof ListenersQuicRequiredBindType[keyof typeof ListenersQuicRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicRequiredBindType = {
  quic: 'quic',
} as const

export type ListenersQuicRequiredBindMaxConnections = number | 'infinity'

export type ListenersQuicRequiredBindEnableAuthn =
  typeof ListenersQuicRequiredBindEnableAuthn[keyof typeof ListenersQuicRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersQuicRequiredBind {
  acceptors?: number
  bind: string
  bytes_rate?: string
  ciphers?: string[]
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersQuicRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersQuicRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  running?: boolean
  ssl_options?: EmqxListenerQuicSslOpts
  type: ListenersQuicRequiredBindType
  zone?: string
}

export type ListenersQuicNotRequiredBindType =
  typeof ListenersQuicNotRequiredBindType[keyof typeof ListenersQuicNotRequiredBindType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicNotRequiredBindType = {
  quic: 'quic',
} as const

export type ListenersQuicNotRequiredBindMaxConnections = number | 'infinity'

export type ListenersQuicNotRequiredBindEnableAuthn =
  typeof ListenersQuicNotRequiredBindEnableAuthn[keyof typeof ListenersQuicNotRequiredBindEnableAuthn]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListenersQuicNotRequiredBindEnableAuthn = {
  true: 'true',
  false: 'false',
  quick_deny_anonymous: 'quick_deny_anonymous',
} as const

export interface ListenersQuicNotRequiredBind {
  acceptors?: number
  bind?: string
  bytes_rate?: string
  ciphers?: string[]
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersQuicNotRequiredBindEnableAuthn
  id: string
  max_conn_rate?: string
  max_connections?: ListenersQuicNotRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  running?: boolean
  ssl_options?: EmqxListenerQuicSslOpts
  type: ListenersQuicNotRequiredBindType
  zone?: string
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
  enable: boolean
  ids: string[]
  node_status?: ListenersNodeStatus[]
  status?: ListenersStatus
  type: ListenersListenerTypeStatusType
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
  acceptors?: number
  bind: string
  enable: boolean
  id: string
  name: string
  node_status?: ListenersNodeStatus[]
  number?: number
  status?: ListenersStatus
  type: ListenersListenerIdStatusType
}

export type EmqxWsOptsMqttPiggyback =
  typeof EmqxWsOptsMqttPiggyback[keyof typeof EmqxWsOptsMqttPiggyback]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxWsOptsMqttPiggyback = {
  single: 'single',
  multiple: 'multiple',
} as const

export type EmqxWsOptsMaxFrameSize = number | 'infinity'

export interface EmqxWsOpts {
  allow_origin_absence?: boolean
  check_origin_enable?: boolean
  check_origins?: string
  compress?: boolean
  deflate_opts?: EmqxDeflateOpts
  fail_if_no_subprotocol?: boolean
  idle_timeout?: string
  max_frame_size?: EmqxWsOptsMaxFrameSize
  mqtt_path?: string
  mqtt_piggyback?: EmqxWsOptsMqttPiggyback
  proxy_address_header?: string
  proxy_port_header?: string
  supported_subprotocols?: string
  validate_utf8?: boolean
}

export interface EmqxTcpOpts {
  active_n?: number
  backlog?: number
  buffer?: string
  high_watermark?: string
  keepalive?: string
  nodelay?: boolean
  nolinger?: boolean
  recbuf?: string
  reuseaddr?: boolean
  send_timeout?: string
  send_timeout_close?: boolean
  sndbuf?: string
}

export interface EmqxOcsp {
  enable_ocsp_stapling?: boolean
  issuer_pem?: string
  refresh_http_timeout?: string
  refresh_interval?: string
  responder_url?: string
}

export type EmqxListenerWssOptsVerify =
  typeof EmqxListenerWssOptsVerify[keyof typeof EmqxListenerWssOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export type EmqxListenerWssOptsPartialChain =
  typeof EmqxListenerWssOptsPartialChain[keyof typeof EmqxListenerWssOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxListenerWssOptsLogLevel =
  typeof EmqxListenerWssOptsLogLevel[keyof typeof EmqxListenerWssOptsLogLevel]

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

export interface EmqxListenerWssOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  client_renegotiation?: boolean
  depth?: number
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  handshake_timeout?: string
  hibernate_after?: string
  honor_cipher_order?: boolean
  keyfile?: string
  log_level?: EmqxListenerWssOptsLogLevel
  partial_chain?: EmqxListenerWssOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  verify?: EmqxListenerWssOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export type EmqxListenerSslOptsVerify =
  typeof EmqxListenerSslOptsVerify[keyof typeof EmqxListenerSslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export type EmqxListenerSslOptsPartialChain =
  typeof EmqxListenerSslOptsPartialChain[keyof typeof EmqxListenerSslOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxListenerSslOptsLogLevel =
  typeof EmqxListenerSslOptsLogLevel[keyof typeof EmqxListenerSslOptsLogLevel]

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

export interface EmqxListenerSslOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  client_renegotiation?: boolean
  depth?: number
  dhfile?: string
  enable_crl_check?: boolean
  fail_if_no_peer_cert?: boolean
  gc_after_handshake?: boolean
  handshake_timeout?: string
  hibernate_after?: string
  honor_cipher_order?: boolean
  keyfile?: string
  log_level?: EmqxListenerSslOptsLogLevel
  ocsp?: EmqxOcsp
  partial_chain?: EmqxListenerSslOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  verify?: EmqxListenerSslOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export interface ListenersWithNameSslRequiredBind {
  acceptors?: number
  access_rules?: string[]
  bind: string
  bytes_rate?: string
  current_connections?: number
  enable?: boolean
  enable_authn?: ListenersWithNameSslRequiredBindEnableAuthn
  max_conn_rate?: string
  max_connections?: ListenersWithNameSslRequiredBindMaxConnections
  messages_rate?: string
  mountpoint?: string
  name: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  ssl_options?: EmqxListenerSslOpts
  tcp_options?: EmqxTcpOpts
  type: ListenersWithNameSslRequiredBindType
  zone?: string
}

export type EmqxListenerQuicSslOptsVerify =
  typeof EmqxListenerQuicSslOptsVerify[keyof typeof EmqxListenerQuicSslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerQuicSslOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxListenerQuicSslOpts {
  cacertfile?: string
  certfile?: string
  hibernate_after?: string
  keyfile?: string
  password?: string
  verify?: EmqxListenerQuicSslOptsVerify
}

export type EmqxDeflateOptsStrategy =
  typeof EmqxDeflateOptsStrategy[keyof typeof EmqxDeflateOptsStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsStrategy = {
  default: 'default',
  filtered: 'filtered',
  huffman_only: 'huffman_only',
  rle: 'rle',
} as const

export type EmqxDeflateOptsServerContextTakeover =
  typeof EmqxDeflateOptsServerContextTakeover[keyof typeof EmqxDeflateOptsServerContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsServerContextTakeover = {
  takeover: 'takeover',
  no_takeover: 'no_takeover',
} as const

export type EmqxDeflateOptsLevel = typeof EmqxDeflateOptsLevel[keyof typeof EmqxDeflateOptsLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsLevel = {
  none: 'none',
  default: 'default',
  best_compression: 'best_compression',
  best_speed: 'best_speed',
} as const

export type EmqxDeflateOptsClientContextTakeover =
  typeof EmqxDeflateOptsClientContextTakeover[keyof typeof EmqxDeflateOptsClientContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsClientContextTakeover = {
  takeover: 'takeover',
  no_takeover: 'no_takeover',
} as const

export interface EmqxDeflateOpts {
  client_context_takeover?: EmqxDeflateOptsClientContextTakeover
  client_max_window_bits?: number
  level?: EmqxDeflateOptsLevel
  mem_level?: number
  server_context_takeover?: EmqxDeflateOptsServerContextTakeover
  server_max_window_bits?: number
  strategy?: EmqxDeflateOptsStrategy
}
