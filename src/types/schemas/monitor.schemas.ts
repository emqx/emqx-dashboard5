export type GetPrometheusAuth200Two = { [key: string]: any }

export type GetPrometheusStats200Two = { [key: string]: any }

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

export type GetPrometheusAuthParams = {
  mode?: EmqxPrometheusApiModeParameter
}

export type GetPrometheusStatsParams = {
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
