import { BackendI18n, MetricsData, MetricsDataWithExtraData, PageParams, SSL } from './common'
import {
  BridgeType,
  ConnectionStatus,
  ConnectorType,
  MQTTBridgeDirection,
  QoSLevel,
  SchemaRegistryType,
} from './enum'

export interface NodeStatus {
  node: string
  status: string
}

export interface Headers {
  'content-type': string
}

export interface RePub {
  payload: string
  topic: string
  qos: QoSLevel
  retain: boolean
  mqtt_properties: Record<string, string>
  user_properties: string
}

export interface OutputItemObj {
  function: string
  args?: RePub
}

/**
 * is string when output is bridge
 * is obj when output is console or repub
 */
export type OutputItem = string | OutputItemObj

export type FromData = Array<string>

export interface BasicRule {
  id: string
  name?: string
  sql: string
  actions: Array<OutputItem>
  description: string
}

export interface RuleForm extends BasicRule {
  created_at: string
  enable: boolean
  from: FromData
}

export interface RuleItem extends RuleForm {
  id: string
}

export interface ResourceOpt {
  worker_pool_size: number
  request_ttl?: string
  health_check_interval: string
  query_mode: 'async' | 'sync'
  inflight_window?: number
  start_timeout?: string

  max_buffer_bytes: string

  batch_size?: number
}

export interface BridgeBaseData {
  /**
   * create by front end {type}:{name}
   */
  id: string
  /**
   * $bridges/${id} fill in from when create/edit rule
   */
  idForRuleFrom: string
  name: string
  connector?: string
  node_status: Array<{
    node: string
    status: ConnectionStatus
  }>
  status: ConnectionStatus
  status_reason?: string
  type: BridgeType
  realType?: string
  local_topic?: string
  enable: boolean
  resource_opts: ResourceOpt
}

export interface HTTPBridge extends BridgeBaseData {
  clean_start: boolean
  parameters: {
    method: string
    body?: string
    headers?: Headers
    path?: string
  }
  max_retries: number
  request_timeout: string
}

export interface MQTTBridgeTransConfiguration {
  payload: string
  qos: string | number
  retain: boolean
  topic: string
}

export interface MQTTBridgeEgress {
  pool_size?: number
  local: {
    topic: string
  }
  remote: MQTTBridgeTransConfiguration
}

export interface MQTTBridgeIngress {
  pool_size?: number
  local: MQTTBridgeTransConfiguration
  remote: {
    qos: number
    topic: string
  }
}

export interface MQTTBridge extends BridgeBaseData {
  enable: boolean
  egress: MQTTBridgeEgress
  ingress: MQTTBridgeIngress
  keepalive: string
  max_inflight: number
  password: string
  clean_start: boolean
  proto_ver: string
  retry_interval: string
  bridge_mode: boolean
  server: string
  ssl: SSL
  username: string
}

export interface MQTTOut extends BridgeBaseData {
  connector: string | Record<string, any>
  direction: MQTTBridgeDirection
  payload: string
  retain: boolean
  remote_qos: QoSLevel
}

export type MQTTIn = MQTTOut & {
  local_qos: QoSLevel
}

export type OtherBridge = Record<string, any>

export type BridgeItem = HTTPBridge | MQTTBridge | OtherBridge

export interface ConnectorForm {
  type: BridgeType
  name: string
  description: string
  [key: string]: any
}

export interface Connector extends ConnectorForm {
  /**
   * After getting the data, concat the type and the name
   * {type}:{name}
   */
  id: string
  status: ConnectionStatus
  status_reason?: string
  enable: boolean
}

export interface Action {
  type: BridgeType
  name: string
  /**
   * After getting the data, concat the type and the name
   * {type}:{name}
   */
  id: string
  status: ConnectionStatus
  status_reason?: string
  enable: boolean
  connector: string
  resource_opts: ResourceOpt
  [key: any]: any
  [key: string]: any
}

export type Source = Action

export type BridgeMetricsData = MetricsData

export type BridgeItemWithMetrics = BridgeItem & BridgeMetricsData

export interface ConnectorBase {
  name: string
}

export type ConnectorMQTT = Omit<ConnectorBase, 'type'> & {
  /**
   * create by front end {type}:{name}
   */
  id: string
  type: ConnectorType.MQTT
  clean_start: boolean
  clientid: string
  keepalive: string
  max_inflight: number
  mode: string
  password: string
  proto_ver: string
  retry_interval: string
  server: string
  ssl: SSL
  username: string
}

export type ConnectorItem = ConnectorMQTT

/**
 * 0: template 1: desc
 */
export type TestColumnItem = [string, string]

export interface RuleEvent {
  columns: string[]
  description: BackendI18n
  event: string
  sql_example: string
  test_columns: Record<string, TestColumnItem>
  title: BackendI18n
}

export interface FilterParamsForQueryRules {
  enable?: boolean
  from?: string
  like_id?: string
  like_from?: string
  like_description?: string
  match_from?: string
}

export type ParamsForQueryRules = FilterParamsForQueryRules & PageParams

export type RuleItem = {
  actions?: Array<Record<string, unknown> | string>
  id?: string
  enable?: boolean
  sql?: string
  description?: string
}

export type RuleMetrics = MetricsDataWithExtraData<{ id: string }>

export interface SchemaRegistry {
  name: string
  description: string
  type: SchemaRegistryType
  source: string
}
