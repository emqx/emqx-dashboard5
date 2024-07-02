import http from '@/common/http'
import { ClusterLink } from '@/types/typeAlias'

export const getClusterLinks = (): Promise<Array<ClusterLink>> => {
  return http.get(`/cluster/links`)
}

export const putClusterLinks = (data: Array<ClusterLink>): Promise<Array<ClusterLink>> => {
  return http.put(`/cluster/links`, data)
}
