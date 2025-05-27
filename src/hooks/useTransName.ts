import { GatewayName, GatewayStatus } from '@/types/enum'

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
      [GatewayName.JT808]: 'JT/T 808',
      [GatewayName.OCPP]: 'OCPP',
      [GatewayName.NATS]: 'NATS',
    }
    return gatewayName[name]
  }
  return {
    transGatewayName,
  }
}

export const useGatewayStatus = () => {
  const { tl } = useI18nTl('Gateway')
  const gatewayStatusLabelMap = new Map<GatewayStatus, string>([
    [GatewayStatus.Running, tl('running')],
    [GatewayStatus.Stopped, tl('stopped')],
    [GatewayStatus.Unloaded, tl('unloaded')],
  ])

  const getGatewayStatusLabel = (status: GatewayStatus) => {
    if (!status || !isString(status)) {
      return status
    }
    return gatewayStatusLabelMap.get(status) || titleCase(status)
  }

  return {
    getGatewayStatusLabel,
  }
}
