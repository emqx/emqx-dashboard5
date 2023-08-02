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
  return http.get('/license')
}

export function updateLicense(key: string) {
  return http.post('/license', { key })
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

const nodesNum = 6
const totalCore = 6

let arr: Array<boolean> = []

const createArr = () => {
  let coreCount = 0
  arr = new Array(nodesNum).fill(0.5).map(() => {
    const boo = Math.random() > 0.5
    if (boo && coreCount < totalCore) {
      coreCount++
      return true
    }
    return false
  })
}
createArr()

// window.setInterval(() => {
//   nodesNum = Math.ceil(Math.random() * 5)
//   createArr()
// }, 2000)

// Nodes
export async function loadNodes(
  doNotTriggerProgress = false,
  timeout = 20000,
): Promise<Array<NodeInfo>> {
  const data = await http.get('/nodes', { doNotTriggerProgress, timeout })
  const ret = new Array(nodesNum).fill(0).map((item, index) => {
    const node = data[0]
    return {
      ...node,
      node: `${index}-${node.node}`,
      node_status: Math.random() > 0.5 ? 'running' : 'stopped',
      role: arr[index] ? 'core' : 'replicant',
      version: `5.1.${index}`,
      // role: 'core',
    }
  })
  return Promise.resolve(ret)
  // return http.get('/nodes', { doNotTriggerProgress, timeout })
}

export async function loadNodeDetail(node: string): Promise<NodeInfo> {
  return http.get(`/nodes/${encodeURIComponent(node)}`)
}

export async function loadStats(): Promise<Array<NodeStatisticalData>> {
  const data = await http.get('/stats', { doNotTriggerProgress: true })
  const ret = new Array(nodesNum).fill(0).map((item, index) => {
    const node = data[0]
    return {
      ...node,
      node: `${index}-${node.node}`,
    }
  })
  return Promise.resolve(ret)
  // return http.get('/stats', { doNotTriggerProgress: true })
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
