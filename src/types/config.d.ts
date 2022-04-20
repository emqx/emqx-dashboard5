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

export interface Zones {
  [key: string]: Zone
}

export interface Zone {
  mqtt: Mqtt
  stats: Stats
  flapping_detect: FlappingDetect
  force_shutdown: ForceShutdown
  conn_congestion: ConnCongestion
  force_gc: ForceGc
  overload_protection: OverloadProtection
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
  keepalive_backoff: number
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

export interface ForceShutdown {
  enable: boolean
  max_message_queue_len: number
  max_heap_size: string
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

export interface DelayedItem {
  delayed_interval: number
  delayed_remaining: number
  expected_at: string
  from_clientid: string
  from_username: string
  msgid: string
  node: string
  publish_at: string
  qos: number
  topic: string
}

export interface TeleStatus {
  enable: boolean
}

export interface Rate {
  bytes_in: BytesIn
  message_in: MessageIn
  connection: Connection
  message_routing: MessageRouting
  batch: Batch
}

export interface BytesIn {
  rate: string
  burst: string
  bucket: Bucket
}

export interface MessageIn {
  rate: string
  burst: string
  bucket: Bucket
}

export interface Connection {
  rate: string
  burst: string
  bucket: Bucket
}

export interface MessageRouting {
  rate: string
  burst: string
  bucket: Bucket
}

export interface Batch {
  rate: string
  burst: string
  bucket: Bucket
}

export interface Bucket {
  $bucket_name: BucketName
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
