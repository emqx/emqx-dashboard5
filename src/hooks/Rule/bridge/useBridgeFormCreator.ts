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
  createKafkaDefaultValCommonPart: () => any
  createRawKafkaProducerForm: () => OtherBridge
  createRawKafkaConsumerForm: () => OtherBridge
  createRawInfluxDBForm: () => OtherBridge
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

  // Common parts of producers and consumers
  const createKafkaDefaultValCommonPart = () => ({
    name: '',
    resource_opts: { health_check_interval: '15s' },
  })
  const createRawKafkaProducerForm = () => ({
    type: BridgeType.KafkaProducer,
    connector: '',
    ...createKafkaDefaultValCommonPart(),
    parameters: {
      topic: '',
      message: {
        key: '${.clientid}',
        value: '${.}',
        timestamp: '${.timestamp}',
      },
      max_batch_bytes: '896KB',
      compression: 'no_compression',
      partition_strategy: 'random',
      required_acks: 'all_isr',
      partition_count_refresh_interval: '60s',
      max_inflight: 10,
      query_mode: 'async',
      sync_query_timeout: '5s',
      kafka_header_value_encode_mode: 'none',
      buffer: {
        mode: 'memory',
        per_partition_limit: '2GB',
        segment_bytes: '100MB',
        memory_overload_protection: false,
      },
    },
  })
  const createRawKafkaConsumerForm = () => ({
    type: BridgeType.KafkaConsumer,
    ...createKafkaDefaultValCommonPart(),
    bootstrap_hosts: '',
    connect_timeout: '5s',
    min_metadata_refresh_interval: '3s',
    metadata_request_timeout: '5s',
    authentication: 'none',
    socket_opts: {
      sndbuf: '1024KB',
      recbuf: '1024KB',
      tcp_keepalive: 'none',
      nodelay: true,
    },
    ssl: createSSLForm(),
    topic_mapping: [],
    kafka: {
      max_batch_bytes: '896KB',
      offset_reset_policy: 'latest',
      offset_commit_interval_seconds: '5s',
    },
    key_encoding_mode: 'none',
    value_encoding_mode: 'none',
  })

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

  return {
    createRawMQTTForm,
    createKafkaDefaultValCommonPart,
    createRawKafkaProducerForm,
    createRawKafkaConsumerForm,
    createRawInfluxDBForm,
  }
}
