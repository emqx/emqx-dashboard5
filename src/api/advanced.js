import http from '@/common/http'
import { transMemorySizeNumToStr } from '@/common/tools'

/* Retainer */
export async function getRetainer() {
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

export function updateRetainer(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/retainer', data)
}

export function getRetainerList() {
  return http.get('/mqtt/retainer/messages')
}

export function getRetainerTopic(topic) {
  if (null == topic) return
  return http.get('/mqtt/retainer/message/' + encodeURIComponent(topic))
}

export function delRetainerTopic(topic) {
  if (null == topic) return
  return http.delete('/mqtt/retainer/message/' + encodeURIComponent(topic))
}

/* Rewrite */
export function getTopicRewrite() {
  return http.get('/mqtt/topic_rewrite')
}

export function editTopicRewrite(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/topic_rewrite', data)
}

/* Proxy subscription */
export function getSubscribe() {
  return http.get('/mqtt/auto_subscribe')
}

export function editSubscribe(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/auto_subscribe', data)
}

/* Delayed */
export function getDelayedConfig() {
  return http.get('/mqtt/delayed')
}

export function editDelayedConfig(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/delayed', data)
}

export function getDelayedList(params) {
  return http.get('/mqtt/delayed/messages', { params: params })
}

export function getDelayedInfo(node, id) {
  if (!node || id == null) return
  return http.get(`/mqtt/delayed/messages/${encodeURIComponent(node)}/${encodeURIComponent(id)}`)
}

export function delDelayedInfo(node, id) {
  if (!node || null == id) return
  return http.delete(`/mqtt/delayed/messages/${encodeURIComponent(node)}/${encodeURIComponent(id)}`)
}

/* Event msg */
export function getEventMsg() {
  return http.get('/mqtt/event_message')
}

export function editEventMsg(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/event_message', data)
}

//topic metrics
export function getTopicMetrics(topic = null) {
  if (null == topic) {
    return http.get('/mqtt/topic_metrics')
  }
  return http.get('/mqtt/topic_metrics/' + encodeURIComponent(topic))
}

export function addTopicMetrics(topic) {
  let data = { topic: topic }
  return http.post('/mqtt/topic_metrics', data)
}

export function deleteTopicMetrics(topic) {
  if (topic == null) return
  return http.delete('/mqtt/topic_metrics/' + encodeURIComponent(topic))
}

export function resetTopicMetrics(topic) {
  if (topic == null) return
  return http.put(`/mqtt/topic_metrics`, { action: 'reset', topic })
}
