import { checkNOmitFromObj, utf8Encode, utf8Decode } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { cloneDeep, omit } from 'lodash'
import useSSL from '@/hooks/useSSL'
import { useBridgeTypeOptions } from './useBridgeTypeValue'

export default (): {
  handleBridgeDataBeforeSubmit: (bridgeData: any) => any
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
} => {
  const { handleSSLDataBeforeSubmit } = useSSL()
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
    }
    return checkNOmitFromObj(omit(ret, ['metrics', 'node_metrics', 'node_status', 'status']))
  }

  const handleBridgeDataAfterLoaded = (bridgeData: any) => {
    const bridgeType = getBridgeType(bridgeData.type)
    if (bridgeType === BridgeType.Webhook && 'body' in bridgeData) {
      bridgeData.body = utf8Decode(bridgeData.body)
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
      'id',
    ])
  }

  return {
    handleBridgeDataBeforeSubmit,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
  }
}
