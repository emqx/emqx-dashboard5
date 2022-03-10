import { ComponentPublicInstance } from 'vue'

export interface SubTabComponent extends ComponentPublicInstance {
  index: number
  reloading: () => void
}

export interface Cluster {
  name: string
  discovery_strategy: string
  autoclean: string
  autoheal: boolean
  static: Static
  mcast: Mcast
  proto_dist: string
  dns: Dns
  etcd: Etcd
  k8s: K8s
}

export interface Static {
  seeds: string
}

export interface Mcast {
  addr: string
  ports: number[]
  iface: string
  ttl: number
  loop: boolean
  sndbuf: string
  recbuf: string
  buffer: string
}

export interface Dns {
  name: string
  app: string
}

export interface Etcd {
  server: string
  prefix: string
  node_ttl: string
  ssl: SSL
}

export interface SSL {
  enable: boolean
  cacertfile: string
  certfile: string
  keyfile: string
  verify: string
  reuse_sessions: boolean
  depth: number
  password: string
  versions: string[]
  ciphers: string[]
  user_lookup_fun: string
  secure_renegotiate: boolean
  server_name_indication: string
}

export interface K8s {
  apiserver: string
  service_name: string
  address_type: string
  app_name: string
  namespace: string
  suffix: string
}

export interface Log {
  console_handler: ConsoleHandler
  file_handlers: FileHandlers
  error_logger: string
}

export interface ConsoleHandler {
  enable: boolean
  level: string
  time_offset: string
  chars_limit: string
  formatter: string
  single_line: boolean
  sync_mode_qlen: number
  drop_mode_qlen: number
  flush_qlen: number
  overload_kill: OverloadKill
  burst_limit: BurstLimit
  supervisor_reports: string
  max_depth: number
}

export interface OverloadKill {
  enable: boolean
  mem_size: string
  qlen: number
  restart_after: string
}

export interface BurstLimit {
  enable: boolean
  max_count: number
  window_time: string
}

export interface FileHandlers {
  [key: string]: Name
}

export interface Name {
  file: string
  rotation: Rotation
  max_size: string
  level: string
  time_offset: string
  chars_limit: string
  formatter: string
  single_line: boolean
  sync_mode_qlen: number
  drop_mode_qlen: number
  flush_qlen: number
  overload_kill: OverloadKill2
  burst_limit: BurstLimit2
  supervisor_reports: string
  max_depth: number
}

export interface Rotation {
  enable: boolean
  count: number
}

export interface OverloadKill2 {
  enable: boolean
  mem_size: string
  qlen: number
  restart_after: string
}

export interface BurstLimit2 {
  enable: boolean
  max_count: number
  window_time: string
}

export interface Dashboard {
  listeners: Listener[] | Listener
  default_username: string
  default_password: string
  sample_interval: string
  token_expired_time: string
  cors: boolean
}

export interface Listener {
  protocol: string
  bind: number
  num_acceptors: number
  max_connections: number
  backlog: number
  send_timeout: string
  inet6: boolean
  ipv6_v6only: boolean
  enable?: boolean
  cacertfile?: string
  certfile?: string
  keyfile?: string
  verify?: string
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  user_lookup_fun?: string
  secure_renegotiate?: boolean
  dhfile?: string
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
}
