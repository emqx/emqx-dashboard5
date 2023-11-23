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
  addConnector: <T = NowConnector>(data: T) => Promise<T>
  updateConnector: <T = NowConnector>(data: T) => Promise<T>
  deleteConnector: (id: string) => Promise<void>
  reconnectConnector: (id: string) => Promise<void>
  handleDataForCopy: <T = NowConnector>(data: T) => T
  isTesting: Ref<boolean>
  testConnectivity: (data: NowConnector) => Promise<void>
} => {
  const getConnectorDetail = async <T = NowConnector>(id: string): Promise<T> => {
    const func = isConnectorSupported(getTypeAndNameFromKey(id).type)
      ? requestConnectorDetail
      : getBridgeInfo
    return func(id) as Promise<T>
  }

  const { handleBridgeDataBeforeSubmit, handleBridgeDataForCopy } = useBridgeDataHandler()
  const {
    handleConnectorDataBeforeSubmit,
    handleConnectorDataBeforeUpdate,
    handleConnectorDataForCopy,
  } = useConnectorDataHandler()

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
      await testConnect(handleBridgeDataBeforeSubmit(bridge))
    } catch (error) {
      //
    } finally {
      isTesting.value = false
    }
  }
  const testConnectivity = async (data: NowConnector): Promise<void> =>
    isConnectorSupported(data.type)
      ? testConnectorConnectivity(data as Connector)
      : testBridgeConnectivity(data)

  return {
    getConnectorDetail,
    addConnector,
    updateConnector,
    deleteConnector,
    reconnectConnector,
    handleDataForCopy,
    isTesting,
    testConnectivity,
  }
}
