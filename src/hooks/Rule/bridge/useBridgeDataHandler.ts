import { checkNOmitFromObj, utf8Encode } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { cloneDeep } from 'lodash'
import useSSL from '@/hooks/useSSL'

export default (): {
  handleBridgeDataBeforeSubmit: (bridgeData: any) => any
} => {
  const { handleSSLDataBeforeSubmit } = useSSL()

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
    return checkNOmitFromObj(ret)
  }

  return {
    handleBridgeDataBeforeSubmit,
  }
}
