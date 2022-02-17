import { GatewayProtocl } from '@/types/gateway'

export default function useTransName(): {
  transGatewayName: (name: GatewayProtocl) => string
} {
  const transGatewayName = (name: GatewayProtocl) => {
    const gatewayName: {
      [key in GatewayProtocl]: string
    } = {
      coap: 'CoAP',
      lwm2m: 'LwM2M',
      exproto: 'ExProto',
      mqttsn: 'MQTT-SN',
      stomp: 'STOMP',
    }
    return gatewayName[name]
  }
  return {
    transGatewayName,
  }
}
