import { BridgeType, MQTTBridgeDirection } from '@/types/enum'
import { MQTTIn, MQTTOut } from '@/types/rule'
import { cloneDeep } from 'lodash'

type MQTTBridge = MQTTIn | MQTTOut

export default () => {
  const handleBridgeDataBeforeSubmit = (bridgeData: any): any => {
    const ret = cloneDeep(bridgeData)
    if (ret.type === BridgeType.MQTT && (ret as MQTTBridge).direction === MQTTBridgeDirection.Out) {
      if (!ret.local_topic) {
        Reflect.deleteProperty(ret, 'local_topic')
      }
    }
    return ret
  }

  return {
    handleBridgeDataBeforeSubmit,
  }
}
