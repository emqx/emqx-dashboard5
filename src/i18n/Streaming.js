export default {
  endpoints: {
    zh: '端点',
    en: 'Endpoints',
  },
  streamingPlaceholder: {
    zh: '请先启用 Streaming',
    en: 'Please enable streaming first',
  },
  streamingConfigurations: {
    zh: 'Streaming 配置',
    en: 'Streaming Configurations',
  },
  hornbillAdminEndpoints: {
    zh: 'Hornbill 管理端点',
    en: 'Hornbill Admin Endpoints',
  },
  hornbillAdminEndpointsDesc: {
    zh: `Hornbill 节点的 http 接口端点，使用逗号分隔多个地址。<br />
例如：<code>127.0.0.1:8080, 127.0.0.1:8081</code><br />
未指定端口时，默认值为 8080。`,
    en: `The http interface endpoints of the Hornbill nodes to be linked, use commas to separate multiple addresses.<br />
i.e: <code>127.0.0.1:8080, 127.0.0.1:8081</code><br />
When the port is not specified, its default value is 8080.`,
  },
  hornbillKafkaEndpoints: {
    zh: 'Hornbill Kafka 端点',
    en: 'Hornbill Kafka Endpoints',
  },
  hornbillKafkaEndpointsDesc: {
    zh: `Hornbill 节点的 kafka 接口端点，使用逗号分隔多个地址。<br />
例如：<code>127.0.0.1:9092, 127.0.0.1:9093</code><br />
未指定端口时，默认值为 9092。`,
    en: `The streaming interface endpoints of the Hornbill nodes to be linked, use commas to separate multiple addresses.<br />
i.e: <code>127.0.0.1:9092,127.0.0.1:9093</code><br />
When the port is not specified, its default value is 9092.`,
  },
  enableStreaming: {
    zh: '启用 Streaming',
    en: 'Enable Streaming',
  },
  disableStreamingWarning: {
    zh: '确认停用 Streaming？',
    en: 'Confirm to disable Streaming?',
  },
}
