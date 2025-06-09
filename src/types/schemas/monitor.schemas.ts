export type GetPrometheusStats200One = { [key: string]: unknown }

export type GetPrometheusSchemaValidation200One = { [key: string]: unknown }

export type GetPrometheusSchemaValidationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusMessageTransformation200One = { [key: string]: unknown }

export type GetPrometheusMessageTransformationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusDataIntegration200One = { [key: string]: unknown }

export type GetPrometheusDataIntegrationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusAuth200One = { [key: string]: unknown }

export type GetPrometheusAuthParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type PutPrometheusBody = PrometheusLegacyDeprecatedSetting | PrometheusRecommendSetting

export type PutOpentelemetry400Code =
  (typeof PutOpentelemetry400Code)[keyof typeof PutOpentelemetry400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutOpentelemetry400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutOpentelemetry400 = {
  code?: PutOpentelemetry400Code
  message?: string
}

export type EmqxPrometheusApiModeParameter =
  (typeof EmqxPrometheusApiModeParameter)[keyof typeof EmqxPrometheusApiModeParameter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxPrometheusApiModeParameter = {
  all_nodes_aggregated: 'all_nodes_aggregated',
  all_nodes_unaggregated: 'all_nodes_unaggregated',
  node: 'node',
} as const

export type GetPrometheusStatsParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type PrometheusPushGatewayMethod =
  (typeof PrometheusPushGatewayMethod)[keyof typeof PrometheusPushGatewayMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusPushGatewayMethod = {
  post: 'post',
  put: 'put',
} as const

export type PrometheusPushGatewayHeaders = { [key: string]: unknown }

export interface PrometheusPushGateway {
  enable: boolean
  headers?: PrometheusPushGatewayHeaders
  interval?: string
  job_name?: string
  method: PrometheusPushGatewayMethod
  url?: string
}

export interface PrometheusRecommendSetting {
  collectors?: PrometheusCollectors
  enable_basic_auth: boolean
  latency_buckets: string
  push_gateway?: PrometheusPushGateway
}

export type PrometheusLegacyDeprecatedSettingVmSystemInfoCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmSystemInfoCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmSystemInfoCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmSystemInfoCollector = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmStatisticsCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmStatisticsCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmStatisticsCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmStatisticsCollector = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmMsaccCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmMsaccCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmMsaccCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmMsaccCollector = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmMemoryCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmMemoryCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmMemoryCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmMemoryCollector = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmDistCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmDistCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmDistCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmDistCollector = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusLegacyDeprecatedSettingMnesiaCollector =
  (typeof PrometheusLegacyDeprecatedSettingMnesiaCollector)[keyof typeof PrometheusLegacyDeprecatedSettingMnesiaCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingMnesiaCollector = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusLegacyDeprecatedSettingHeaders = { [key: string]: unknown }

export interface PrometheusLegacyDeprecatedSetting {
  enable: boolean
  headers?: PrometheusLegacyDeprecatedSettingHeaders
  interval: string
  job_name: string
  mnesia_collector: PrometheusLegacyDeprecatedSettingMnesiaCollector
  push_gateway_server: string
  vm_dist_collector: PrometheusLegacyDeprecatedSettingVmDistCollector
  vm_memory_collector: PrometheusLegacyDeprecatedSettingVmMemoryCollector
  vm_msacc_collector: PrometheusLegacyDeprecatedSettingVmMsaccCollector
  vm_statistics_collector: PrometheusLegacyDeprecatedSettingVmStatisticsCollector
  vm_system_info_collector: PrometheusLegacyDeprecatedSettingVmSystemInfoCollector
}

export type PrometheusCollectorsVmSystemInfo =
  (typeof PrometheusCollectorsVmSystemInfo)[keyof typeof PrometheusCollectorsVmSystemInfo]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmSystemInfo = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusCollectorsVmStatistics =
  (typeof PrometheusCollectorsVmStatistics)[keyof typeof PrometheusCollectorsVmStatistics]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmStatistics = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusCollectorsVmMsacc =
  (typeof PrometheusCollectorsVmMsacc)[keyof typeof PrometheusCollectorsVmMsacc]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmMsacc = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusCollectorsVmMemory =
  (typeof PrometheusCollectorsVmMemory)[keyof typeof PrometheusCollectorsVmMemory]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmMemory = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusCollectorsVmDist =
  (typeof PrometheusCollectorsVmDist)[keyof typeof PrometheusCollectorsVmDist]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmDist = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusCollectorsMnesia =
  (typeof PrometheusCollectorsMnesia)[keyof typeof PrometheusCollectorsMnesia]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsMnesia = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export interface PrometheusCollectors {
  mnesia: PrometheusCollectorsMnesia
  vm_dist: PrometheusCollectorsVmDist
  vm_memory: PrometheusCollectorsVmMemory
  vm_msacc: PrometheusCollectorsVmMsacc
  vm_statistics: PrometheusCollectorsVmStatistics
  vm_system_info: PrometheusCollectorsVmSystemInfo
}

export type OpentelemetryTraceFilterTraceMode =
  (typeof OpentelemetryTraceFilterTraceMode)[keyof typeof OpentelemetryTraceFilterTraceMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OpentelemetryTraceFilterTraceMode = {
  e2e: 'e2e',
  legacy: 'legacy',
} as const

export interface OpentelemetryTraceFilter {
  e2e_tracing_options?: OpentelemetryE2eTracingOptions
  trace_all?: boolean
  trace_mode?: OpentelemetryTraceFilterTraceMode
}

export interface OpentelemetryOtelTraces {
  enable?: boolean
  filter?: OpentelemetryTraceFilter
  /** @minimum 1 */
  max_queue_size?: number
  scheduled_delay?: string
}

export interface OpentelemetryOtelMetrics {
  enable: boolean
  interval?: string
}

export type OpentelemetryOtelLogsLevel =
  (typeof OpentelemetryOtelLogsLevel)[keyof typeof OpentelemetryOtelLogsLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OpentelemetryOtelLogsLevel = {
  alert: 'alert',
  all: 'all',
  critical: 'critical',
  debug: 'debug',
  emergency: 'emergency',
  error: 'error',
  info: 'info',
  notice: 'notice',
  warning: 'warning',
} as const

export interface OpentelemetryOtelLogs {
  enable?: boolean
  level?: OpentelemetryOtelLogsLevel
  scheduled_delay?: string
}

export interface OpentelemetryOtelExporter {
  endpoint?: string
  ssl_options?: EmqxSslClientOpts
}

export interface OpentelemetryOpentelemetry {
  exporter?: OpentelemetryOtelExporter
  logs?: OpentelemetryOtelLogs
  metrics?: OpentelemetryOtelMetrics
  traces?: OpentelemetryOtelTraces
}

export interface OpentelemetryE2eTracingOptions {
  client_connect_disconnect?: boolean
  client_messaging?: boolean
  client_subscribe_unsubscribe?: boolean
  /** @minimum 1 */
  clientid_match_rules_max?: number
  cluster_identifier: string
  follow_traceparent?: boolean
  /**
   * @minimum 0
   * @maximum 2
   */
  msg_trace_level?: number
  sample_ratio?: string
  /** @minimum 1 */
  topic_match_rules_max?: number
  trace_rule_engine?: boolean
}

export type EmqxSslClientOptsVerify =
  (typeof EmqxSslClientOptsVerify)[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_none: 'verify_none',
  verify_peer: 'verify_peer',
} as const

export type EmqxSslClientOptsServerNameIndication = 'disable' | string

export type EmqxSslClientOptsPartialChain =
  (typeof EmqxSslClientOptsPartialChain)[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  cacert_from_cacertfile: 'cacert_from_cacertfile',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  false: false,
  true: true,
} as const

export type EmqxSslClientOptsLogLevel =
  (typeof EmqxSslClientOptsLogLevel)[keyof typeof EmqxSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsLogLevel = {
  alert: 'alert',
  all: 'all',
  critical: 'critical',
  debug: 'debug',
  emergency: 'emergency',
  error: 'error',
  info: 'info',
  none: 'none',
  notice: 'notice',
  warning: 'warning',
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
