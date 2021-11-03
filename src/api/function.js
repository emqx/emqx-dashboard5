import http from '@/common/http'

export function loadApp() {
  return http.get('/apps')
}

export function showApp(appid) {
  return http.get(`/apps/${appid}`)
}

export function createApp(body = {}) {
  return http.post('/apps', body)
}

export function updateApp(appid, body = {}) {
  return http.put(`/apps/${appid}`, body)
}

export function destroyAPP(appid) {
  return http.delete(`/apps/${appid}`)
}

export function loadUser() {
  return http.get('/users')
}

export function createUser(body = {}) {
  return http.post(`/users`, body)
}

export function updateUser(username, body = {}) {
  return http.put(`/users/${username}`, body)
}

export function changePassword(username, body = {}) {
  return http.put(`/users/${username}/change_pwd`, body)
}

export function destroyUser(username) {
  return http.delete(`/users/${username}`)
}

export function loadBlacklist(params = {}) {
  return http.get('/banned', { params })
}

export function createBlacklist(body) {
  return http.post('/banned', body)
}

export function deleteBlacklist({ who, as }) {
  return http.delete(`/banned/${as}/${encodeURIComponent(who)}`)
}

export default {}
