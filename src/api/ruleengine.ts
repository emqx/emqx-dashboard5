import http from '@/common/http'
import { BridgeItem, RuleItem } from '@/types/ruleengine'

//Bridges
export function getBridgeList(): Promise<any> {
  return http.get('/bridges')
}

export function createBridge(body: Record<string, unknown>): Promise<any> {
  return http.post('/bridges', body)
}

export function updateBridge(id: string, body: Record<string, unknown>): Promise<any> {
  if (!id) return Promise.reject()
  return http.put('/bridges/' + encodeURIComponent(id), body)
}

export function startStopBridge(id: string, op: 'start' | 'stop'): Promise<any> {
  if (!id) return Promise.reject()
  return http.post(`/bridges/${encodeURIComponent(id)}/operation/${op}`)
}

export function getBridgeInfo(id: string): Promise<any> {
  if (!id) return Promise.reject()
  return http.get('/bridges/' + encodeURIComponent(id))
}

export function deleteBridge(id: string): Promise<any> {
  if (!id) return Promise.reject()
  return http.delete('/bridges/' + encodeURIComponent(id))
}

//Connectors
export function getConnectorList(): Promise<any> {
  return http.get('/connectors')
}

export function createConnector(body: Record<string, unknown>): Promise<any> {
  return http.post('/connectors', body)
}

export function updateConnector(id: string, body: Record<string, unknown>): Promise<any> {
  if (!id) return Promise.reject()
  return http.put('/connectors/' + encodeURIComponent(id), body)
}

export function deleteConnector(id: string): Promise<any> {
  if (!id) return Promise.reject()
  return http.delete('/connectors/' + encodeURIComponent(id))
}

//Rules
export function getRules(): Promise<any> {
  return http.get('/rules')
}

export function getRuleInfo(id: string): Promise<any> {
  if (!id) return Promise.reject()
  return http.get('/rules/' + encodeURIComponent(id))
}

export function createRules(body: Record<string, unknown>): Promise<any> {
  return http.post('/rules', body)
}

export function getRuleEvents(): Promise<any> {
  return http.get('/rule_events')
}

export function updateRules(id: string, body: RuleItem): Promise<any> {
  if (!id) return Promise.reject()
  return http.put('/rules/' + encodeURIComponent(id), body)
}

export function deleteRules(id: string): Promise<any> {
  if (!id) return Promise.reject()
  return http.delete('/rules/' + encodeURIComponent(id))
}

export function testsql(body: Record<string, unknown>): Promise<any> {
  return http.post('/rule_test', body)
}
