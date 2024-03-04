import {
  postConnector,
  putConnector,
  getConnectorDetail as requestConnectorDetail,
  deleteConnector as requestDelConnector,
  reconnectConnector as requestReconnectConnector,
} from '@/api/connector'
import useTestConnector from '@/hooks/Rule/connector/useTestConnector'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { BridgeItem, Connector } from '@/types/rule'
import { Ref, ref } from 'vue'
import { useConnectorDataHandler } from '../useDataHandler'

type NowConnector = Connector | BridgeItem

interface ConnectorHandlerResult {
  getConnectorDetail: (id: string) => Promise<Connector>
  handleConnectorDataAfterLoaded: (data: Connector) => Connector
  addConnector: (data: Connector) => Promise<Connector>
  updateConnector: (data: Connector) => Promise<Connector>
  deleteConnector: (id: string, withDep?: boolean) => Promise<void>
  reconnectConnector: (id: string) => Promise<void>
  handleDataForCopy: (data: Connector) => Connector
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
  const {
    handleConnectorDataBeforeSubmit,
    handleConnectorDataBeforeUpdate,
    handleConnectorDataForCopy,
    handleConnectorDataAfterLoaded,
  } = useConnectorDataHandler()

  const handleDataAfterLoaded = (data: Connector): Connector => {
    return handleConnectorDataAfterLoaded(data as any)
  }

  const getConnectorDetail = async (id: string): Promise<Connector> => {
    try {
      const data = await requestConnectorDetail(id)
      return handleDataAfterLoaded(data)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const handleDataForCopy = (data: Connector): Connector => {
    try {
      const ret = handleConnectorDataForCopy(data as any)
      return ret
    } catch (error) {
      console.error(error)
      return data
    }
  }

  const addConnector = async (data: Connector): Promise<Connector> => {
    const dataForSubmit = await handleConnectorDataBeforeSubmit(data as any)
    return postConnector(dataForSubmit)
  }

  const updateConnector = async (data: Connector): Promise<Connector> => {
    const { id } = data as NowConnector
    const dataForSubmit = await handleConnectorDataBeforeUpdate(data as any)
    Reflect.deleteProperty(dataForSubmit, 'id')
    return putConnector(id, dataForSubmit) as Promise<Connector>
  }

  const deleteConnector = async (id: string): Promise<void> => {
    return requestDelConnector(id)
  }

  const reconnectConnector = async (id: string): Promise<void> => {
    return requestReconnectConnector(id)
  }

  const { isTesting, testConnectivity: testConnectorConnectivity } = useTestConnector()
  const testConnectivity = async (data: NowConnector): Promise<void> =>
    testConnectorConnectivity(data as Connector)

  const showDelTip = ref(false)
  const associatedActionList = ref<Array<string>>([])
  const currentDelType = ref('')

  const { confirmDel } = useOperationConfirm()

  const deleteTrueConnector = async (id: string) => {
    return confirmDel(() => deleteConnector(id))
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
      await deleteTrueConnector(id)
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
