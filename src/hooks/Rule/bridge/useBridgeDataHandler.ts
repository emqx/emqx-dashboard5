import { checkNOmitFromObj, utf8Encode } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { cloneDeep } from 'lodash'
import useSSL from '@/hooks/useSSL'
import { ElMessage } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'

export default (): {
  handleBridgeDataBeforeSubmit: (bridgeData: any) => any
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
    return checkNOmitFromObj(ret)
  }

  return {
    handleBridgeDataBeforeSubmit,
  }
}
