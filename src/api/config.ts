import { parseLinkPaginationCursor, LinkPaginationCursorName } from '@/common/linkPagination'
import http from '@/common/http'
import {
  AlarmSettings,
  Cluster,
  Dashboard,
  Log,
  NamespaceItem,
  NamespaceMetrics,
  RuleEngine,
  Zone,
  Zones,
} from '@/types/config'
import {
  FileTransferConf,
  GetNamespaceListParams,
  MessageQueueConfig,
  NamespaceConfig,
  NamespaceDetailItem,
} from '@/types/typeAlias'
import type { AxiosResponse } from 'axios'

export type LinkPaginatedResult<T> = {
  data: T
  nextCursor?: string
  nextCursorName?: LinkPaginationCursorName
}

const getResponseHeader = (response: AxiosResponse, name: string) => {
  const headers = response.headers as Record<string, unknown> & {
    get?: (headerName: string) => unknown
  }
  return headers.get?.(name) ?? headers[name.toLowerCase()] ?? headers[name]
}

const toLinkPaginatedResult = <T>(response: AxiosResponse<T>): LinkPaginatedResult<T> => {
  const nextCursor = parseLinkPaginationCursor(getResponseHeader(response, 'link'))
  return {
    data: response.data,
    ...(nextCursor
      ? {
          nextCursor: nextCursor.value,
          nextCursorName: nextCursor.name,
        }
      : {}),
  }
}

const getLinkPaginated = async <T>(
  url: string,
  params: Record<string, unknown>,
): Promise<LinkPaginatedResult<T>> => {
  const response = await http.get<T, AxiosResponse<T>>(url, { params, returnRawResponse: true })
  return toLinkPaginatedResult(response)
}

export const getClusterConfigs = (): Promise<Cluster> => http.get('/configs/cluster')

export const updateClusterConfigs = (data: Cluster): Promise<Cluster> =>
  http.put('/configs/cluster', data)

export const getLogConfigs = (): Promise<Log> => http.get('/configs/log')

export const updateLogConfigs = (data: Log): Promise<Log> => http.put('/configs/log', data)

export const getRuleEngineConfigs = (): Promise<RuleEngine> => http.get('/rule_engine')

export const updateRuleEngineConfigs = (data: RuleEngine): Promise<RuleEngine> =>
  http.put('/rule_engine', data)

export const getDashboardConfigs = (): Promise<Dashboard> => http.get('/configs/dashboard')

export const updateDashboardConfigs = (data: Dashboard): Promise<Dashboard> =>
  http.put('/configs/dashboard', data)

export const getDefaultZoneConfigs = (): Promise<Zone> => http.get('/configs/global_zone')

export const updateDefaultZoneConfigs = (data: Zone): Promise<Zone> =>
  http.put('/configs/global_zone', data)

export const getZoneConfigs = (): Promise<Zones> => http.get('/configs/zones')

export const updateZoneConfigs = (data: Zones): Promise<Zones> => http.put('/configs/zones', data)

export const getSysMon = (): Promise<AlarmSettings> => http.get('/configs/sysmon')

export const updateSysMon = (data: AlarmSettings): Promise<AlarmSettings> =>
  http.put('/configs/sysmon', data)

export const getFileTransConfigs = (): Promise<FileTransferConf> =>
  http.get('/configs/file_transfer')

export const updateFileTransConfigs = (data: FileTransferConf): Promise<FileTransferConf> =>
  http.put('/configs/file_transfer', data)

// Multi-tenancy API functions
export const getNamespaceList = (
  params: GetNamespaceListParams,
): Promise<LinkPaginatedResult<Array<string>>> => getLinkPaginated('/mt/ns_list', params)

export const getNamespaceClientCount = (namespace: string): Promise<{ count: number }> =>
  http.get(`/mt/ns/${encodeURIComponent(namespace)}/client_count`)

export const bulkImportNamespaces = (data: Array<NamespaceItem>): Promise<void> =>
  http.post('/mt/bulk_import_configs', data)

export const updateNamespaceConfig = (
  namespace: string,
  data: NamespaceConfig,
): Promise<NamespaceConfig> => http.put(`/mt/ns/${encodeURIComponent(namespace)}/config`, data)

export const getManagedNamespaceList = (
  params: GetNamespaceListParams,
): Promise<LinkPaginatedResult<Array<string>>> => getLinkPaginated('/mt/managed_ns_list', params)

export const kickAllClientsInNamespace = (namespace: string): Promise<void> =>
  http.post(`/mt/ns/${encodeURIComponent(namespace)}/kick_all_clients`)

export const getNamespaceClientList = (
  namespace: string,
  params: { last_clientid?: string; first_clientid?: string; limit: number },
): Promise<LinkPaginatedResult<Array<string>>> =>
  getLinkPaginated(`/mt/ns/${encodeURIComponent(namespace)}/client_list`, params)

export const deleteManagedNamespace = (namespace: string): Promise<void> =>
  http.delete(`/mt/ns/${encodeURIComponent(namespace)}`)

export const batchDeleteNamespace = (nsArr: Array<string>) =>
  http.delete(`/mt/bulk_delete_ns`, { data: { nss: nsArr } })

export const createManagedNamespace = (namespace: string): Promise<void> =>
  http.post(`/mt/ns/${encodeURIComponent(namespace)}`)

export const getManagedDetailNamespaceList = (
  params: GetNamespaceListParams,
): Promise<LinkPaginatedResult<Array<NamespaceDetailItem>>> =>
  getLinkPaginated('/mt/managed_ns_list_details', params)

export const getDetailNamespaceList = (
  params: GetNamespaceListParams,
): Promise<LinkPaginatedResult<Array<NamespaceDetailItem>>> =>
  getLinkPaginated('/mt/ns_list_details', params)

export const getNamespaceMetrics = (namespace: string): Promise<NamespaceMetrics> =>
  http.get(`/mt/ns/${encodeURIComponent(namespace)}/metrics`)

export const getConfigs = <T = Record<string, unknown>>(key?: string): Promise<T> =>
  http.get('/configs', {
    params: { key },
    headers: { Accept: 'application/json' },
  })

export const putConfigs = (configs: any) => http.put('/configs', configs)

export const getMessageQueueConfigs = (): Promise<MessageQueueConfig> => http.get('/queues/config')

export const putMessageQueueConfigs = (data: MessageQueueConfig): Promise<MessageQueueConfig> =>
  http.put('/queues/config', data)
