import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import http from '@/common/http'
import { getBridgeKey, getConnectorKey } from '@/common/tools'
import { BridgeItem, ConnectorItem, RuleItem } from '@/types/rule'

//Bridges
export async function getBridgeList(): Promise<any> {
  try {
    const data = await http.get('/bridges')
    return Promise.resolve(
      data.map((item: Omit<BridgeItem, 'id' | 'idForRuleFrom'>) => {
        const id = getBridgeKey(item)
        return {
          id,
          idForRuleFrom: `${RULE_INPUT_BRIDGE_TYPE_PREFIX}${id}`,
          ...item,
        }
      }),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function createBridge(body: Record<string, unknown>): Promise<BridgeItem> {
  try {
    const data = await http.post('/bridges', body)
    return Promise.resolve({ ...data, id: getBridgeKey(data) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function updateBridge(id: string, body: BridgeItem): Promise<any> {
  if (!id) return Promise.reject()
  try {
    const data = await http.put('/bridges/' + encodeURIComponent(id), body)
    return Promise.resolve({ ...data, id: getBridgeKey(data) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export function startStopBridge(id: string, op: 'enable' | 'disable'): Promise<any> {
  if (!id) return Promise.reject()
  return http.post(`/bridges/${encodeURIComponent(id)}/operation/${op}`)
}

export async function getBridgeInfo(id: string): Promise<any> {
  if (!id) return Promise.reject()
  try {
    const data = await http.get('/bridges/' + encodeURIComponent(id))
    return Promise.resolve({ ...data, id: getBridgeKey(data) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export function deleteBridge(id: string): Promise<any> {
  if (!id) return Promise.reject()
  return http.delete('/bridges/' + encodeURIComponent(id))
}

export function reconnectBridgeForNode(node: string, bridgeID: string): Promise<number> {
  return http.post(`/nodes/${node}/bridges/${bridgeID}/operation/restart`)
}

export async function resetBridgeMetrics(bridgeId: string): Promise<string> {
  return http.put(`/bridges/${bridgeId}/reset_metrics`)
}

//Connectors
export async function getConnectorList(): Promise<any> {
  try {
    const data = await http.get('/connectors')
    return Promise.resolve(
      data.map((item: Omit<ConnectorItem, 'id'>) => {
        return {
          id: getConnectorKey(item),
          ...item,
        }
      }),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function createConnector(body: Record<string, unknown>): Promise<ConnectorItem> {
  try {
    const data = await http.post('/connectors', body)
    return Promise.resolve({ id: getConnectorKey(data), ...data })
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function updateConnector(id: string, body: Record<string, unknown>): Promise<any> {
  if (!id) return Promise.reject()
  try {
    const data = await http.put('/connectors/' + encodeURIComponent(id), body)
    return Promise.resolve({ id: getConnectorKey(data), ...data })
  } catch (error) {
    return Promise.reject(error)
  }
}

export function deleteConnector(id: string): Promise<any> {
  if (!id) return Promise.reject()
  return http.delete('/connectors/' + encodeURIComponent(id))
}

export function testConnector(body: ConnectorItem): Promise<void> {
  return http.post(`/connectors_test`, body)
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

export function updateRules(id: string, body: Partial<RuleItem>): Promise<any> {
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

export function resetRuleMetrics(ruleId: string): Promise<string> {
  return http.put(`/rules/${ruleId}/reset_metrics`)
}
