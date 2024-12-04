import http from '@/common/http'
import {
  StreamingAuthnBasicUserList,
  StreamingAuthzAclList,
  StreamingConsumerGroups,
  StreamingStreamsList,
} from '@/types/schemas/streaming.schemas'
import {
  DeleteStreamingAuthnParams,
  Stream,
  StreamDetails,
  StreamingAuthn,
  StreamingAuthz,
  StreamingConfig,
  StreamingConsumerGroupDetails,
  StreamingMetrics,
} from '@/types/typeAlias'

export const getConfig = (): Promise<StreamingConfig> => {
  return http.get('/streaming/config')
}

export const updateConfig = (data: StreamingConfig): Promise<StreamingConfig> => {
  return http.put('/streaming/config', data)
}

export const getStreamingMetrics = (): Promise<StreamingMetrics> => {
  return http.get('/streaming/metrics')
}

export const getEndpoints = () => {
  return http.get('/streaming/stream_endpoints')
}

export const getStreamDetail = (streamName: string): Promise<StreamDetails> => {
  return http.get(`/streaming/streams/${encodeURIComponent(streamName)}`)
}

export const deleteStream = (streamName: string): Promise<void> => {
  return http.delete(`/streaming/streams/${encodeURIComponent(streamName)}`)
}

export const createStream = (data: Stream): Promise<Stream> => {
  return http.post('/streaming/streams', data)
}

export const getStreams = (): Promise<StreamingStreamsList> => {
  return http.get('/streaming/streams')
}

export const getConsumerGroups = (): Promise<StreamingConsumerGroups> => {
  return http.get('/streaming/consumer_groups')
}

export const getConsumerGroupDetail = (groupId: string): Promise<StreamingConsumerGroupDetails> => {
  return http.get(`/streaming/consumer_groups/${encodeURIComponent(groupId)}`)
}

export const getStreamingAuthnList = (): Promise<StreamingAuthnBasicUserList> => {
  return http.get('/streaming/authentication/basic/users')
}

export const createStreamingAuthn = (data: StreamingAuthn): Promise<StreamingAuthn> => {
  return http.post('/streaming/authentication/basic/users', data)
}

export const updateStreamingAuthn = (data: StreamingAuthn): Promise<StreamingAuthn> => {
  return http.put(`/streaming/authentication/basic/users`, data)
}

export const deleteStreamingAuthn = (data: DeleteStreamingAuthnParams): Promise<void> => {
  return http.post('/streaming/authentication/basic/users/delete', data)
}

export const getStreamingAuthzList = (): Promise<StreamingAuthzAclList> => {
  return http.get('/streaming/authorization/acls')
}

export const createStreamingAuthz = (data: StreamingAuthz): Promise<StreamingAuthz> => {
  return http.post('/streaming/authorization/acls', data)
}
export const deleteStreamingAuthz = (data: StreamingAuthz): Promise<void> => {
  return http.post(`/streaming/authorization/acls/delete`, data)
}
