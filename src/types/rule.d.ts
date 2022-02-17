import { SSL } from './common'
import { MQTTBridgeDirection } from './enum'

export type Metrics = Record<string, number>

export interface NodeMetrics {
  node: string
  metrics: Metrics
}

export interface NodeStatus {
  node: string
  status: string
}

export interface Headers {
  'content-type': string
}

export interface OutputItemObj {
  function: string
  args?: {
    payload: string
    topic: string
  }
}

/**
 * is string when output is bridge
 * is obj when output is console or repub
 */
export type OutputItem = string | OutputItemObj

export type FromData = Array<string> | string

export interface RuleItem {
  created_at: string
  description: string
  enable: boolean
  from: FromData
  id: string
  metrics: Metrics
  name: string
  node_metrics: NodeMetrics
  outputs: Array<OutputItem> | OutputItem
  sql: string
}

export interface BridgeBaseData {
  id: string
  metrics: Metrics
  name: string
  node_metrics: Array<NodeMetrics>
  node_status: Array<NodeStatus>
  status: string
  type: string
  local_topic: string
}

export interface HTTPBridge extends BridgeBaseData {
  body: string
  connect_timeout: string
  enable_pipelining: boolean
  headers: Headers
  max_retries: number
  method: string
  pool_size: number
  request_timeout: string
  ssl: SSL
  url: string
}

export interface MQTTOut extends BridgeBaseData {
  connector: string
  direction: MQTTBridgeDirection
  payload: string
  remote_topic: string
  retain: boolean
  remote_qos: number
}

export type MQTTIn = MQTTOut & {
  local_qos: number
}

export type BridgeItem = HTTPBridge | MQTTOut | MQTTIn
