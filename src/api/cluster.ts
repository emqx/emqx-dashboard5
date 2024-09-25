import http from '@/common/http'
import type {
  ClusterLinkingForm,
  CreatedClusterLinking,
  ClusterLinkingMetrics,
  ClusterLinkingFormForUpdate,
} from '@/types/typeAlias'

export const getClusterLinking = (): Promise<CreatedClusterLinking[]> => {
  return http.get(`/cluster/links`)
}

export const postClusterLinking = (data: ClusterLinkingForm): Promise<CreatedClusterLinking> => {
  return http.post(`/cluster/links`, data)
}

export const putClusterLinking = (
  name: string,
  data: ClusterLinkingFormForUpdate,
): Promise<CreatedClusterLinking> => {
  return http.put(`/cluster/links/link/${encodeURIComponent(name)}`, data)
}

export const deleteClusterLinking = (name: string): Promise<void> => {
  return http.delete(`/cluster/links/link/${encodeURIComponent(name)}`)
}

export const getClusterLinkingDetail = (name: string): Promise<CreatedClusterLinking> => {
  return http.get(`/cluster/links/link/${encodeURIComponent(name)}`)
}

export const getClusterLinkingMetrics = (name: string): Promise<ClusterLinkingMetrics> => {
  return http.get(`/cluster/links/link/${encodeURIComponent(name)}/metrics`)
}

export const resetClusterLinkingMetrics = (name: string): Promise<void> => {
  return http.put(`/cluster/links/link/${encodeURIComponent(name)}/metrics/reset`)
}
