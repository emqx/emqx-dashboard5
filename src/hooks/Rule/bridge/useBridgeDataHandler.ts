import { checkNOmitFromObj } from '@/common/tools'
import useSSL from '@/hooks/useSSL'
import { BridgeType } from '@/types/enum'
import { cloneDeep, omit, set, get } from 'lodash'
import { useBridgeTypeOptions } from './useBridgeTypeValue'

export default (): {
  likePasswordFieldKeys: string[]
  handleBridgeDataBeforeSubmit: (bridgeData: any) => Promise<any>
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
  handleBridgeDataForSaveAsCopy: (bridgeData: any) => any
} => {
  const { handleSSLDataBeforeSubmit } = useSSL()
  const { getBridgeType } = useBridgeTypeOptions()

  const handleMQTTBridgeData = (bridgeData: any) => {
    const { egress = {}, ingress = {} } = bridgeData
    if (!egress.remote?.topic) {
      Reflect.deleteProperty(bridgeData, 'egress')
    } else if (!ingress.remote?.topic) {
      Reflect.deleteProperty(bridgeData, 'ingress')
    }
    return bridgeData
  }

  const keysDoNotNeedForAPI = ['node_status', 'status', 'status_reason', 'role', 'idForRuleFrom']

  const keysNeedDel = {
    update: keysDoNotNeedForAPI,
    create: [...keysDoNotNeedForAPI, 'enable', 'id'],
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
      //
    }
    return bridgeData
  }

  // When copying, set to empty value.
  // When saving as a copy, check if it has been modified.
  const likePasswordFieldKeys = ['password']
  const handleBridgeDataForCopy = (bridgeData: any): any => {
    const ret = omit(handleBridgeDataAfterLoaded(bridgeData), keysNeedDel.create)
    likePasswordFieldKeys.forEach((key) => {
      if (get(ret, key) !== undefined) {
        set(ret, key, '')
      }
    })
    return ret
  }

  const handleBridgeDataForSaveAsCopy = (bridgeData: any): any => {
    return omit(bridgeData, keysNeedDel.create)
  }

  return {
    likePasswordFieldKeys,
    handleBridgeDataBeforeSubmit,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
    handleBridgeDataForSaveAsCopy,
  }
}
