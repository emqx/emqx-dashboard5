export default {
  createMessageStream: {
    zh: '创建消息流',
    en: 'Create Message Stream',
  },
  editMessageStream: {
    zh: '编辑消息流',
    en: 'Edit Message Stream',
  },
  topicFilterDesc: {
    zh: `用于确定哪些消息进入消息流的过滤器。客户端可以通过订阅 \`$s/{'过滤主题'}\` 来从流中消费消息`,
    en: `The filter used to determine which messages are getting into the message stream.
Clients can consume messages from the stream by subscribing to \`$s/{'Topic Filter'}\`.`,
  },
  dataRetentionPeriodDesc: {
    zh: '消息流中数据保留的时间',
    en: 'The period for which data is retained in the Message Stream.',
  },
  isLastvalueDesc: {
    zh: `指示消息是否具有最后值语义。最后值语义意味着消息覆盖同一主题中相同流键的先前消息。<br />
请注意，启用此选项后，每条消息应该具有“流键表达式”所配置的属性，以保存到流中。`,
    en: `Indicates if the message has Last-Value semantics. Last-Value semantics means that messages overwrite previous messages with the same stream key in the same topic.<br />
Please note that each message should have the property set by "Stream Key Expression" to be saved in the stream.`,
  },
  keyExpressionDesc: {
    zh: `用于确定 Last-Value 消息流中消息的流键表达式，默认值为 \`message.from\`，即为消息的发送者客户端 ID，关于 variform 表达式可使用的函数及语法请参考 [Variform 表达式](https://docs.emqx.com/zh/emqx/latest/configuration/configuration.html#variform-%E8%A1%A8%E8%BE%BE%E5%BC%8F) 章节。注意：不支持从 \`message.payload.xxx\` 中取值作为流键<br />
可使用的变量请参考以下数据结构：
`,
    en: `The expression used to determine the key of the message for Last-Value Message Streams, the default value is \`message.from\`, which is the client ID of the message publisher. For functions and syntax of variform expression, please refer to the [Variform Expressions](https://docs.emqx.com/en/emqx/latest/configuration/configuration.html#variform-expressions) chapter. Note: Extracting values from \`message.payload.xxx\` is not supported as stream key.
The variables can be referenced as follows:
`,
  },
  maxShardMessageCountDesc: {
    zh: `消息流中每个分片的最大消息数量，配置将进行持久化存储。`,
    en: `The maximum number of messages in a shard for the Message Stream, the configuration will be saved to the durable storage.`,
  },
  maxShardMessageBytesDesc: {
    zh: `消息流中每个分片的最大字节数，配置将进行持久化存储。`,
    en: `The maximum number of bytes in a shard for the Message Stream, the configuration will be saved to the durable storage.`,
  },
  deleteTip: {
    zh: '确定删除过滤主题为 {topicFilter} 的消息流吗？',
    en: 'Confirm to delete message stream with topic filter {topicFilter}?',
  },
  // Guidance component
  createFirstMSTitle: {
    zh: '创建您的第一个 EMQX 流',
    en: 'Create your first EMQX Stream',
  },
  msGuidance1: {
    zh: '通过内置的消息流功能挖掘数据价值。EMQX 流支持消息的持久化存储与历史回溯，提供分区内的严格有序性，并支持通过键值压缩（Compaction）来高效维护最新状态。',
    en: 'Unlock data value with built-in message streaming. EMQX Stream enables message persistence and historical replay, ensuring strict ordering within partitions and efficient state maintenance via key-based compaction.',
  },
  msGuidance2: {
    zh: '允许客户端随时从任意历史位点或时间戳开始重新消费数据。',
    en: 'Allowing clients to re-consume data from any historical offset or timestamp at any time.',
  },
  msDisabledTip: {
    zh: '消息流未启用，请先启用该功能。',
    en: 'Message stream is not enabled, please enable it first.',
  },
  createMessageStreamBtn: {
    zh: '创建消息流',
    en: 'Create Stream',
  },
  limitsDisabledTip: {
    zh: '常规流消息限制无法在无限制和有限之间切换',
    en: 'Regular streams cannot be updated from limited to unlimited and vice versa',
  },
  keyExpression: {
    zh: '流键表达式',
    en: 'Stream Key Expression',
  },
}
