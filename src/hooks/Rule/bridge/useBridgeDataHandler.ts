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

const strReg = /('[^']+')|("[^"]+")/g
const SPACE = ' '
const splitBySpace = (command: string) => {
  // TODO:handle chaos input
  const randomStr = createRandomString()
  const strArr: Array<string> = []
  const commandRemoveStr = command.replace(/\n/g, SPACE).replace(strReg, (matched: string) => {
    strArr.push(matched)
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

export default (): {
  handleBridgeDataBeforeSubmit: (bridgeData: any) => any
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

  const handleRedisBridgeData = (bridgeData: any) => {
    bridgeData.command_template = splitBySpace(bridgeData.command_template)
    return bridgeData
  }

  const handleGCPBridgeData = (bridgeData: any) => {
    if (bridgeData.service_account_json && typeof bridgeData.service_account_json === 'string') {
      try {
        bridgeData.service_account_json = JSON.parse(bridgeData.service_account_json)
        return bridgeData
      } catch (error) {
        // TODO: Need to interrupt the submit process
        ElMessage.error(tl('accountJSONError'))
      }
    }
    return bridgeData
  }

  const handleBridgeDataBeforeSubmit = (bridgeData: any): any => {
    let ret = cloneDeep(bridgeData)
    const bridgeType = getBridgeType(bridgeData.type)
    if (ret.ssl) {
      ret.ssl = handleSSLDataBeforeSubmit(ret.ssl)
    }
    if (bridgeType === BridgeType.MQTT) {
      ret = handleMQTTBridgeData(ret)
    } else if (bridgeType === BridgeType.Webhook) {
      ret = handleWebhookBridgeData(ret)
    } else if (bridgeType === BridgeType.Redis) {
      ret = handleRedisBridgeData(ret)
    } else if (bridgeType === BridgeType.GCP) {
      ret = handleGCPBridgeData(ret)
    } else if (bridgeType === BridgeType.InfluxDB) {
      ret = handleInfluxDBBridgeData(ret)
    }
    return checkNOmitFromObj(omit(ret, ['metrics', 'node_metrics', 'node_status', 'status']))
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
      bridgeData.command_template = bridgeData.command_template.join(SPACE)
    }
    return bridgeData
  }

  const handleBridgeDataForCopy = (bridgeData: any): any => {
    return omit(handleBridgeDataAfterLoaded(bridgeData), [
      'metrics',
      'node_metrics',
      'node_status',
      'status',
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
