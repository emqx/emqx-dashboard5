import http from '@/common/http'
import {
  Cluster,
  Log,
  Dashboard,
  Zones,
  Zone,
  TeleStatus,
  RateItem,
  LimiterType,
  Rate,
  AlarmSettings,
} from '@/types/config'

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

export const getLimiters = (): Promise<Rate> => http.get('/configs/limiter')

export const updateTeleStatus = (data: TeleStatus): Promise<TeleStatus> =>
  http.put('telemetry/status', data)

export const getRateConfigsByType = (limiterType: LimiterType): Promise<RateItem> =>
  http.get(`/configs/limiter/${limiterType}`)

export const updateRateConfigsByType = (
  limiterType: LimiterType,
  data: RateItem,
): Promise<RateItem> => http.put(`/configs/limiter/${limiterType}`, data)

export const getSysMon = (): Promise<AlarmSettings> => http.get('/configs/sysmon')

export const updateSysMon = (data: AlarmSettings): Promise<AlarmSettings> =>
  http.put('/configs/sysmon', data)
