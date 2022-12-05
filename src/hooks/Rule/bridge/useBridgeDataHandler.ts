import { checkNOmitFromObj } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { cloneDeep } from 'lodash'

export default (): {
  handleBridgeDataBeforeSubmit: (bridgeData: any) => any
} => {
  const handleMQTTBridgeData = (bridgeData: any) => {
    const { egress, ingress } = bridgeData
    if (!egress.remote?.topic) {
      Reflect.deleteProperty(bridgeData, 'egress')
    } else if (!ingress.remote?.topic) {
      Reflect.deleteProperty(bridgeData, 'ingress')
    }
    return bridgeData
  }

  const handleBridgeDataBeforeSubmit = (bridgeData: any): any => {
    let ret = cloneDeep(bridgeData)
    if (ret.type === BridgeType.MQTT) {
      ret = handleMQTTBridgeData(ret)
    }
    return checkNOmitFromObj(ret)
  }

  return {
    handleBridgeDataBeforeSubmit,
  }
}
