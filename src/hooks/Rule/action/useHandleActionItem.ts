import {
  getActionDetail,
  postAction,
  putAction,
  putActionEnable,
  deleteAction as requestDelAction,
  getActionMetrics as requestGetActionMetrics,
  reconnectAction as requestReconnectAction,
  reconnectActionForNode as requestReconnectActionForNode,
  resetActionMetrics as requestResetActionMetrics,
  testActionConnectivity as requestTestActionConnectivity,
} from '@/api/action'
import {
  createBridge,
  deleteBridge,
  getBridgeInfo,
  queryBridgeMetrics,
  reconnectBridge,
  reconnectBridgeForNode,
  resetBridgeMetrics,
  startStopBridge,
  testConnect,
  updateBridge,
} from '@/api/ruleengine'
import { BRIDGE_OLD_TYPES_MAP } from '@/common/constants'
import { getBridgeKey, getTypeAndNameFromKey } from '@/common/tools'
import { isConnectorSupported } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { Action, BridgeItem } from '@/types/rule'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useActionDataHandler, useBridgeDataHandler } from '../useDataHandler'
import useMixedActionList from './useMixedActionList'
import { useRoute } from 'vue-router'
import { BridgeType } from '@/types/enum'

type NowAction = Action | BridgeItem

type HandleDirectionCallback = (
  direction?: number,
  connName?: string,
  connType?: BridgeType,
) => void

export default (): {
  getDetail: <T = NowAction>(id: string) => Promise<T>
  handleActionDataAfterLoaded: <T = NowAction>(data: T) => T
  addAction: <T = NowAction>(data: T) => Promise<T>
  updateAction: <T = NowAction>(data: T) => Promise<T>
  deleteAction: (id: string, withDependency?: boolean) => Promise<void>
  getActionMetrics: (id: string) => Promise<any>
  resetActionMetrics: (id: string) => Promise<void>
  toggleActionEnable: (id: string, isEnable: boolean) => Promise<void>
  reconnectAction: (id: string) => Promise<void>
  reconnectActionForNode: (node: string, id: string) => Promise<void>
  isTesting: Ref<boolean>
  testConnectivity: (data: NowAction) => Promise<void>
  handleConnDirection: (callback: HandleDirectionCallback) => void
} => {
  const route = useRoute()

  const isTrueActionId = (id: string) => isConnectorSupported(getTypeAndNameFromKey(id).type)

  const { handleBridgeDataBeforeSubmit, handleBridgeDataAfterLoaded } = useBridgeDataHandler()
  const { handleActionDataBeforeSubmit, handleActionDataBeforeUpdate } = useActionDataHandler()

  const handleDataAfterLoaded = <T = NowAction>(data: T): T => {
    return handleBridgeDataAfterLoaded(data)
  }

  const { getMixedActionListForRule } = useMixedActionList()
  // Extracted logic for handling non-true action IDs
  const handleNonTrueActionId = async (id: string): Promise<string> => {
    const { type, name } = getTypeAndNameFromKey(id)

    if (BRIDGE_OLD_TYPES_MAP.get(type)) {
      const actionList = await getMixedActionListForRule()
      const actionItem = actionList.find(
        ({ id: actionId, realType }) => actionId === id && realType,
      )

      if (actionItem) {
        return getBridgeKey({ type: actionItem.realType, name })
      }
    }

    return id
  }
  const getDetail = async <T = NowAction>(id: string): Promise<T> => {
    try {
      let idForRequest = id
      const isTrueAction = isTrueActionId(id)
      if (!isTrueAction) {
        idForRequest = await handleNonTrueActionId(id)
      }
      const func = isTrueAction ? getActionDetail : getBridgeInfo
      const data = await func(idForRequest)
      return handleDataAfterLoaded(data) as Promise<T>
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const addAction = async <T = NowAction>(data: T): Promise<T> => {
    const isTrueAction = isConnectorSupported((data as NowAction).type)
    const request = isTrueAction ? postAction : createBridge
    const handleFunction = isTrueAction
      ? handleActionDataBeforeSubmit
      : handleBridgeDataBeforeSubmit
    const dataForSubmit = await handleFunction(data as any)
    return request(dataForSubmit as any) as Promise<T>
  }

  const updateAction = async <T = NowAction>(data: T): Promise<T> => {
    try {
      const { id, type } = data as NowAction

      const isTrueAction = isConnectorSupported(type)
      const func = isTrueAction ? putAction : updateBridge
      const dataHandler = isTrueAction ? handleActionDataBeforeUpdate : handleBridgeDataBeforeSubmit

      const dataToSubmit = await dataHandler(data)
      Reflect.deleteProperty(dataToSubmit as NowAction, 'id')

      return func(id, dataToSubmit as any) as Promise<T>
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const deleteAction = async (id: string, withDependency = false): Promise<void> => {
    const func = isTrueActionId(id) ? requestDelAction : deleteBridge
    return func(id, withDependency)
  }

  // TODO: type of ret; request action metrics
  const getActionMetrics = async (id: string): Promise<any> => {
    const func = isTrueActionId(id) ? requestGetActionMetrics : queryBridgeMetrics
    return func(id)
  }

  const resetActionMetrics = async (id: string) => {
    const func = isTrueActionId(id) ? requestResetActionMetrics : resetBridgeMetrics
    return func(id)
  }

  const toggleActionEnable = (id: string, isEnable: boolean) => {
    const func = isTrueActionId(id) ? putActionEnable : startStopBridge
    return func(id, isEnable)
  }

  const reconnectAction = async (id: string): Promise<void> => {
    const func = isTrueActionId(id) ? requestReconnectAction : reconnectBridge
    return func(id)
  }

  const reconnectActionForNode = async (node: string, id: string): Promise<void> => {
    const func = isTrueActionId(id) ? requestReconnectActionForNode : reconnectBridgeForNode
    return func(node, id)
  }

  const isTesting = ref(false)
  const testConnectivity = async (data: NowAction): Promise<void> => {
    try {
      isTesting.value = true
      const isTrueAction = isConnectorSupported((data as NowAction).type)
      const request = isTrueAction ? requestTestActionConnectivity : testConnect
      const dataForSubmit = await handleBridgeDataBeforeSubmit(data)
      await request(dataForSubmit)
      isTesting.value = false
      return Promise.resolve()
    } catch (error) {
      isTesting.value = false
      return Promise.reject(error)
    }
  }

  const handleConnDirection = (callback: HandleDirectionCallback) => {
    if (!route.query.direction) {
      return
    }
    const direction = parseInt(route.query.direction as string, 10)
    const connName = route.query.connName?.toString()
    const connType = route.query.connType?.toString() as BridgeType
    callback(direction, connName, connType)
  }

  return {
    getDetail,
    handleActionDataAfterLoaded: handleDataAfterLoaded,
    addAction,
    updateAction,
    deleteAction,
    getActionMetrics,
    resetActionMetrics,
    toggleActionEnable,
    reconnectAction,
    reconnectActionForNode,
    isTesting,
    testConnectivity,
    handleConnDirection,
  }
}
