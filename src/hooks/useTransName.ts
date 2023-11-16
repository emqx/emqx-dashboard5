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
      [GatewayName.GBT32960]: 'GB/T 32960',
      [GatewayName.JT808]: 'JT/T808',
      [GatewayName.OCPP]: 'OCPP',
    }
    return gatewayName[name]
  }
  return {
    transGatewayName,
  }
}
