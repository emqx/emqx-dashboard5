export type PutOpentelemetry400Code =
  typeof PutOpentelemetry400Code[keyof typeof PutOpentelemetry400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutOpentelemetry400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutOpentelemetry400 = {
  code?: PutOpentelemetry400Code
  message?: string
}

export type GetPrometheusStats200Two = { [key: string]: any }

export type PutPrometheusBody = PrometheusLegacyDeprecatedSetting | PrometheusRecommendSetting

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
  typeof PrometheusLegacyDeprecatedSettingVmMsaccCollector[keyof typeof PrometheusLegacyDeprecatedSettingVmMsaccCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmMsaccCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmMemoryCollector =
  typeof PrometheusLegacyDeprecatedSettingVmMemoryCollector[keyof typeof PrometheusLegacyDeprecatedSettingVmMemoryCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmMemoryCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmSystemInfoCollector =
  typeof PrometheusLegacyDeprecatedSettingVmSystemInfoCollector[keyof typeof PrometheusLegacyDeprecatedSettingVmSystemInfoCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmSystemInfoCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmStatisticsCollector =
  typeof PrometheusLegacyDeprecatedSettingVmStatisticsCollector[keyof typeof PrometheusLegacyDeprecatedSettingVmStatisticsCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingVmStatisticsCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingMnesiaCollector =
  typeof PrometheusLegacyDeprecatedSettingMnesiaCollector[keyof typeof PrometheusLegacyDeprecatedSettingMnesiaCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusLegacyDeprecatedSettingMnesiaCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusLegacyDeprecatedSettingVmDistCollector =
  typeof PrometheusLegacyDeprecatedSettingVmDistCollector[keyof typeof PrometheusLegacyDeprecatedSettingVmDistCollector]

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
  typeof PrometheusCollectorsVmMsacc[keyof typeof PrometheusCollectorsVmMsacc]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmMsacc = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsVmMemory =
  typeof PrometheusCollectorsVmMemory[keyof typeof PrometheusCollectorsVmMemory]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmMemory = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsVmSystemInfo =
  typeof PrometheusCollectorsVmSystemInfo[keyof typeof PrometheusCollectorsVmSystemInfo]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmSystemInfo = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsVmStatistics =
  typeof PrometheusCollectorsVmStatistics[keyof typeof PrometheusCollectorsVmStatistics]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsVmStatistics = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsMnesia =
  typeof PrometheusCollectorsMnesia[keyof typeof PrometheusCollectorsMnesia]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusCollectorsMnesia = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusCollectorsVmDist =
  typeof PrometheusCollectorsVmDist[keyof typeof PrometheusCollectorsVmDist]

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

export interface OpentelemetryTraceFilter {
  trace_all?: boolean
}

export type OpentelemetrySslOptsServerNameIndication = string | 'disable'

export type OpentelemetrySslOptsLogLevel =
  typeof OpentelemetrySslOptsLogLevel[keyof typeof OpentelemetrySslOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OpentelemetrySslOptsLogLevel = {
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

export type OpentelemetrySslOptsVerify =
  typeof OpentelemetrySslOptsVerify[keyof typeof OpentelemetrySslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OpentelemetrySslOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface OpentelemetrySslOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: OpentelemetrySslOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: OpentelemetrySslOptsLogLevel
  hibernate_after?: string
  server_name_indication?: OpentelemetrySslOptsServerNameIndication
}

export interface OpentelemetryOtelTraces {
  enable?: boolean
  filter?: OpentelemetryTraceFilter
}

export interface OpentelemetryOtelMetrics {
  enable: boolean
}

export type OpentelemetryOtelLogsLevel =
  typeof OpentelemetryOtelLogsLevel[keyof typeof OpentelemetryOtelLogsLevel]

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
}

export interface OpentelemetryOtelExporter {
  endpoint?: string
  ssl_options?: OpentelemetrySslOpts
}

export interface OpentelemetryOpentelemetry {
  metrics?: OpentelemetryOtelMetrics
  logs?: OpentelemetryOtelLogs
  traces?: OpentelemetryOtelTraces
  exporter?: OpentelemetryOtelExporter
}
