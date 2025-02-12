import { checkNOmitFromObj } from '@/common/tools'
import useSSL from '@/hooks/useSSL'
import { BridgeType } from '@/types/enum'
import { Action, Connector } from '@/types/rule'
import { cloneDeep, get, omit, set } from 'lodash'

const keysDoNotNeedForAPI = [
  'node_status',
  'status',
  'status_reason',
  'error',
  'idForRuleFrom',
  'actions',
  'id',
  'rules',
  'last_modified_at',
]

const keysNeedDel = {
  saveAsCopy: ['enable', 'id'],
  update: keysDoNotNeedForAPI,
  create: [...keysDoNotNeedForAPI, 'enable', 'id'],
}
/**
 * update action and connectors
 */
const keysNeedRemovedForUpdate = ['type', 'name']

/**
 * common for connector, action and bridge
 */
const useCommonDataHandler = () => {
  const { handleSSLDataBeforeSubmit } = useSSL()

  const handleDataBeforeSubmit = (data: any): any => {
    const ret = cloneDeep(data)
    if (ret.ssl) {
      ret.ssl = handleSSLDataBeforeSubmit(ret.ssl)
    }
    return checkNOmitFromObj(omit(ret, keysNeedDel.update))
  }

  // When copying, set to empty value.
  // When saving as a copy, check if it has been modified.
  const likePasswordFieldKeys = ['password'].reduce(
    (arr: Array<string>, key) => [...arr, key, `parameters.${key}`],
    [],
  )
  const handleDataForCopy = (data: any): any => {
    const ret = omit(data, keysNeedDel.saveAsCopy)
    likePasswordFieldKeys.forEach((key) => {
      if (get(ret, key) !== undefined) {
        set(ret, key, '')
      }
    })
    return ret
  }

  const handleDataForSaveAsCopy = (data: any): any => {
    return omit(data, keysNeedDel.create)
  }

  return {
    handleDataBeforeSubmit,
    likePasswordFieldKeys,
    handleDataForCopy,
    handleDataForSaveAsCopy,
  }
}

const connectorKeysDoNotNeedForAPI = ['sources']

type ConnectorDataHandler = (connector: Connector) => Connector
export const useConnectorDataHandler = (): {
  likePasswordFieldKeys: string[]
  handleConnectorDataBeforeSubmit: ConnectorDataHandler
  handleConnectorDataBeforeUpdate: (data: Connector) => Connector
  handleConnectorDataForCopy: ConnectorDataHandler
  handleConnectorDataForSaveAsCopy: ConnectorDataHandler
  handleConnectorDataAfterLoaded: ConnectorDataHandler
} => {
  const {
    handleDataBeforeSubmit,
    likePasswordFieldKeys,
    handleDataForCopy,
    handleDataForSaveAsCopy,
  } = useCommonDataHandler()

  const handleConnectorDataBeforeSubmit: ConnectorDataHandler = (data) => {
    const ret: Connector = handleDataBeforeSubmit(data)
    return omit(ret, connectorKeysDoNotNeedForAPI) as Connector
  }

  const handleConnectorDataBeforeUpdate = (data: Connector): Connector => {
    const ret: Connector = handleConnectorDataBeforeSubmit(data)
    return omit(ret, keysNeedRemovedForUpdate) as Connector
  }

  const handleConnectorDataForCopy = handleDataForCopy

  const handleConnectorDataForSaveAsCopy = handleDataForSaveAsCopy

  const handleConnectorDataAfterLoaded = <T>(data: T): T => data

  return {
    likePasswordFieldKeys,
    handleConnectorDataBeforeSubmit,
    handleConnectorDataBeforeUpdate,
    handleConnectorDataForCopy,
    handleConnectorDataForSaveAsCopy,
    handleConnectorDataAfterLoaded,
  }
}

export const useBridgeDataHandler = (): {
  likePasswordFieldKeys: string[]
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
} => {
  const { likePasswordFieldKeys, handleDataForCopy } = useCommonDataHandler()

  const handleBridgeDataAfterLoaded = (bridgeData: any) => {
    return bridgeData
  }

  const handleBridgeDataForCopy = (bridgeData: any): any => {
    return handleBridgeDataAfterLoaded(handleDataForCopy(bridgeData))
  }

  return {
    likePasswordFieldKeys,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
  }
}

export const useActionDataHandler = (): {
  handleActionDataBeforeSubmit: (data: any) => Promise<any>
  handleActionDataBeforeUpdate: (data: any) => Promise<any>
  handleActionDataAfterLoaded: (data: any) => any
} => {
  const { handleDataBeforeSubmit } = useCommonDataHandler()

  const specialDataHandlerBeforeSubmit: Map<BridgeType, (data: Action) => Action> = new Map([])

  /**
   * submit contains create and update
   */
  const handleActionDataBeforeSubmit = async (data: any): Promise<any> => {
    try {
      let ret = cloneDeep(data)
      const handler = specialDataHandlerBeforeSubmit.get(ret.type)
      if (handler) {
        ret = await handler(ret)
      }
      return Promise.resolve(await handleDataBeforeSubmit(ret))
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleActionDataBeforeUpdate = async (data: any): Promise<any> => {
    const ret = await handleActionDataBeforeSubmit(data)
    return omit(ret, keysNeedRemovedForUpdate)
  }

  const handleActionDataAfterLoaded = (data: any) => {
    return data
  }

  return {
    handleActionDataBeforeSubmit,
    handleActionDataBeforeUpdate,
    handleActionDataAfterLoaded,
  }
}
