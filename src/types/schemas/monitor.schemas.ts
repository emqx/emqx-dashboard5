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

export type PrometheusPrometheusVmMsaccCollector =
  typeof PrometheusPrometheusVmMsaccCollector[keyof typeof PrometheusPrometheusVmMsaccCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusPrometheusVmMsaccCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusPrometheusVmMemoryCollector =
  typeof PrometheusPrometheusVmMemoryCollector[keyof typeof PrometheusPrometheusVmMemoryCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusPrometheusVmMemoryCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusPrometheusVmSystemInfoCollector =
  typeof PrometheusPrometheusVmSystemInfoCollector[keyof typeof PrometheusPrometheusVmSystemInfoCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusPrometheusVmSystemInfoCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusPrometheusVmStatisticsCollector =
  typeof PrometheusPrometheusVmStatisticsCollector[keyof typeof PrometheusPrometheusVmStatisticsCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusPrometheusVmStatisticsCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusPrometheusMnesiaCollector =
  typeof PrometheusPrometheusMnesiaCollector[keyof typeof PrometheusPrometheusMnesiaCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusPrometheusMnesiaCollector = {
  enabled: 'enabled',
  disabled: 'disabled',
} as const

export type PrometheusPrometheusVmDistCollector =
  typeof PrometheusPrometheusVmDistCollector[keyof typeof PrometheusPrometheusVmDistCollector]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrometheusPrometheusVmDistCollector = {
  disabled: 'disabled',
  enabled: 'enabled',
} as const

export type PrometheusPrometheusHeadersItem = { [key: string]: any }

export interface PrometheusPrometheus {
  push_gateway_server: string
  interval: string
  headers?: PrometheusPrometheusHeadersItem[]
  job_name: string
  enable: boolean
  vm_dist_collector: PrometheusPrometheusVmDistCollector
  mnesia_collector: PrometheusPrometheusMnesiaCollector
  vm_statistics_collector: PrometheusPrometheusVmStatisticsCollector
  vm_system_info_collector: PrometheusPrometheusVmSystemInfoCollector
  vm_memory_collector: PrometheusPrometheusVmMemoryCollector
  vm_msacc_collector: PrometheusPrometheusVmMsaccCollector
}

export interface OpentelemetryExporter {
  endpoint?: string
  interval: string
}

export interface OpentelemetryOpentelemetry {
  exporter?: OpentelemetryExporter
  enable: boolean
}
