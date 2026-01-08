export default {
  createMessageStream: {
    zh: '创建流',
    en: 'Create Stream',
  },
  editMessageStream: {
    zh: '编辑流',
    en: 'Edit Stream',
  },
  topicFilterDesc: {
    zh: `用于确定哪些消息进入流的过滤器。客户端可以通过订阅格式为 \`$s/<timestamp>/<topic_filter>\` 的特殊主题来消费流中的消息。其中 <timestamp> 可以是微秒级 Unix 时间戳，也可以是特殊值 \`earliest\`（从最早开始）或 \`latest\`（从最新开始）。`,
    en: `The filter used to determine which messages are getting into the stream.
Clients can consume messages from the stream by subscribing to a special topic in the format \`$s/<timestamp>/<topic_filter>\`. The <timestamp> can be a Unix timestamp in microseconds, or the special values \`earliest\` or \`latest\`.`,
  },
  dataRetentionPeriodDesc: {
    zh: '流中数据保留的时间',
    en: 'The period for which data is retained in the Stream.',
  },
  isLastvalueDesc: {
    zh: `指示消息是否具有最后值语义。最后值语义意味着消息覆盖同一主题中相同流键的先前消息。<br />
请注意，启用此选项后，每条消息应该具有“流键表达式”所配置的属性，以保存到流中。`,
    en: `Indicates if the message has Last-Value semantics. Last-Value semantics means that messages overwrite previous messages with the same stream key in the same topic.<br />
Please note that each message should have the property set by "Stream Key Expression" to be saved in the stream.`,
  },
  keyExpressionDesc: {
    zh: `用于确定流中消息的流键表达式，EMQX 将流键相同的消息放入同一个分区，从而保证消息的顺序性。<br />默认值为 \`message.from\`，即为消息的发送者客户端 ID，关于 variform 表达式可使用的函数及语法请参考 [Variform 表达式](https://docs.emqx.com/zh/emqx/latest/configuration/configuration.html#variform-%E8%A1%A8%E8%BE%BE%E5%BC%8F) 章节。注意：不支持从 \`message.payload.xxx\` 中取值作为流键<br />
可使用的变量请参考以下数据结构：
`,
    en: `The expression used to determine the key of the message for Streams, EMQX will put messages with the same stream key into the same partition to ensure the order of messages.<br />The default value is \`message.from\`, which is the client ID of the message publisher. For functions and syntax of variform expression, please refer to the [Variform Expressions](https://docs.emqx.com/en/emqx/latest/configuration/configuration.html#variform-expressions) chapter. Note: Extracting values from \`message.payload.xxx\` is not supported as stream key.
The variables can be referenced as follows:
`,
  },
  maxShardMessageCountDesc: {
    zh: `流中每个分片的最大消息数量，配置将进行持久化存储。`,
    en: `The maximum number of messages in a shard for the Stream, the configuration will be saved to the durable storage.`,
  },
  maxShardMessageBytesDesc: {
    zh: `流中每个分片的最大字节数，配置将进行持久化存储。`,
    en: `The maximum number of bytes in a shard for the Stream, the configuration will be saved to the durable storage.`,
  },
  deleteTip: {
    zh: '确定删除过滤主题为 {topicFilter} 的流吗？',
    en: 'Confirm to delete stream with topic filter {topicFilter}?',
  },
  // Guidance component
  createFirstMSTitle: {
    zh: '创建您的第一个 EMQX 流',
    en: 'Create your first EMQX Stream',
  },
  msGuidance: {
    zh: '利用仅追加写入（Append-only）的流扩展 MQTT 功能。EMQX 流能够捕获匹配主题过滤器的消息，并将其持久化以供回放。借助可配置的数据保留期和可选的日志压缩支持，构建时序分析、事件溯源管道及数字孪生应用。',
    en: 'Extend MQTT with append-only streams. EMQX Stream captures messages matching your topic filters and persists them for replay. Build time-series analytics, event sourcing pipelines, and digital twins with configurable retention and optional compaction support.',
  },
  msDisabledTip: {
    zh: '流未启用，请先启用该功能。',
    en: 'Streams are not enabled, please enable it first.',
  },
  createMessageStreamBtn: {
    zh: '创建流',
    en: 'Create Stream',
  },
  limitsDisabledTip: {
    zh: '常规流限制无法在无限制和有限之间切换',
    en: 'Regular streams cannot be updated from limited to unlimited and vice versa',
  },
  keyExpression: {
    zh: '流键表达式',
    en: 'Stream Key Expression',
  },
}
