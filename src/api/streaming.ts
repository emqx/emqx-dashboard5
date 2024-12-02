import http from '@/common/http'
import { Stream, StreamingAuthn, StreamingAuthz } from '@/types/typeAlias'

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
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  return {
    groups: [
      {
        generation_id: 2,
        group_id: 'emqx-kafka-consumer-PROBE_Q1mF4o9G',
        member_number: 0,
        state: 'Empty',
        topic_number: 0,
      },
      {
        generation_id: 2330,
        group_id: 'emqx-kafka-consumer-source-191a47',
        member_number: 0,
        state: 'Empty',
        topic_number: 0,
      },
      {
        generation_id: 2,
        group_id: 'emqx-kafka-consumer-PROBE_lhuxZkaW',
        member_number: 0,
        state: 'Empty',
        topic_number: 0,
      },
    ],
  }
  // return http.get('/streaming/consumer_groups')
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
  return http.get('/streaming/authn')
}

export const createStreamingAuthn = (data: StreamingAuthn) => {
  return http.post('/streaming/authn', data)
}

export const deleteStreamingAuthn = (username: string) => {
  return http.delete(`/streaming/authn/${encodeURIComponent(username)}`)
}

export const getStreamingAuthzList = () => {
  return http.get('/streaming/authz')
}

export const createStreamingAuthz = (data: StreamingAuthz) => {
  return http.post('/streaming/authz', data)
}

export const deleteStreamingAuthz = (username: string) => {
  return http.delete(`/streaming/authz/${encodeURIComponent(username)}`)
}
