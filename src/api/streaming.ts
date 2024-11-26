import http from '@/common/http'

export const getMetrics = () => {
  return http.get('/streaming/metrics')
}

export const getStreamDetail = (streamName: string) => {
  return http.get(`/streaming/streams/${encodeURIComponent(streamName)}`)
}

export const deleteStream = (streamName: string) => {
  return http.delete(`/streaming/streams/${encodeURIComponent(streamName)}`)
}

export const createStream = (data) => {
  return http.post('/streaming/streams', data)
}

export const getStreams = () => {
  return http.get('/streaming/streams')
}

export const getConsumerGroups = () => {
  return http.get('/streaming/consumer_groups')
}

export const getConsumerGroup = (groupId: string) => {
  return http.get(`/streaming/consumer_groups/${encodeURIComponent(groupId)}`)
}

export const getConfig = () => {
  return http.get('/streaming/config')
}

export const updateConfig = (data) => {
  return http.put('/streaming/config', data)
}
