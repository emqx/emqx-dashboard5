/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import { ListDataWithPagination } from '@/types/common'
import {
  Alarm,
  ChartDataItem,
  NodeInfo,
  NodeStatisticalData,
  Prometheus,
  StatsD,
  OpenTelemetry,
  LicenseConfig,
  LicenseData,
} from '@/types/dashboard'
import { PostLogin200 } from '@/types/schemas/dashboard.schemas'

//account
export function login(user: { password: string; username: string }): Promise<PostLogin200> {
  return http.post('/login', user)
}

export function logout(username: string, backend: 'ldap' | 'local' = 'local') {
  return http.post(`/logout?backend=${backend}`, { username })
}

// License
export function loadLicenseInfo(): LicenseData {
  return http.get('/license')
}
export function updateLicense(key: string) {
  return http.post('/license', { key })
}
export function loadLicenseConfig() {
  return http.get('/license/setting')
}
export function updateLicenseConfig(body: LicenseConfig) {
  return http.put('/license/setting', body)
}

//metrics
export function loadMetrics(
  node?: string,
): Promise<NodeStatisticalData | Array<NodeStatisticalData>> {
  const aggregate = !node ? 'true' : 'false'
  return http.get('/metrics', { params: { aggregate, node } })
}

export function loadCurrentMetrics(): Promise<Record<string, number>> {
  return http.get('/monitor_current', { doNotTriggerProgress: true })
}

export function loadChartData(time: number): Promise<Array<ChartDataItem>> {
  return http.get('/monitor', { params: { latest: time } })
}

//metrics integration
export function getStatsD(): Promise<StatsD> {
  return http.get('/statsd')
}

export function setStatsD(body: StatsD): Promise<StatsD> {
  return http.put('/statsd', body)
}

export function getPrometheus(): Promise<Prometheus> {
  return http.get('/prometheus')
}

export function setPrometheus(body: Prometheus): Promise<Prometheus> {
  return http.put('/prometheus', body)
}

export function getOpenTelemetry(): Promise<OpenTelemetry> {
  return http.get('/opentelemetry')
}

export function setOpenTelemetry(body: OpenTelemetry): Promise<OpenTelemetry> {
  return http.put('/opentelemetry', body)
}

// Nodes
export async function loadNodes(
  doNotTriggerProgress = false,
  timeout = 20000,
): Promise<Array<NodeInfo>> {
  return http.get('/nodes', { doNotTriggerProgress, timeout })
}

export async function loadNodeDetail(node: string): Promise<NodeInfo> {
  return http.get(`/nodes/${encodeURIComponent(node)}`)
}

export async function loadStats(): Promise<Array<NodeStatisticalData>> {
  return http.get('/stats', { doNotTriggerProgress: true })
}

export function loadNodeStats(node: string): Promise<NodeStatisticalData> {
  return http.get(`/nodes/${encodeURIComponent(node)}/stats`)
}

//Alarms
export async function loadAlarm(
  history = false,
  params = {},
): Promise<ListDataWithPagination<Alarm>> {
  return http.get('/alarms', {
    params: { activated: String(!history), ...params },
  })
}

export async function clearHistoryAlarm() {
  return http.delete('/alarms')
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
