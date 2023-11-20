import { checkNOmitFromObj, createRandomString } from '@/common/tools'
import useSSL from '@/hooks/useSSL'
import { BridgeType } from '@/types/enum'
import { Connector } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { cloneDeep, get, omit, set } from 'lodash'
import useI18nTl from '../useI18nTl'
import { useBridgeTypeOptions } from './bridge/useBridgeTypeValue'

const keysDoNotNeedForAPI = [
  'node_status',
  'status',
  'status_reason',
  'error',
  'role',
  'idForRuleFrom',
]

const keysNeedDel = {
  saveAsCopy: ['enable', 'id'],
  update: keysDoNotNeedForAPI,
  create: [...keysDoNotNeedForAPI, 'enable', 'id'],
}

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
  const likePasswordFieldKeys = ['password']
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
  handleConnectorDataForCopy: ConnectorDataHandler
  handleConnectorDataForSaveAsCopy: ConnectorDataHandler
} => {
  const {
    handleDataBeforeSubmit,
    likePasswordFieldKeys,
    handleDataForCopy,
    handleDataForSaveAsCopy,
  } = useCommonDataHandler()

  const handleConnectorDataBeforeSubmit = handleDataBeforeSubmit

  const handleConnectorDataForCopy = handleDataForCopy

  const handleConnectorDataForSaveAsCopy = handleDataForSaveAsCopy

  return {
    likePasswordFieldKeys,
    handleConnectorDataBeforeSubmit,
    handleConnectorDataForCopy,
    handleConnectorDataForSaveAsCopy,
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
  handleBridgeDataBeforeSubmit: (bridgeData: any) => Promise<any>
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
  handleBridgeDataForSaveAsCopy: (bridgeData: any) => any
} => {
  const { getBridgeType } = useBridgeTypeOptions()
  const {
    handleDataBeforeSubmit,
    likePasswordFieldKeys,
    handleDataForCopy,
    handleDataForSaveAsCopy,
  } = useCommonDataHandler()

  const handleMQTTBridgeData = (bridgeData: any) => {
    const { egress = {}, ingress = {} } = bridgeData
    if (!egress.remote?.topic) {
      Reflect.deleteProperty(bridgeData, 'egress')
    } else if (!ingress.remote?.topic) {
      Reflect.deleteProperty(bridgeData, 'ingress')
    }
    return bridgeData
  }

  const handleBridgeDataBeforeSubmit = async (bridgeData: any): Promise<any> => {
    try {
      let ret = cloneDeep(bridgeData)
      const bridgeType = getBridgeType(bridgeData.type)
      if (bridgeType === BridgeType.MQTT) {
        ret = await handleMQTTBridgeData(ret)
      }
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

  const handleBridgeDataForSaveAsCopy = handleDataForSaveAsCopy

  return {
    likePasswordFieldKeys,
    handleBridgeDataBeforeSubmit,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
    handleBridgeDataForSaveAsCopy,
  }
}
