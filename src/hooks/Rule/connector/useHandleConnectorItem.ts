import {
  postConnector,
  putConnector,
  putConnectorEnable,
  getConnectorDetail as requestConnectorDetail,
  deleteConnector as requestDelConnector,
  reconnectConnector as requestReconnectConnector,
} from '@/api/connector'
import { BridgeItem, Connector, ConnectorForm } from '@/types/rule'

type NowConnector = Connector | BridgeItem

interface ConnectorHandlerResult {
  getConnectorDetail: (id: string) => Promise<Connector>
  handleConnectorDataAfterLoaded: (data: Connector) => Connector
  addConnector: (data: Connector) => Promise<Connector>
  updateConnector: (data: Connector) => Promise<Connector>
  requestDeleteConnector: (connector: Connector | ConnectorForm) => Promise<void>
  requestPutConnector: (id: string, connector: Connector) => Promise<Connector>
  reconnectConnector: (id: string) => Promise<void>
  showDisableConfirm: Ref<boolean>
  currentConnector: Ref<undefined | Connector>
  handleToggleConnectorEnable: (connector: Connector, sucCb?: () => void) => Promise<void>
  requestPutConnectorEnable: (connector: Connector, newEnable: boolean) => Promise<void>
  handleDataForCopy: (data: Connector) => Connector
  isTesting: Ref<boolean>
  testConnectivity: (data: NowConnector) => Promise<void>
  showDelTip: Ref<boolean>
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

  const requestPutConnector = async (id: string, connector: Connector): Promise<Connector> => {
    const { namespace, ...others } = connector
    return putConnector(id, others, { ns: namespace ?? undefined })
  }

  const updateConnector = async (data: Connector): Promise<Connector> => {
    const { id } = data as NowConnector
    const dataForSubmit = await handleConnectorDataBeforeUpdate(data as any)
    Reflect.deleteProperty(dataForSubmit, 'id')
    return requestPutConnector(id, dataForSubmit) as Promise<Connector>
  }

  const requestDeleteConnector = async (connector: Connector | ConnectorForm): Promise<void> => {
    const { namespace, id } = connector
    return requestDelConnector(id, { ns: namespace ?? undefined })
  }

  const reconnectConnector = async (id: string): Promise<void> => {
    return requestReconnectConnector(id)
  }

  const { operationWarning, confirmDel } = useOperationConfirm()

  const requestPutConnectorEnable = async (
    connector: Connector,
    newEnable: boolean,
  ): Promise<void> => {
    const { namespace, id } = connector
    return putConnectorEnable(id, newEnable, { ns: namespace ?? undefined })
  }

  const { t } = useI18nTl('RuleEngine')
  const toggleConnectorEnable = async (
    connector: Connector,
    isEnable: boolean,
    sucCb?: () => void,
  ) => {
    const sucMessage = isEnable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
    try {
      if (!isEnable) {
        await operationWarning(t('Base.confirmDisabled'))
      }
      await requestPutConnectorEnable(connector, isEnable)
      if (isFunction(sucCb)) {
        sucCb()
      }
      ElMessage.success(t(sucMessage))
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const showDisableConfirm = ref(false)
  const currentConnector = ref<undefined | Connector>(undefined)
  const handleToggleConnectorEnable = async (connector: Connector, sucCb?: () => void) => {
    const { enable, actions, sources } = connector
    if ((actions?.length || sources?.length) && enable) {
      currentConnector.value = connector
      showDisableConfirm.value = true
      return
    }
    try {
      await toggleConnectorEnable(connector, !enable, sucCb)
    } catch (error) {
      //
    }
  }

  const { isTesting, testConnectivity: testConnectorConnectivity } = useTestConnector()
  const testConnectivity = async (data: NowConnector): Promise<void> =>
    testConnectorConnectivity(data as Connector)

  const showDelTip = ref(false)

  const deleteTrueConnector = async (connector: Connector) => {
    return confirmDel(() => requestDeleteConnector(connector))
  }

  const { judgeIsWebhookConnector } = useWebhookUtils()

  const handleDeleteConnector = async (
    connector: Connector,
    callback: () => void | Promise<void>,
  ) => {
    const { actions, sources } = connector
    if (judgeIsWebhookConnector(connector)) {
      return
    }
    if ((actions && actions.length) || (sources && sources.length)) {
      currentConnector.value = connector
      showDelTip.value = true
      return
    }
    try {
      await deleteTrueConnector(connector)
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
    requestDeleteConnector,
    reconnectConnector,
    requestPutConnectorEnable,
    requestPutConnector,
    showDisableConfirm,
    currentConnector,
    handleToggleConnectorEnable,
    handleDataForCopy,
    isTesting,
    testConnectivity,
    showDelTip,
    handleDeleteConnector,
  }
}
