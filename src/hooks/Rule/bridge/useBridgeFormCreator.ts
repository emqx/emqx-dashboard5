import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'
import useSSL from '@/hooks/useSSL'
import { BridgeDirection, BridgeType } from '@/types/enum'
import {
  HTTPBridge,
  MQTTBridgeEgress,
  MQTTBridgeIngress,
  MQTTBridgeTransConfiguration,
} from '@/types/rule'

export default (): {
  createRawHTTPForm: () => HTTPBridge
  createRawMQTTForm: (direction?: BridgeDirection) => any
} => {
  const { createDefaultResourceOptsForm } = useResourceOpt()
  const { createSSLForm } = useSSL()

  const createRawHTTPForm = (): HTTPBridge =>
    ({
      name: '',
      method: 'post',
      url: 'http://',
      headers: { 'content-type': 'application/json' },
      body: '',
      pool_type: 'hash',
      pool_size: 8,
      enable_pipelining: 100,
      connect_timeout: '15s',
      resource_opts: createDefaultResourceOptsForm({
        inflight: true,
        withoutRequestTimeout: false,
      }),
      ssl: createSSLForm(),
      type: BridgeType.Webhook,
    } as HTTPBridge)

  const createRawMQTTTransDefaultVal = (): MQTTBridgeTransConfiguration => ({
    topic: '',
    qos: 1,
    payload: '${payload}',
    retain: false,
  })
  const createMQTTIngressDefaultVal = (): MQTTBridgeIngress => ({
    remote: { topic: '', qos: 1 },
    local: createRawMQTTTransDefaultVal(),
  })
  const createMQTTEgressDefaultValue = (): MQTTBridgeEgress => ({
    local: { topic: '' },
    remote: createRawMQTTTransDefaultVal(),
  })
  const createRawMQTTForm = (direction: BridgeDirection = BridgeDirection.Both): any => {
    const base = {
      enable: true,
      name: '',
      server: '',
      proto_ver: 'v4',
      username: '',
      password: '',
      ssl: createSSLForm(),
      keepalive: '300s',
      retry_interval: '15s',
      clean_start: true,
      bridge_mode: false,
      type: BridgeType.MQTT,
      resource_opts: createDefaultResourceOptsForm({ inflight: true }),
    }

    switch (direction) {
      case BridgeDirection.Ingress:
        return { ...base, ingress: createMQTTIngressDefaultVal() }
      case BridgeDirection.Egress:
        return { ...base, egress: createMQTTEgressDefaultValue() }
      default:
        return {
          ...base,
          ingress: createMQTTIngressDefaultVal(),
          egress: createMQTTEgressDefaultValue(),
        }
    }
  }

  return {
    createRawHTTPForm,
    createRawMQTTForm,
  }
}
