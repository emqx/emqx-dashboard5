import { SlowSubType } from './enum'

export interface SlowSubConfig {
  enable: boolean
  threshold: string
  expire_interval: string
  top_k_num: number
  stats_type: SlowSubType
}

export interface SlowSubStatistic {
  clientid: string
  node: string
  topic: string
  timespan: string
  last_update_time: string
}

export type TraceRecord = {
  name: string
}

export type TraceFormRecord = {
  name: string
  type: 'clientid' | 'topic' | 'ip_address'
  topic: string
  clientid: string
  ip_address: string
  startTime: [string, string] | [Date, Date]
}

export interface TraceItem {
  name: string
  type: 'clientid' | 'topic' | 'ip_address'
  ip_address?: string
  topic?: string
  clientid?: string
  start_at: string
  end_at: string
  status: string
  log_size: Record<string, number>
}

export interface TopicMetricItem {
  topic: string
  create_time: string
  reset_time: string
  metrics: Record<string, number>
}
