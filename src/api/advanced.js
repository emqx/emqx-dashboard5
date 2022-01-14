import http from '@/common/http'

export function getRetainer() {
  return http.get('/mqtt/retainer')
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

export function getTopicRewrite() {
  return http.get('/mqtt/topic_rewrite')
}

export function editTopicRewrite(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/topic_rewrite', data)
}

export function getSubscribe() {
  return http.get('/mqtt/auto_subscribe')
}

export function editSubscribe(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/auto_subscribe', data)
}

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

export function getDelayedInfo(id) {
  if (id == null) return
  return http.get('/mqtt/delayed/messages/' + encodeURIComponent(id))
}

export function delDelayedInfo(id) {
  if (null == id) return
  return http.delete('/mqtt/delayed/messages/' + encodeURIComponent(id))
}

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
