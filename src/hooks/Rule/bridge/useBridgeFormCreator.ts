import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'
import useSSL from '@/hooks/useSSL'
import { BridgeDirection, BridgeType, InfluxDBType, KafkaType } from '@/types/enum'
import {
  HTTPBridge,
  MQTTBridgeEgress,
  MQTTBridgeIngress,
  MQTTBridgeTransConfiguration,
  OtherBridge,
} from '@/types/rule'

export default (): {
  createRawHTTPForm: () => HTTPBridge
  createRawMQTTForm: (direction?: BridgeDirection) => any
  createKafkaDefaultValCommonPart: () => any
  createRawKafkaProducerForm: () => OtherBridge
  createRawKafkaConsumerForm: () => OtherBridge
  createRawInfluxDBForm: () => OtherBridge
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

  // Common parts of producers and consumers
  const createKafkaDefaultValCommonPart = () => ({
    name: '',
    bootstrap_hosts: '',
    connect_timeout: '5s',
    min_metadata_refresh_interval: '3s',
    metadata_request_timeout: '5s',
    authentication: 'none',
    socket_opts: {
      sndbuf: '1024KB',
      recbuf: '1024KB',
      tcp_keepalive: 'none',
    },
    ssl: createSSLForm(),
  })
  const createRawKafkaProducerForm = () => ({
    type: KafkaType.Producer,
    ...createKafkaDefaultValCommonPart(),
    kafka: {
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
    type: KafkaType.Consumer,
    ...createKafkaDefaultValCommonPart(),
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
    type: InfluxDBType.v2,
    name: '',
    local_topic: '',
    write_syntax: '',
    server: '127.0.0.1:8086',
    precision: 'ms',
    database: '',
    username: '',
    password: '',
    ssl: createSSLForm(),
    bucket: '',
    org: '',
    token: '',
    resource_opts: createDefaultResourceOptsForm({ inflight: true, batch: true }),
  })

  return {
    createRawHTTPForm,
    createRawMQTTForm,
    createKafkaDefaultValCommonPart,
    createRawKafkaProducerForm,
    createRawKafkaConsumerForm,
    createRawInfluxDBForm,
  }
}
