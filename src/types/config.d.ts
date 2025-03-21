import { ComponentPublicInstance } from 'vue'
import { EmqxForceShutdown } from './schemas/configs.schemas'

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

export interface Zones {
  [key: string]: Zone
}

export interface Zone {
  mqtt: Mqtt
  stats: Stats
  flapping_detect: FlappingDetect
  force_shutdown: EmqxForceShutdown
  conn_congestion: ConnCongestion
  force_gc: ForceGc
  overload_protection: OverloadProtection
  durable_sessions: DurableSessions
}

export interface Mqtt {
  idle_timeout: string
  max_packet_size: string
  max_clientid_len: number
  max_topic_levels: number
  max_qos_allowed: string
  max_topic_alias: number
  retain_available: boolean
  wildcard_subscription: boolean
  shared_subscription: boolean
  ignore_loop_deliver: boolean
  strict_mode: boolean
  response_information: string
  server_keepalive: string
  keepalive_multiplier: number
  max_subscriptions: string
  upgrade_qos: boolean
  max_inflight: number
  retry_interval: string
  max_awaiting_rel: string
  await_rel_timeout: string
  session_expiry_interval: string
  max_mqueue_len: string
  mqueue_priorities: string
  mqueue_default_priority: string
  mqueue_store_qos0: boolean
  use_username_as_clientid: boolean
  peer_cert_as_username: string
  peer_cert_as_clientid: string
}

export interface Stats {
  enable: boolean
}

export interface FlappingDetect {
  enable: boolean
  max_count: number
  window_time: string
  ban_time: string
}

export interface ConnCongestion {
  enable_alarm: boolean
  min_alarm_sustain_duration: string
}

export interface ForceGc {
  enable: boolean
  count: number
  bytes: string
}

export interface OverloadProtection {
  enable: boolean
  backoff_delay: number
  backoff_gc: boolean
  backoff_hibernation: boolean
  backoff_new_conn: boolean
}

export interface TeleStatus {
  enable: boolean
}

export interface Bucket {
  [key: string]: BucketName
}

export interface BucketName {
  rate: string
  capacity: string
  initial: string
  per_client: PerClient
}

export interface PerClient {
  rate: string
  initial: string
  low_water_mark: string
  capacity: string
  divisible: boolean
  max_retry_time: string
  failure_strategy: string
}

interface Top {
  num_items: number
  sample_interval: string
  max_procs: number
  db_hostname: string
  db_port: number
  db_username: string
  db_password: string
  db_name: string
}

interface OS {
  cpu_check_interval: string
  cpu_high_watermark: string
  cpu_low_watermark: string
  mem_check_interval: string
  sysmem_high_watermark: string
  procmem_high_watermark: string
}

interface VM {
  process_check_interval: string
  process_high_watermark: string
  process_low_watermark: string
  long_gc: string
  long_schedule: string
  large_heap: string
  busy_dist_port: boolean
  busy_port: boolean
}
export interface Limiter {
  bytes_rate: string
  max_conn_rate: string
  messages_rate: string
}

export interface DurableSessions {
  enable: boolean
  batch_size: number
  idle_poll_interval: string
  heartbeat_interval: string
  session_gc_interval: string
  session_gc_batch_size: number
  message_retention_period: string
}
