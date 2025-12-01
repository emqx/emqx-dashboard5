import http from '@/common/http'
import type { ListDataWithPagination } from '@/types/common'
import type { LicenseData } from '@/types/dashboard'
import type {
  GenerateSQLPayload,
  GenerateSQLResponse,
  NsParams,
  ParamsForQueryRules,
  RuleItem,
  RuleMetrics,
  SchemaRegistry,
} from '@/types/rule'
import type {
  ExternalSchema,
  ExternalSchemaMap,
  SchemaRegistryDetail,
  SchemaRegistryProtobufBundle,
} from '@/types/typeAlias'

//Rules
export function getRules(
  params: ParamsForQueryRules = { page: 1, limit: 1000 },
): Promise<ListDataWithPagination<RuleItem>> {
  return http.get('/rules', { params })
}

export function getRuleInfo(id: string, params?: NsParams): Promise<any> {
  if (!id) return Promise.reject()
  return http.get('/rules/' + encodeURIComponent(id), { params })
}

export function createRules(body: Record<string, unknown>, params?: NsParams): Promise<any> {
  return http.post('/rules', body, { params })
}

export function getRuleEvents(): Promise<any> {
  return http.get('/rule_events')
}

export function updateRules(id: string, body: Partial<RuleItem>, params?: NsParams): Promise<any> {
  if (!id) return Promise.reject()
  return http.put('/rules/' + encodeURIComponent(id), body, { params })
}

export function deleteRules(id: string, params?: NsParams): Promise<any> {
  if (!id) return Promise.reject()
  return http.delete('/rules/' + encodeURIComponent(id), { params })
}

export function testsql(body: Record<string, unknown>, params?: NsParams): Promise<any> {
  return http.post('/rule_test', body, {
    params,
    transformResponse: [
      (data: string, responseHeader: any, code: number) => {
        return code > 299 ? JSON.parse(data) : data
      },
    ],
  })
}

export function queryRuleMetrics(ruleId: string, params?: NsParams): Promise<RuleMetrics> {
  return http.get(`/rules/${ruleId}/metrics`, { params })
}

export function resetRuleMetrics(ruleId: string, params?: NsParams): Promise<string> {
  return http.put(`/rules/${ruleId}/metrics/reset`, undefined, { params })
}

export function applyRuleTest(
  ruleId: string,
  context: Record<string, any>,
  params?: NsParams,
): Promise<Array<string>> {
  return http.post(
    `/rules/${ruleId}/test`,
    {
      context,
      stop_action_after_template_rendering: false,
    },
    { params },
  )
}

export const querySchemas = (): Promise<Array<SchemaRegistry>> => {
  return http.get('/schema_registry')
}

export const createSchema = (data: SchemaRegistry): Promise<SchemaRegistry> => {
  return http.post('/schema_registry', data)
}

export const deleteSchema = (schemaName: string): Promise<void> => {
  return http.delete(`/schema_registry/${schemaName}`)
}

export const querySchemaDetail = (schemaName: string): Promise<SchemaRegistryDetail> => {
  return http.get(`/schema_registry/${schemaName}`)
}

export const updateSchema = (
  schemaName: string,
  schema: Omit<SchemaRegistry, 'name'>,
): Promise<SchemaRegistry> => {
  return http.put(`/schema_registry/${schemaName}`, schema)
}

export const createProtobufBundleSchema = (
  data: SchemaRegistryProtobufBundle,
): Promise<SchemaRegistry> => {
  return http.post('/schema_registry_protobuf/bundle', data)
}

export const updateProtobufBundleSchema = (schema: FormData): Promise<SchemaRegistry> => {
  return http.put(`/schema_registry_protobuf/bundle`, schema)
}

export const getExternalSchemas = (): Promise<ExternalSchemaMap> => {
  return http.get(`/schema_registry_external`)
}

export const postExternalSchema = (data: ExternalSchema): Promise<ExternalSchema> => {
  return http.post(`/schema_registry_external`, data)
}

export const getExternalSchemaDetail = (name: string): Promise<Omit<ExternalSchema, 'name'>> => {
  return http.get(`/schema_registry_external/registry/${encodeURIComponent(name)}`)
}

export const putExternalSchema = (
  name: string,
  data: Omit<ExternalSchema, 'name'>,
): Promise<ExternalSchema> => {
  return http.put(`/schema_registry_external/registry/${encodeURIComponent(name)}`, data)
}

export const deleteExternalSchema = (name: string): Promise<void> => {
  return http.delete(`/schema_registry_external/registry/${encodeURIComponent(name)}`)
}

export const generateSQLByAI = async (
  cloudApiUrl: string,
  data: GenerateSQLPayload,
  licenseData: LicenseData,
): Promise<GenerateSQLResponse> => {
  const response = await fetch(`${cloudApiUrl}/public_api/v1/rule_sql_assistants`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'X-License-Email': licenseData.email,
      'X-License-ID': licenseData.deployment,
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}
