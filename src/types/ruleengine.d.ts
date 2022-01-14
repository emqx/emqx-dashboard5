export type tlsConfig = {
  enable: boolean
  verify: string
  certfile: string
  keyfile: string
  cacertfile: string
}

export interface Connector {
  type: 'mqtt'
  name: string
}

export interface ConnectorItem {
  id: string
  keepalive: number
}

export type BridgeItem = {
  id: string
  status: string
  direction: string
}

export type RuleItem = {
  outputs?: Array<Record<string, unknown> | string>
  name?: string
  enable?: boolean
  sql?: string
  description?: string
}

export type Rule = {
  enable: boolean
  created_at: string
  name: string
  id: string
}
