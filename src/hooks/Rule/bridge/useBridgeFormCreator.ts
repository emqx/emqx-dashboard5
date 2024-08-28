import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'
import useSSL from '@/hooks/useSSL'
import { BridgeDirection, BridgeType } from '@/types/enum'
import {
  MQTTBridgeEgress,
  MQTTBridgeIngress,
  MQTTBridgeTransConfiguration,
  OtherBridge,
} from '@/types/rule'

export default (): {
  createRawMQTTForm: (direction?: BridgeDirection) => any
  createRawInfluxDBForm: () => OtherBridge
  createRawDataLayersForm: () => OtherBridge
} => {
  const { createDefaultResourceOptsForm } = useResourceOpt()
  const { createSSLForm } = useSSL()

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

  const createRawInfluxDBForm = () => ({
    type: BridgeType.InfluxDB,
    name: '',
    connector: '',
    parameters: {
      write_syntax: '',
      precision: 'ms',
    },
    resource_opts: createDefaultResourceOptsForm({
      inflight: true,
      batch: true,
      withoutRequestTimeout: false,
      withoutStartTimeout: true,
    }),
  })

  const createRawDataLayersForm = () => ({
    ...createRawInfluxDBForm(),
    type: BridgeType.Datalayers,
  })

  return {
    createRawMQTTForm,
    createRawInfluxDBForm,
    createRawDataLayersForm,
  }
}
