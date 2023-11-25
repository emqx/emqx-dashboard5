import {
  getActionDetail,
  postAction,
  putAction,
  putActionEnable,
  deleteAction as requestDelAction,
  reconnectAction as requestReconnectAction,
  reconnectActionForNode as requestReconnectActionForNode,
  testActionConnectivity as requestTestActionConnectivity,
} from '@/api/action'
import {
  createBridge,
  deleteBridge,
  getBridgeInfo,
  reconnectBridge,
  reconnectBridgeForNode,
  startStopBridge,
  testConnect,
  updateBridge,
} from '@/api/ruleengine'
import { getTypeAndNameFromKey } from '@/common/tools'
import { isConnectorSupported } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { Action, BridgeItem } from '@/types/rule'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useActionDataHandler, useBridgeDataHandler } from '../useDataHandler'

type NowAction = Action | BridgeItem

export default (): {
  getDetail: <T = NowAction>(id: string) => Promise<T>
  handleActionDataAfterLoaded: <T = NowAction>(data: T) => T
  addAction: <T = NowAction>(data: T) => Promise<T>
  updateAction: <T = NowAction>(data: T) => Promise<T>
  deleteAction: (id: string, withDependency?: boolean) => Promise<void>
  getMetrics: (id: string) => Promise<any>
  toggleActionEnable: (id: string, isEnable: boolean) => Promise<void>
  reconnectAction: (id: string) => Promise<void>
  reconnectActionForNode: (node: string, id: string) => Promise<void>
  isTesting: Ref<boolean>
  testConnectivity: (data: NowAction) => Promise<void>
} => {
  const isTrueActionId = (id: string) => isConnectorSupported(getTypeAndNameFromKey(id).type)

  const { handleBridgeDataBeforeSubmit, handleBridgeDataAfterLoaded } = useBridgeDataHandler()
  const { handleActionDataBeforeUpdate } = useActionDataHandler()

  const handleDataAfterLoaded = <T = NowAction>(data: T): T => {
    return handleBridgeDataAfterLoaded(data)
  }

  const getDetail = async <T = NowAction>(id: string): Promise<T> => {
    try {
      const func = isTrueActionId(id) ? getActionDetail : getBridgeInfo
      const data = await func(id)
      return handleDataAfterLoaded(data) as Promise<T>
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const addAction = async <T = NowAction>(data: T): Promise<T> => {
    const request = isConnectorSupported((data as NowAction).type) ? postAction : createBridge
    const dataForSubmit = await handleBridgeDataBeforeSubmit(data)
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
  const getMetrics = async (id: string): Promise<any> => {
    const func = isTrueActionId(id) ? requestDelAction : deleteBridge
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

  return {
    getDetail,
    handleActionDataAfterLoaded: handleDataAfterLoaded,
    addAction,
    updateAction,
    deleteAction,
    getMetrics,
    toggleActionEnable,
    reconnectAction,
    reconnectActionForNode,
    isTesting,
    testConnectivity,
  }
}
