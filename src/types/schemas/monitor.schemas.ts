export type GetPrometheusStats200One = { [key: string]: unknown }

export type GetPrometheusStatsParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusSchemaValidation200One = { [key: string]: unknown }

export type GetPrometheusSchemaValidationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusMessageTransformation200One = { [key: string]: unknown }

export type GetPrometheusDataIntegration200One = { [key: string]: unknown }

export type GetPrometheusAuth200One = { [key: string]: unknown }

export type PutPrometheusBody = PrometheusLegacyDeprecatedSetting | PrometheusRecommendSetting

export type EmqxPrometheusApiModeParameter =
  (typeof EmqxPrometheusApiModeParameter)[keyof typeof EmqxPrometheusApiModeParameter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxPrometheusApiModeParameter = {
  all_nodes_aggregated: 'all_nodes_aggregated',
  all_nodes_unaggregated: 'all_nodes_unaggregated',
  node: 'node',
} as const

export type GetPrometheusMessageTransformationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusDataIntegrationParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusAuthParams = {
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
