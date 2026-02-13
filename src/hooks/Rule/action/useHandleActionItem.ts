import {
  getActionDetail as requestActionDetail,
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
import { BridgeType } from '@/types/enum'
import { Action, BridgeItem } from '@/types/rule'

type HandleDirectionCallback = (
  direction?: number,
  connName?: string,
  connType?: BridgeType,
) => void

export default (): {
  getActionDetail: (id: string, namespace?: string, config?: any) => Promise<Action>
  handleActionDataAfterLoaded: (data: any) => Promise<Action>
  addAction: (data: Action) => Promise<Action>
  updateAction: (data: Action) => Promise<Action>
  deleteAction: (action: Action | BridgeItem, withDependency?: boolean) => Promise<void>
  getActionMetrics: (action: Action) => Promise<any>
  resetActionMetrics: (action: Action) => Promise<void>
  toggleActionEnable: (action: Action, isEnable: boolean) => Promise<void>
  reconnectAction: (action: Action) => Promise<void>
  reconnectActionForNode: (action: Action, node: string) => Promise<void>
  isTesting: Ref<boolean>
  testConnectivity: (data: Action) => Promise<void>
  handleConnDirection: (callback: HandleDirectionCallback) => void
} => {
  const route = useRoute()

  const {
    handleActionDataAfterLoaded,
    handleActionDataBeforeSubmit,
    handleActionDataBeforeUpdate,
  } = useActionDataHandler()

  const { getNsParams } = useNsParams()

  const handleDataAfterLoaded = (data: any): Promise<Action> => {
    return handleActionDataAfterLoaded(data)
  }

  const getActionDetail = async (id: string, namespace?: string): Promise<Action> => {
    try {
      const data = await requestActionDetail(id, getNsParams(namespace))
      return handleDataAfterLoaded(data) as Promise<Action>
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const addAction = async (data: Action): Promise<Action> => {
    const dataForSubmit = await handleActionDataBeforeSubmit(data)
    return postAction(dataForSubmit as any) as Promise<Action>
  }

  const updateAction = async (data: Action): Promise<Action> => {
    try {
      const { id } = data as Action
      const { namespace, ...dataToSubmit } = await handleActionDataBeforeUpdate(data)
      Reflect.deleteProperty(dataToSubmit as Action, 'id')
      return putAction(id, dataToSubmit as any, getNsParams(namespace)) as Promise<Action>
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const deleteAction = async (
    { id, namespace }: Action | BridgeItem,
    withDependency = false,
  ): Promise<void> => {
    return requestDelAction(id, withDependency, namespace ?? undefined)
  }

  const getActionMetrics = async ({ id, namespace }: Action): Promise<any> => {
    return requestGetActionMetrics(id, getNsParams(namespace))
  }

  const resetActionMetrics = async ({ id, namespace }: Action) => {
    return requestResetActionMetrics(id, getNsParams(namespace))
  }

  const toggleActionEnable = (action: Action, isEnable: boolean) => {
    const { id, namespace } = action
    return putActionEnable(id, isEnable, getNsParams(namespace))
  }

  const reconnectAction = async ({ id, namespace }: Action): Promise<void> => {
    return requestReconnectAction(id, getNsParams(namespace))
  }

  const reconnectActionForNode = async ({ id, namespace }: Action, node: string): Promise<void> => {
    return requestReconnectActionForNode(node, id, getNsParams(namespace))
  }

  const isTesting = ref(false)
  const testConnectivity = async (data: Action): Promise<void> => {
    try {
      isTesting.value = true
      const { namespace, ...others } = data
      const dataForSubmit = await handleActionDataBeforeSubmit(others)
      await requestTestActionConnectivity(dataForSubmit, getNsParams(namespace))
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
    getActionDetail,
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
