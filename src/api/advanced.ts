import http from '@/common/http'
import { transMemorySizeNumToStr } from '@/common/tools'
import {
  AutoSubscribe,
  Delayed,
  DelayedMessage,
  Retainer,
  RetainerMessage,
  RetainerMessageDetail,
  Rewrite,
  SysTopics,
} from '@/types/advanced'
import { ListDataWithPagination } from '@/types/common'

/* Retainer */
export async function getRetainer(): Promise<Retainer> {
  try {
    const ret = await http.get('/mqtt/retainer')
    let { max_payload_size, msg_clear_interval, msg_expiry_interval } = ret
    max_payload_size =
      typeof max_payload_size === 'number'
        ? transMemorySizeNumToStr(max_payload_size)
        : max_payload_size
    msg_clear_interval =
      typeof msg_clear_interval === 'number' ? msg_clear_interval + 's' : msg_clear_interval
    msg_expiry_interval =
      typeof msg_expiry_interval === 'number' ? msg_expiry_interval + 's' : msg_expiry_interval
    return Promise.resolve({
      ...ret,
      max_payload_size,
      msg_clear_interval,
      msg_expiry_interval,
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

export function updateRetainer(body: Retainer): Promise<any> {
  const data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/retainer', data)
}

export function getRetainerList(): Promise<Array<RetainerMessage>> {
  return http.get('/mqtt/retainer/messages')
}

export function getRetainerTopic(topic: string): Promise<RetainerMessageDetail> | undefined {
  if (null == topic) return
  return http.get('/mqtt/retainer/message/' + encodeURIComponent(topic))
}

export function delRetainerTopic(topic: string): Promise<any> | undefined {
  if (null == topic) return
  return http.delete('/mqtt/retainer/message/' + encodeURIComponent(topic))
}

/* System Topics */
export function getSystemTopicsConfig(): Promise<SysTopics> {
  return http.get('/mqtt/sys_topics')
}

export function updateSystemTopicConfig(params: SysTopics): Promise<SysTopics> {
  return http.put('/mqtt/sys_topics', params)
}

/* Rewrite */
export function getTopicRewrite(): Promise<Array<Rewrite>> {
  return http.get('/mqtt/topic_rewrite')
}

export function editTopicRewrite(body: Rewrite): Promise<Rewrite> {
  const data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/topic_rewrite', data)
}

/* Proxy subscription */
export function getSubscribe(): Promise<{ topics: Array<AutoSubscribe> }> {
  return http.get('/mqtt/auto_subscribe')
}

export function editSubscribe(body: {
  topics: Array<AutoSubscribe>
}): Promise<{ topics: Array<AutoSubscribe> }> {
  const data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/auto_subscribe', data)
}

/* Delayed */
export function getDelayedConfig(): Promise<Delayed> {
  return http.get('/mqtt/delayed')
}

export function editDelayedConfig(body: Delayed): Promise<any> {
  const data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/delayed', data)
}

export function getDelayedList(params: {
  page: number
  limit: number
}): Promise<ListDataWithPagination<DelayedMessage>> {
  return http.get('/mqtt/delayed/messages', { params: params })
}

export function getDelayedInfo(node: string, id: string): Promise<DelayedMessage> | undefined {
  if (!node || id == null) return
  return http.get(`/mqtt/delayed/messages/${encodeURIComponent(node)}/${encodeURIComponent(id)}`)
}

export function delDelayedInfo(node: string, id: string): Promise<any> | undefined {
  if (!node || null == id) return
  return http.delete(`/mqtt/delayed/messages/${encodeURIComponent(node)}/${encodeURIComponent(id)}`)
}
