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
import {
  postSource,
  putSource,
  putSourceEnable,
  deleteSource as requestDeleteSource,
  reconnectSource as requestReconnectSource,
  reconnectSourceForNode as requestReconnectSourceForNode,
  resetSourceMetrics as requestResetSourceMetrics,
  getSourceDetail as requestSourceDetail,
  getSourceMetrics as requestSourceMetrics,
  testSourceConnectivity,
} from '@/api/sources'
import { getTypeAndNameFromKey } from '@/common/tools'
import { BridgeItem } from '@/types/rule'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { isConnectorSupported } from '../bridge/useBridgeTypeValue'
import { useBridgeDataHandler } from '../useDataHandler'

type Source = BridgeItem

export default (): {
  getSourceDetail: (id: string) => Promise<Source>
  handleDataAfterLoaded: (data: Source) => Source
  addSource: (data: Source) => Promise<Source>
  updateSource: (data: Source) => Promise<Source>
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

  const isSupportedConnectorId = (id: string) => {
    const { type } = getTypeAndNameFromKey(id)
    return isConnectorSupported(type)
  }

  const handleDataAfterLoaded = (data: Source): Source => {
    return handleBridgeDataAfterLoaded(data)
  }

  const getSourceDetail = async (id: string): Promise<Source> => {
    try {
      const func = isSupportedConnectorId(id) ? requestSourceDetail : getBridgeInfo
      const data = await func(id)
      return handleDataAfterLoaded(data) as Promise<Source>
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const addSource = async (data: Source): Promise<Source> => {
    const request = isConnectorSupported(data.type) ? postSource : createBridge
    const dataForSubmit = await handleBridgeDataBeforeSubmit(data)
    return request(dataForSubmit as any)
  }

  const updateSource = async (data: Source): Promise<Source> => {
    try {
      const { id, type } = data as Source

      const func = isConnectorSupported(type) ? putSource : updateBridge
      const dataHandler = handleBridgeDataBeforeSubmit

      const dataToSubmit = await dataHandler(data)
      Reflect.deleteProperty(dataToSubmit as Source, 'id')

      return func(id, dataToSubmit as any) as Promise<Source>
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const deleteSource = async (id: string, withDependency = false): Promise<void> => {
    const func = isSupportedConnectorId(id) ? requestDeleteSource : deleteBridge
    return func(id, withDependency)
  }

  // TODO: type of ret; request action metrics
  const getSourceMetrics = async (id: string): Promise<any> => {
    const func = isSupportedConnectorId(id) ? requestSourceMetrics : queryBridgeMetrics
    return func(id)
  }

  const resetSourceMetrics = async (id: string) => {
    const func = isSupportedConnectorId(id) ? requestResetSourceMetrics : resetBridgeMetrics
    return func(id)
  }

  const toggleSourceEnable = (id: string, isEnable: boolean) => {
    const func = isSupportedConnectorId(id) ? putSourceEnable : startStopBridge
    return func(id, isEnable)
  }

  const reconnectSource = async (id: string): Promise<void> => {
    const func = isSupportedConnectorId(id) ? requestReconnectSource : reconnectBridge
    return func(id)
  }

  const reconnectSourceForNode = async (node: string, id: string): Promise<void> => {
    const func = isSupportedConnectorId(id) ? requestReconnectSourceForNode : reconnectBridgeForNode
    return func(node, id)
  }

  const isTesting = ref(false)
  const testConnectivity = async (data: Source): Promise<void> => {
    try {
      isTesting.value = true
      const { type } = data
      const request = isConnectorSupported(type) ? testSourceConnectivity : testConnect
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
