/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import qs from 'qs'

export function listClients(params = {}) {
  return http.get('/clients_v2', {
    params,
    // Multi-search support
    paramsSerializer: (params: any) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })
}

export function exactSearchClient(clientId: string) {
  return http.get(`/clients/${encodeURIComponent(clientId)}`)
}

// Search for connections of a single node
export function searchNodeClients(nodeName: string, clientId: string) {
  return http.get(`/nodes/${nodeName}/clients/${encodeURIComponent(clientId)}`)
}

export function disconnectClient(clientId: string) {
  return http.delete(`/clients/${encodeURIComponent(clientId)}`)
}

export function batchDisconnectClients(clientIds: string[]) {
  return http.post('/clients/kickout/bulk', clientIds)
}

export async function loadClientDetail(clientId: string) {
  return http.get(`/clients/${encodeURIComponent(clientId)}`, { errorsHandleCustom: [404] })
}

export function loadSubscriptions(clientId: string) {
  return http.get(`/clients/${encodeURIComponent(clientId)}/subscriptions`)
}

export function unsubscribe(clientId: string, topic: string) {
  if (null == topic) return
  return http.post(`/clients/${encodeURIComponent(clientId)}/unsubscribe`, { topic })
}

export function subscribe(
  clientId: string,
  topic: { qos: number; topic: string; nl?: 1 | 0; rap?: 1 | 0; rh?: 2 | 1 | 0 },
) {
  const topicData = pick(topic, ['qos', 'topic', 'nl', 'rap', 'rh'])
  return http.post(`/clients/${encodeURIComponent(clientId)}/subscribe`, topicData)
}

export function loadMsgQueue(
  clientId: string,
  query: { position?: number | string; limit: number },
) {
  return http.get(`/clients/${encodeURIComponent(clientId)}/mqueue_messages`, { params: query })
}

export function loadInflightMsgs(
  clientId: string,
  query: { position?: number | string; limit: number },
) {
  return http.get(`/clients/${encodeURIComponent(clientId)}/inflight_messages`, { params: query })
}
