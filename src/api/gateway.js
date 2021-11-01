import http from '@/common/http'

export function getGatewayList() {
  return http.get('/gateway')
}

export async function getGatewayListeners(name, id) {
  if (!name) return Promise.reject()
  return http.get(
    '/gateway/' +
      encodeURIComponent(name) +
      '/listeners' +
      ((id && '/' + encodeURIComponent(id)) || ''),
  )
}

export function addGatewayListener(name, body) {
  return http.post(`/gateway/${encodeURIComponent(name)}/listeners`, body)
}

export async function updateGatewayListener(name, id, body) {
  if (!name || !id) return Promise.reject()
  return http.put(
    '/gateway/' + encodeURIComponent(name) + '/listeners/' + encodeURIComponent(id),
    body,
  )
}

export async function updateGateway(name, body) {
  if (!name) return Promise.reject()
  return http.put('/gateway/' + encodeURIComponent(name), body)
}

export async function postGateway(body) {
  return http.post('/gateway', body)
}

export async function getGateway(name) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + encodeURIComponent(name))
}

export async function getGatewayClients(name, params) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + encodeURIComponent(name) + '/clients', { params: params })
}

export async function getGatewayClientDetail(name, id) {
  if (!name || !id) return Promise.reject()
  return http.get(`/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(id)}`)
}

export async function getGatewayClientSubs(name, id) {
  if (!name || !id) return Promise.reject()
  return http.get(
    `/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(id)}/subscriptions`,
  )
}

export async function addGatewayClientSubs(name, id, body) {
  if (!name || !id) return Promise.reject()
  return http.post(
    `/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(id)}/subscriptions`,
    body,
  )
}

export async function disconnGatewayClient(name, id) {
  if (!name || !id) return Promise.reject()
  return http.delete(`/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(id)}`)
}

export async function unsubscribeGatewayClientSub(name, id, topic) {
  if (!name || !id || !topic) return Promise.reject()
  return http.delete(
    `/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(
      id,
    )}/subscriptions/${encodeURIComponent(topic)}`,
  )
}

//gateway auth
export async function getGatewayAuth(name) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + encodeURIComponent(name) + '/authentication')
}

export async function deleteGatewayAuth(name) {
  if (!name) return Promise.reject()
  return http.delete('/gateway/' + encodeURIComponent(name) + '/authentication')
}

export async function updateGatewayAuth(name, body) {
  if (!name) return Promise.reject()
  return http.put('/gateway/' + encodeURIComponent(name) + '/authentication', body)
}

export async function addGatewayAuth(name, body) {
  if (!name) return Promise.reject()
  return http.post('/gateway/' + encodeURIComponent(name) + '/authentication', body)
}
