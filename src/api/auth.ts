/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import { AuthzSetting, BuiltInDBItem, BuiltInDBRule, ImportResult, Metrics } from '@/types/auth'
import { ListDataWithPagination } from '@/types/common'
import { BuiltInDBType } from '@/types/enum'
import { NsParams } from '@/types/rule'

export function listAuthn(params = {}) {
  return http.get('/authentication', { params })
}

export function queryAuthnItemMetrics(id: string): Promise<Metrics> {
  return http.get(`/authentication/${encodeURIComponent(id)}/status`)
}

export function resetAuthnItemMetrics(id: string): Promise<void> {
  return http.post(`/authentication/${encodeURIComponent(id)}/metrics/reset`)
}

export function listAuthz(params = {}) {
  return http.get('/authorization/sources', { params })
}

export function queryAuthzItemMetrics(type: string): Promise<Metrics> {
  return http.get(`/authorization/sources/${encodeURIComponent(type)}/status`)
}

export function resetAuthzItemMetrics(type: string): Promise<void> {
  return http.post(`/authorization/sources/${encodeURIComponent(type)}/metrics/reset`)
}

export function listAuthzSetting(params = {}): Promise<AuthzSetting> {
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

export function deleteAuthnUser(id: string, userId: string, params?: NsParams) {
  return http.delete(
    `/authentication/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
    { params },
  )
}

export function updateAuthnUser(
  id: string,
  userId: string,
  body: { [key: string]: any },
  params?: NsParams,
) {
  return http.put(
    `/authentication/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
    body,
    { params },
  )
}

export function uploadUsers(
  id: string,
  type: 'plain' | 'hash',
  file: { raw: File; name: string },
): Promise<ImportResult> {
  const formData = new FormData()
  formData.append('filename', file.raw)
  return http.post(
    `/authentication/${encodeURIComponent(id)}/import_users?type=${encodeURIComponent(type)}`,
    formData,
    {
      params: { id },
    },
  )
}

export function moveAuthn(id: string, positionStr: string) {
  return http.put(`/authentication/${encodeURIComponent(id)}/position/${positionStr}`)
}

type ReturnByParam<T> = T extends BuiltInDBType.All
  ? { rules: BuiltInDBRule[] }
  : ListDataWithPagination<BuiltInDBItem>
export function loadBuiltInDatabaseData<T extends BuiltInDBType>(
  type: T,
  params = {},
): Promise<ReturnByParam<T>> {
  return http.get(`/authorization/sources/built_in_database/rules/${encodeURIComponent(type)}`, {
    params,
  })
}

export function createBuiltInDatabaseData(
  type: string,
  body: { [key: string]: any },
  params?: { ns?: string },
) {
  return http.post(
    `/authorization/sources/built_in_database/rules/${encodeURIComponent(type)}`,
    body,
    { params },
  )
}

export function deleteBuiltInDatabaseData(type: string, key: string, params?: { ns?: string }) {
  return http.delete(
    `/authorization/sources/built_in_database/rules/${encodeURIComponent(type)}/${encodeURIComponent(key)}`,
    { params },
  )
}

export function updateBuiltInDatabaseData(
  type: string,
  key: string,
  body: { [key: string]: any },
  params?: { ns?: string },
) {
  return http.put(
    `/authorization/sources/built_in_database/rules/${encodeURIComponent(type)}/${encodeURIComponent(key)}`,
    body,
    { params },
  )
}

export function updateAllBuiltInDatabaseData(body = {}, params?: { ns?: string }) {
  return http.post('/authorization/sources/built_in_database/rules/all', body, { params })
}

export function loadAuthnSettings() {
  return http.get('/authentication/settings')
}

export function updateAuthnSettings(body = {}) {
  return http.put('/authentication/settings', body)
}

export function loadAuthnCacheStatus() {
  return http.get('/authentication/node_cache/status')
}

export function resetAuthnCacheStatus() {
  return http.post('/authentication/node_cache/reset')
}

export function loadAuthzSettings() {
  return http.get('/authorization/node_cache')
}

export function updateAuthzSettings(body = {}) {
  return http.put('/authorization/node_cache', body)
}

export function loadAuthzCacheStatus() {
  return http.get('/authorization/node_cache/status')
}

export function resetAuthzCacheStatus() {
  return http.post('/authorization/node_cache/reset')
}

export default {}
