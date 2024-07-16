import { NodeStatus } from './enum'
import { OpentelemetryOpentelemetry } from './schemas/monitor.schemas'
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

export interface NodeInfo {
  connections: number
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
  sys_path: string
  uptime: number
  version: string
  role: 'core' | 'replicant'
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
  push_gateway: {
    headers: {
      Authorization: string
    }
    interval: string
    job_name: string
    url: string
    enable: boolean
  }
}

export interface StatsD {
  enable: boolean
  flush_time_interval: string
  sample_time_interval: string
  server: string
}

export type OpenTelemetry = Omit<OpentelemetryOpentelemetry, 'exporter'> & {
  exporter?: {
    endpoint?: string
    ssl_options?: SSL
  }
}

export default {}
