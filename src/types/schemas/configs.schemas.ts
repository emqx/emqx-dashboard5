export type PutConfigsLog403Code = typeof PutConfigsLog403Code[keyof typeof PutConfigsLog403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsLog403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsLog403 = {
  code?: PutConfigsLog403Code
  message?: string
}

export type PutConfigsLog400Code = typeof PutConfigsLog400Code[keyof typeof PutConfigsLog400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsLog400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutConfigsLog400 = {
  code?: PutConfigsLog400Code
  message?: string
}

export type GetConfigsLog404Code = typeof GetConfigsLog404Code[keyof typeof GetConfigsLog404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsLog404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsLog404 = {
  code?: GetConfigsLog404Code
  message?: string
}

export type PutConfigs400Code = typeof PutConfigs400Code[keyof typeof PutConfigs400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigs400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigs400 = {
  code?: PutConfigs400Code
  message?: string
}

export type PutConfigsMode = typeof PutConfigsMode[keyof typeof PutConfigsMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsMode = {
  replace: 'replace',
  merge: 'merge',
} as const

export type PutConfigsParams = {
  mode?: PutConfigsMode
  ignore_readonly?: boolean
}

export type GetConfigs500Code = typeof GetConfigs500Code[keyof typeof GetConfigs500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigs500Code = {
  BAD_NODE: 'BAD_NODE',
} as const

export type GetConfigs500 = {
  code?: GetConfigs500Code
  message?: string
}

export type GetConfigs404Code = typeof GetConfigs404Code[keyof typeof GetConfigs404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigs404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigs404 = {
  code?: GetConfigs404Code
  message?: string
}

export type GetConfigs400Code = typeof GetConfigs400Code[keyof typeof GetConfigs400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigs400Code = {
  INVALID_ACCEPT: 'INVALID_ACCEPT',
} as const

export type GetConfigs400 = {
  code?: GetConfigs400Code
  message?: string
}

export type GetConfigs200Two = { [key: string]: any }

export type GetConfigsKey = typeof GetConfigsKey[keyof typeof GetConfigsKey]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsKey = {
  actions: 'actions',
  alarm: 'alarm',
  api_key: 'api_key',
  authentication: 'authentication',
  authorization: 'authorization',
  auto_subscribe: 'auto_subscribe',
  banned: 'banned',
  bridges: 'bridges',
  cluster: 'cluster',
  conn_congestion: 'conn_congestion',
  connectors: 'connectors',
  crl_cache: 'crl_cache',
  dashboard: 'dashboard',
  delayed: 'delayed',
  durable_storage: 'durable_storage',
  exhook: 'exhook',
  flapping_detect: 'flapping_detect',
  force_gc: 'force_gc',
  force_shutdown: 'force_shutdown',
  gateway: 'gateway',
  limiter: 'limiter',
  listeners: 'listeners',
  log: 'log',
  mqtt: 'mqtt',
  node: 'node',
  opentelemetry: 'opentelemetry',
  overload_protection: 'overload_protection',
  prometheus: 'prometheus',
  psk_authentication: 'psk_authentication',
  retainer: 'retainer',
  rewrite: 'rewrite',
  rpc: 'rpc',
  rule_engine: 'rule_engine',
  slow_subs: 'slow_subs',
  sources: 'sources',
  sys_topics: 'sys_topics',
  sysmon: 'sysmon',
  telemetry: 'telemetry',
  topic_metrics: 'topic_metrics',
} as const

export type GetConfigsParams = {
  key?: GetConfigsKey
  node?: string
}

export type PostConfigsResetRootname403Code =
  typeof PostConfigsResetRootname403Code[keyof typeof PostConfigsResetRootname403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConfigsResetRootname403Code = {
  REST_FAILED: 'REST_FAILED',
} as const

export type PostConfigsResetRootname403 = {
  code?: PostConfigsResetRootname403Code
  message?: string
}

export type PostConfigsResetRootname400Code =
  typeof PostConfigsResetRootname400Code[keyof typeof PostConfigsResetRootname400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConfigsResetRootname400Code = {
  NO_DEFAULT_VALUE: 'NO_DEFAULT_VALUE',
  REST_FAILED: 'REST_FAILED',
} as const

export type PostConfigsResetRootname400 = {
  code?: PostConfigsResetRootname400Code
  message?: string
}

export type PostConfigsResetRootnameParams = {
  conf_path?: string
}

export type PutConfigsBroker403Code =
  typeof PutConfigsBroker403Code[keyof typeof PutConfigsBroker403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsBroker403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsBroker403 = {
  code?: PutConfigsBroker403Code
  message?: string
}

export type PutConfigsBroker400Code =
  typeof PutConfigsBroker400Code[keyof typeof PutConfigsBroker400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsBroker400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutConfigsBroker400 = {
  code?: PutConfigsBroker400Code
  message?: string
}

export type GetConfigsBroker404Code =
  typeof GetConfigsBroker404Code[keyof typeof GetConfigsBroker404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsBroker404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsBroker404 = {
  code?: GetConfigsBroker404Code
  message?: string
}

export type PutConfigsDashboard403Code =
  typeof PutConfigsDashboard403Code[keyof typeof PutConfigsDashboard403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsDashboard403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsDashboard403 = {
  code?: PutConfigsDashboard403Code
  message?: string
}

export type PutConfigsDashboard400Code =
  typeof PutConfigsDashboard400Code[keyof typeof PutConfigsDashboard400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsDashboard400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutConfigsDashboard400 = {
  code?: PutConfigsDashboard400Code
  message?: string
}

export type GetConfigsDashboard404Code =
  typeof GetConfigsDashboard404Code[keyof typeof GetConfigsDashboard404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsDashboard404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsDashboard404 = {
  code?: GetConfigsDashboard404Code
  message?: string
}

export type PutConfigsAlarm403Code =
  typeof PutConfigsAlarm403Code[keyof typeof PutConfigsAlarm403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsAlarm403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsAlarm403 = {
  code?: PutConfigsAlarm403Code
  message?: string
}

export type PutConfigsAlarm400Code =
  typeof PutConfigsAlarm400Code[keyof typeof PutConfigsAlarm400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsAlarm400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutConfigsAlarm400 = {
  code?: PutConfigsAlarm400Code
  message?: string
}

export type GetConfigsAlarm404Code =
  typeof GetConfigsAlarm404Code[keyof typeof GetConfigsAlarm404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsAlarm404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsAlarm404 = {
  code?: GetConfigsAlarm404Code
  message?: string
}

export type PutConfigsGlobalZone403Code =
  typeof PutConfigsGlobalZone403Code[keyof typeof PutConfigsGlobalZone403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsGlobalZone403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsGlobalZone403 = {
  code?: PutConfigsGlobalZone403Code
  message?: string
}

export type PutConfigsGlobalZone400Code =
  typeof PutConfigsGlobalZone400Code[keyof typeof PutConfigsGlobalZone400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsGlobalZone400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsGlobalZone400 = {
  code?: PutConfigsGlobalZone400Code
  message?: string
}

export type PutConfigsGlobalZone200 = {
  mqtt?: EmqxMqtt
  flapping_detect?: EmqxFlappingDetect
  force_shutdown?: EmqxForceShutdown
  force_gc?: EmqxForceGc
  durable_sessions?: EmqxDurableSessions
}

export type PutConfigsGlobalZoneBody = {
  mqtt?: EmqxMqtt
  flapping_detect?: EmqxFlappingDetect
  force_shutdown?: EmqxForceShutdown
  force_gc?: EmqxForceGc
  durable_sessions?: EmqxDurableSessions
}

export type GetConfigsGlobalZone200 = {
  mqtt?: EmqxMqtt
  flapping_detect?: EmqxFlappingDetect
  force_shutdown?: EmqxForceShutdown
  force_gc?: EmqxForceGc
  durable_sessions?: EmqxDurableSessions
}

export type PutConfigsSysmon403Code =
  typeof PutConfigsSysmon403Code[keyof typeof PutConfigsSysmon403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsSysmon403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsSysmon403 = {
  code?: PutConfigsSysmon403Code
  message?: string
}

export type PutConfigsSysmon400Code =
  typeof PutConfigsSysmon400Code[keyof typeof PutConfigsSysmon400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsSysmon400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutConfigsSysmon400 = {
  code?: PutConfigsSysmon400Code
  message?: string
}

export type GetConfigsSysmon404Code =
  typeof GetConfigsSysmon404Code[keyof typeof GetConfigsSysmon404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsSysmon404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsSysmon404 = {
  code?: GetConfigsSysmon404Code
  message?: string
}

export type PutConfigsSysTopics403Code =
  typeof PutConfigsSysTopics403Code[keyof typeof PutConfigsSysTopics403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsSysTopics403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsSysTopics403 = {
  code?: PutConfigsSysTopics403Code
  message?: string
}

export type PutConfigsSysTopics400Code =
  typeof PutConfigsSysTopics400Code[keyof typeof PutConfigsSysTopics400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsSysTopics400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutConfigsSysTopics400 = {
  code?: PutConfigsSysTopics400Code
  message?: string
}

export type GetConfigsSysTopics404Code =
  typeof GetConfigsSysTopics404Code[keyof typeof GetConfigsSysTopics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsSysTopics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsSysTopics404 = {
  code?: GetConfigsSysTopics404Code
  message?: string
}

export type EmqxSysmonVmLargeHeap = string | 'disabled'

export type EmqxSysmonVmLongSchedule = string | 'disabled'

export type EmqxSysmonVmLongGc = string | 'disabled'

export interface EmqxSysmonVm {
  process_check_interval?: string
  process_high_watermark?: string
  process_low_watermark?: string
  long_gc?: EmqxSysmonVmLongGc
  long_schedule?: EmqxSysmonVmLongSchedule
  large_heap?: EmqxSysmonVmLargeHeap
  busy_dist_port?: boolean
  busy_port?: boolean
}

export type EmqxSysmonOsMemCheckInterval = string | 'disabled'

export interface EmqxSysmonOs {
  cpu_check_interval?: string
  cpu_high_watermark?: string
  cpu_low_watermark?: string
  mem_check_interval?: EmqxSysmonOsMemCheckInterval
  sysmem_high_watermark?: string
  procmem_high_watermark?: string
}

export interface EmqxSysmon {
  vm?: EmqxSysmonVm
  os?: EmqxSysmonOs
}

export type EmqxSysTopicsSysHeartbeatInterval = string | 'disabled'

export type EmqxSysTopicsSysMsgInterval = string | 'disabled'

export interface EmqxSysTopics {
  sys_msg_interval?: EmqxSysTopicsSysMsgInterval
  sys_heartbeat_interval?: EmqxSysTopicsSysHeartbeatInterval
  sys_event_messages?: EmqxEventNames
}

export type EmqxMqttMaxSubscriptions = 'infinity' | number

export type EmqxMqttMaxMqueueLen = 'infinity' | number

export type EmqxMqttMqueueDefaultPriority =
  typeof EmqxMqttMqueueDefaultPriority[keyof typeof EmqxMqttMqueueDefaultPriority]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMqttMqueueDefaultPriority = {
  highest: 'highest',
  lowest: 'lowest',
} as const

export type EmqxMqttMqueuePrioritiesOneOf = { [key: string]: any }

export type EmqxMqttMqueuePriorities = EmqxMqttMqueuePrioritiesOneOf | 'disabled'

export type EmqxMqttMaxAwaitingRel = 'infinity' | number

export type EmqxMqttMessageExpiryInterval = 'infinity' | string

export type EmqxMqttPeerCertAsClientid =
  typeof EmqxMqttPeerCertAsClientid[keyof typeof EmqxMqttPeerCertAsClientid]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMqttPeerCertAsClientid = {
  disabled: 'disabled',
  cn: 'cn',
  dn: 'dn',
  crt: 'crt',
  pem: 'pem',
  md5: 'md5',
} as const

export type EmqxMqttPeerCertAsUsername =
  typeof EmqxMqttPeerCertAsUsername[keyof typeof EmqxMqttPeerCertAsUsername]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMqttPeerCertAsUsername = {
  disabled: 'disabled',
  cn: 'cn',
  dn: 'dn',
  crt: 'crt',
  pem: 'pem',
  md5: 'md5',
} as const

export type EmqxMqttServerKeepalive = 'disabled' | number

export type EmqxMqttSharedSubscriptionStrategy =
  typeof EmqxMqttSharedSubscriptionStrategy[keyof typeof EmqxMqttSharedSubscriptionStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMqttSharedSubscriptionStrategy = {
  random: 'random',
  round_robin: 'round_robin',
  round_robin_per_group: 'round_robin_per_group',
  sticky: 'sticky',
  local: 'local',
  hash_topic: 'hash_topic',
  hash_clientid: 'hash_clientid',
} as const

export type EmqxMqttIdleTimeout = string | 'infinity'

export interface EmqxMqtt {
  idle_timeout?: EmqxMqttIdleTimeout
  max_packet_size?: string
  max_clientid_len?: number
  max_topic_levels?: number
  max_topic_alias?: number
  retain_available?: boolean
  wildcard_subscription?: boolean
  shared_subscription?: boolean
  shared_subscription_strategy?: EmqxMqttSharedSubscriptionStrategy
  exclusive_subscription?: boolean
  ignore_loop_deliver?: boolean
  strict_mode?: boolean
  response_information?: string
  server_keepalive?: EmqxMqttServerKeepalive
  keepalive_multiplier?: number
  keepalive_check_interval?: string
  retry_interval?: string
  use_username_as_clientid?: boolean
  peer_cert_as_username?: EmqxMqttPeerCertAsUsername
  peer_cert_as_clientid?: EmqxMqttPeerCertAsClientid
  client_attrs_init?: EmqxClientAttrsInit[]
  session_expiry_interval?: string
  message_expiry_interval?: EmqxMqttMessageExpiryInterval
  max_awaiting_rel?: EmqxMqttMaxAwaitingRel
  max_qos_allowed?: number
  mqueue_priorities?: EmqxMqttMqueuePriorities
  mqueue_default_priority?: EmqxMqttMqueueDefaultPriority
  mqueue_store_qos0?: boolean
  max_mqueue_len?: EmqxMqttMaxMqueueLen
  max_inflight?: number
  max_subscriptions?: EmqxMqttMaxSubscriptions
  upgrade_qos?: boolean
  await_rel_timeout?: string
}

export interface EmqxLogThrottling {
  time_window?: string
}

export type EmqxLogFileHandlerTimestampFormat =
  typeof EmqxLogFileHandlerTimestampFormat[keyof typeof EmqxLogFileHandlerTimestampFormat]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLogFileHandlerTimestampFormat = {
  auto: 'auto',
  epoch: 'epoch',
  rfc3339: 'rfc3339',
} as const

export type EmqxLogFileHandlerFormatter =
  typeof EmqxLogFileHandlerFormatter[keyof typeof EmqxLogFileHandlerFormatter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLogFileHandlerFormatter = {
  text: 'text',
  json: 'json',
} as const

export type EmqxLogFileHandlerLevel =
  typeof EmqxLogFileHandlerLevel[keyof typeof EmqxLogFileHandlerLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLogFileHandlerLevel = {
  debug: 'debug',
  info: 'info',
  notice: 'notice',
  warning: 'warning',
  error: 'error',
  critical: 'critical',
  alert: 'alert',
  emergency: 'emergency',
  all: 'all',
} as const

export type EmqxLogFileHandlerRotationSize = string | 'infinity'

export interface EmqxLogFileHandler {
  path?: string
  rotation_count?: number
  rotation_size?: EmqxLogFileHandlerRotationSize
  level?: EmqxLogFileHandlerLevel
  enable?: boolean
  formatter?: EmqxLogFileHandlerFormatter
  timestamp_format?: EmqxLogFileHandlerTimestampFormat
  time_offset?: string
}

export type EmqxLogFileOneOf = {
  $handler_name?: EmqxLogFileHandler
}

export type EmqxLogFile = EmqxLogFileOneOf | EmqxLogFileHandler

export interface EmqxLog {
  console?: EmqxConsoleHandler
  file?: EmqxLogFile
  throttling?: EmqxLogThrottling
}

export interface EmqxForceShutdown {
  enable?: boolean
  max_mailbox_size?: number
  max_heap_size?: string
}

export interface EmqxForceGc {
  enable?: boolean
  count?: number
  bytes?: string
}

export interface EmqxFlappingDetect {
  enable?: boolean
  window_time?: string
  max_count?: number
  ban_time?: string
}

export interface EmqxEventNames {
  client_connected?: boolean
  client_disconnected?: boolean
  client_subscribed?: boolean
  client_unsubscribed?: boolean
}

export interface EmqxDurableSessions {
  enable?: boolean
  batch_size?: number
  idle_poll_interval?: string
  heartbeat_interval?: string
  session_gc_interval?: string
  session_gc_batch_size?: number
  message_retention_period?: string
}

export type EmqxConsoleHandlerTimestampFormat =
  typeof EmqxConsoleHandlerTimestampFormat[keyof typeof EmqxConsoleHandlerTimestampFormat]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxConsoleHandlerTimestampFormat = {
  auto: 'auto',
  epoch: 'epoch',
  rfc3339: 'rfc3339',
} as const

export type EmqxConsoleHandlerFormatter =
  typeof EmqxConsoleHandlerFormatter[keyof typeof EmqxConsoleHandlerFormatter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxConsoleHandlerFormatter = {
  text: 'text',
  json: 'json',
} as const

export type EmqxConsoleHandlerLevel =
  typeof EmqxConsoleHandlerLevel[keyof typeof EmqxConsoleHandlerLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxConsoleHandlerLevel = {
  debug: 'debug',
  info: 'info',
  notice: 'notice',
  warning: 'warning',
  error: 'error',
  critical: 'critical',
  alert: 'alert',
  emergency: 'emergency',
  all: 'all',
} as const

export interface EmqxConsoleHandler {
  level?: EmqxConsoleHandlerLevel
  enable?: boolean
  formatter?: EmqxConsoleHandlerFormatter
  timestamp_format?: EmqxConsoleHandlerTimestampFormat
  time_offset?: string
}

export interface EmqxClientAttrsInit {
  expression?: string
  set_as_attr?: string
}

export interface EmqxBroker {
  enable_session_registry?: boolean
  session_history_retain?: string
}

export type EmqxAlarmActionsItem = typeof EmqxAlarmActionsItem[keyof typeof EmqxAlarmActionsItem]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAlarmActionsItem = {
  log: 'log',
  publish: 'publish',
} as const

export interface EmqxAlarm {
  actions?: EmqxAlarmActionsItem[]
  size_limit?: number
  validity_period?: string
}

export type DashboardSslOptionsLogLevel =
  typeof DashboardSslOptionsLogLevel[keyof typeof DashboardSslOptionsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSslOptionsLogLevel = {
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

export type DashboardSslOptionsVerify =
  typeof DashboardSslOptionsVerify[keyof typeof DashboardSslOptionsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSslOptionsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface DashboardSslOptions {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: DashboardSslOptionsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: DashboardSslOptionsLogLevel
  hibernate_after?: string
  dhfile?: string
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
}

export interface DashboardHttps {
  bind?: string
  ssl_options: DashboardSslOptions
  num_acceptors?: number
  max_connections?: number
  backlog?: number
  send_timeout?: string
  inet6?: boolean
  ipv6_v6only?: boolean
  proxy_header?: boolean
}

export interface DashboardHttp {
  bind?: string
  num_acceptors?: number
  max_connections?: number
  backlog?: number
  send_timeout?: string
  inet6?: boolean
  ipv6_v6only?: boolean
  proxy_header?: boolean
}

export interface DashboardListeners {
  http?: DashboardHttp
  https?: DashboardHttps
}

export interface DashboardDashboard {
  listeners?: DashboardListeners
  token_expired_time?: string
  cors?: boolean
  swagger_support?: boolean
}
