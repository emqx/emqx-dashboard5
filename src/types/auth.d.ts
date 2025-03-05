import { MetricsDataWithExtraData } from './common'
import { BannedType, ConnectionStatus, QoSLevel } from './enum'

export interface AuthzSetting {
  deny_action: 'ignore' | 'disconnect'
  no_match: 'allow' | 'deny'
  cache: {
    enable: boolean
    excludes: string[]
    ttl?: string
    max_size?: number
  }
}

export interface AuthzSourceItem {
  type: string
  enable: boolean
  rules?: string
  header: {
    [key: string]: string
  }
  img?: string
}

export interface AuthnItem {
  backend: string
  enable: boolean
  id: string
  mechanism: string
  password_hash_algorithm?: PasswordHashAlgorithm
  user_id_type?: string
  body?: Body
  connect_timeout?: string
  enable_pipelining?: number
  headers?: Headers
  max_retries?: number
  method?: string
  pool_size?: number
  request_timeout?: string
  retry_interval?: string
  ssl?: Ssl
  url?: string
  cmd?: string
  database?: number
  password?: string
  redis_type?: string
  servers?: string
  img?: string
}

export interface BuiltInDBRule {
  permission: string
  action: string
  topic: string
  qos?: Array<QoSLevel>
  retain?: boolean | 'all'
  clientid_re?: string
  username_re?: string
  ipaddr?: string
}

export interface BuiltInDBItem {
  rules: BuiltInDBRule[]
  clientid: string
  username: string
}

export interface DataManagerItem {
  user_id: string
  password: string
  is_superuser: boolean
}

export type Metrics = MetricsDataWithExtraData<{
  node_status: Array<{
    node: string
    status: string
  }>
  status: ConnectionStatus
}>

export interface Banned {
  as: BannedType
  who: string
  reason: string
  until: string
}

export type DatabaseAndServer = 'mysql' | 'postgresql' | 'mongodb' | 'redis' | 'http' | 'ldap'

export interface ImportResult {
  total?: number
  success?: number
  override?: number
  skipped?: number
  failed?: number
}

export default {}
