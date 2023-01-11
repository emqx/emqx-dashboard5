import { checkNOmitFromObj, utf8Encode, utf8Decode, stringifyObjSafely } from '@/common/tools'
import { BridgeType, InfluxDBType } from '@/types/enum'
import { cloneDeep, omit } from 'lodash'
import useSSL from '@/hooks/useSSL'
import { ElMessage } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'

export default (): {
  handleBridgeDataBeforeSubmit: (bridgeData: any) => any
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
} => {
  const { handleSSLDataBeforeSubmit } = useSSL()
  const { tl } = useI18nTl('RuleEngine')

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
      bridgeData = omit(bridgeData, ['database'])
    }
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
    if (ret.ssl) {
      ret.ssl = handleSSLDataBeforeSubmit(ret.ssl)
    }
    if (ret.type === BridgeType.MQTT) {
      ret = handleMQTTBridgeData(ret)
    }
    if (ret.type === BridgeType.Webhook) {
      ret = handleWebhookBridgeData(ret)
    }
    if (ret.type === BridgeType.GCP) {
      ret = handleGCPBridgeData(ret)
    }
    if (ret.type === InfluxDBType.v1 || ret.type === InfluxDBType.v2) {
      ret = handleInfluxDBBridgeData(ret)
    }
    return checkNOmitFromObj(omit(ret, ['metrics', 'node_metrics', 'node_status', 'status']))
  }

  const handleBridgeDataAfterLoaded = (bridgeData: any) => {
    if (bridgeData.type === BridgeType.Webhook && 'body' in bridgeData) {
      bridgeData.body = utf8Decode(bridgeData.body)
    } else if (bridgeData.type === BridgeType.GCP && 'service_account_json' in bridgeData) {
      bridgeData.service_account_json = stringifyObjSafely(bridgeData.service_account_json, 2)
    }
    return bridgeData
  }

  const handleBridgeDataForCopy = (bridgeData: any): any => {
    return omit(handleBridgeDataAfterLoaded(bridgeData), [
      'metrics',
      'node_metrics',
      'node_status',
      'status',
      'id',
    ])
  }

  return {
    handleBridgeDataBeforeSubmit,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
  }
}
