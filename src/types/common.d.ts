import { NodeStatusClass } from './enum'
import { FormItemRule } from 'element-plus'

export interface UserInfo {
  username: string
  token: string
}

export interface PageData {
  /**
   * When the value is -1, it means that we don’t know how many items of data there are,
   * and we need to display the page up and down component
   */
  count?: number
  limit: number
  page: number
  hasnext?: boolean
}

export type ListDataWithPagination<T> = {
  data: Array<T>
  meta: PageData
}

export interface PageParams {
  limit: number
  page: number
}

export interface RuleInValidatorParam {
  field: string
  fullField: string
  type: string
}

export interface SSL {
  enable: boolean
  verify: string
  server_name_indication?: string
  certfile?: string
  keyfile?: string
  cacertfile?: string
}

export interface BackendI18n {
  zh: string
  en: string
}

export type StatusDetailOfEachNode = Array<{
  node: string
  statusClass: NodeStatusClass
  statusLabel: string
}>

export interface TargetStatusWithDetail {
  statusClass: NodeStatusClass
  statusLabel: string
  details?: StatusDetailOfEachNode
}

export type OptionList<T> = Array<{
  value: T
  label: string
}>

export interface FormItemRule extends FormItemRule {
  trigger?: Array<string>
}

export type FormRules = Record<string, Array<FormItemRule>>

export type Metrics = Record<string, number>
export interface NodeMetrics {
  node: string
  metrics: Metrics
}
export type MetricsData = {
  metrics: Metrics
  node_metrics: Array<NodeMetrics>
}
export type MetricsDataWithExtraData<ExtraMetricsData = Record<string, never>> = {
  metrics: Metrics
  node_metrics: Array<NodeMetrics>
} & ExtraMetricsData
export interface SetItem {
  name: string
  stats: TypeMetricDataItem[]
  children?: SetItem[] | null
}
