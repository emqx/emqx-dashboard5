export type GetAudit400Code = typeof GetAudit400Code[keyof typeof GetAudit400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAudit400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetAudit400 = {
  code?: GetAudit400Code
  message?: string
}

export type GetAuditHttpMethod = typeof GetAuditHttpMethod[keyof typeof GetAuditHttpMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuditHttpMethod = {
  post: 'post',
  put: 'put',
  delete: 'delete',
} as const

export type GetAuditOperationResult =
  typeof GetAuditOperationResult[keyof typeof GetAuditOperationResult]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuditOperationResult = {
  success: 'success',
  failure: 'failure',
} as const

export type GetAuditFrom = typeof GetAuditFrom[keyof typeof GetAuditFrom]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuditFrom = {
  dashboard: 'dashboard',
  rest_api: 'rest_api',
  cli: 'cli',
  erlang_console: 'erlang_console',
} as const

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetAuditParams = {
  node?: string
  from?: GetAuditFrom
  source?: string
  source_ip?: string
  operation_id?: string
  operation_type?: string
  operation_result?: GetAuditOperationResult
  http_status_code?: number
  http_method?: GetAuditHttpMethod
  gte_duration_ms?: number
  lte_duration_ms?: number
  gte_created_at?: number | string
  lte_created_at?: number | string
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export interface PublicMeta {
  count?: number
  hasnext: boolean
  limit?: number
  page?: number
}

export type AuditHttpRequestMethod =
  typeof AuditHttpRequestMethod[keyof typeof AuditHttpRequestMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuditHttpRequestMethod = {
  post: 'post',
  put: 'put',
  delete: 'delete',
} as const

export type AuditHttpRequestHeaders = { [key: string]: any }

export type AuditHttpRequestBody = { [key: string]: any }

export type AuditHttpRequestBindings = { [key: string]: any }

export interface AuditHttpRequest {
  bindings?: AuditHttpRequestBindings
  body?: AuditHttpRequestBody
  headers?: AuditHttpRequestHeaders
  method?: AuditHttpRequestMethod
}

export interface AuditAuditList {
  data?: AuditAudit[]
  meta?: PublicMeta
}

export type AuditAuditOperationResult =
  typeof AuditAuditOperationResult[keyof typeof AuditAuditOperationResult]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuditAuditOperationResult = {
  success: 'success',
  failure: 'failure',
} as const

export type AuditAuditHttpMethod = typeof AuditAuditHttpMethod[keyof typeof AuditAuditHttpMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuditAuditHttpMethod = {
  post: 'post',
  put: 'put',
  delete: 'delete',
} as const

export type AuditAuditFrom = typeof AuditAuditFrom[keyof typeof AuditAuditFrom]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuditAuditFrom = {
  dashboard: 'dashboard',
  rest_api: 'rest_api',
  cli: 'cli',
  erlang_console: 'erlang_console',
} as const

export type AuditAuditCreatedAt = number | string

export interface AuditAudit {
  args?: string[]
  created_at?: AuditAuditCreatedAt
  duration_ms?: number
  failure?: string[]
  from?: AuditAuditFrom
  http_method?: AuditAuditHttpMethod
  http_request?: AuditHttpRequest
  http_status_code?: number
  node?: string
  operation_id?: string
  operation_result?: AuditAuditOperationResult
  operation_type?: string
  source?: string
  source_ip?: string
}
