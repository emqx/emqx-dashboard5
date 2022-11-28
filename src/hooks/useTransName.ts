import { GatewayName } from '@/types/enum'

export default function useTransName(): {
  transGatewayName: (name: GatewayName) => string
} {
  const transGatewayName = (name: GatewayName) => {
    const gatewayName: Record<GatewayName, string> = {
      [GatewayName.CoAP]: 'CoAP',
      [GatewayName.LwM2M]: 'LwM2M',
      [GatewayName.ExProto]: 'ExProto',
      [GatewayName.MQTT_SN]: 'MQTT-SN',
      [GatewayName.STOMP]: 'STOMP',
    }
    return gatewayName[name]
  }
  return {
    transGatewayName,
  }
}
