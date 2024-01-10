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
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { BridgeItem, Connector } from '@/types/rule'
import { ElMessageBox } from 'element-plus'
import { Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { isConnectorSupported } from '../bridge/useBridgeTypeValue'
import { useBridgeDataHandler, useConnectorDataHandler } from '../useDataHandler'

type NowConnector = Connector | BridgeItem

interface ConnectorHandlerResult {
  getConnectorDetail: <T = NowConnector>(id: string) => Promise<T>
  handleConnectorDataAfterLoaded: <T = NowConnector>(data: T) => T
  addConnector: <T = NowConnector>(data: T) => Promise<T>
  updateConnector: <T = NowConnector>(data: T) => Promise<T>
  deleteConnector: (id: string, withDep?: boolean) => Promise<void>
  reconnectConnector: (id: string) => Promise<void>
  handleDataForCopy: <T = NowConnector>(data: T) => T
  isTesting: Ref<boolean>
  testConnectivity: (data: NowConnector) => Promise<void>
  showDelTip: Ref<boolean>
  currentDelName: Ref<string>
  showDeleteWebhookAssociatedTip: Ref<boolean>
  associatedActionList: Ref<string[]>
  currentDelType: Ref<string>
  handleDeleteConnector: (data: Connector, callback: () => void | Promise<void>) => Promise<void>
}

export default (): ConnectorHandlerResult => {
  const { t } = useI18n()
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

  const deleteConnector = async (id: string, withDep?: boolean): Promise<void> => {
    const isConnector = isConnectorSupported(getTypeAndNameFromKey(id).type)
    if (isConnector) {
      return requestDelConnector(id)
    }
    return deleteBridge(id, withDep)
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

  const showDelTip = ref(false)
  const associatedActionList = ref<Array<string>>([])
  const currentDelType = ref('')

  const { confirmDel } = useOperationConfirm()

  const deleteTrueConnector = async (id: string) => {
    return confirmDel(() => deleteConnector(id))
  }

  const deleteFakeConnector = async (id: string) => {
    try {
      await confirmDel(() => deleteConnector(id))
    } catch (error: any) {
      const { status, data } = error?.response || {}
      if (status === 400 && data?.rules?.length) {
        await ElMessageBox.confirm(t('RuleEngine.deleteFakeConnectorConfirm'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          confirmButtonClass: 'confirm-danger',
          type: 'warning',
        })
        await deleteConnector(id, true)
        return Promise.resolve()
      } else {
        console.error(error)
      }
      return Promise.reject()
    }
  }

  const currentDelName = ref('')
  const showDeleteWebhookAssociatedTip = ref(false)
  const { judgeIsWebhookConnector } = useWebhookUtils()

  const handleDeleteConnector = async (
    connector: Connector,
    callback: () => void | Promise<void>,
  ) => {
    const { id, type, actions, name } = connector
    if (judgeIsWebhookConnector(connector)) {
      currentDelName.value = name
      showDeleteWebhookAssociatedTip.value = true
      return
    }
    if (actions && actions.length) {
      showDelTip.value = true
      associatedActionList.value = actions
      currentDelType.value = type
      return
    }
    try {
      if (isConnectorSupported(type)) {
        await deleteTrueConnector(id)
      } else {
        await deleteFakeConnector(id)
      }
      callback()
    } catch (error) {
      //
    }
  }

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
    showDelTip,
    currentDelName,
    showDeleteWebhookAssociatedTip,
    associatedActionList,
    currentDelType,
    handleDeleteConnector,
  }
}
