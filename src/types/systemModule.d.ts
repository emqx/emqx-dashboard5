import { ExhookFailedAction, ExhookStatus } from './enum'

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

export interface ExhookFormForCreate {
  auto_reconnect: false | string
  enable: boolean
  failed_action: ExhookFailedAction
  name: string
  pool_size: number | undefined
  request_timeout: string
  ssl: SSL
  url: string
}

export interface SSL {
  cacertfile: string
  certfile: string
  enable: boolean
  keyfile: string
}

export interface Exhook extends ExhookFormForCreate {
  hooks: Array<{
    name: hooks
    arguments: { topic: string }
    metrics: {
      success: number
      failed: number
      rate: number
      rate_max: number
      rate_last5m: number
    }
  }>
  metrics: Array<{
    failed: number
    max_rate: number
    rate: number
    succeed: number
  }>
  node_metrics: Array<{
    metrics: Metrics
    node: string
  }>
  node_status: Array<{
    node: string
    status: ExhookStatus
  }>
  request_timeout: string
}

export interface RegisteredHook {
  name: string
  params: {
    $name: string
  }
  metrics: ExhookMetricItem
  node_metrics: Array<{
    node: string
    metrics: Metrics
  }>
}

interface ExhookMetricItem {
  succeed: number
  failed: number
  rate: number
  max_rate: number
}
