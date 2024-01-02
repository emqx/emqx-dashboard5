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
import { BridgeItem } from '@/types/rule'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useBridgeDataHandler } from '../useDataHandler'

type Source = BridgeItem

export default (): {
  getSourceDetail: <T = Source>(id: string) => Promise<T>
  handleDataAfterLoaded: <T = Source>(data: T) => T
  addSource: <T = Source>(data: T) => Promise<T>
  updateSource: <T = Source>(data: T) => Promise<T>
  deleteSource: (id: string, withDependency?: boolean) => Promise<void>
  getSourceMetrics: (id: string) => Promise<any>
  resetSourceMetrics: (id: string) => Promise<void>
  toggleSourceEnable: (id: string, isEnable: boolean) => Promise<void>
  reconnectSource: (id: string) => Promise<void>
  reconnectSourceForNode: (node: string, id: string) => Promise<void>
  isTesting: Ref<boolean>
  testConnectivity: (data: Source) => Promise<void>
} => {
  const { handleBridgeDataBeforeSubmit, handleBridgeDataAfterLoaded } = useBridgeDataHandler()

  const handleDataAfterLoaded = <T = Source>(data: T): T => {
    return handleBridgeDataAfterLoaded(data)
  }

  const getSourceDetail = async <T = Source>(id: string): Promise<T> => {
    try {
      const data = await getBridgeInfo(id)
      return handleDataAfterLoaded(data) as Promise<T>
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const addSource = async <T = Source>(data: T): Promise<T> => {
    const request = createBridge
    const dataForSubmit = await handleBridgeDataBeforeSubmit(data)
    return request(dataForSubmit as any) as Promise<T>
  }

  const updateSource = async <T = Source>(data: T): Promise<T> => {
    try {
      const { id } = data as Source

      const func = updateBridge
      const dataHandler = handleBridgeDataBeforeSubmit

      const dataToSubmit = await dataHandler(data)
      Reflect.deleteProperty(dataToSubmit as Source, 'id')

      return func(id, dataToSubmit as any) as Promise<T>
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const deleteSource = async (id: string, withDependency = false): Promise<void> => {
    const func = deleteBridge
    return func(id, withDependency)
  }

  // TODO: type of ret; request action metrics
  const getSourceMetrics = async (id: string): Promise<any> => {
    const func = queryBridgeMetrics
    return func(id)
  }

  const resetSourceMetrics = async (id: string) => {
    const func = resetBridgeMetrics
    return func(id)
  }

  const toggleSourceEnable = (id: string, isEnable: boolean) => {
    const func = startStopBridge
    return func(id, isEnable)
  }

  const reconnectSource = async (id: string): Promise<void> => {
    const func = reconnectBridge
    return func(id)
  }

  const reconnectSourceForNode = async (node: string, id: string): Promise<void> => {
    const func = reconnectBridgeForNode
    return func(node, id)
  }

  const isTesting = ref(false)
  const testConnectivity = async (data: Source): Promise<void> => {
    try {
      isTesting.value = true
      const request = testConnect
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
    getSourceDetail,
    handleDataAfterLoaded,
    addSource,
    updateSource,
    deleteSource,
    getSourceMetrics,
    resetSourceMetrics,
    toggleSourceEnable,
    reconnectSource,
    reconnectSourceForNode,
    isTesting,
    testConnectivity,
  }
}
