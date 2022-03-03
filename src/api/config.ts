import http from '@/common/http'
import { Cluster } from '@/types/config'

export const getClusterConfigs = (): Promise<Cluster> => {
  return http.get('/configs/cluster')
}
