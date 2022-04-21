/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import { ListDataWithPagination } from '@/types/common'
import { ChartDataItem, NodeMsg, NodeStatisticalData, Prometheus, StatsD } from '@/types/dashboard'

//account
export function login(user: { password: string; username: string }): Promise<{
  license: {
    edition: string
  }
  token: string
  version: string
}> {
  return http.post('/login', user)
}

export function logout(username: string) {
  return http.post('/logout', { username })
}

export function loadLicenseInfo() {
  return http.get('/license_info')
}
//metrics
export function loadMetrics(): Promise<Array<NodeStatisticalData>> {
  return http.get('/metrics')
}

export function loadCurrentMetrics(): Promise<Record<string, number>> {
  return http.get('/monitor_current', { doNotTriggerProgress: true })
}

export function loadChartData(time: number): Promise<Array<ChartDataItem>> {
  return http.get('/monitor', { params: { latest: time } })
}

//metrics integration
export function getStatsd(): Promise<StatsD> {
  return http.get('/statsd')
}

export function setStatsd(body: StatsD): Promise<StatsD> {
  return http.put('/statsd', body)
}

export function getPrometheus(): Promise<Prometheus> {
  return http.get('/prometheus')
}

export function setPrometheus(body: Prometheus): Promise<Prometheus> {
  return http.put('/prometheus', body)
}

// Nodes
export async function loadNodes(): Promise<Array<NodeMsg>> {
  return http.get('/nodes')
}

export async function loadNodeDetail(node: string): Promise<NodeMsg> {
  return http.get(`/nodes/${encodeURIComponent(node)}`)
}

export function loadStats(): Promise<Array<NodeStatisticalData>> {
  return http.get('/stats')
}

export function loadNodeStats(node: string): Promise<NodeStatisticalData> {
  return http.get(`/nodes/${encodeURIComponent(node)}/stats`)
}

//Alarms
export async function loadAlarm(
  history = false,
  params = {},
): Promise<ListDataWithPagination<unknown>> {
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

// invite node
export const getClusterNodes = () => {
  return http.get('/cluster')
}

export const inviteNode = (nodeName: string) => {
  return http.put(`/cluster/${encodeURIComponent(nodeName)}/invite`).catch()
}

// remove cluster node
export const forceLeaveNode = (nodeName: string) => {
  return http.delete(`/cluster/${encodeURIComponent(nodeName)}/force_leave`).catch()
}

//topics
export const listTopics = (params: any = {}) => {
  params.topic = params.topic || undefined
  return http.get('/topics', { params })
}

// get subs
export function listSubscriptions(params = {}) {
  return http.get('/subscriptions', { params })
}
