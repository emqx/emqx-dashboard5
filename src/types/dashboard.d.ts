import { NodeStatus } from './enum'
import type { OpenTelemetryLogs, OpenTelemetryMetrics, OpenTelemetryTraces } from './typeAlias'
import { SSL } from './common'

export interface CounterItem {
  count: number
  timestamp: number
}

export interface ChartDataItem {
  connections: number
  dropped: number
  received: number
  received_bytes: number
  topics: number
  sent: number
  sent_bytes: number
  subscriptions: number
  time_stamp: number
}

export type NodeStatisticalData = { node: string } & {
  [fieldName: string]: number
}

export type SecurityProfile = 'legacy' | 'hardened'

export type FeaturePreset = 'full' | 'essential' | 'custom'

export interface NodeInfo {
  connections: number
  edition: string
  feature_preset?: FeaturePreset
  load1: string
  load15: string
  load5: string
  log_path: string
  max_fds: number
  memory_total: string | number
  memory_used: string | number
  node: string
  node_status: NodeStatus
  otp_release: string
  process_available: number
  process_used: number
  security_profile?: SecurityProfile
  sys_path: string
  uptime: number
  version: string
  role: 'core' | 'replicant'
  cluster_sessions: number
  live_connections: number
}

export interface Prometheus {
  collectors: {
    mnesia: string
    vm_dist: string
    vm_memory: string
    vm_msacc: string
    vm_statistics: string
    vm_system_info: string
  }
  enable_basic_auth: boolean
  latency_buckets: string
  push_gateway: {
    headers: {
      Authorization: string
    }
    interval: string
    job_name: string
    url: string
    enable: boolean
  }
  namespaced_metrics_limiter?: {
    rate?: string
  }
}

export interface StatsD {
  enable: boolean
  flush_time_interval: string
  sample_time_interval: string
  server: string
}

export type OpenTelemetryType = 'generic' | 'dynatrace'

export interface OpenTelemetryExporter {
  endpoint?: string
  ssl_options?: SSL
  headers?: Record<string, string>
}

export interface DynatraceOAuth2 {
  kind: 'dynatrace_oauth2'
  enable: true
  grant_type: 'client_credentials'
  token_endpoint: string
  client_id: string
  client_secret: string
  resource: string
  scope?: string
  timeout?: string
  ssl?: SSL
}

export interface GenericOpenTelemetry {
  type: 'generic'
  exporter?: OpenTelemetryExporter
  logs?: OpenTelemetryLogs
  metrics?: OpenTelemetryMetrics
  traces?: OpenTelemetryTraces
}

export interface DynatraceOpenTelemetry {
  type: 'dynatrace'
  exporter?: {
    auth: DynatraceOAuth2
  } & OpenTelemetryExporter
  logs?: OpenTelemetryLogs
  metrics?: never
  traces?: OpenTelemetryTraces
}

export type OpenTelemetry = GenericOpenTelemetry | DynatraceOpenTelemetry

export interface Alarm {
  node: string
  name: string
  message: string
  details: Record<string, any>
  duration: number
  activate_at: string
  deactivate_at: string
}

export interface LicenseData {
  customer: string
  customer_type: number
  deployment: string
  email: string
  expiry: boolean
  expiry_at: string
  max_connections: number
  max_sessions: number
  start_at: string
  type: string
  max_tps: number | string
}

export interface LicenseConfig {
  connection_low_watermark: string
  connection_high_watermark: string
  high_watermark_timezone: string
}

export type LicenseSessionHwmHistoryPeriod = 'daily' | 'monthly'

export interface LicenseSessionHwmHistoryRow {
  period: string
  high_watermark: number
  observed_at: string
}

export interface LicenseSessionHwmHistoryResponse {
  period: LicenseSessionHwmHistoryPeriod
  count: number
  data: Array<LicenseSessionHwmHistoryRow>
}

export default {}
