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
  bridges: 'bridges',
  cluster: 'cluster',
  conn_congestion: 'conn_congestion',
  connectors: 'connectors',
  crl_cache: 'crl_cache',
  dashboard: 'dashboard',
  delayed: 'delayed',
  exhook: 'exhook',
  file_transfer: 'file_transfer',
  flapping_detect: 'flapping_detect',
  force_gc: 'force_gc',
  force_shutdown: 'force_shutdown',
  gateway: 'gateway',
  license: 'license',
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
  schema_registry: 'schema_registry',
  slow_subs: 'slow_subs',
  sys_topics: 'sys_topics',
  sysmon: 'sysmon',
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

export type PutConfigsFileTransfer403Code =
  typeof PutConfigsFileTransfer403Code[keyof typeof PutConfigsFileTransfer403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsFileTransfer403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsFileTransfer403 = {
  code?: PutConfigsFileTransfer403Code
  message?: string
}

export type PutConfigsFileTransfer400Code =
  typeof PutConfigsFileTransfer400Code[keyof typeof PutConfigsFileTransfer400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsFileTransfer400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsFileTransfer400 = {
  code?: PutConfigsFileTransfer400Code
  message?: string
}

export type GetConfigsFileTransfer404Code =
  typeof GetConfigsFileTransfer404Code[keyof typeof GetConfigsFileTransfer404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsFileTransfer404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsFileTransfer404 = {
  code?: GetConfigsFileTransfer404Code
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
  mqtt?: BrokerMqtt
  flapping_detect?: BrokerFlappingDetect
  force_shutdown?: BrokerForceShutdown
  force_gc?: BrokerForceGc
}

export type PutConfigsGlobalZoneBody = {
  mqtt?: BrokerMqtt
  flapping_detect?: BrokerFlappingDetect
  force_shutdown?: BrokerForceShutdown
  force_gc?: BrokerForceGc
}

export type GetConfigsGlobalZone200 = {
  mqtt?: BrokerMqtt
  flapping_detect?: BrokerFlappingDetect
  force_shutdown?: BrokerForceShutdown
  force_gc?: BrokerForceGc
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

export type SsoLdapBackend = typeof SsoLdapBackend[keyof typeof SsoLdapBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoLdapBackend = {
  ldap: 'ldap',
} as const

export interface SsoLdap {
  enable?: boolean
  backend: SsoLdapBackend
  query_timeout?: string
  server: string
  pool_size?: number
  username: string
  password?: string
  base_dn: string
  filter?: string
  request_timeout?: string
  ssl?: LdapSsl
}

export type S3TransportOptionsHeaders = { [key: string]: any }

export type S3TransportOptionsPoolType =
  typeof S3TransportOptionsPoolType[keyof typeof S3TransportOptionsPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const S3TransportOptionsPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export interface S3TransportOptions {
  ipv6_probe?: boolean
  connect_timeout?: string
  pool_type?: S3TransportOptionsPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: BrokerSslClientOpts
  headers?: S3TransportOptionsHeaders
  max_retries?: number
  request_timeout?: string
}

export type LdapSslServerNameIndication = string | 'disable'

export type LdapSslLogLevel = typeof LdapSslLogLevel[keyof typeof LdapSslLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslLogLevel = {
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

export type LdapSslVerify = typeof LdapSslVerify[keyof typeof LdapSslVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface LdapSsl {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: LdapSslVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: LdapSslLogLevel
  hibernate_after?: string
  enable?: boolean
  server_name_indication?: LdapSslServerNameIndication
}

export interface FileTransferStorageBackend {
  local?: FileTransferLocalStorage
}

export type FileTransferS3ExporterAcl =
  typeof FileTransferS3ExporterAcl[keyof typeof FileTransferS3ExporterAcl]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const FileTransferS3ExporterAcl = {
  private: 'private',
  public_read: 'public_read',
  public_read_write: 'public_read_write',
  authenticated_read: 'authenticated_read',
  bucket_owner_read: 'bucket_owner_read',
  bucket_owner_full_control: 'bucket_owner_full_control',
} as const

export interface FileTransferS3Exporter {
  access_key_id?: string
  secret_access_key?: string
  bucket: string
  host: string
  port: number
  url_expire_time?: string
  min_part_size: string
  max_part_size: string
  acl?: FileTransferS3ExporterAcl
  transport_options?: S3TransportOptions
  enable?: boolean
}

export interface FileTransferLocalStorageSegmentsGc {
  interval?: string
  maximum_segments_ttl?: string
  minimum_segments_ttl?: string
}

export interface FileTransferLocalStorageSegments {
  root?: string
  gc?: FileTransferLocalStorageSegmentsGc
}

export interface FileTransferLocalStorageExporter {
  root?: string
  enable?: boolean
}

export interface FileTransferLocalStorageExporterBackend {
  local?: FileTransferLocalStorageExporter
  s3?: FileTransferS3Exporter
}

export interface FileTransferLocalStorage {
  segments?: FileTransferLocalStorageSegments
  exporter?: FileTransferLocalStorageExporterBackend
  enable?: boolean
}

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
  time_offset?: string
}

export type EmqxLogAuditHandlerRotationSize = string | 'infinity'

export interface EmqxLogAuditHandler {
  path?: string
  rotation_count?: number
  rotation_size?: EmqxLogAuditHandlerRotationSize
  max_filter_size?: number
  ignore_high_frequency_request?: boolean
  enable?: boolean
  time_offset?: string
}

export type EmqxLogFileOneOf = {
  $handler_name?: EmqxLogFileHandler
}

export type EmqxLogFile = EmqxLogFileOneOf | EmqxLogFileHandler

export interface EmqxLog {
  console?: EmqxConsoleHandler
  file?: EmqxLogFile
  audit?: EmqxLogAuditHandler
}

export interface EmqxFileTransfer {
  enable?: boolean
  init_timeout?: string
  store_segment_timeout?: string
  assemble_timeout?: string
  storage?: FileTransferStorageBackend
}

export type EmqxConsoleHandlerFormatter =
  typeof EmqxConsoleHandlerFormatter[keyof typeof EmqxConsoleHandlerFormatter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDashboardSsoSamlSamlBackend = {
  saml: 'saml',
} as const

export interface EmqxDashboardSsoSamlSaml {
  enable?: boolean
  backend: EmqxDashboardSsoSamlSamlBackend
  dashboard_addr?: string
  idp_metadata_url?: string
  sp_sign_request?: boolean
  sp_public_key?: string
  sp_private_key?: string
}

export type EmqxConfSchemaLogFileHandlerFormatter =
  typeof EmqxConfSchemaLogFileHandlerFormatter[keyof typeof EmqxConfSchemaLogFileHandlerFormatter]

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
  time_offset?: string
}

export type EmqxConfSchemaConsoleHandlerFormatter =
  typeof EmqxConfSchemaConsoleHandlerFormatter[keyof typeof EmqxConfSchemaConsoleHandlerFormatter]

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
  time_offset?: string
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

export type DashboardSamlBackend = typeof DashboardSamlBackend[keyof typeof DashboardSamlBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSamlBackend = {
  saml: 'saml',
} as const

export interface DashboardSaml {
  enable?: boolean
  backend: DashboardSamlBackend
  dashboard_addr?: string
  idp_metadata_url?: string
  sp_sign_request?: boolean
  sp_public_key?: string
  sp_private_key?: string
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
  sso?: DashboardSso
}

export type BrokerSysmonVmLargeHeap = string | 'disabled'

export type BrokerSysmonVmLongSchedule = string | 'disabled'

export type BrokerSysmonVmLongGc = string | 'disabled'

export interface BrokerSysmonVm {
  process_check_interval?: string
  process_high_watermark?: string
  process_low_watermark?: string
  long_gc?: BrokerSysmonVmLongGc
  long_schedule?: BrokerSysmonVmLongSchedule
  large_heap?: BrokerSysmonVmLargeHeap
  busy_dist_port?: boolean
  busy_port?: boolean
}

export type BrokerSysmonOsMemCheckInterval = string | 'disabled'

export interface BrokerSysmonOs {
  cpu_check_interval?: string
  cpu_high_watermark?: string
  cpu_low_watermark?: string
  mem_check_interval?: BrokerSysmonOsMemCheckInterval
  sysmem_high_watermark?: string
  procmem_high_watermark?: string
}

export interface BrokerSysmon {
  vm?: BrokerSysmonVm
  os?: BrokerSysmonOs
}

export type BrokerSysTopicsSysHeartbeatInterval = string | 'disabled'

export type BrokerSysTopicsSysMsgInterval = string | 'disabled'

export interface BrokerSysTopics {
  sys_msg_interval?: BrokerSysTopicsSysMsgInterval
  sys_heartbeat_interval?: BrokerSysTopicsSysHeartbeatInterval
  sys_event_messages?: BrokerEventNames
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

export type BrokerMqttMaxSubscriptions = 'infinity' | number

export type BrokerMqttMaxMqueueLen = 'infinity' | number

export type BrokerMqttMqueueDefaultPriority =
  typeof BrokerMqttMqueueDefaultPriority[keyof typeof BrokerMqttMqueueDefaultPriority]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerMqttMqueueDefaultPriority = {
  highest: 'highest',
  lowest: 'lowest',
} as const

export type BrokerMqttMqueuePrioritiesOneOf = { [key: string]: any }

export type BrokerMqttMqueuePriorities = BrokerMqttMqueuePrioritiesOneOf | 'disabled'

export type BrokerMqttMaxAwaitingRel = 'infinity' | number

export type BrokerMqttPeerCertAsClientid =
  typeof BrokerMqttPeerCertAsClientid[keyof typeof BrokerMqttPeerCertAsClientid]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerMqttPeerCertAsClientid = {
  disabled: 'disabled',
  cn: 'cn',
  dn: 'dn',
  crt: 'crt',
  pem: 'pem',
  md5: 'md5',
} as const

export type BrokerMqttPeerCertAsUsername =
  typeof BrokerMqttPeerCertAsUsername[keyof typeof BrokerMqttPeerCertAsUsername]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerMqttPeerCertAsUsername = {
  disabled: 'disabled',
  cn: 'cn',
  dn: 'dn',
  crt: 'crt',
  pem: 'pem',
  md5: 'md5',
} as const

export type BrokerMqttServerKeepalive = 'disabled' | number

export type BrokerMqttSharedSubscriptionStrategy =
  typeof BrokerMqttSharedSubscriptionStrategy[keyof typeof BrokerMqttSharedSubscriptionStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerMqttSharedSubscriptionStrategy = {
  random: 'random',
  round_robin: 'round_robin',
  round_robin_per_group: 'round_robin_per_group',
  sticky: 'sticky',
  local: 'local',
  hash_topic: 'hash_topic',
  hash_clientid: 'hash_clientid',
} as const

export type BrokerMqttIdleTimeout = string | 'infinity'

export interface BrokerMqtt {
  idle_timeout?: BrokerMqttIdleTimeout
  max_packet_size?: string
  max_clientid_len?: number
  max_topic_levels?: number
  max_topic_alias?: number
  retain_available?: boolean
  wildcard_subscription?: boolean
  shared_subscription?: boolean
  shared_subscription_strategy?: BrokerMqttSharedSubscriptionStrategy
  exclusive_subscription?: boolean
  ignore_loop_deliver?: boolean
  strict_mode?: boolean
  response_information?: string
  server_keepalive?: BrokerMqttServerKeepalive
  keepalive_multiplier?: number
  retry_interval?: string
  use_username_as_clientid?: boolean
  peer_cert_as_username?: BrokerMqttPeerCertAsUsername
  peer_cert_as_clientid?: BrokerMqttPeerCertAsClientid
  session_expiry_interval?: string
  max_awaiting_rel?: BrokerMqttMaxAwaitingRel
  max_qos_allowed?: number
  mqueue_priorities?: BrokerMqttMqueuePriorities
  mqueue_default_priority?: BrokerMqttMqueueDefaultPriority
  mqueue_store_qos0?: boolean
  max_mqueue_len?: BrokerMqttMaxMqueueLen
  max_inflight?: number
  max_subscriptions?: BrokerMqttMaxSubscriptions
  upgrade_qos?: boolean
  await_rel_timeout?: string
}

export interface BrokerForceShutdown {
  enable?: boolean
  max_mailbox_size?: number
  max_heap_size?: string
}

export interface BrokerForceGc {
  enable?: boolean
  count?: number
  bytes?: string
}

export interface BrokerFlappingDetect {
  enable?: boolean
  window_time?: string
  max_count?: number
  ban_time?: string
}

export interface BrokerEventNames {
  client_connected?: boolean
  client_disconnected?: boolean
  client_subscribed?: boolean
  client_unsubscribed?: boolean
}

export interface BrokerAlarm {
  actions?: string[]
  size_limit?: number
  validity_period?: string
}
