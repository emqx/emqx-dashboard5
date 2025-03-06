export type PutConfigsSysmon403Code =
  (typeof PutConfigsSysmon403Code)[keyof typeof PutConfigsSysmon403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsSysmon403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsSysmon403 = {
  code?: PutConfigsSysmon403Code
  message?: string
}

export type PutConfigsSysmon400Code =
  (typeof PutConfigsSysmon400Code)[keyof typeof PutConfigsSysmon400Code]

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
  (typeof GetConfigsSysmon404Code)[keyof typeof GetConfigsSysmon404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsSysmon404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsSysmon404 = {
  code?: GetConfigsSysmon404Code
  message?: string
}

export type PutConfigsSysTopics403Code =
  (typeof PutConfigsSysTopics403Code)[keyof typeof PutConfigsSysTopics403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsSysTopics403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsSysTopics403 = {
  code?: PutConfigsSysTopics403Code
  message?: string
}

export type PutConfigsSysTopics400Code =
  (typeof PutConfigsSysTopics400Code)[keyof typeof PutConfigsSysTopics400Code]

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
  (typeof GetConfigsSysTopics404Code)[keyof typeof GetConfigsSysTopics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsSysTopics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsSysTopics404 = {
  code?: GetConfigsSysTopics404Code
  message?: string
}

export type PutConfigsLog403Code = (typeof PutConfigsLog403Code)[keyof typeof PutConfigsLog403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsLog403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsLog403 = {
  code?: PutConfigsLog403Code
  message?: string
}

export type PutConfigsLog400Code = (typeof PutConfigsLog400Code)[keyof typeof PutConfigsLog400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsLog400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutConfigsLog400 = {
  code?: PutConfigsLog400Code
  message?: string
}

export type GetConfigsLog404Code = (typeof GetConfigsLog404Code)[keyof typeof GetConfigsLog404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsLog404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsLog404 = {
  code?: GetConfigsLog404Code
  message?: string
}

export type PutConfigsGlobalZone403Code =
  (typeof PutConfigsGlobalZone403Code)[keyof typeof PutConfigsGlobalZone403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsGlobalZone403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsGlobalZone403 = {
  code?: PutConfigsGlobalZone403Code
  message?: string
}

export type PutConfigsGlobalZone400Code =
  (typeof PutConfigsGlobalZone400Code)[keyof typeof PutConfigsGlobalZone400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsGlobalZone400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsGlobalZone400 = {
  code?: PutConfigsGlobalZone400Code
  message?: string
}

export type PutConfigsGlobalZone200 = {
  durable_sessions?: EmqxDurableSessions
  flapping_detect?: EmqxFlappingDetect
  force_gc?: EmqxForceGc
  force_shutdown?: EmqxForceShutdown
  mqtt?: EmqxMqtt
}

export type PutConfigsGlobalZoneBody = {
  durable_sessions?: EmqxDurableSessions
  flapping_detect?: EmqxFlappingDetect
  force_gc?: EmqxForceGc
  force_shutdown?: EmqxForceShutdown
  mqtt?: EmqxMqtt
}

export type GetConfigsGlobalZone200 = {
  durable_sessions?: EmqxDurableSessions
  flapping_detect?: EmqxFlappingDetect
  force_gc?: EmqxForceGc
  force_shutdown?: EmqxForceShutdown
  mqtt?: EmqxMqtt
}

export type PutConfigsFileTransfer403Code =
  (typeof PutConfigsFileTransfer403Code)[keyof typeof PutConfigsFileTransfer403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsFileTransfer403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsFileTransfer403 = {
  code?: PutConfigsFileTransfer403Code
  message?: string
}

export type PutConfigsFileTransfer400Code =
  (typeof PutConfigsFileTransfer400Code)[keyof typeof PutConfigsFileTransfer400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsFileTransfer400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutConfigsFileTransfer400 = {
  code?: PutConfigsFileTransfer400Code
  message?: string
}

export type GetConfigsFileTransfer404Code =
  (typeof GetConfigsFileTransfer404Code)[keyof typeof GetConfigsFileTransfer404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsFileTransfer404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsFileTransfer404 = {
  code?: GetConfigsFileTransfer404Code
  message?: string
}

export type PutConfigsDashboard403Code =
  (typeof PutConfigsDashboard403Code)[keyof typeof PutConfigsDashboard403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsDashboard403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsDashboard403 = {
  code?: PutConfigsDashboard403Code
  message?: string
}

export type PutConfigsDashboard400Code =
  (typeof PutConfigsDashboard400Code)[keyof typeof PutConfigsDashboard400Code]

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
  (typeof GetConfigsDashboard404Code)[keyof typeof GetConfigsDashboard404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsDashboard404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsDashboard404 = {
  code?: GetConfigsDashboard404Code
  message?: string
}

export type PutConfigsBroker403Code =
  (typeof PutConfigsBroker403Code)[keyof typeof PutConfigsBroker403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsBroker403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsBroker403 = {
  code?: PutConfigsBroker403Code
  message?: string
}

export type PutConfigsBroker400Code =
  (typeof PutConfigsBroker400Code)[keyof typeof PutConfigsBroker400Code]

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
  (typeof GetConfigsBroker404Code)[keyof typeof GetConfigsBroker404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsBroker404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsBroker404 = {
  code?: GetConfigsBroker404Code
  message?: string
}

export type PutConfigsAlarm403Code =
  (typeof PutConfigsAlarm403Code)[keyof typeof PutConfigsAlarm403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsAlarm403Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigsAlarm403 = {
  code?: PutConfigsAlarm403Code
  message?: string
}

export type PutConfigsAlarm400Code =
  (typeof PutConfigsAlarm400Code)[keyof typeof PutConfigsAlarm400Code]

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
  (typeof GetConfigsAlarm404Code)[keyof typeof GetConfigsAlarm404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsAlarm404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigsAlarm404 = {
  code?: GetConfigsAlarm404Code
  message?: string
}

export type PostConfigsResetRootname403Code =
  (typeof PostConfigsResetRootname403Code)[keyof typeof PostConfigsResetRootname403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostConfigsResetRootname403Code = {
  REST_FAILED: 'REST_FAILED',
} as const

export type PostConfigsResetRootname403 = {
  code?: PostConfigsResetRootname403Code
  message?: string
}

export type PostConfigsResetRootname400Code =
  (typeof PostConfigsResetRootname400Code)[keyof typeof PostConfigsResetRootname400Code]

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

export type PutConfigs400Code = (typeof PutConfigs400Code)[keyof typeof PutConfigs400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigs400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutConfigs400 = {
  code?: PutConfigs400Code
  message?: string
}

export type PutConfigsMode = (typeof PutConfigsMode)[keyof typeof PutConfigsMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutConfigsMode = {
  merge: 'merge',
  replace: 'replace',
} as const

export type PutConfigsParams = {
  mode?: PutConfigsMode
  ignore_readonly?: boolean
}

export type GetConfigs500Code = (typeof GetConfigs500Code)[keyof typeof GetConfigs500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigs500Code = {
  BAD_NODE: 'BAD_NODE',
} as const

export type GetConfigs500 = {
  code?: GetConfigs500Code
  message?: string
}

export type GetConfigs404Code = (typeof GetConfigs404Code)[keyof typeof GetConfigs404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigs404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetConfigs404 = {
  code?: GetConfigs404Code
  message?: string
}

export type GetConfigs400Code = (typeof GetConfigs400Code)[keyof typeof GetConfigs400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigs400Code = {
  INVALID_ACCEPT: 'INVALID_ACCEPT',
} as const

export type GetConfigs400 = {
  code?: GetConfigs400Code
  message?: string
}

export type GetConfigs200Two = { [key: string]: unknown }

export type GetConfigsKey = (typeof GetConfigsKey)[keyof typeof GetConfigsKey]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetConfigsKey = {
  actions: 'actions',
  alarm: 'alarm',
  api_key: 'api_key',
  authentication: 'authentication',
  authentication_settings: 'authentication_settings',
  authorization: 'authorization',
  auto_subscribe: 'auto_subscribe',
  banned: 'banned',
  bridges: 'bridges',
  cluster: 'cluster',
  config_backup_interval: 'config_backup_interval',
  conn_congestion: 'conn_congestion',
  connectors: 'connectors',
  crl_cache: 'crl_cache',
  dashboard: 'dashboard',
  delayed: 'delayed',
  durable_queues: 'durable_queues',
  durable_sessions: 'durable_sessions',
  durable_storage: 'durable_storage',
  exhook: 'exhook',
  file_transfer: 'file_transfer',
  flapping_detect: 'flapping_detect',
  force_gc: 'force_gc',
  force_shutdown: 'force_shutdown',
  gateway: 'gateway',
  license: 'license',
  listeners: 'listeners',
  log: 'log',
  message_transformation: 'message_transformation',
  mqtt: 'mqtt',
  multi_tenancy: 'multi_tenancy',
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
  schema_validation: 'schema_validation',
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

export type SsoOidcProvider = (typeof SsoOidcProvider)[keyof typeof SsoOidcProvider]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcProvider = {
  okta: 'okta',
  generic: 'generic',
} as const

export type SsoOidcPreferredAuthMethodsItem =
  (typeof SsoOidcPreferredAuthMethodsItem)[keyof typeof SsoOidcPreferredAuthMethodsItem]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcPreferredAuthMethodsItem = {
  private_key_jwt: 'private_key_jwt',
  client_secret_jwt: 'client_secret_jwt',
  client_secret_post: 'client_secret_post',
  client_secret_basic: 'client_secret_basic',
  none: 'none',
} as const

export type SsoOidcClientJwks = SsoClientFileJwks | 'none'

export type SsoOidcBackend = (typeof SsoOidcBackend)[keyof typeof SsoOidcBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcBackend = {
  oidc: 'oidc',
} as const

export interface SsoOidc {
  backend: SsoOidcBackend
  client_jwks?: SsoOidcClientJwks
  clientid: string
  dashboard_addr?: string
  enable?: boolean
  fallback_methods?: string[]
  issuer: string
  name_var?: string
  preferred_auth_methods?: SsoOidcPreferredAuthMethodsItem[]
  provider?: SsoOidcProvider
  require_pkce?: boolean
  scopes?: string[]
  secret: string
  session_expiry?: string
}

export type SsoLdapBackend = (typeof SsoLdapBackend)[keyof typeof SsoLdapBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoLdapBackend = {
  ldap: 'ldap',
} as const

export interface SsoLdap {
  backend: SsoLdapBackend
  base_dn: string
  enable?: boolean
  filter?: string
  password?: string
  /** @minimum 1 */
  pool_size?: number
  query_timeout?: string
  request_timeout?: string
  server: string
  ssl?: LdapSsl
  username: string
}

export type SsoClientFileJwksType =
  (typeof SsoClientFileJwksType)[keyof typeof SsoClientFileJwksType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoClientFileJwksType = {
  file: 'file',
} as const

export interface SsoClientFileJwks {
  file: string
  type: SsoClientFileJwksType
}

export type S3TransportOptionsHeaders = { [key: string]: unknown }

export interface S3TransportOptions {
  connect_timeout?: string
  /**
   * @deprecated
   * @minimum 1
   */
  enable_pipelining?: number
  headers?: S3TransportOptionsHeaders
  ipv6_probe?: boolean
  /** @minimum 0 */
  max_retries?: number
  /** @minimum 1 */
  pool_size?: number
  request_timeout?: string
  ssl?: EmqxSslClientOpts
}

export interface LimiterMqtt {
  bytes_burst?: string
  bytes_rate?: string
  max_conn_burst?: string
  max_conn_rate?: string
  messages_burst?: string
  messages_rate?: string
}

export type LdapSslVerify = (typeof LdapSslVerify)[keyof typeof LdapSslVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export type LdapSslServerNameIndication = string | 'disable'

export type LdapSslPartialChain = (typeof LdapSslPartialChain)[keyof typeof LdapSslPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslPartialChain = {
  true: true,
  false: false,
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type LdapSslLogLevel = (typeof LdapSslLogLevel)[keyof typeof LdapSslLogLevel]

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

export interface LdapSsl {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  /** @minimum 0 */
  depth?: number
  enable?: boolean
  hibernate_after?: string
  keyfile?: string
  log_level?: LdapSslLogLevel
  partial_chain?: LdapSslPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  server_name_indication?: LdapSslServerNameIndication
  verify?: LdapSslVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export interface FileTransferStorageBackend {
  local?: FileTransferLocalStorage
}

export type FileTransferS3ExporterAcl =
  (typeof FileTransferS3ExporterAcl)[keyof typeof FileTransferS3ExporterAcl]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const FileTransferS3ExporterAcl = {
  private: 'private',
  public_read: 'public_read',
  public_read_write: 'public_read_write',
  authenticated_read: 'authenticated_read',
  bucket_owner_read: 'bucket_owner_read',
  bucket_owner_full_control: 'bucket_owner_full_control',
} as const

export type FileTransferS3ExporterAccessMethod =
  (typeof FileTransferS3ExporterAccessMethod)[keyof typeof FileTransferS3ExporterAccessMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const FileTransferS3ExporterAccessMethod = {
  path: 'path',
  vhost: 'vhost',
} as const

export interface FileTransferS3Exporter {
  access_key_id?: string
  access_method?: FileTransferS3ExporterAccessMethod
  acl?: FileTransferS3ExporterAcl
  bucket: string
  enable?: boolean
  host: string
  max_part_size?: string
  min_part_size?: string
  /** @minimum 1 */
  port: number
  secret_access_key?: string
  transport_options?: S3TransportOptions
  url_expire_time?: string
}

export interface FileTransferLocalStorageSegmentsGc {
  interval?: string
  maximum_segments_ttl?: string
  minimum_segments_ttl?: string
}

export interface FileTransferLocalStorageSegments {
  gc?: FileTransferLocalStorageSegmentsGc
  root?: string
}

export interface FileTransferLocalStorageExporter {
  enable?: boolean
  root?: string
}

export interface FileTransferLocalStorageExporterBackend {
  local?: FileTransferLocalStorageExporter
  s3?: FileTransferS3Exporter
}

export interface FileTransferLocalStorage {
  enable?: boolean
  exporter?: FileTransferLocalStorageExporterBackend
  segments?: FileTransferLocalStorageSegments
}

export type EmqxSysmonVmLongSchedule = string | 'disabled'

export type EmqxSysmonVmLongGc = string | 'disabled'

export type EmqxSysmonVmLargeHeap = string | 'disabled'

export interface EmqxSysmonVm {
  busy_dist_port?: boolean
  busy_port?: boolean
  large_heap?: EmqxSysmonVmLargeHeap
  long_gc?: EmqxSysmonVmLongGc
  long_schedule?: EmqxSysmonVmLongSchedule
  process_check_interval?: string
  process_high_watermark?: string
  process_low_watermark?: string
}

export type EmqxSysmonOsMemCheckInterval = string | 'disabled'

export interface EmqxSysmonOs {
  cpu_check_interval?: string
  cpu_high_watermark?: string
  cpu_low_watermark?: string
  mem_check_interval?: EmqxSysmonOsMemCheckInterval
  procmem_high_watermark?: string
  sysmem_high_watermark?: string
}

export interface EmqxSysmon {
  /** @minimum 1 */
  broker_pool_mailbox_size_alarm_threshold?: number
  /** @minimum 1 */
  mnesia_tm_mailbox_size_alarm_threshold?: number
  os?: EmqxSysmonOs
  vm?: EmqxSysmonVm
}

export type EmqxSysTopicsSysMsgInterval = string | 'disabled'

export type EmqxSysTopicsSysHeartbeatInterval = string | 'disabled'

export interface EmqxSysTopics {
  sys_event_messages?: EmqxEventNames
  sys_heartbeat_interval?: EmqxSysTopicsSysHeartbeatInterval
  sys_msg_interval?: EmqxSysTopicsSysMsgInterval
}

export type EmqxSslClientOptsVerify =
  (typeof EmqxSslClientOptsVerify)[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

export type EmqxSslClientOptsPartialChain =
  (typeof EmqxSslClientOptsPartialChain)[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  true: true,
  false: false,
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxSslClientOptsLogLevel =
  (typeof EmqxSslClientOptsLogLevel)[keyof typeof EmqxSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsLogLevel = {
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

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  /** @minimum 0 */
  depth?: number
  enable?: boolean
  hibernate_after?: string
  keyfile?: string
  log_level?: EmqxSslClientOptsLogLevel
  partial_chain?: EmqxSslClientOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
  verify?: EmqxSslClientOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export type EmqxMqttSharedSubscriptionStrategy =
  (typeof EmqxMqttSharedSubscriptionStrategy)[keyof typeof EmqxMqttSharedSubscriptionStrategy]

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

export type EmqxMqttSharedSubscriptionInitialStickyPick =
  (typeof EmqxMqttSharedSubscriptionInitialStickyPick)[keyof typeof EmqxMqttSharedSubscriptionInitialStickyPick]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMqttSharedSubscriptionInitialStickyPick = {
  random: 'random',
  local: 'local',
  hash_topic: 'hash_topic',
  hash_clientid: 'hash_clientid',
} as const

export type EmqxMqttServerKeepalive = 'disabled' | number

export type EmqxMqttRetryInterval = string | 'infinity'

export type EmqxMqttPeerCertAsUsername =
  (typeof EmqxMqttPeerCertAsUsername)[keyof typeof EmqxMqttPeerCertAsUsername]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMqttPeerCertAsUsername = {
  disabled: 'disabled',
  cn: 'cn',
  dn: 'dn',
  crt: 'crt',
  pem: 'pem',
  md5: 'md5',
} as const

export type EmqxMqttPeerCertAsClientid =
  (typeof EmqxMqttPeerCertAsClientid)[keyof typeof EmqxMqttPeerCertAsClientid]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMqttPeerCertAsClientid = {
  disabled: 'disabled',
  cn: 'cn',
  dn: 'dn',
  crt: 'crt',
  pem: 'pem',
  md5: 'md5',
} as const

export type EmqxMqttMqueuePrioritiesOneOf = { [key: string]: unknown }

export type EmqxMqttMqueuePriorities = EmqxMqttMqueuePrioritiesOneOf | 'disabled'

export type EmqxMqttMqueueDefaultPriority =
  (typeof EmqxMqttMqueueDefaultPriority)[keyof typeof EmqxMqttMqueueDefaultPriority]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMqttMqueueDefaultPriority = {
  highest: 'highest',
  lowest: 'lowest',
} as const

export type EmqxMqttMessageExpiryInterval = 'infinity' | string

export type EmqxMqttMaxSubscriptions = 'infinity' | number

export type EmqxMqttMaxMqueueLen = 'infinity' | number

export type EmqxMqttMaxAwaitingRel = 'infinity' | number

export type EmqxMqttIdleTimeout = string | 'infinity'

export type EmqxMqttClientidOverride = string | 'disabled'

export interface EmqxMqtt {
  await_rel_timeout?: string
  client_attrs_init?: EmqxClientAttrsInit[]
  clientid_override?: EmqxMqttClientidOverride
  exclusive_subscription?: boolean
  idle_timeout?: EmqxMqttIdleTimeout
  ignore_loop_deliver?: boolean
  keepalive_check_interval?: string
  keepalive_multiplier?: number
  limiter?: LimiterMqtt
  max_awaiting_rel?: EmqxMqttMaxAwaitingRel
  /**
   * @minimum 23
   * @maximum 65535
   */
  max_clientid_len?: number
  /**
   * @minimum 1
   * @maximum 65535
   */
  max_inflight?: number
  max_mqueue_len?: EmqxMqttMaxMqueueLen
  max_packet_size?: string
  /**
   * @minimum 0
   * @maximum 2
   */
  max_qos_allowed?: number
  max_subscriptions?: EmqxMqttMaxSubscriptions
  /**
   * @minimum 0
   * @maximum 65535
   */
  max_topic_alias?: number
  /**
   * @minimum 1
   * @maximum 65535
   */
  max_topic_levels?: number
  message_expiry_interval?: EmqxMqttMessageExpiryInterval
  mqueue_default_priority?: EmqxMqttMqueueDefaultPriority
  mqueue_priorities?: EmqxMqttMqueuePriorities
  mqueue_store_qos0?: boolean
  peer_cert_as_clientid?: EmqxMqttPeerCertAsClientid
  peer_cert_as_username?: EmqxMqttPeerCertAsUsername
  response_information?: string
  retain_available?: boolean
  retry_interval?: EmqxMqttRetryInterval
  server_keepalive?: EmqxMqttServerKeepalive
  session_expiry_interval?: string
  shared_subscription?: boolean
  shared_subscription_initial_sticky_pick?: EmqxMqttSharedSubscriptionInitialStickyPick
  shared_subscription_strategy?: EmqxMqttSharedSubscriptionStrategy
  strict_mode?: boolean
  upgrade_qos?: boolean
  use_username_as_clientid?: boolean
  wildcard_subscription?: boolean
}

export interface EmqxLogThrottling {
  time_window?: string
}

export type EmqxLogFileHandlerTimestampFormat =
  (typeof EmqxLogFileHandlerTimestampFormat)[keyof typeof EmqxLogFileHandlerTimestampFormat]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLogFileHandlerTimestampFormat = {
  auto: 'auto',
  epoch: 'epoch',
  rfc3339: 'rfc3339',
} as const

export type EmqxLogFileHandlerRotationSize = string | 'infinity'

export type EmqxLogFileHandlerPayloadEncode =
  (typeof EmqxLogFileHandlerPayloadEncode)[keyof typeof EmqxLogFileHandlerPayloadEncode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLogFileHandlerPayloadEncode = {
  hex: 'hex',
  text: 'text',
  hidden: 'hidden',
} as const

export type EmqxLogFileHandlerLevel =
  (typeof EmqxLogFileHandlerLevel)[keyof typeof EmqxLogFileHandlerLevel]

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

export type EmqxLogFileHandlerFormatter =
  (typeof EmqxLogFileHandlerFormatter)[keyof typeof EmqxLogFileHandlerFormatter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLogFileHandlerFormatter = {
  text: 'text',
  json: 'json',
} as const

export interface EmqxLogFileHandler {
  enable?: boolean
  formatter?: EmqxLogFileHandlerFormatter
  level?: EmqxLogFileHandlerLevel
  path?: string
  payload_encode?: EmqxLogFileHandlerPayloadEncode
  /**
   * @minimum 1
   * @maximum 128
   */
  rotation_count?: number
  rotation_size?: EmqxLogFileHandlerRotationSize
  time_offset?: string
  timestamp_format?: EmqxLogFileHandlerTimestampFormat
}

export type EmqxLogAuditHandlerTimestampFormat =
  (typeof EmqxLogAuditHandlerTimestampFormat)[keyof typeof EmqxLogAuditHandlerTimestampFormat]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLogAuditHandlerTimestampFormat = {
  auto: 'auto',
  epoch: 'epoch',
  rfc3339: 'rfc3339',
} as const

export type EmqxLogAuditHandlerRotationSize = string | 'infinity'

export type EmqxLogAuditHandlerPayloadEncode =
  (typeof EmqxLogAuditHandlerPayloadEncode)[keyof typeof EmqxLogAuditHandlerPayloadEncode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLogAuditHandlerPayloadEncode = {
  hex: 'hex',
  text: 'text',
  hidden: 'hidden',
} as const

export interface EmqxLogAuditHandler {
  enable?: boolean
  ignore_high_frequency_request?: boolean
  /**
   * @minimum 10
   * @maximum 30000
   */
  max_filter_size?: number
  path?: string
  payload_encode?: EmqxLogAuditHandlerPayloadEncode
  /**
   * @minimum 1
   * @maximum 128
   */
  rotation_count?: number
  rotation_size?: EmqxLogAuditHandlerRotationSize
  time_offset?: string
  timestamp_format?: EmqxLogAuditHandlerTimestampFormat
}

export type EmqxLogFileOneOf = {
  $handler_name?: EmqxLogFileHandler
}

export type EmqxLogFile = EmqxLogFileOneOf | EmqxLogFileHandler

export interface EmqxLog {
  audit?: EmqxLogAuditHandler
  console?: EmqxConsoleHandler
  file?: EmqxLogFile
  throttling?: EmqxLogThrottling
}

export interface EmqxForceShutdown {
  enable?: boolean
  max_heap_size?: string
  /** @minimum 0 */
  max_mailbox_size?: number
}

export interface EmqxForceGc {
  bytes?: string
  /** @minimum 0 */
  count?: number
  enable?: boolean
}

export interface EmqxFlappingDetect {
  ban_time?: string
  enable?: boolean
  /** @minimum 0 */
  max_count?: number
  window_time?: string
}

export interface EmqxFileTransfer {
  assemble_timeout?: string
  enable?: boolean
  init_timeout?: string
  storage?: FileTransferStorageBackend
  store_segment_timeout?: string
}

export interface EmqxEventNames {
  client_connected?: boolean
  client_disconnected?: boolean
  client_subscribed?: boolean
  client_unsubscribed?: boolean
}

export interface EmqxDurableSessions {
  /** @minimum 1 */
  batch_size?: number
  enable?: boolean
  heartbeat_interval?: string
  idle_poll_interval?: string
  message_retention_period?: string
  /** @minimum 1 */
  session_gc_batch_size?: number
  session_gc_interval?: string
}

export type EmqxConsoleHandlerTimestampFormat =
  (typeof EmqxConsoleHandlerTimestampFormat)[keyof typeof EmqxConsoleHandlerTimestampFormat]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxConsoleHandlerTimestampFormat = {
  auto: 'auto',
  epoch: 'epoch',
  rfc3339: 'rfc3339',
} as const

export type EmqxConsoleHandlerPayloadEncode =
  (typeof EmqxConsoleHandlerPayloadEncode)[keyof typeof EmqxConsoleHandlerPayloadEncode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxConsoleHandlerPayloadEncode = {
  hex: 'hex',
  text: 'text',
  hidden: 'hidden',
} as const

export type EmqxConsoleHandlerLevel =
  (typeof EmqxConsoleHandlerLevel)[keyof typeof EmqxConsoleHandlerLevel]

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

export type EmqxConsoleHandlerFormatter =
  (typeof EmqxConsoleHandlerFormatter)[keyof typeof EmqxConsoleHandlerFormatter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxConsoleHandlerFormatter = {
  text: 'text',
  json: 'json',
} as const

export interface EmqxConsoleHandler {
  enable?: boolean
  formatter?: EmqxConsoleHandlerFormatter
  level?: EmqxConsoleHandlerLevel
  payload_encode?: EmqxConsoleHandlerPayloadEncode
  time_offset?: string
  timestamp_format?: EmqxConsoleHandlerTimestampFormat
}

export interface EmqxClientAttrsInit {
  expression?: string
  set_as_attr?: string
}

export interface EmqxBroker {
  enable_session_registry?: boolean
  session_history_retain?: string
}

export type EmqxAlarmActionsItem = (typeof EmqxAlarmActionsItem)[keyof typeof EmqxAlarmActionsItem]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAlarmActionsItem = {
  log: 'log',
  publish: 'publish',
} as const

export interface EmqxAlarm {
  actions?: EmqxAlarmActionsItem[]
  /**
   * @minimum 1
   * @maximum 3000
   */
  size_limit?: number
  validity_period?: string
}

export interface DashboardSso {
  ldap?: SsoLdap
  oidc?: SsoOidc
  saml?: DashboardSaml
}

export type DashboardSslOptionsVerify =
  (typeof DashboardSslOptionsVerify)[keyof typeof DashboardSslOptionsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSslOptionsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export type DashboardSslOptionsPartialChain =
  (typeof DashboardSslOptionsPartialChain)[keyof typeof DashboardSslOptionsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSslOptionsPartialChain = {
  true: true,
  false: false,
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type DashboardSslOptionsLogLevel =
  (typeof DashboardSslOptionsLogLevel)[keyof typeof DashboardSslOptionsLogLevel]

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

export interface DashboardSslOptions {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  client_renegotiation?: boolean
  /** @minimum 0 */
  depth?: number
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  handshake_timeout?: string
  hibernate_after?: string
  honor_cipher_order?: boolean
  keyfile?: string
  log_level?: DashboardSslOptionsLogLevel
  partial_chain?: DashboardSslOptionsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  verify?: DashboardSslOptionsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export type DashboardSamlBackend = (typeof DashboardSamlBackend)[keyof typeof DashboardSamlBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSamlBackend = {
  saml: 'saml',
} as const

export interface DashboardSaml {
  backend: DashboardSamlBackend
  dashboard_addr?: string
  enable?: boolean
  idp_metadata_url?: string
  sp_private_key?: string
  sp_public_key?: string
  sp_sign_request?: boolean
}

export type DashboardMfaSettingsMechanism =
  (typeof DashboardMfaSettingsMechanism)[keyof typeof DashboardMfaSettingsMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardMfaSettingsMechanism = {
  totp: 'totp',
} as const

export interface DashboardMfaSettings {
  mechanism: DashboardMfaSettingsMechanism
}

export interface DashboardHttps {
  backlog?: number
  bind?: string
  inet6?: boolean
  ipv6_v6only?: boolean
  max_connections?: number
  num_acceptors?: number
  proxy_header?: boolean
  send_timeout?: string
  ssl_options: DashboardSslOptions
}

export interface DashboardHttp {
  backlog?: number
  bind?: string
  inet6?: boolean
  ipv6_v6only?: boolean
  max_connections?: number
  num_acceptors?: number
  proxy_header?: boolean
  send_timeout?: string
}

export interface DashboardListeners {
  http?: DashboardHttp
  https?: DashboardHttps
}

export type DashboardDashboardDefaultMfa = DashboardMfaSettings | 'none'

export interface DashboardDashboard {
  cors?: boolean
  default_mfa?: DashboardDashboardDefaultMfa
  readonly default_password: string
  listeners?: DashboardListeners
  password_expired_time?: string
  sso?: DashboardSso
  swagger_support?: boolean
  token_expired_time?: string
}
