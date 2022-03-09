import { NodeStatusClass } from './enum'

export interface PageData {
  count: number
  limit: number
  page: number
}

export type ListDataWithPagination<T> = {
  data: Array<T>
  meta: PageData
}

export interface RuleInValidatorParam {
  field: string
  fullField: string
  type: string
}

export interface SSL {
  cacertfile: string
  certfile: string
  enable: boolean
  keyfile: string
  verify: string
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
  details: StatusDetailOfEachNode | undefined
}
