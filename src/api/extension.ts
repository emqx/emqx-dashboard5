import http from '@/common/http'
import { Retainer, RetainerMessage, RetainerMessageDetail, SysTopics } from '@/types/extension'
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

export function getRetainerList(
  params: Record<string, any>,
): Promise<ListDataWithPagination<RetainerMessage>> {
  params.topic = params.topic || undefined
  return http.get('/mqtt/retainer/messages', { params })
}

export function getRetainerTopic(topic: string): Promise<RetainerMessageDetail> | undefined {
  if (null == topic) return
  return http.get('/mqtt/retainer/message/' + encodeURIComponent(topic))
}

export function delRetainerTopic(topic: string): Promise<any> | undefined {
  if (null == topic) return
  return http.delete('/mqtt/retainer/message/' + encodeURIComponent(topic))
}

export function delAllRetainerMessages(): Promise<void> {
  return http.delete('/mqtt/retainer/messages')
}

/* System Topics */
export function getSystemTopicsConfig(): Promise<SysTopics> {
  return http.get('/configs/sys_topics')
}

export function updateSystemTopicConfig(params: SysTopics): Promise<SysTopics> {
  return http.put('/configs/sys_topics', params)
}
