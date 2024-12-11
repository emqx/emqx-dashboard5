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

export type GetPrometheusAuth200Two = { [key: string]: any }

export type GetPrometheusAuthParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusMessageTransformation200Two = { [key: string]: any }

export type GetPrometheusStats200Two = { [key: string]: any }

export type GetPrometheusStatsParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusSchemaValidation200Two = { [key: string]: any }

export type GetPrometheusDataIntegration200Two = { [key: string]: any }

export type PutPrometheusBody = PrometheusLegacyDeprecatedSetting | PrometheusRecommendSetting

export type EmqxPrometheusApiModeParameter =
  (typeof EmqxPrometheusApiModeParameter)[keyof typeof EmqxPrometheusApiModeParameter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxPrometheusApiModeParameter = {
  node: 'node',
  all_nodes_aggregated: 'all_nodes_aggregated',
  all_nodes_unaggregated: 'all_nodes_unaggregated',
} as const

export type GetPrometheusMessageTransformationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusSchemaValidationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusDataIntegrationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type PrometheusPushGatewayHeaders = { [key: string]: any }

export interface PrometheusPushGateway {
  enable: boolean
  url?: string
  interval?: string
  headers?: PrometheusPushGatewayHeaders
  job_name?: string
}

export interface PrometheusRecommendSetting {
  enable_basic_auth: boolean
  push_gateway?: PrometheusPushGateway
  collectors?: PrometheusCollectors
}

export type PrometheusLegacyDeprecatedSettingVmMsaccCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmMsaccCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmMsaccCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmMsaccCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmMemoryCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmMemoryCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmMemoryCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmMemoryCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmSystemInfoCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmSystemInfoCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmSystemInfoCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmSystemInfoCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmStatisticsCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmStatisticsCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmStatisticsCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmStatisticsCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingMnesiaCollector =
  (typeof PrometheusLegacyDeprecatedSettingMnesiaCollector)[keyof typeof PrometheusLegacyDeprecatedSettingMnesiaCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingMnesiaCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmDistCollector =
  (typeof PrometheusLegacyDeprecatedSettingVmDistCollector)[keyof typeof PrometheusLegacyDeprecatedSettingVmDistCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmDistCollector = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusLegacyDeprecatedSettingHeaders = { [key: string]: any }

export interface PrometheusLegacyDeprecatedSetting {
  push_gateway_server: string
  interval: string
  headers?: PrometheusLegacyDeprecatedSettingHeaders
  job_name: string
  enable: boolean
  vm_dist_collector: PrometheusLegacyDeprecatedSettingVmDistCollector
  mnesia_collector: PrometheusLegacyDeprecatedSettingMnesiaCollector
  vm_statistics_collector: PrometheusLegacyDeprecatedSettingVmStatisticsCollector
  vm_system_info_collector: PrometheusLegacyDeprecatedSettingVmSystemInfoCollector
  vm_memory_collector: PrometheusLegacyDeprecatedSettingVmMemoryCollector
  vm_msacc_collector: PrometheusLegacyDeprecatedSettingVmMsaccCollector
}

export type PrometheusCollectorsVmMsacc =
  (typeof PrometheusCollectorsVmMsacc)[keyof typeof PrometheusCollectorsVmMsacc]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmMsacc = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsVmMemory =
  (typeof PrometheusCollectorsVmMemory)[keyof typeof PrometheusCollectorsVmMemory]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmMemory = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsVmSystemInfo =
  (typeof PrometheusCollectorsVmSystemInfo)[keyof typeof PrometheusCollectorsVmSystemInfo]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmSystemInfo = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsVmStatistics =
  (typeof PrometheusCollectorsVmStatistics)[keyof typeof PrometheusCollectorsVmStatistics]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmStatistics = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsMnesia =
  (typeof PrometheusCollectorsMnesia)[keyof typeof PrometheusCollectorsMnesia]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsMnesia = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsVmDist =
  (typeof PrometheusCollectorsVmDist)[keyof typeof PrometheusCollectorsVmDist]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmDist = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export interface PrometheusCollectors {
  vm_dist: PrometheusCollectorsVmDist
  mnesia: PrometheusCollectorsMnesia
  vm_statistics: PrometheusCollectorsVmStatistics
  vm_system_info: PrometheusCollectorsVmSystemInfo
  vm_memory: PrometheusCollectorsVmMemory
  vm_msacc: PrometheusCollectorsVmMsacc
}

export type OpentelemetryTraceFilterTraceMode =
  (typeof OpentelemetryTraceFilterTraceMode)[keyof typeof OpentelemetryTraceFilterTraceMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OpentelemetryTraceFilterTraceMode = {
  legacy: 'legacy',
  e2e: 'e2e',
} as const

export interface OpentelemetryTraceFilter {
  trace_mode?: OpentelemetryTraceFilterTraceMode
  trace_all?: boolean
  e2e_tracing_options?: OpentelemetryE2eTracingOptions
}

export interface OpentelemetryOtelTraces {
  enable?: boolean
  scheduled_delay?: string
  filter?: OpentelemetryTraceFilter
}

export interface OpentelemetryOtelMetrics {
  enable: boolean
  interval?: string
}

export type OpentelemetryOtelLogsLevel =
  (typeof OpentelemetryOtelLogsLevel)[keyof typeof OpentelemetryOtelLogsLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OpentelemetryOtelLogsLevel = {
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

export interface OpentelemetryOtelLogs {
  level?: OpentelemetryOtelLogsLevel
  enable?: boolean
  scheduled_delay?: string
}

export interface OpentelemetryOtelExporter {
  endpoint?: string
  ssl_options?: EmqxSslClientOpts
}

export interface OpentelemetryOpentelemetry {
  metrics?: OpentelemetryOtelMetrics
  logs?: OpentelemetryOtelLogs
  traces?: OpentelemetryOtelTraces
  exporter?: OpentelemetryOtelExporter
}

export interface OpentelemetryE2eTracingOptions {
  cluster_identifier: string
  msg_trace_level?: number
  clientid_match_rules_max?: number
  topic_match_rules_max?: number
  sample_ratio?: string
  client_connect_disconnect?: boolean
  client_subscribe_unsubscribe?: boolean
  client_messaging?: boolean
}

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

export type EmqxSslClientOptsPartialChain =
  (typeof EmqxSslClientOptsPartialChain)[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  true: 'true',
  false: 'false',
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

export type EmqxSslClientOptsVerify =
  (typeof EmqxSslClientOptsVerify)[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxSslClientOptsLogLevel
  hibernate_after?: string
  partial_chain?: EmqxSslClientOptsPartialChain
  verify_peer_ext_key_usage?: string
  enable?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
}
