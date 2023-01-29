import {
  checkNOmitFromObj,
  utf8Encode,
  utf8Decode,
  stringifyObjSafely,
  createRandomString,
} from '@/common/tools'
import { BridgeType, InfluxDBType } from '@/types/enum'
import { cloneDeep, omit } from 'lodash'
import useSSL from '@/hooks/useSSL'
import { ElMessage } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'
import { useBridgeTypeOptions } from './useBridgeTypeValue'

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

export default (): {
  handleBridgeDataBeforeSubmit: (bridgeData: any) => Promise<any>
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
} => {
  const { handleSSLDataBeforeSubmit } = useSSL()
  const { tl } = useI18nTl('RuleEngine')
  const { getBridgeType } = useBridgeTypeOptions()

  const handleMQTTBridgeData = (bridgeData: any) => {
    const { egress, ingress } = bridgeData
    if (!egress.remote?.topic) {
      Reflect.deleteProperty(bridgeData, 'egress')
    } else if (!ingress.remote?.topic) {
      Reflect.deleteProperty(bridgeData, 'ingress')
    }
    return bridgeData
  }

  const handleWebhookBridgeData = (bridgeData: any) => {
    if (bridgeData.body) {
      bridgeData.body = utf8Encode(bridgeData.body)
    }
    return bridgeData
  }

  const handleInfluxDBBridgeData = (bridgeData: any) => {
    if (bridgeData.type === InfluxDBType.v1) {
      bridgeData = omit(bridgeData, ['token', 'org', 'bucket'])
    } else {
      bridgeData = omit(bridgeData, ['database', 'username', 'password'])
    }
    return bridgeData
  }

  const { splitBySpace, transCommandArrToStr } = useRedisCommandCheck()
  const handleRedisBridgeData = async (bridgeData: any) => {
    try {
      bridgeData.command_template = await splitBySpace(bridgeData.command_template)
      return bridgeData
    } catch (error) {
      return Promise.reject()
    }
  }

  const handleGCPBridgeData = (bridgeData: any) => {
    if (bridgeData.service_account_json && typeof bridgeData.service_account_json === 'string') {
      try {
        bridgeData.service_account_json = JSON.parse(bridgeData.service_account_json)
        return bridgeData
      } catch (error) {
        ElMessage.error(tl('accountJSONError'))
        return Promise.reject()
      }
    }
    return bridgeData
  }

  const handleBridgeDataBeforeSubmit = async (bridgeData: any): Promise<any> => {
    try {
      let ret = cloneDeep(bridgeData)
      const bridgeType = getBridgeType(bridgeData.type)
      if (ret.ssl) {
        ret.ssl = handleSSLDataBeforeSubmit(ret.ssl)
      }
      if (bridgeType === BridgeType.MQTT) {
        ret = await handleMQTTBridgeData(ret)
      } else if (bridgeType === BridgeType.Webhook) {
        ret = await handleWebhookBridgeData(ret)
      } else if (bridgeType === BridgeType.Redis) {
        ret = await handleRedisBridgeData(ret)
      } else if (bridgeType === BridgeType.GCP) {
        ret = await handleGCPBridgeData(ret)
      } else if (bridgeType === BridgeType.InfluxDB) {
        ret = await handleInfluxDBBridgeData(ret)
      }
      return Promise.resolve(
        checkNOmitFromObj(omit(ret, ['metrics', 'node_metrics', 'node_status', 'status'])),
      )
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleBridgeDataAfterLoaded = (bridgeData: any) => {
    const bridgeType = getBridgeType(bridgeData.type)

    if (bridgeType === BridgeType.Webhook && 'body' in bridgeData) {
      bridgeData.body = utf8Decode(bridgeData.body)
    } else if (bridgeType === BridgeType.GCP && 'service_account_json' in bridgeData) {
      bridgeData.service_account_json = stringifyObjSafely(bridgeData.service_account_json, 2)
    } else if (
      bridgeType === BridgeType.Redis &&
      'command_template' in bridgeData &&
      Array.isArray(bridgeData.command_template)
    ) {
      bridgeData.command_template = transCommandArrToStr(bridgeData.command_template)
    }
    return bridgeData
  }

  const handleBridgeDataForCopy = (bridgeData: any): any => {
    return omit(handleBridgeDataAfterLoaded(bridgeData), [
      'metrics',
      'node_metrics',
      'node_status',
      'status',
      // TODO: unify this
      'password',
      'authentication.password',
      'id',
    ])
  }

  return {
    handleBridgeDataBeforeSubmit,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
  }
}
