import http from '@/common/http'
import {
  DeleteStreamingAuthnParams,
  Stream,
  StreamingAuthn,
  StreamingAuthz,
} from '@/types/typeAlias'

export const getStreamingMetrics = () => {
  return http.get('/streaming/metrics')
}

export const getEndpoints = () => {
  return http.get('/streaming/stream_endpoints')
}

export const getStreamDetail = (streamName: string) => {
  return http.get(`/streaming/streams/${encodeURIComponent(streamName)}`)
}

export const deleteStream = (streamName: string) => {
  return http.delete(`/streaming/streams/${encodeURIComponent(streamName)}`)
}

export const createStream = (data: Stream) => {
  return http.post('/streaming/streams', data)
}

export const getStreams = () => {
  return http.get('/streaming/streams')
}

export const getConsumerGroups = () => {
  return http.get('/streaming/consumer_groups')
}

export const getConsumerGroupDetail = (groupId: string) => {
  return http.get(`/streaming/consumer_groups/${encodeURIComponent(groupId)}`)
}

export const getConfig = () => {
  return http.get('/streaming/config')
}

export const updateConfig = (data: any) => {
  return http.put('/streaming/config', data)
}

export const getStreamingAuthnList = () => {
  return http.get('/streaming/authentication/basic/users')
}

export const createStreamingAuthn = (data: StreamingAuthn) => {
  return http.post('/streaming/authentication/basic/users', data)
}

export const updateStreamingAuthn = (data: StreamingAuthn) => {
  return http.put(`/streaming/authentication/basic/users`, data)
}

export const deleteStreamingAuthn = (data: DeleteStreamingAuthnParams): Promise<void> => {
  return http.post('/streaming/authentication/basic/users/delete', data)
}

export const getStreamingAuthzList = () => {
  return http.get('/streaming/authorization/acls')
}

export const createStreamingAuthz = (data: StreamingAuthz) => {
  return http.post('/streaming/authorization/acls', data)
}
export const deleteStreamingAuthz = (data: StreamingAuthz): Promise<void> => {
  return http.post(`/streaming/authorization/acls/delete`, data)
}
