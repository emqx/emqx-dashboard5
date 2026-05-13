import http from '@/common/http'
import type { AxiosResponse } from 'axios'
import {
  AlarmSettings,
  Cluster,
  Dashboard,
  Limiter,
  Log,
  NamespaceItem,
  RuleEngine,
  Zone,
  Zones,
} from '@/types/config'
import {
  FileTransferConf,
  GetNamespaceClientListParams,
  GetNamespaceListParams,
  MessageQueueConfig,
  NamespaceConfig,
  NamespaceDetailItem,
} from '@/types/typeAlias'

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

export const getLimiters = (): Promise<Limiter> => http.get('/configs/limiter')

export const updateLimiters = (data: Limiter): Promise<Limiter> =>
  http.put('/configs/limiter', data)

export const getSysMon = (): Promise<AlarmSettings> => http.get('/configs/sysmon')

export const updateSysMon = (data: AlarmSettings): Promise<AlarmSettings> =>
  http.put('/configs/sysmon', data)

export const getFileTransConfigs = (): Promise<FileTransferConf> =>
  http.get('/configs/file_transfer')

export const updateFileTransConfigs = (data: FileTransferConf): Promise<FileTransferConf> =>
  http.put('/configs/file_transfer', data)

// Multi-tenancy API functions
type LinkPaginationMeta = {
  cursor?: string
  hasnext: boolean
}

type LinkPaginationData<T> = {
  data: T
  meta: LinkPaginationMeta
}

const getHeader = (headers: AxiosResponse['headers'], key: string) => {
  if (typeof headers?.get === 'function') {
    return headers.get(key)
  }
  return headers?.[key] ?? headers?.[key.toLowerCase()]
}

const parseNextCursorFromLinkHeader = (
  linkHeader: string | null | undefined,
  cursorKeys: Array<string>,
): LinkPaginationMeta => {
  if (!linkHeader) {
    return { hasnext: false }
  }
  const nextLink = linkHeader.split(',').find((item) => /rel="?next"?/.test(item))
  const uri = nextLink?.match(/<([^>]+)>/)?.[1]
  if (!uri) {
    return { hasnext: false }
  }
  const params = new URL(uri, 'http://localhost').searchParams
  return {
    cursor: cursorKeys.map((key) => params.get(key)).find(Boolean) ?? undefined,
    hasnext: true,
  }
}

const getLinkPaginatedData = async <T>(
  url: string,
  params: object,
  cursorKeys: Array<string>,
): Promise<LinkPaginationData<T>> => {
  const response = await http.get<T, AxiosResponse<T>>(url, {
    params,
    returnRawResponse: true,
  } as any)
  return {
    data: response.data,
    meta: parseNextCursorFromLinkHeader(getHeader(response.headers, 'link'), cursorKeys),
  }
}

export const getNamespaceListWithLinkMeta = (
  params: GetNamespaceListParams,
): Promise<LinkPaginationData<Array<string>>> =>
  getLinkPaginatedData('/mt/ns_list', params, ['last_ns', 'first_ns'])

export const getNamespaceList = async (params: GetNamespaceListParams): Promise<Array<string>> => {
  const { data } = await getNamespaceListWithLinkMeta(params)
  return data
}

export const getNamespaceClientCount = (namespace: string): Promise<{ count: number }> =>
  http.get(`/mt/ns/${encodeURIComponent(namespace)}/client_count`)

export const bulkImportNamespaces = (data: Array<NamespaceItem>): Promise<void> =>
  http.post('/mt/bulk_import_configs', data)

export const getNamespaceConfig = (namespace: string): Promise<NamespaceConfig> =>
  http.get(`/mt/ns/${encodeURIComponent(namespace)}/config`)

export const updateNamespaceConfig = (
  namespace: string,
  data: NamespaceConfig,
): Promise<NamespaceConfig> => http.put(`/mt/ns/${encodeURIComponent(namespace)}/config`, data)

export const getManagedNamespaceListWithLinkMeta = (
  params: GetNamespaceListParams,
): Promise<LinkPaginationData<Array<string>>> =>
  getLinkPaginatedData('/mt/managed_ns_list', params, ['last_ns', 'first_ns'])

export const getManagedNamespaceList = async (
  params: GetNamespaceListParams,
): Promise<Array<string>> => {
  const { data } = await getManagedNamespaceListWithLinkMeta(params)
  return data
}

export const getAllManagedNamespaceList = async (limit = 10000): Promise<Array<string>> => {
  const list: Array<string> = []
  let params: GetNamespaceListParams = { limit }
  let hasnext = false
  do {
    const { data, meta } = await getManagedNamespaceListWithLinkMeta(params)
    list.push(...data)
    hasnext = meta.hasnext
    params = {
      limit,
      last_ns: meta.cursor ?? data[data.length - 1],
    }
  } while (hasnext && params.last_ns)
  return list
}

export const kickAllClientsInNamespace = (namespace: string): Promise<void> =>
  http.post(`/mt/ns/${encodeURIComponent(namespace)}/kick_all_clients`)

export const getNamespaceClientList = (
  namespace: string,
  params: GetNamespaceClientListParams,
): Promise<Array<string>> =>
  getNamespaceClientListWithLinkMeta(namespace, params).then(({ data }) => data)

export const getNamespaceClientListWithLinkMeta = (
  namespace: string,
  params: GetNamespaceClientListParams,
): Promise<LinkPaginationData<Array<string>>> =>
  getLinkPaginatedData(`/mt/ns/${encodeURIComponent(namespace)}/client_list`, params, [
    'last_clientid',
    'first_clientid',
  ])

export const deleteManagedNamespace = (namespace: string): Promise<void> =>
  http.delete(`/mt/ns/${encodeURIComponent(namespace)}`)

export const batchDeleteNamespace = (nsArr: Array<string>) =>
  http.delete(`/mt/bulk_delete_ns`, { data: { nss: nsArr } })

export const createManagedNamespace = (namespace: string): Promise<void> =>
  http.post(`/mt/ns/${encodeURIComponent(namespace)}`)

export const getManagedDetailNamespaceList = (
  params: GetNamespaceListParams,
): Promise<Array<NamespaceDetailItem>> =>
  getManagedDetailNamespaceListWithLinkMeta(params).then(({ data }) => data)

export const getManagedDetailNamespaceListWithLinkMeta = (
  params: GetNamespaceListParams,
): Promise<LinkPaginationData<Array<NamespaceDetailItem>>> =>
  getLinkPaginatedData('/mt/managed_ns_list_details', params, ['last_ns', 'first_ns'])

export const getDetailNamespaceList = (
  params: GetNamespaceListParams,
): Promise<Array<NamespaceDetailItem>> =>
  getDetailNamespaceListWithLinkMeta(params).then(({ data }) => data)

export const getDetailNamespaceListWithLinkMeta = (
  params: GetNamespaceListParams,
): Promise<LinkPaginationData<Array<NamespaceDetailItem>>> =>
  getLinkPaginatedData('/mt/ns_list_details', params, ['last_ns', 'first_ns'])

export const getConfigs = (key?: string) => http.get('/configs', { params: { key } })

export const putConfigs = (configs: any) => http.put('/configs', configs)

export const getMessageQueueConfigs = (): Promise<MessageQueueConfig> =>
  http.get('/message_queues/config')

export const putMessageQueueConfigs = (data: MessageQueueConfig): Promise<MessageQueueConfig> =>
  http.put('/message_queues/config', data)
