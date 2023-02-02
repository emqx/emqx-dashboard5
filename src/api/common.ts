/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import { ListDataWithPagination } from '@/types/common'
import {
  Alarm,
  ChartDataItem,
  NodeMsg,
  NodeStatisticalData,
  Prometheus,
  StatsD,
} from '@/types/dashboard'

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
export function loadMetrics(
  queryClusterData: boolean,
): Promise<NodeStatisticalData | Array<NodeStatisticalData>> {
  return http.get('/metrics', { params: { aggregate: queryClusterData } })
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

// Nodes
export async function loadNodes(
  doNotTriggerProgress = false,
  timeout = 20000,
): Promise<Array<NodeMsg>> {
  return http.get('/nodes', { doNotTriggerProgress, timeout })
}

export async function loadNodeDetail(node: string): Promise<NodeMsg> {
  return http.get(`/nodes/${encodeURIComponent(node)}`)
}

export function loadStats(): Promise<Array<NodeStatisticalData>> {
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
