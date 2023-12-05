import {
  postConnector,
  putConnector,
  getConnectorDetail as requestConnectorDetail,
  deleteConnector as requestDelConnector,
  reconnectConnector as requestReconnectConnector,
} from '@/api/connector'
import {
  createBridge,
  deleteBridge,
  getBridgeInfo,
  reconnectBridge,
  testConnect,
  updateBridge,
} from '@/api/ruleengine'
import { getTypeAndNameFromKey } from '@/common/tools'
import useTestConnector from '@/hooks/Rule/connector/useTestConnector'
import { BridgeItem, Connector } from '@/types/rule'
import type { Ref } from 'vue'
import { isConnectorSupported } from '../bridge/useBridgeTypeValue'
import { useBridgeDataHandler, useConnectorDataHandler } from '../useDataHandler'

type NowConnector = Connector | BridgeItem

export default (): {
  getConnectorDetail: <T = NowConnector>(id: string) => Promise<T>
  handleConnectorDataAfterLoaded: <T = NowConnector>(data: T) => T
  addConnector: <T = NowConnector>(data: T) => Promise<T>
  updateConnector: <T = NowConnector>(data: T) => Promise<T>
  deleteConnector: (id: string) => Promise<void>
  reconnectConnector: (id: string) => Promise<void>
  handleDataForCopy: <T = NowConnector>(data: T) => T
  isTesting: Ref<boolean>
  testConnectivity: (data: NowConnector) => Promise<void>
} => {
  const { handleBridgeDataBeforeSubmit, handleBridgeDataAfterLoaded, handleBridgeDataForCopy } =
    useBridgeDataHandler()
  const {
    handleConnectorDataBeforeSubmit,
    handleConnectorDataBeforeUpdate,
    handleConnectorDataForCopy,
    handleConnectorDataAfterLoaded,
  } = useConnectorDataHandler()

  const handleDataAfterLoaded = <T = NowConnector>(data: T): T => {
    const dataHandler = isConnectorSupported((data as NowConnector).type)
      ? handleConnectorDataAfterLoaded
      : handleBridgeDataAfterLoaded
    return dataHandler(data as any)
  }

  const getConnectorDetail = async <T = NowConnector>(id: string): Promise<T> => {
    try {
      const isTrueConnector = isConnectorSupported(getTypeAndNameFromKey(id).type)
      const func = isTrueConnector ? requestConnectorDetail : getBridgeInfo
      const data = await func(id)
      return handleDataAfterLoaded(data) as Promise<T>
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const handleDataForCopy = <T = NowConnector>(data: T): T => {
    try {
      const dataHandle = isConnectorSupported((data as NowConnector).type)
        ? handleConnectorDataForCopy
        : handleBridgeDataForCopy
      const ret = dataHandle(data as any)
      return ret
    } catch (error) {
      console.error(error)
      return data
    }
  }

  const addConnector = async <T = NowConnector>(data: T): Promise<T> => {
    const isTrueConnector = isConnectorSupported((data as NowConnector).type)
    const request = isTrueConnector ? postConnector : createBridge
    const dataHandler = isTrueConnector
      ? handleConnectorDataBeforeSubmit
      : handleBridgeDataBeforeSubmit
    const dataForSubmit = await dataHandler(data as any)
    return request(dataForSubmit) as Promise<T>
  }

  const updateConnector = async <T = NowConnector>(data: T): Promise<T> => {
    const { id, type } = data as NowConnector

    const isTrueConnector = isConnectorSupported(type)
    const func = isTrueConnector ? putConnector : updateBridge
    const dataHandler = isTrueConnector
      ? handleConnectorDataBeforeUpdate
      : handleBridgeDataBeforeSubmit

    const dataForSubmit = await dataHandler(data as any)
    Reflect.deleteProperty(dataForSubmit, 'id')
    return func(id, dataForSubmit) as Promise<T>
  }

  const deleteConnector = async (id: string): Promise<void> => {
    const func = isConnectorSupported(getTypeAndNameFromKey(id).type)
      ? requestDelConnector
      : deleteBridge
    return func(id)
  }

  const reconnectConnector = async (id: string): Promise<void> => {
    const func = isConnectorSupported(getTypeAndNameFromKey(id).type)
      ? requestReconnectConnector
      : reconnectBridge
    return func(id)
  }

  const { isTesting, testConnectivity: testConnectorConnectivity } = useTestConnector()

  const testBridgeConnectivity = async (bridge: BridgeItem) => {
    try {
      isTesting.value = true
      const data = await handleBridgeDataBeforeSubmit(bridge)
      await testConnect(data)
      isTesting.value = false
      return Promise.resolve()
    } catch (error) {
      isTesting.value = false
      return Promise.reject()
    }
  }
  const testConnectivity = async (data: NowConnector): Promise<void> =>
    isConnectorSupported(data.type)
      ? testConnectorConnectivity(data as Connector)
      : testBridgeConnectivity(data)

  return {
    getConnectorDetail,
    handleConnectorDataAfterLoaded: handleDataAfterLoaded,
    addConnector,
    updateConnector,
    deleteConnector,
    reconnectConnector,
    handleDataForCopy,
    isTesting,
    testConnectivity,
  }
}
