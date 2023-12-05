import {
  BRIDGE_OLD_TYPES_MAP,
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  SUPPORTED_CONNECTOR_TYPES,
} from '@/common/constants'
import http from '@/common/http'
import { getBridgeKey, omitArr } from '@/common/tools'
import { ListDataWithPagination } from '@/types/common'
import { BridgeType } from '@/types/enum'
import {
  BridgeItem,
  BridgeMetricsData,
  ParamsForQueryRules,
  RuleItem,
  RuleMetrics,
  SchemaRegistry,
} from '@/types/rule'
import { getActions } from './action'

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

/**
 * bridge + action list
 */
export const getMixedActionList = async (): Promise<Array<BridgeItem>> => {
  try {
    const [actionList, bridgeList] = await Promise.all([getActions(), getBridgeList()])
    /**
     * Supported v2 type
     * When creating a bridge
     * An action will be created at the same time
     *
     * Here, when deduplicating, you need to consider the compatibility of the dashboard
     *
     * The dashboard supports v2, remove the part in bridge
     * If the dashboard does not support it yet, remove the action.
     */
    const bridgeIdArr: Array<string> = bridgeList.map(({ id }: BridgeItem) => id)
    const actionIndexArrNeedRemoved: Array<number> = []
    const bridgeIndexArrNeedRemoved: Array<number> = []
    actionList.forEach(({ id: actionId, name, type: newType }, actionIndex) => {
      const oldTypeArr = BRIDGE_OLD_TYPES_MAP.get(newType)
      let bridgeIndex = -1
      if (oldTypeArr) {
        const oldIdArr = oldTypeArr.map((oldType) =>
          getBridgeKey({ type: oldType as BridgeType, name }),
        )
        bridgeIndex = bridgeIdArr.findIndex((id) => oldIdArr.includes(id))
      } else {
        bridgeIndex = bridgeIdArr.findIndex((id) => id === actionId)
      }
      if (bridgeIndex > -1) {
        if (SUPPORTED_CONNECTOR_TYPES.includes(newType)) {
          bridgeIndexArrNeedRemoved.push(bridgeIndex)
        } else {
          actionIndexArrNeedRemoved.push(actionIndex)
        }
      }
    })

    const filteredActionList: Array<BridgeItem> = omitArr(actionList, actionIndexArrNeedRemoved)
    const filteredBridgeList: Array<BridgeItem> = omitArr(bridgeList, bridgeIndexArrNeedRemoved)
    return Promise.resolve(filteredActionList.concat(filteredBridgeList))
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

export function startStopBridge(id: string, isEnable: boolean): Promise<any> {
  if (!id) return Promise.reject()
  return http.put(`/bridges/${encodeURIComponent(id)}/enable/${isEnable}`)
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

export function deleteBridge(id: string, withDependency = false): Promise<any> {
  if (!id) return Promise.reject()
  return http.delete(
    `/bridges/${encodeURIComponent(id)}${withDependency ? '?also_delete_dep_actions' : ''}`,
    {
      errorsHandleCustom: [400],
    },
  )
}

export function reconnectBridge(bridgeID: string): Promise<void> {
  return http.post(`/bridges/${bridgeID}/start`)
}

export function reconnectBridgeForNode(node: string, bridgeID: string): Promise<void> {
  return http.post(`/nodes/${node}/bridges/${bridgeID}/start`)
}

export async function resetBridgeMetrics(bridgeId: string): Promise<void> {
  return http.put(`/bridges/${bridgeId}/metrics/reset`)
}

export function testConnect(body: BridgeItem): Promise<void> {
  return http.post(`/bridges_probe`, body)
}

export function queryBridgeMetrics(id: string): Promise<BridgeMetricsData> {
  return http(`/bridges/${id}/metrics`)
}

//Rules
export function getRules(
  params: ParamsForQueryRules = { page: 1, limit: 1000 },
): Promise<ListDataWithPagination<RuleItem>> {
  return http.get('/rules', { params })
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

export function queryRuleMetrics(ruleId: string): Promise<RuleMetrics> {
  return http.get(`/rules/${ruleId}/metrics`)
}

export function resetRuleMetrics(ruleId: string): Promise<string> {
  return http.put(`/rules/${ruleId}/metrics/reset`)
}

export const querySchemas = (): Promise<Array<SchemaRegistry>> => {
  return http.get('/schema_registry')
}

export const createSchema = (data: SchemaRegistry): Promise<SchemaRegistry> => {
  return http.post('/schema_registry', data)
}

export const deleteSchema = (schemaName: string): Promise<void> => {
  return http.delete(`/schema_registry/${schemaName}`)
}

export const querySchemaDetail = (schemaName: string): Promise<SchemaRegistry> => {
  return http.get(`/schema_registry/${schemaName}`)
}

export const updateSchema = (
  schemaName: string,
  schema: Omit<SchemaRegistry, 'name'>,
): Promise<SchemaRegistry> => {
  return http.put(`/schema_registry/${schemaName}`, schema)
}
