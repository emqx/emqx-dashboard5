import { NUM_REG } from '@/common/constants'
import { checkNOmitFromObj, createRandomString, stringifyObjSafely } from '@/common/tools'
import useSSL from '@/hooks/useSSL'
import { BridgeType, Role } from '@/types/enum'
import { Connector } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { cloneDeep, get, omit, set } from 'lodash'
import useI18nTl from '../useI18nTl'
import useCheckIoTDBConnectorDriver from './connector/useCheckIoTDBConnectorDriver'

const keysDoNotNeedForAPI = [
  'node_status',
  'status',
  'status_reason',
  'error',
  'role',
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
  const likePasswordFieldKeys = [
    'password',
    'authentication.password',
    'authentication.jwt',
    'secret_key',
    'aws_secret_access_key',
    'secret_access_key',
    'token',
    'security_token',
    'access_key_id',
    'access_key_secret',
  ].reduce((arr: Array<string>, key) => [...arr, key, `parameters.${key}`], [])
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
  handleConnectorDataBeforeSubmit: (connector: Connector) => Promise<Connector>
  handleConnectorDataBeforeUpdate: (data: Connector) => Promise<Connector>
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

  const { tl } = useI18nTl('RuleEngine')
  const handleGCPData = (data: any) => {
    if (data.service_account_json && typeof data.service_account_json === 'string') {
      try {
        data.service_account_json = JSON.parse(data.service_account_json)
        return data
      } catch (error) {
        ElMessage.error(tl('accountJSONError'))
        return Promise.reject()
      }
    }
    return data
  }

  const specialDataHandlerBeforeSubmit = new Map([
    [BridgeType.GCPProducer, handleGCPData],
    [BridgeType.GCPConsumer, handleGCPData],
  ])

  const handleConnectorDataBeforeSubmit = async (data: Connector): Promise<Connector> => {
    try {
      let ret = cloneDeep(data)
      const type = data.type
      const handler = specialDataHandlerBeforeSubmit.get(type)
      if (handler) {
        ret = await handler(ret)
      }
      ret = handleDataBeforeSubmit(ret)
      return Promise.resolve(omit(ret, connectorKeysDoNotNeedForAPI) as Connector)
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleConnectorDataBeforeUpdate = async (data: Connector): Promise<Connector> => {
    const ret = await handleConnectorDataBeforeSubmit(data)
    return omit(ret, keysNeedRemovedForUpdate) as Connector
  }

  const handleConnectorDataForCopy = handleDataForCopy

  const handleConnectorDataForSaveAsCopy = handleDataForSaveAsCopy

  const handleGCPDataAfterLoaded = (data: any) => {
    if ('service_account_json' in data && typeof data.service_account_json === 'object') {
      data.service_account_json = stringifyObjSafely(data.service_account_json, 2)
    }
    data.role = data.type.indexOf('consumer') > -1 ? Role.Consumer : Role.Producer
    return data
  }

  const specialHandlerAfterLoaded = new Map([
    [BridgeType.GCPProducer, handleGCPDataAfterLoaded],
    [BridgeType.GCPConsumer, handleGCPDataAfterLoaded],
  ])

  const handleConnectorDataAfterLoaded = (data: Connector): Connector => {
    const { type } = data
    const handler = specialHandlerAfterLoaded.get(type)
    if (handler) {
      handler(data)
    }
    return data
  }

  return {
    likePasswordFieldKeys,
    handleConnectorDataBeforeSubmit,
    handleConnectorDataBeforeUpdate,
    handleConnectorDataForCopy,
    handleConnectorDataForSaveAsCopy,
    handleConnectorDataAfterLoaded,
  }
}

export const useRedisCommandCheck = (): {
  commandReg: RegExp
  splitBySpace: (command: string) => string[] | Promise<never>
  transCommandArrToStr: (commandArr: Array<string>) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const strReg = /('(([^'\\]|(\\')|\\))+')|("(([^"\\]|(\\")|\\))+")/g
  const partItem = /[^\s"']+/
  const commandReg = new RegExp(
    `^((${strReg.source}|${partItem.source})\\s)*(${strReg.source}|${partItem.source})$`,
  )
  const SPACE = ' '

  const splitBySpace = (command: string) => {
    const randomStr = createRandomString()
    const strArr: Array<string> = []
    const newCommand = command.replace(/\n/g, SPACE).trim()
    if (!commandReg.test(newCommand)) {
      ElMessage.error(tl('redisCommandError'))
      return Promise.reject()
    }
    const commandRemoveStr = newCommand.replace(/\n/g, SPACE).replace(strReg, (matched: string) => {
      // remove quota
      strArr.push(matched.slice(1, -1))
      return randomStr
    })
    const ret = commandRemoveStr.split(SPACE)
    let replaceIndex = 0
    return ret
      .map((item) => {
        if (item === randomStr) {
          replaceIndex += 1
          return strArr[replaceIndex - 1]
        }
        return item
      })
      .filter((item) => !!item)
  }

  const transCommandArrToStr = (commandArr: Array<string>) => {
    // If an string item has space or escape characters, wrap it in double quotes.
    return commandArr.reduce((str, current) => {
      const item =
        current.indexOf(SPACE) > -1 || current.indexOf('\\') > -1 ? `"${current}"` : current
      return str ? `${str} ${item}` : item
    }, '')
  }

  return {
    commandReg,
    splitBySpace,
    transCommandArrToStr,
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

  const { splitBySpace, transCommandArrToStr } = useRedisCommandCheck()
  const handleRedisBridgeData = async (bridgeData: any) => {
    try {
      if (
        bridgeData?.parameters?.command_template &&
        typeof bridgeData.parameters.command_template === 'string'
      ) {
        bridgeData.parameters.command_template = await splitBySpace(
          bridgeData.parameters.command_template,
        )
      }
      return bridgeData
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleS3ActionData = async (bridgeData: any) => {
    if (/direct/i.test(bridgeData?.parameters?.mode)) {
      bridgeData.resource_opts.batch_size = 1
    }
    return bridgeData
  }

  const { checkIsIoTDBThriftConnector } = useCheckIoTDBConnectorDriver()
  const handleIoTDBActionData = async (data: any) => {
    const { connector } = data
    const isThriftConnector = await checkIsIoTDBThriftConnector(connector)
    if (isThriftConnector && /async/i.test(data.resource_opts?.query_mode)) {
      data.resource_opts.query_mode = 'sync'
    }
    return data
  }

  const specialDataHandlerBeforeSubmit = new Map([
    [BridgeType.Redis, handleRedisBridgeData],
    [BridgeType.S3, handleS3ActionData],
    [BridgeType.AzureBlobStorage, handleS3ActionData],
    [BridgeType.IoTDB, handleIoTDBActionData],
  ])

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

  const handleRedisDataAfterLoaded = (data: any) => {
    if (data?.parameters?.command_template && Array.isArray(data.parameters.command_template)) {
      data.parameters.command_template = transCommandArrToStr(data.parameters.command_template)
    }
    return data
  }

  const specialHandlerAfterLoaded = new Map([[BridgeType.Redis, handleRedisDataAfterLoaded]])

  const handleActionDataAfterLoaded = (data: any) => {
    const handler = specialHandlerAfterLoaded.get(data.type)
    if (handler) {
      handler(data)
    }
    return data
  }

  return {
    handleActionDataBeforeSubmit,
    handleActionDataBeforeUpdate,
    handleActionDataAfterLoaded,
  }
}
