import {
  postConnector,
  putConnector,
  getConnectorDetail as requestConnectorDetail,
  deleteConnector as requestDelConnector,
} from '@/api/connector'
import {
  createBridge,
  deleteBridge,
  getBridgeInfo,
  testConnect,
  updateBridge,
} from '@/api/ruleengine'
import { getTypeAndNameFromKey } from '@/common/tools'
import useTestConnector from '@/hooks/Rule/connector/useTestConnector'
import { BridgeItem, Connector } from '@/types/rule'
import { isConnectorSupported } from '../bridge/useBridgeTypeValue'
import { useBridgeDataHandler, useConnectorDataHandler } from '../useDataHandler'
import type { Ref } from 'vue'

type NowConnector = Connector | BridgeItem

export default (): {
  getConnectorDetail: <T = NowConnector>(id: string) => Promise<T>
  addConnector: <T = NowConnector>(data: T) => Promise<T>
  updateConnector: <T = NowConnector>(data: T) => Promise<T>
  deleteConnector: ({ id }: NowConnector) => Promise<void>
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
  const { handleConnectorDataBeforeSubmit, handleConnectorDataForCopy } = useConnectorDataHandler()

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

  const handleDataBeforeSubmit = async (data: NowConnector): Promise<any> => {
    try {
      const dataHandle = isConnectorSupported(data.type)
        ? handleConnectorDataBeforeSubmit
        : handleBridgeDataBeforeSubmit
      const ret = await dataHandle(data as any)
      return ret
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }
  const addConnector = async <T = NowConnector>(data: T): Promise<T> => {
    const request = isConnectorSupported((data as NowConnector).type) ? postConnector : createBridge
    const dataForSubmit = await handleDataBeforeSubmit(data as NowConnector)
    return request(dataForSubmit) as Promise<T>
  }

  const updateConnector = async <T = NowConnector>(data: T): Promise<T> => {
    const func = isConnectorSupported((data as NowConnector).type) ? putConnector : updateBridge
    const dataForSubmit = await handleDataBeforeSubmit(data as NowConnector)
    return func((data as NowConnector).id, dataForSubmit) as Promise<T>
  }

  const deleteConnector = async ({ id }: NowConnector): Promise<void> => {
    const func = isConnectorSupported(getTypeAndNameFromKey(id).type)
      ? requestDelConnector
      : deleteBridge
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
    handleDataForCopy,
    isTesting,
    testConnectivity,
  }
}
