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
