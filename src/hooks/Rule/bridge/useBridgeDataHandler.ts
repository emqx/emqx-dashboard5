import { checkNOmitFromObj, utf8Decode, utf8Encode } from '@/common/tools'
import useSSL from '@/hooks/useSSL'
import { BridgeType } from '@/types/enum'
import { cloneDeep, omit } from 'lodash'
import { useBridgeTypeOptions } from './useBridgeTypeValue'

export default (): {
  handleBridgeDataBeforeSubmit: (bridgeData: any) => Promise<any>
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
  handleBridgeDataForSaveAsCopy: (bridgeData: any) => any
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

  const keysNeedDel = {
    update: ['node_status', 'status', 'status_reason'],
    saveAsCopy: ['node_status', 'status', 'enable', 'id', 'status_reason'],
    copy: ['node_status', 'status', 'enable', 'id', 'password', 'status_reason'],
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
      }
      return Promise.resolve(checkNOmitFromObj(omit(ret, keysNeedDel.update)))
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleBridgeDataAfterLoaded = (bridgeData: any) => {
    const bridgeType = getBridgeType(bridgeData.type)
    if (bridgeType === BridgeType.Webhook && 'body' in bridgeData) {
      bridgeData.body = utf8Decode(bridgeData.body)
    }
    return bridgeData
  }

  const handleBridgeDataForCopy = (bridgeData: any): any => {
    return omit(handleBridgeDataAfterLoaded(bridgeData), keysNeedDel.copy)
  }

  const handleBridgeDataForSaveAsCopy = (bridgeData: any): any => {
    return omit(bridgeData, keysNeedDel.saveAsCopy)
  }

  return {
    handleBridgeDataBeforeSubmit,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
    handleBridgeDataForSaveAsCopy,
  }
}
