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
import { BridgeType } from '@/types/enum'
import { Action } from '@/types/rule'

type HandleDirectionCallback = (
  direction?: number,
  connName?: string,
  connType?: BridgeType,
) => void

export default (): {
  getDetail: (id: string) => Promise<Action>
  handleActionDataAfterLoaded: (data: any) => Promise<Action>
  addAction: (data: Action) => Promise<Action>
  updateAction: (data: Action) => Promise<Action>
  deleteAction: (id: string, withDependency?: boolean) => Promise<void>
  getActionMetrics: (id: string) => Promise<any>
  resetActionMetrics: (id: string) => Promise<void>
  toggleActionEnable: (id: string, isEnable: boolean) => Promise<void>
  reconnectAction: (id: string) => Promise<void>
  reconnectActionForNode: (node: string, id: string) => Promise<void>
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

  const handleDataAfterLoaded = (data: any): Promise<Action> => {
    return handleActionDataAfterLoaded(data)
  }

  const getDetail = async (id: string): Promise<Action> => {
    try {
      const data = await getActionDetail(id)
      return handleDataAfterLoaded(data) as Promise<Action>
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const addAction = async (data: Action): Promise<Action> => {
    const dataForSubmit = data
    return postAction(dataForSubmit as any) as Promise<Action>
  }

  const updateAction = async (data: Action): Promise<Action> => {
    try {
      const { id } = data as Action
      const dataToSubmit = await handleActionDataBeforeUpdate(data)
      Reflect.deleteProperty(dataToSubmit as Action, 'id')
      return putAction(id, dataToSubmit as any) as Promise<Action>
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const deleteAction = async (id: string, withDependency = false): Promise<void> => {
    return requestDelAction(id, withDependency)
  }

  const getActionMetrics = async (id: string): Promise<any> => {
    return requestGetActionMetrics(id)
  }

  const resetActionMetrics = async (id: string) => {
    return requestResetActionMetrics(id)
  }

  const toggleActionEnable = (id: string, isEnable: boolean) => {
    return putActionEnable(id, isEnable)
  }

  const reconnectAction = async (id: string): Promise<void> => {
    return requestReconnectAction(id)
  }

  const reconnectActionForNode = async (node: string, id: string): Promise<void> => {
    return requestReconnectActionForNode(node, id)
  }

  const isTesting = ref(false)
  const testConnectivity = async (data: Action): Promise<void> => {
    try {
      isTesting.value = true
      const dataForSubmit = await handleActionDataBeforeSubmit(data)
      await requestTestActionConnectivity(dataForSubmit)
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
