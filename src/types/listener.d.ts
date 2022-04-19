import { SSL } from './common'
import { ListenerType, ListenerTypeForGateway } from './enum'

type Infinity = 'infinity'

export interface ListenerStatus {
  max_connections: number
  current_connections: number
}

export interface ListenerNodeStatus {
  node: string
  max_connections: number
  current_connections: number
}

export interface ListenerSimpleInfo {
  id: string
  name: string
  type: string
  enable: boolean
  number: number
  status: ListenerStatus
  node_status: Array<ListenerNodeStatus>
}

export interface ListenerBase {
  /**
   * id = {type}:{name}
   */
  id: string
  name: string
  type: ListenerType | ListenerTypeForGateway
  bind: number | string
  acceptors?: number
  limiter?: 'object'
  max_connections?: number | Infinity
  mountpoint?: string
  running?: boolean
  zone?: string
}

export interface ListenerQuic extends ListenerBase {
  certfile?: string
  ciphers?: 'array'
  enabled?: boolean
  idle_timeout?: string
  keyfile?: string
}

export interface ListenerWSS extends ListenerBase {
  access_rules?: 'array'
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  ssl?: SSL
  // TODO:
  tcp?: undefined
  // TODO:
  websocket?: undefined
}

export interface ListenerWS extends ListenerBase {
  access_rules?: 'array'
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  // TODO:
  tcp?: undefined
  // TODO:
  websocket?: undefined
}

export interface ListenerSSL extends ListenerBase {
  access_rules?: 'array'
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  ssl?: SSL
  // TODO:
  tcp?: undefined
}

export interface ListenerTCP extends ListenerBase {
  access_rules?: 'array'
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  tcp?: undefined
}

// export type Listener = ListenerQuic | ListenerWSS | ListenerWS | ListenerSSL | ListenerTCP

export type Listener = Record<string, any>
