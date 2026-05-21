import http from '@/common/http'
import {
  AlarmSettings,
  Cluster,
  Dashboard,
  Limiter,
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
export const getNamespaceList = (params: GetNamespaceListParams): Promise<Array<string>> =>
  http.get('/mt/ns_list', { params })

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

export const getManagedNamespaceList = (params: GetNamespaceListParams): Promise<Array<string>> =>
  http.get('/mt/managed_ns_list', { params })

export const kickAllClientsInNamespace = (namespace: string): Promise<void> =>
  http.post(`/mt/ns/${encodeURIComponent(namespace)}/kick_all_clients`)

export const getNamespaceClientList = (
  namespace: string,
  params: { last_clientid?: string; limit: number },
): Promise<Array<string>> =>
  http.get(`/mt/ns/${encodeURIComponent(namespace)}/client_list`, { params })

export const deleteManagedNamespace = (namespace: string): Promise<void> =>
  http.delete(`/mt/ns/${encodeURIComponent(namespace)}`)

export const batchDeleteNamespace = (nsArr: Array<string>) =>
  http.delete(`/mt/bulk_delete_ns`, { data: { nss: nsArr } })

export const createManagedNamespace = (namespace: string): Promise<void> =>
  http.post(`/mt/ns/${encodeURIComponent(namespace)}`)

export const getManagedDetailNamespaceList = (
  params: GetNamespaceListParams,
): Promise<Array<NamespaceDetailItem>> => http.get('/mt/managed_ns_list_details', { params })

export const getDetailNamespaceList = (
  params: GetNamespaceListParams,
): Promise<Array<NamespaceDetailItem>> => http.get('/mt/ns_list_details', { params })

export const getNamespaceMetrics = (namespace: string): Promise<NamespaceMetrics> =>
  http.get(`/mt/ns/${encodeURIComponent(namespace)}/metrics`)

export const getConfigs = (key?: string) => http.get('/configs', { params: { key } })

export const putConfigs = (configs: any) => http.put('/configs', configs)

export const getMessageQueueConfigs = (): Promise<MessageQueueConfig> => http.get('/queues/config')

export const putMessageQueueConfigs = (data: MessageQueueConfig): Promise<MessageQueueConfig> =>
  http.put('/queues/config', data)
