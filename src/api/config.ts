import http from '@/common/http'
import {
  AlarmSettings,
  Cluster,
  Dashboard,
  Limiter,
  Log,
  NamespaceItem,
  TeleStatus,
  Zone,
  Zones,
} from '@/types/config'
import { FileTransferConf, NamespaceConfig } from '@/types/typeAlias'

export const getClusterConfigs = (): Promise<Cluster> => http.get('/configs/cluster')

export const updateClusterConfigs = (data: Cluster): Promise<Cluster> =>
  http.put('/configs/cluster', data)

export const getLogConfigs = (): Promise<Log> => http.get('/configs/log')

export const updateLogConfigs = (data: Log): Promise<Log> => http.put('/configs/log', data)

export const getDashboardConfigs = (): Promise<Dashboard> => http.get('/configs/dashboard')

export const updateDashboardConfigs = (data: Dashboard): Promise<Dashboard> =>
  http.put('/configs/dashboard', data)

export const getDefaultZoneConfigs = (): Promise<Zone> => http.get('/configs/global_zone')

export const updateDefaultZoneConfigs = (data: Zone): Promise<Zone> =>
  http.put('/configs/global_zone', data)

export const getZoneConfigs = (): Promise<Zones> => http.get('/configs/zones')

export const updateZoneConfigs = (data: Zones): Promise<Zones> => http.put('/configs/zones', data)

export const getTeleStatus = (): Promise<TeleStatus> => http.get('telemetry/status')

export const getLimiters = (): Promise<Limiter> => http.get('/configs/limiter')

export const updateLimiters = (data: Limiter): Promise<Limiter> =>
  http.put('/configs/limiter', data)

export const updateTeleStatus = (data: TeleStatus): Promise<TeleStatus> =>
  http.put('telemetry/status', data)

export const getSysMon = (): Promise<AlarmSettings> => http.get('/configs/sysmon')

export const updateSysMon = (data: AlarmSettings): Promise<AlarmSettings> =>
  http.put('/configs/sysmon', data)

export const getFileTransConfigs = (): Promise<FileTransferConf> =>
  http.get('/configs/file_transfer')

export const updateFileTransConfigs = (data: FileTransferConf): Promise<FileTransferConf> =>
  http.put('/configs/file_transfer', data)

// Multi-tenancy API functions
export const getNamespaceList = (): Promise<Array<string>> => http.get('/mt/ns_list')

export const getNamespaceClientCount = (namespace: string): Promise<number> =>
  http.get(`/mt/ns/${namespace}/client_count`)

export const bulkImportNamespaces = (data: Array<NamespaceItem>): Promise<void> =>
  http.post('/mt/bulk_import_configs', data)

export const getNamespaceConfig = (namespace: string): Promise<NamespaceConfig> =>
  http.get(`/mt/ns/${namespace}/config`)

export const updateNamespaceConfig = (
  namespace: string,
  data: NamespaceConfig,
): Promise<NamespaceConfig> => http.put(`/mt/ns/${namespace}/config`, data)

export const getManagedNamespaceList = (): Promise<Array<string>> => http.get('/mt/managed_ns_list')

export const kickAllClientsInNamespace = (namespace: string): Promise<void> =>
  http.post(`/mt/ns/${namespace}/kick_all_clients`)

export const getNamespaceClientList = (namespace: string): Promise<Array<string>> =>
  http.get(`/mt/ns/${namespace}/client_list`)

export const deleteManagedNamespace = (namespace: string): Promise<void> =>
  http.delete(`/mt/ns/${namespace}`)

export const createManagedNamespace = (namespace: string): Promise<void> =>
  http.post(`/mt/ns/${namespace}`)
