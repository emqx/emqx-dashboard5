import http from '@/common/http'
import _ from 'lodash'

export function listAuthn(params = {}) {
  return http.get('/authentication', { params })
}

export function listAuthz(params = {}) {
  return http.get('/authorization/sources', { params })
}

export function listAuthzSetting(params = {}) {
  return http.get('/authorization/settings', { params })
}

export function updateAuthzSetting(body) {
  const {
    cache: { ttl, unit },
  } = body
  const data = _.cloneDeep(body)
  delete data.cache.unit
  data.cache.ttl = `${ttl}${unit}`
  return http.put('/authorization/settings', data)
}

export function updateAuthz(type, body) {
  return http.put(`/authorization/sources/${encodeURIComponent(type)}`, body)
}

export function createAuthz(body) {
  return http.post('/authorization/sources', body)
}

export function deleteAuthz(type) {
  return http.delete(`/authorization/sources/${encodeURIComponent(type)}`)
}

export function loadAuthz(type) {
  return http.get(`/authorization/sources/${encodeURIComponent(type)}`)
}

export function moveAuthz(type, body) {
  return http.post(`/authorization/sources/${encodeURIComponent(type)}/move`, body)
}

export function createAuthn(body) {
  return http.post('/authentication', body)
}

export function updateAuthn(id, body) {
  delete body.id
  return http.put(`/authentication/${encodeURIComponent(id)}`, body)
}

export function deleteAuthn(id) {
  return http.delete(`/authentication/${encodeURIComponent(id)}`)
}

export function loadAuthn(id) {
  return http.get(`/authentication/${encodeURIComponent(id)}`)
}

export function createAuthnUsers(id, body) {
  return http.post(`/authentication/${encodeURIComponent(id)}/users`, body)
}

export function loadAuthnUsers(id, params = {}) {
  return http.get(`/authentication/${encodeURIComponent(id)}/users`, {
    params,
  })
}

export function deleteAuthnUser(id, userId) {
  return http.delete(
    `/authentication/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
  )
}

export function updateAuthnUser(id, userId, body) {
  return http.put(
    `/authentication/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
    body,
  )
}

export function moveAuthn(id, body) {
  return http.post(`/authentication/${encodeURIComponent(id)}/move`, body)
}

export function loadBuiltInDatabaseData(type, params = {}) {
  return http.get(`/authorization/sources/built-in-database/${type}`, {
    params,
  })
}

export function createBuiltInDatabaseData(type, body) {
  return http.post(`/authorization/sources/built-in-database/${type}`, body)
}

export function deleteBuiltInDatabaseData(type, key) {
  return http.delete(`/authorization/sources/built-in-database/${type}/${encodeURIComponent(key)}`)
}

export function updateBuiltInDatabaseData(type, key, body) {
  return http.put(
    `/authorization/sources/built-in-database/${type}/${encodeURIComponent(key)}`,
    body,
  )
}

export function updateAllBuiltInDatabaseData(body) {
  return http.put('/authorization/sources/built-in-database/all', body)
}

export default {}
