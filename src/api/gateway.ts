/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'

export function getGatewayList() {
  return http.get('/gateway')
}

export async function getGatewayListeners(name: string, id: string) {
  if (!name) return Promise.reject()
  return http.get(
    '/gateway/' +
      encodeURIComponent(name) +
      '/listeners' +
      ((id && '/' + encodeURIComponent(id)) || ''),
  )
}

export function addGatewayListener(name: string, body: { [key: string]: any }) {
  return http.post(`/gateway/${encodeURIComponent(name)}/listeners`, body)
}

export async function updateGatewayListener(
  name: string,
  id: string,
  body: { [key: string]: any },
) {
  if (!name || !id) return Promise.reject()
  return http.put(
    '/gateway/' + encodeURIComponent(name) + '/listeners/' + encodeURIComponent(id),
    body,
  )
}

export async function deleteGatewayListener(name: string, id: string) {
  if (!name || !id) return Promise.reject()
  return http.delete(
    '/gateway/' + encodeURIComponent(name) + '/listeners/' + encodeURIComponent(id),
  )
}

export async function updateGateway(name: string, body: { [key: string]: any }) {
  if (!name) return Promise.reject()
  return http.put('/gateway/' + encodeURIComponent(name), body)
}

export async function postGateway(body: { [key: string]: any }) {
  return http.post('/gateway', body)
}

export async function getGateway(name: string) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + encodeURIComponent(name))
}

export async function getGatewayClients(name: string, params = {}) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + encodeURIComponent(name) + '/clients', {
    params,
  })
}

export async function getGatewayClientDetail(name: string, id: string) {
  if (!name || !id) return Promise.reject()
  return http.get(`/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(id)}`)
}

export async function getGatewayClientSubs(name: string, id: string) {
  if (!name || !id) return Promise.reject()
  return http.get(
    `/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(id)}/subscriptions`,
  )
}

export async function addGatewayClientSubs(name: string, id: string, body: { [key: string]: any }) {
  if (!name || !id) return Promise.reject()
  return http.post(
    `/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(id)}/subscriptions`,
    body,
  )
}

export async function disconnGatewayClient(name: string, id: string) {
  if (!name || !id) return Promise.reject()
  return http.delete(`/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(id)}`)
}

export async function unsubscribeGatewayClientSub(name: string, id: string, topic: string) {
  if (!name || !id || !topic) return Promise.reject()
  return http.delete(
    `/gateway/${encodeURIComponent(name)}/clients/${encodeURIComponent(
      id,
    )}/subscriptions/${encodeURIComponent(topic)}`,
  )
}

//gateway auth
export async function getGatewayAuth(name: string) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + encodeURIComponent(name) + '/authentication')
}

export async function deleteGatewayAuth(name: string) {
  if (!name) return Promise.reject()
  return http.delete('/gateway/' + encodeURIComponent(name) + '/authentication')
}

export async function updateGatewayAuth(name: string, body: { [key: string]: any }) {
  if (!name) return Promise.reject()
  return http.put('/gateway/' + encodeURIComponent(name) + '/authentication', body)
}

export async function addGatewayAuth(name: string, body: { [key: string]: any }) {
  if (!name) return Promise.reject()
  return http.post('/gateway/' + encodeURIComponent(name) + '/authentication', body)
}

export async function getGatewayUserManagement(name: string, params = {}) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + encodeURIComponent(name) + '/authentication/users', { params })
}

export async function addGatewayUserManagement(name: string, body: { [key: string]: any }) {
  if (!name) return Promise.reject()
  return http.post('/gateway/' + encodeURIComponent(name) + '/authentication/users', body)
}

export async function updateGatewayUser(name: string, uid: string, data: { [key: string]: any }) {
  if (!name || !uid) return Promise.reject()
  return http.put(
    '/gateway/' + encodeURIComponent(name) + '/authentication/users/' + encodeURIComponent(uid),
    data,
  )
}

export async function deleteGatewayUser(name: string, uid: string) {
  if (!name || !uid) return Promise.reject()
  return http.delete(
    '/gateway/' + encodeURIComponent(name) + '/authentication/users/' + encodeURIComponent(uid),
  )
}

export async function getGatewayUser(name: string, uid: string) {
  if (!name || !uid) return Promise.reject()
  return http.get(
    '/gateway/' + encodeURIComponent(name) + '/authentication/users/' + encodeURIComponent(uid),
  )
}
