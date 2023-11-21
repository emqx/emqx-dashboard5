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
import { useBridgeDataHandler } from '../useDataHandler'
import type { Ref } from 'vue'

type NowConnector = Connector | BridgeItem

export default (): {
  getConnectorDetail: <T = NowConnector>(id: string) => Promise<T>
  addConnector: <T = NowConnector>(data: NowConnector) => Promise<T>
  updateConnector: <T = NowConnector>(data: NowConnector) => Promise<T>
  deleteConnector: ({ id }: NowConnector) => Promise<void>
  isTesting: Ref<boolean>
  testConnectivity: (data: NowConnector) => Promise<void>
} => {
  const getConnectorDetail = async <T = NowConnector>(id: string): Promise<T> => {
    const func = isConnectorSupported(getTypeAndNameFromKey(id).type)
      ? requestConnectorDetail
      : getBridgeInfo
    return func(id) as Promise<T>
  }

  const addConnector = async <T = NowConnector>(data: NowConnector): Promise<T> => {
    const func = isConnectorSupported(data.type) ? postConnector : createBridge
    return func(data as any) as Promise<T>
  }

  const updateConnector = async <T = NowConnector>(data: NowConnector): Promise<T> => {
    const func = isConnectorSupported(data.type) ? putConnector : updateBridge
    return func(data.id, data as any) as Promise<T>
  }

  const deleteConnector = async ({ id }: NowConnector): Promise<void> => {
    const func = isConnectorSupported(getTypeAndNameFromKey(id).type)
      ? requestDelConnector
      : deleteBridge
    return func(id)
  }

  const { isTesting, testConnectivity: testConnectorConnectivity } = useTestConnector()

  const { handleBridgeDataBeforeSubmit } = useBridgeDataHandler()
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
    isTesting,
    testConnectivity,
  }
}
