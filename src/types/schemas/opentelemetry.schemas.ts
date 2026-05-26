export type PostOpentelemetryWhitelistType500Code =
  (typeof PostOpentelemetryWhitelistType500Code)[keyof typeof PostOpentelemetryWhitelistType500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostOpentelemetryWhitelistType500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type PostOpentelemetryWhitelistType500 = {
  code?: PostOpentelemetryWhitelistType500Code
  message?: string
}

export type DeleteOpentelemetryWhitelistType500Code =
  (typeof DeleteOpentelemetryWhitelistType500Code)[keyof typeof DeleteOpentelemetryWhitelistType500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteOpentelemetryWhitelistType500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type DeleteOpentelemetryWhitelistType500 = {
  code?: DeleteOpentelemetryWhitelistType500Code
  message?: string
}

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

export type OpentelemetryOtelExporterHeaders = { [key: string]: unknown }

export interface OpentelemetryOtelExporter {
  endpoint?: string
  headers?: OpentelemetryOtelExporterHeaders
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

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

export type EmqxSslClientOptsPartialChain =
  (typeof EmqxSslClientOptsPartialChain)[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  cacert_from_cacertfile: 'cacert_from_cacertfile',
  false: false,
  true: true,
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
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
  middlebox_comp_mode?: boolean
  partial_chain?: EmqxSslClientOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
  verify?: EmqxSslClientOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}
