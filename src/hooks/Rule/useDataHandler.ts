import { checkNOmitFromObj } from '@/common/tools'
import useSSL from '@/hooks/useSSL'
import { Connector } from '@/types/rule'
import { cloneDeep, get, omit, set } from 'lodash'

const keysDoNotNeedForAPI = [
  'node_status',
  'status',
  'status_reason',
  'error',
  'role',
  'idForRuleFrom',
  'actions',
  'id',
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

  const handleConnectorDataBeforeSubmit = handleDataBeforeSubmit

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
  handleBridgeDataBeforeSubmit: (bridgeData: any) => Promise<any>
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
} => {
  const { handleDataBeforeSubmit, likePasswordFieldKeys, handleDataForCopy } =
    useCommonDataHandler()

  const handleBridgeDataBeforeSubmit = async (bridgeData: any): Promise<any> => {
    try {
      const ret = cloneDeep(bridgeData)
      return Promise.resolve(handleDataBeforeSubmit(ret))
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleBridgeDataAfterLoaded = (bridgeData: any) => {
    return bridgeData
  }

  const handleBridgeDataForCopy = (bridgeData: any): any => {
    return handleBridgeDataAfterLoaded(handleDataForCopy(bridgeData))
  }

  return {
    likePasswordFieldKeys,
    handleBridgeDataBeforeSubmit,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
  }
}

export const useActionDataHandler = (): {
  handleActionDataBeforeUpdate: (data: any) => Promise<any>
} => {
  const { handleBridgeDataBeforeSubmit } = useBridgeDataHandler()

  const handleActionDataBeforeUpdate = async (data: any): Promise<any> => {
    const ret = await handleBridgeDataBeforeSubmit(data)
    return omit(ret, keysNeedRemovedForUpdate)
  }

  return {
    handleActionDataBeforeUpdate,
  }
}
