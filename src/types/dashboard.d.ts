export interface CounterItem {
  count: number
  timestamp: number
}

export interface ChartDataItem {
  connections: number
  dropped: number
  received: number
  received_bytes: number
  routes: number
  sent: number
  sent_bytes: number
  subscriptions: number
  time_stamp: number
}

export type NodeStatisticalData = { node: string } & {
  [fieldName: string]: number
}

export interface NodeMsg {
  config_path: string
  connections: number
  load1: string
  load15: string
  load5: string
  log_path: string
  max_fds: number
  memory_total: string
  memory_used: string
  node: string
  node_status: string
  otp_release: string
  process_available: number
  process_used: number
  sys_path: string
  uptime: number
  version: string
}

export interface Prometheus {
  enable: boolean
  interval: string | [string, string]
  push_gateway_server: string
}

export interface StatsD {
  enable: boolean
  flush_time_interval: string | [string, string]
  sample_time_interval: string
  server: string
}

export default {}
