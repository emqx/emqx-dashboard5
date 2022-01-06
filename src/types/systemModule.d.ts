import { ConnectionStatus, ExhookFailedAction } from './enum'

export interface APIKeyFormWhenCreating {
  name: string
  /**
   * When the api key never expires, the value is undefined
   * (not submit to the interface)
   */
  expired_at?: string | undefined
  desc: string
  enable: boolean
}

export interface APIKey extends APIKeyFormWhenCreating {
  api_key: string
  api_secret: string
  created_at: string
}

export type APIKeyFormWhenEditing = Pick<APIKey, 'name' | 'expired_at' | 'desc' | 'enable'>

export interface Exhook {
  name: string
  url: string
  request_timeout?: string
  request_failed_action?: ExhookFailedAction
  registered_hooks: Array<{
    name: hooks
    arguments: { topic: 't/#' }
    // 集群指标
    metrics: {
      success: int
      failed: int
      rate: float
      rate_max: float
      rate_last5m: float
    }
  }>
  auto_reconnect?: boolean
  reconnect_interval?: string
  status: ConnectionStatus
  cluster_status: ConnectionStatus
  node_status: [{ node: string; status: StatusEnum }]
  metrics: {
    success: number
    failed: number
    rate: number
    rate_max: number
    rate_last5m: number
  }
  node_metrics: Array<{ node: string }>
  ssl: {
    enable: boolean
  }
}
