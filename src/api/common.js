import http from '@/common/http'

//account
export function login(user = {}) {
  return http.post('/login', user)
}

export function logout(username) {
  return http.post('/logout', { username })
}

export function loadStats() {
  return http.get('/stats')
}

export function loadLicenseInfo() {
  return http.get('/license_info')
}
//metrics
export function loadMetrics() {
  return http.get('/metrics')
}

export function loadCurrentMetrics() {
  return http.get('/monitor/current')
}

//metrics integration
export function getStatsd() {
  return http.get('/statsd')
}

export function setStatsd(body) {
  return http.put('/statsd', body)
}

export function getPrometheus() {
  return http.get('/prometheus')
}

export function setPrometheus(body) {
  return http.put('/prometheus', body)
}

export async function loadNodes() {
  return http.get('/nodes')
}

//Alarms
export async function loadAlarm(history = false, params = {}) {
  return http.get('/alarms', {
    params: { activated: String(!history), ...params },
  })
}

export async function clearHistoryAlarm() {
  return http.delete('/alarms')
}

//cluster
export const loadCluster = async () => {
  const res = await http.get('/cluster')
  const { config } = res
  if (res.type === 'mcast') {
    res.config.ports = config.ports.join(',')
    res.config.loop = JSON.stringify(config.loop)
  } else if (res.type === 'etcd') {
    res.config.node_ttl = config.node_ttl
  }
  return res
}

// 邀请节点加入
export const inviteNode = async (data) => {
  const body = {
    node: data.config.node,
  }
  return http.post('/cluster/invite_node', body).catch()
}

// 集群移除节点
export const forceLeaveNode = async (nodename) => {
  return http.delete(`/cluster/force_leave/${nodename}`).catch()
}

//topics
export const listTopics = (params = {}) => {
  params.topic = params.topic || undefined
  return http.get('/routes', { params })
}

// 获取订阅
export function listSubscriptions(params = {}) {
  return http.get('/subscriptions', { params })
}
