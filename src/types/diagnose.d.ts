import { LogTraceFormatter, TraceEncodeType } from './enum'

export type TraceRecord = {
  name: string
  type: 'clientid' | 'topic' | 'ip_address' | 'ruleid'
  topic?: string
  clientid?: string
  ip_address?: string
  ruleid?: string
  start_at: string
  end_at: string
  payload_encode: TraceEncodeType
  formatter?: LogTraceFormatter
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
