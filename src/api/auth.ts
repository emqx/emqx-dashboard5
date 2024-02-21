/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import { AuthzSetting, Metrics } from '@/types/auth'

export function listAuthn(params = {}) {
  return http.get('/authentication', { params })
}

export function queryAuthnItemMetrics(id: string): Promise<Metrics> {
  return http.get(`/authentication/${id}/status`)
}

export function listAuthz(params = {}) {
  return http.get('/authorization/sources', { params })
}

export function queryAuthzItemMetrics(type: string): Promise<Metrics> {
  return http.get(`/authorization/sources/${type}/status`)
}

export function listAuthzSetting(params = {}) {
  return http.get('/authorization/settings', { params })
}

export function clearCache() {
  return http.delete('/authorization/cache')
}

export function updateAuthzSetting(body: AuthzSetting) {
  return http.put('/authorization/settings', body)
}

export function updateAuthz(type: string, body = {}) {
  return http.put(`/authorization/sources/${encodeURIComponent(type)}`, body)
}

export function createAuthz(body = {}) {
  return http.post('/authorization/sources', body)
}

export function deleteAuthz(type: string) {
  return http.delete(`/authorization/sources/${encodeURIComponent(type)}`)
}

export function loadAuthz(type: string) {
  return http.get(`/authorization/sources/${encodeURIComponent(type)}`)
}

export function moveAuthz(type: string, positionStr: string): Promise<void> {
  return http.post(`/authorization/sources/${encodeURIComponent(type)}/move`, {
    position: positionStr,
  })
}

export function createAuthn(body = {}) {
  return http.post('/authentication', body)
}

export function updateAuthn(id: string, body: any) {
  delete body.id
  return http.put(`/authentication/${encodeURIComponent(id)}`, body)
}

export function deleteAuthn(id: string) {
  return http.delete(`/authentication/${encodeURIComponent(id)}`)
}

export function loadAuthn(id: string) {
  return http.get(`/authentication/${encodeURIComponent(id)}`)
}

export function createAuthnUsers(id: string, body = {}) {
  return http.post(`/authentication/${encodeURIComponent(id)}/users`, body)
}

export function loadAuthnUsers(id: string, params = {}) {
  return http.get(`/authentication/${encodeURIComponent(id)}/users`, {
    params,
  })
}

export function deleteAuthnUser(id: string, userId: string) {
  return http.delete(
    `/authentication/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
  )
}

export function updateAuthnUser(id: string, userId: string, body: { [key: string]: any }) {
  return http.put(
    `/authentication/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
    body,
  )
}

export function uploadUsers(id: string, type: 'plain' | 'hash', file: { raw: File; name: string }) {
  const formData = new FormData()
  formData.append('filename', file.raw)
  return http.post(
    `/authentication/${encodeURIComponent(id)}/import_users?type=${type}`,
    formData,
    {
      params: { id },
    },
  )
}

export function moveAuthn(id: string, positionStr: string) {
  return http.put(`/authentication/${id}/position/${positionStr}`)
}

export function loadBuiltInDatabaseData(type: string, params = {}) {
  return http.get(`/authorization/sources/built_in_database/rules/${type}`, {
    params,
  })
}

export function createBuiltInDatabaseData(type: string, body: { [key: string]: any }) {
  return http.post(`/authorization/sources/built_in_database/rules/${type}`, body)
}

export function deleteBuiltInDatabaseData(type: string, key: string) {
  return http.delete(
    `/authorization/sources/built_in_database/rules/${type}/${encodeURIComponent(key)}`,
  )
}

export function updateBuiltInDatabaseData(type: string, key: string, body: { [key: string]: any }) {
  return http.put(
    `/authorization/sources/built_in_database/rules/${type}/${encodeURIComponent(key)}`,
    body,
  )
}

export function updateAllBuiltInDatabaseData(body = {}) {
  return http.post('/authorization/sources/built_in_database/rules/all', body)
}

export default {}
